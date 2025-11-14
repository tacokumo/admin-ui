/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../../../@types";

export type Methods = DefineMethods<{
	/** Retrieve a list of all roles in a project. */
	get: {
		query: {
			/** Maximum number of roles to return */
			limit: number;
			/** Number of roles to skip for pagination */
			offset: number;
		};

		status: 200;
		/** A list of roles. */
		resBody: Types.Role[];
	};

	/** Create a new role in a project. */
	post: {
		status: 201;
		/** Role created successfully. */
		resBody: Types.Role;
		reqBody: Types.CreateRoleRequest;
	};
}>;
