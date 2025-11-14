/* eslint-disable */
import type { DefineMethods } from "aspida";
import type * as Types from "../../../@types";

export type Methods = DefineMethods<{
	/** Check if the service is alive. */
	get: {
		status: 200;
		/** Service is alive. */
		resBody: Types.HealthResponse;
	};
}>;
