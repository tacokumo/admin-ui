import type {
	CreateRoleRequest,
	Project,
	Role,
	RoleAttribute,
	UpdateRoleRequest,
} from "../types/api.js";
import { NotFoundError, ValidationError } from "./errors.js";
import type { ProjectService } from "./ProjectService.js";

type RoleRecord = {
	id: string;
	projectId: string;
	name: string;
	description: string;
	attributeIds: string[];
	createdAt: string;
	updatedAt: string;
};

export class RoleService {
	private readonly roles = new Map<string, RoleRecord>();
	private readonly attributes = new Map<string, RoleAttribute>();
	private nextId = 1;

	constructor(private readonly projectService: ProjectService) {
		this.seedAttributes();
		this.seedInitialData();
	}

	private seedAttributes() {
		const seeds: RoleAttribute[] = [
			{ id: "attr-read", name: "read", description: "Read-only access" },
			{ id: "attr-write", name: "write", description: "Write access" },
			{
				id: "attr-admin",
				name: "admin",
				description: "Administrative control",
			},
		];

		for (const attr of seeds) {
			this.attributes.set(attr.id, attr);
		}
	}

	private seedInitialData() {
		const [firstProject, secondProject] = this.projectService.list(2, 0);
		if (firstProject) {
			this.createRole(firstProject.id, {
				name: "Viewer",
				description: "Can view project resources",
				attributeIds: ["attr-read"],
			});
			this.createRole(firstProject.id, {
				name: "Editor",
				description: "Can view and modify project resources",
				attributeIds: ["attr-read", "attr-write"],
			});
		}

		if (secondProject) {
			this.createRole(secondProject.id, {
				name: "Maintainer",
				description: "Manages project members and permissions",
				attributeIds: ["attr-read", "attr-write", "attr-admin"],
			});
		}
	}

	private nextRoleId(): string {
		return `role-${this.nextId++}`;
	}

	private toRole(
		record: RoleRecord,
		projectOverride?: Project,
		attributeOverride?: RoleAttribute[],
	): Role {
		const project =
			projectOverride ?? this.projectService.requireProject(record.projectId);
		const attributeObjects =
			attributeOverride ??
			record.attributeIds.map((id) => {
				const attribute = this.attributes.get(id);
				if (!attribute) {
					throw new ValidationError(`Unknown role attribute: ${id}`);
				}

				return attribute;
			});

		return {
			id: record.id,
			name: record.name,
			description: record.description,
			project,
			attributes: attributeObjects,
			createdAt: record.createdAt,
			updatedAt: record.updatedAt,
		};
	}

	private resolveAttributes(attributeIds: string[]): RoleAttribute[] {
		if (!Array.isArray(attributeIds)) {
			throw new ValidationError("attributeIds must be an array of strings");
		}

		return attributeIds.map((id) => {
			if (typeof id !== "string") {
				throw new ValidationError("attributeIds must contain string values");
			}

			const attribute = this.attributes.get(id);
			if (!attribute) {
				throw new ValidationError(`Unknown attribute id: ${id}`);
			}

			return attribute;
		});
	}

	list(projectId: string, limit: number, offset: number): Role[] {
		const project = this.projectService.requireProject(projectId);

		return Array.from(this.roles.values())
			.filter((record) => record.projectId === projectId)
			.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			)
			.slice(offset, offset + limit)
			.map((record) => this.toRole(record, project));
	}

	createRole(projectId: string, payload: CreateRoleRequest): Role {
		const project = this.projectService.requireProject(projectId);
		const attributes = this.resolveAttributes(payload.attributeIds);
		const now = new Date().toISOString();

		const record: RoleRecord = {
			id: this.nextRoleId(),
			projectId,
			name: payload.name,
			description: payload.description,
			attributeIds: attributes.map((attribute) => attribute.id),
			createdAt: now,
			updatedAt: now,
		};

		this.roles.set(record.id, record);
		return this.toRole(record, project, attributes);
	}

	getRole(projectId: string, roleId: string): Role | undefined {
		const record = this.roles.get(roleId);
		if (!record || record.projectId !== projectId) {
			return undefined;
		}

		return this.toRole(record);
	}

	updateRole(
		projectId: string,
		roleId: string,
		payload: UpdateRoleRequest,
	): Role {
		const record = this.roles.get(roleId);
		if (!record || record.projectId !== projectId) {
			throw new NotFoundError("Role not found");
		}

		const attributes = this.resolveAttributes(payload.attributeIds);
		const updated: RoleRecord = {
			...record,
			name: payload.name,
			description: payload.description,
			attributeIds: attributes.map((attribute) => attribute.id),
			updatedAt: new Date().toISOString(),
		};

		this.roles.set(roleId, updated);
		return this.toRole(updated);
	}

	getById(roleId: string): Role | undefined {
		const record = this.roles.get(roleId);
		return record ? this.toRole(record) : undefined;
	}

	getManyByIds(roleIds: string[]): Role[] {
		return roleIds
			.map((id) => this.roles.get(id))
			.filter((record): record is RoleRecord => Boolean(record))
			.map((record) => this.toRole(record));
	}

	getAll(): Role[] {
		return Array.from(this.roles.values()).map((record) => this.toRole(record));
	}
}
