import { ProjectService } from "./ProjectService.js";
import { RoleService } from "./RoleService.js";
import { UserGroupService } from "./UserGroupService.js";
import { UserService } from "./UserService.js";

export const projectService = new ProjectService();
export const roleService = new RoleService(projectService);
export const userService = new UserService(roleService);
export const userGroupService = new UserGroupService(
	projectService,
	userService,
);
