/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../@types";

export type Methods = DefineMethods<{
	/** Retrieve a list of all users. */
	get: {
		query: {
			/** Maximum number of users to return */
			limit: number;
			/** Number of users to skip for pagination */
			offset: number;
		};

		status: 200;
		/** A list of users. */
		resBody: Types.User[];
	};

	/**
	 * Create a new user.
	 * Admin上で管理するユーザを作成するだけであり､真実源はAuth0で管理される
	 */
	post: {
		status: 201;
		/** User created successfully. */
		resBody: Types.User;
		reqBody: Types.CreateUserRequest;
	};
}>;
