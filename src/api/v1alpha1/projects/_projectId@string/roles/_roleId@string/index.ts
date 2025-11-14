/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../../../../@types";

export type Methods = DefineMethods<{
	/** Retrieve a role by its ID in a project. */
	get: {
		status: 200;
		/** Role details. */
		resBody: Types.Role;
	};

	/** Update an existing role in a project. */
	put: {
		status: 200;
		/** Role updated successfully. */
		resBody: Types.Role;
		reqBody: Types.UpdateRoleRequest;
	};
}>;
