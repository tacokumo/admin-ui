import type {
	CreateUserGroupRequest,
	Project,
	UpdateUserGroupRequest,
	User,
	UserGroup,
} from "../types/api.js";
import { NotFoundError, ValidationError } from "./errors.js";
import type { ProjectService } from "./ProjectService.js";
import type { UserService } from "./UserService.js";

type UserGroupRecord = {
	id: string;
	projectId: string;
	name: string;
	description: string;
	memberIds: string[];
	createdAt: string;
	updatedAt: string;
};

export class UserGroupService {
	private readonly groups = new Map<string, UserGroupRecord>();
	private nextId = 1;

	constructor(
		private readonly projectService: ProjectService,
		private readonly userService: UserService,
	) {
		this.seedInitialData();
	}

	private seedInitialData() {
		const project = this.projectService.list(1, 0)[0];
		const members = this.userService.list(5, 0);
		if (project && members.length >= 1) {
			this.createGroup(project.id, {
				name: "Core Maintainers",
				description: "Primary maintainers for the project",
				memberIds: members.map((member) => member.id),
			});
		}
	}

	private nextGroupId(): string {
		return `group-${this.nextId++}`;
	}

	private normalizeMembers(memberIds: string[]): string[] {
		if (!Array.isArray(memberIds)) {
			throw new ValidationError("memberIds must be an array of user ids");
		}

		const seen = new Set<string>();
		return memberIds.filter((id) => {
			if (typeof id !== "string") {
				throw new ValidationError("memberIds must contain string values");
			}

			if (seen.has(id)) {
				return false;
			}

			seen.add(id);
			return true;
		});
	}

	private toUserGroup(
		record: UserGroupRecord,
		projectOverride?: Project,
		membersOverride?: User[],
	): UserGroup {
		const project =
			projectOverride ?? this.projectService.requireProject(record.projectId);
		const members =
			membersOverride ?? this.userService.requireUsers(record.memberIds);

		return {
			id: record.id,
			name: record.name,
			description: record.description,
			project,
			members,
			createdAt: record.createdAt,
			updatedAt: record.updatedAt,
		};
	}

	list(projectId: string, limit: number, offset: number): UserGroup[] {
		const project = this.projectService.requireProject(projectId);
		return Array.from(this.groups.values())
			.filter((record) => record.projectId === projectId)
			.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			)
			.slice(offset, offset + limit)
			.map((record) => this.toUserGroup(record, project));
	}

	createGroup(projectId: string, payload: CreateUserGroupRequest): UserGroup {
		const project = this.projectService.requireProject(projectId);
		const memberIds = this.normalizeMembers(payload.memberIds);
		const members = this.userService.requireUsers(memberIds);
		const now = new Date().toISOString();

		const record: UserGroupRecord = {
			id: this.nextGroupId(),
			projectId,
			name: payload.name,
			description: payload.description,
			memberIds: members.map((member) => member.id),
			createdAt: now,
			updatedAt: now,
		};

		this.groups.set(record.id, record);
		return this.toUserGroup(record, project, members);
	}

	getGroup(projectId: string, groupId: string): UserGroup | undefined {
		const record = this.groups.get(groupId);
		if (!record || record.projectId !== projectId) {
			return undefined;
		}

		return this.toUserGroup(record);
	}

	updateGroup(
		projectId: string,
		groupId: string,
		payload: UpdateUserGroupRequest,
	): UserGroup {
		const record = this.groups.get(groupId);
		if (!record || record.projectId !== projectId) {
			throw new NotFoundError("User group not found");
		}

		const memberIds = this.normalizeMembers(payload.memberIds);
		const members = this.userService.requireUsers(memberIds);
		const updated: UserGroupRecord = {
			...record,
			name: payload.name,
			description: payload.description,
			memberIds: members.map((user) => user.id),
			updatedAt: new Date().toISOString(),
		};

		this.groups.set(groupId, updated);
		return this.toUserGroup(updated);
	}
}
