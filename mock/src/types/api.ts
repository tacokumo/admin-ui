export type ISODate = string;

export type ProjectKind = "personal" | "shared";

export interface HealthResponse {
	status: string;
}

export interface ErrorResponse {
	error: string;
}

export interface Project {
	id: string;
	name: string;
	description: string;
	kind: ProjectKind;
	createdAt: ISODate;
	updatedAt: ISODate;
}

export interface RoleAttribute {
	id: string;
	name: string;
	description: string;
}

export interface Role {
	id: string;
	name: string;
	description: string;
	project: Project;
	attributes: RoleAttribute[];
	createdAt: ISODate;
	updatedAt: ISODate;
}

export interface User {
	id: string;
	email: string;
	roles: Role[];
	createdAt: ISODate;
	updatedAt: ISODate;
}

export interface UserGroup {
	id: string;
	name: string;
	description: string;
	project: Project;
	members: User[];
	createdAt: ISODate;
	updatedAt: ISODate;
}

export interface CreateProjectRequest {
	name: string;
	description: string;
	kind: ProjectKind;
	ownerIds: string[];
	ownerGroupIds: string[];
}

export interface UpdateProjectRequest {
	name: string;
	description: string;
	ownerIds: string[];
	ownerGroupIds: string[];
}

export interface CreateUserRequest {
	email: string;
}

export interface CreateUserGroupRequest {
	name: string;
	description: string;
	memberIds: string[];
}

export interface UpdateUserGroupRequest {
	name: string;
	description: string;
	memberIds: string[];
}

export interface CreateRoleRequest {
	name: string;
	description: string;
	attributeIds: string[];
}

export interface UpdateRoleRequest {
	name: string;
	description: string;
	attributeIds: string[];
}
