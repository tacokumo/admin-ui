/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../../../../@types";

export type Methods = DefineMethods<{
	/** Retrieve a user group by its ID in a project. */
	get: {
		status: 200;
		/** User group details. */
		resBody: Types.UserGroup;
	};

	/** Update an existing user group in a project. */
	put: {
		status: 200;
		/** User group updated successfully. */
		resBody: Types.UserGroup;
		reqBody: Types.UpdateUserGroupRequest;
	};
}>;
