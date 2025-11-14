import { serve } from "@hono/node-server";
import type { Context } from "hono";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { NotFoundError, ValidationError } from "./services/errors.js";
import {
	projectService,
	roleService,
	userGroupService,
	userService,
} from "./services/index.js";
import type {
	CreateProjectRequest,
	CreateRoleRequest,
	CreateUserGroupRequest,
	CreateUserRequest,
	ProjectKind,
	UpdateProjectRequest,
	UpdateRoleRequest,
	UpdateUserGroupRequest,
} from "./types/api.js";

const app = new Hono();

app.use(
	cors({
		origin: "https://localhost:8443",
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["GET", "POST", "PUT", "OPTIONS"],
		exposeHeaders: ["Content-Length", "Authorization"],
		maxAge: 86400,
		credentials: true,
	}),
);
app.use(logger());

type Pagination = {
	limit: number;
	offset: number;
};

const parsePagination = (c: Context): Pagination => {
	const limitParam = c.req.query("limit");
	const offsetParam = c.req.query("offset");

	if (limitParam === null) {
		throw new ValidationError("limit is required");
	}

	if (offsetParam === null) {
		throw new ValidationError("offset is required");
	}

	const limit = Number(limitParam);
	const offset = Number(offsetParam);

	if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
		throw new ValidationError("limit must be an integer between 1 and 100");
	}

	if (!Number.isInteger(offset) || offset < 0) {
		throw new ValidationError(
			"offset must be an integer greater than or equal to 0",
		);
	}

	return { limit, offset };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const assertString = (value: unknown, field: string): string => {
	if (typeof value !== "string" || value.trim().length === 0) {
		throw new ValidationError(`${field} is required`);
	}

	return value.trim();
};

const assertStringArray = (value: unknown, field: string): string[] => {
	if (!Array.isArray(value)) {
		throw new ValidationError(`${field} must be an array of strings`);
	}

	value.forEach((entry) => {
		if (typeof entry !== "string" || entry.trim().length === 0) {
			throw new ValidationError(`${field} entries must be non-empty strings`);
		}
	});

	return value.map((entry) => entry.trim());
};

const assertProjectKind = (value: unknown): ProjectKind => {
	if (value === "personal" || value === "shared") {
		return value;
	}

	throw new ValidationError('kind must be either "personal" or "shared"');
};

const parseCreateProjectBody = (body: unknown): CreateProjectRequest => {
	if (!isRecord(body)) {
		throw new ValidationError("Invalid request body");
	}

	return {
		name: assertString(body.name, "name"),
		description: assertString(body.description, "description"),
		kind: assertProjectKind(body.kind),
		ownerIds: assertStringArray(body.ownerIds, "ownerIds"),
		ownerGroupIds: assertStringArray(body.ownerGroupIds, "ownerGroupIds"),
	};
};

const parseUpdateProjectBody = (body: unknown): UpdateProjectRequest => {
	if (!isRecord(body)) {
		throw new ValidationError("Invalid request body");
	}

	return {
		name: assertString(body.name, "name"),
		description: assertString(body.description, "description"),
		ownerIds: assertStringArray(body.ownerIds, "ownerIds"),
		ownerGroupIds: assertStringArray(body.ownerGroupIds, "ownerGroupIds"),
	};
};

const parseCreateUserBody = (body: unknown): CreateUserRequest => {
	if (!isRecord(body)) {
		throw new ValidationError("Invalid request body");
	}

	return {
		email: assertString(body.email, "email"),
	};
};

const parseUserGroupBody = (
	body: unknown,
): CreateUserGroupRequest | UpdateUserGroupRequest => {
	if (!isRecord(body)) {
		throw new ValidationError("Invalid request body");
	}

	return {
		name: assertString(body.name, "name"),
		description: assertString(body.description, "description"),
		memberIds: assertStringArray(body.memberIds, "memberIds"),
	};
};

const parseRoleBody = (
	body: unknown,
): CreateRoleRequest | UpdateRoleRequest => {
	if (!isRecord(body)) {
		throw new ValidationError("Invalid request body");
	}

	return {
		name: assertString(body.name, "name"),
		description: assertString(body.description, "description"),
		attributeIds: assertStringArray(body.attributeIds, "attributeIds"),
	};
};

const handleError = (c: Context, error: unknown) => {
	if (error instanceof ValidationError) {
		return c.json({ error: error.message }, 400);
	}

	if (error instanceof NotFoundError) {
		return c.json({ error: error.message }, 404);
	}

	console.error(error);
	return c.json({ error: "Internal server error" }, 500);
};

app.get("/", (c) => c.text("Admin API Mock Server"));

app.get("/v1alpha1/health/liveness", (c) => c.json({ status: "alive" }));

app.get("/v1alpha1/health/readiness", (c) => c.json({ status: "ready" }));

app.get("/v1alpha1/projects", (c) => {
	try {
		const pagination = parsePagination(c);
		const projects = projectService.list(pagination.limit, pagination.offset);
		return c.json(projects);
	} catch (error) {
		return handleError(c, error);
	}
});

app.post("/v1alpha1/projects", async (c) => {
	try {
		const body = parseCreateProjectBody(await c.req.json());
		const project = projectService.createProject(body);
		return c.json(project, 201);
	} catch (error) {
		return handleError(c, error);
	}
});

app.get("/v1alpha1/projects/:projectId", (c) => {
	try {
		const projectId = c.req.param("projectId");
		const project = projectService.getProject(projectId);
		if (!project) {
			return c.json({ error: "Project not found" }, 404);
		}

		return c.json(project);
	} catch (error) {
		return handleError(c, error);
	}
});

app.put("/v1alpha1/projects/:projectId", async (c) => {
	try {
		const projectId = c.req.param("projectId");
		const body = parseUpdateProjectBody(await c.req.json());
		const project = projectService.updateProject(projectId, body);
		return c.json(project);
	} catch (error) {
		return handleError(c, error);
	}
});

app.get("/v1alpha1/users", (c) => {
	try {
		const pagination = parsePagination(c);
		const users = userService.list(pagination.limit, pagination.offset);
		return c.json(users);
	} catch (error) {
		return handleError(c, error);
	}
});

app.post("/v1alpha1/users", async (c) => {
	try {
		const body = parseCreateUserBody(await c.req.json());
		const user = userService.createUser(body);
		return c.json(user, 201);
	} catch (error) {
		return handleError(c, error);
	}
});

app.get("/v1alpha1/projects/:projectId/usergroups", (c) => {
	try {
		const projectId = c.req.param("projectId");
		const pagination = parsePagination(c);
		const groups = userGroupService.list(
			projectId,
			pagination.limit,
			pagination.offset,
		);
		return c.json(groups);
	} catch (error) {
		return handleError(c, error);
	}
});

app.post("/v1alpha1/projects/:projectId/usergroups", async (c) => {
	try {
		const projectId = c.req.param("projectId");
		const body = parseUserGroupBody(await c.req.json());
		const group = userGroupService.createGroup(projectId, body);
		return c.json(group, 201);
	} catch (error) {
		return handleError(c, error);
	}
});

app.get("/v1alpha1/projects/:projectId/usergroups/:groupId", (c) => {
	try {
		const projectId = c.req.param("projectId");
		const groupId = c.req.param("groupId");
		const group = userGroupService.getGroup(projectId, groupId);
		if (!group) {
			return c.json({ error: "User group not found" }, 404);
		}

		return c.json(group);
	} catch (error) {
		return handleError(c, error);
	}
});

app.put("/v1alpha1/projects/:projectId/usergroups/:groupId", async (c) => {
	try {
		const projectId = c.req.param("projectId");
		const groupId = c.req.param("groupId");
		const body = parseUserGroupBody(await c.req.json());
		const group = userGroupService.updateGroup(projectId, groupId, body);
		return c.json(group);
	} catch (error) {
		return handleError(c, error);
	}
});

app.get("/v1alpha1/projects/:projectId/roles", (c) => {
	try {
		const projectId = c.req.param("projectId");
		const pagination = parsePagination(c);
		const roles = roleService.list(
			projectId,
			pagination.limit,
			pagination.offset,
		);
		return c.json(roles);
	} catch (error) {
		return handleError(c, error);
	}
});

app.post("/v1alpha1/projects/:projectId/roles", async (c) => {
	try {
		const projectId = c.req.param("projectId");
		const body = parseRoleBody(await c.req.json());
		const role = roleService.createRole(projectId, body);
		return c.json(role, 201);
	} catch (error) {
		return handleError(c, error);
	}
});

app.get("/v1alpha1/projects/:projectId/roles/:roleId", (c) => {
	try {
		const projectId = c.req.param("projectId");
		const roleId = c.req.param("roleId");
		const role = roleService.getRole(projectId, roleId);
		if (!role) {
			return c.json({ error: "Role not found" }, 404);
		}

		return c.json(role);
	} catch (error) {
		return handleError(c, error);
	}
});

app.put("/v1alpha1/projects/:projectId/roles/:roleId", async (c) => {
	try {
		const projectId = c.req.param("projectId");
		const roleId = c.req.param("roleId");
		const body = parseRoleBody(await c.req.json());
		const role = roleService.updateRole(projectId, roleId, body);
		return c.json(role);
	} catch (error) {
		return handleError(c, error);
	}
});

serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
