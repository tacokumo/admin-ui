/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../../@types";

export type Methods = DefineMethods<{
	/** Retrieve a project by its ID. */
	get: {
		status: 200;
		/** Project details. */
		resBody: Types.Project;
	};

	/** Update an existing project. */
	put: {
		status: 200;
		/** Project updated successfully. */
		resBody: Types.Project;
		reqBody: Types.UpdateProjectRequest;
	};
}>;
