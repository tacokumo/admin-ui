/* eslint-disable */
export type HealthResponse = {
	status: string;
};

export type ErrorResponse = {
	error: string;
};

export type Project = {
	id: string;
	name: string;
	description: string;
	kind: "personal" | "shared";
	createdAt: string;
	updatedAt: string;
};

export type RoleAttribute = {
	id: string;
	name: string;
	description: string;
};

export type Role = {
	id: string;
	name: string;
	description: string;
	project: Project;
	attributes: RoleAttribute[];
	createdAt: string;
	updatedAt: string;
};

export type User = {
	id: string;
	email: string;
	roles: Role[];
	createdAt: string;
	updatedAt: string;
};

export type UserGroup = {
	id: string;
	name: string;
	description: string;
	project: Project;
	members: User[];
	createdAt: string;
	updatedAt: string;
};

export type CreateProjectRequest = {
	name: string;
	description: string;
	kind: "personal" | "shared";
	/** List of user IDs who will be owners of the project */
	ownerIds: string[];
	/** List of user group IDs who will be owners of the project */
	ownerGroupIds: string[];
};

export type CreateUserRequest = {
	email: string;
};

export type UpdateProjectRequest = {
	name: string;
	description: string;
	/** List of user IDs who will be owners of the project */
	ownerIds: string[];
	/** List of user group IDs who will be owners of the project */
	ownerGroupIds: string[];
};

export type CreateUserGroupRequest = {
	name: string;
	description: string;
	/** List of user IDs who will be members of the user group */
	memberIds: string[];
};

export type UpdateUserGroupRequest = {
	name: string;
	description: string;
	memberIds: string[];
};

export type CreateRoleRequest = {
	name: string;
	description: string;
	attributeIds: string[];
};

export type UpdateRoleRequest = {
	name: string;
	description: string;
	attributeIds: string[];
};
