import type { CreateUserRequest, User } from "../types/api.js";
import { NotFoundError, ValidationError } from "./errors.js";
import type { RoleService } from "./RoleService.js";

type UserRecord = {
	id: string;
	email: string;
	roleIds: string[];
	createdAt: string;
	updatedAt: string;
};

export class UserService {
	private readonly users = new Map<string, UserRecord>();
	private nextId = 1;

	constructor(private readonly roleService: RoleService) {
		this.seedInitialData();
	}

	private seedInitialData() {
		const [viewerRole, editorRole] = this.roleService.getAll();

		const first = this.createUser({ email: "miki@example.com" });
		if (viewerRole) {
			this.assignRoles(first.id, [viewerRole.id]);
		}

		const second = this.createUser({ email: "sora@example.com" });
		if (editorRole) {
			this.assignRoles(second.id, [editorRole.id]);
		}
	}

	private nextUserId(): string {
		return `user-${this.nextId++}`;
	}

	private toUser(record: UserRecord): User {
		const roles = this.roleService.getManyByIds(record.roleIds);
		return {
			id: record.id,
			email: record.email,
			roles,
			createdAt: record.createdAt,
			updatedAt: record.updatedAt,
		};
	}

	list(limit: number, offset: number): User[] {
		return Array.from(this.users.values())
			.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			)
			.slice(offset, offset + limit)
			.map((record) => this.toUser(record));
	}

	createUser(payload: CreateUserRequest): User {
		if (
			typeof payload.email !== "string" ||
			payload.email.trim().length === 0
		) {
			throw new ValidationError("email is required");
		}

		const now = new Date().toISOString();
		const record: UserRecord = {
			id: this.nextUserId(),
			email: payload.email.trim().toLowerCase(),
			roleIds: [],
			createdAt: now,
			updatedAt: now,
		};

		this.users.set(record.id, record);
		return this.toUser(record);
	}

	getUser(userId: string): User | undefined {
		const record = this.users.get(userId);
		return record ? this.toUser(record) : undefined;
	}

	requireUsers(userIds: string[]): User[] {
		const missing = userIds.filter((id) => !this.users.has(id));
		if (missing.length > 0) {
			throw new ValidationError(`Unknown user ids: ${missing.join(", ")}`);
		}

		const seen = new Set<string>();
		const uniqueIds = userIds.filter((id) => {
			if (seen.has(id)) return false;
			seen.add(id);
			return true;
		});
		return uniqueIds
			.map((id) => this.users.get(id))
			.filter((record): record is UserRecord => Boolean(record))
			.map((record) => this.toUser(record));
	}

	private assignRoles(userId: string, roleIds: string[]) {
		const record = this.users.get(userId);
		if (!record) {
			throw new NotFoundError("User not found");
		}

		const now = new Date().toISOString();
		this.users.set(userId, {
			...record,
			roleIds: [...roleIds],
			updatedAt: now,
		});
	}
}
