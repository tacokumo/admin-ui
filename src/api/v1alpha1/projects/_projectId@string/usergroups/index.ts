/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../../../@types";

export type Methods = DefineMethods<{
	/** Retrieve a list of all user groups in a project. */
	get: {
		query: {
			/** Maximum number of user groups to return */
			limit: number;
			/** Number of user groups to skip for pagination */
			offset: number;
		};

		status: 200;
		/** A list of user groups. */
		resBody: Types.UserGroup[];
	};

	/** Create a new user group in a project. */
	post: {
		status: 201;
		/** User group created successfully. */
		resBody: Types.UserGroup;
		reqBody: Types.CreateUserGroupRequest;
	};
}>;
