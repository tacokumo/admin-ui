import type { AspidaClient, BasicHeaders } from "aspida";
import { dataToURLString } from "aspida";
import type { Methods as Methods_jivkqp } from "./v1alpha1/health/liveness";
import type { Methods as Methods_1nbz74g } from "./v1alpha1/health/readiness";
import type { Methods as Methods_4jdmpb } from "./v1alpha1/projects";
import type { Methods as Methods_ijhmng } from "./v1alpha1/projects/_projectId@string";
import type { Methods as Methods_8bfoyq } from "./v1alpha1/projects/_projectId@string/roles";
import type { Methods as Methods_wm61cq } from "./v1alpha1/projects/_projectId@string/roles/_roleId@string";
import type { Methods as Methods_1t8rjge } from "./v1alpha1/projects/_projectId@string/usergroups";
import type { Methods as Methods_17xdd3j } from "./v1alpha1/projects/_projectId@string/usergroups/_groupId@string";
import type { Methods as Methods_4fnyij } from "./v1alpha1/users";

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
	const prefix = (
		baseURL === undefined ? "http://admin.example.com" : baseURL
	).replace(/\/$/, "");
	const PATH0 = "/v1alpha1/health/liveness";
	const PATH1 = "/v1alpha1/health/readiness";
	const PATH2 = "/v1alpha1/projects";
	const PATH3 = "/roles";
	const PATH4 = "/usergroups";
	const PATH5 = "/v1alpha1/users";
	const GET = "GET";
	const POST = "POST";
	const PUT = "PUT";

	return {
		v1alpha1: {
			health: {
				liveness: {
					/**
					 * Check if the service is alive.
					 * @returns Service is alive.
					 */
					get: (option?: { config?: T | undefined } | undefined) =>
						fetch<
							Methods_jivkqp["get"]["resBody"],
							BasicHeaders,
							Methods_jivkqp["get"]["status"]
						>(prefix, PATH0, GET, option).json(),
					/**
					 * Check if the service is alive.
					 * @returns Service is alive.
					 */
					$get: (option?: { config?: T | undefined } | undefined) =>
						fetch<
							Methods_jivkqp["get"]["resBody"],
							BasicHeaders,
							Methods_jivkqp["get"]["status"]
						>(prefix, PATH0, GET, option)
							.json()
							.then((r) => r.body),
					$path: () => `${prefix}${PATH0}`,
				},
				readiness: {
					/**
					 * Check if the service is ready for receiving requests.
					 * @returns Service is ready.
					 */
					get: (option?: { config?: T | undefined } | undefined) =>
						fetch<
							Methods_1nbz74g["get"]["resBody"],
							BasicHeaders,
							Methods_1nbz74g["get"]["status"]
						>(prefix, PATH1, GET, option).json(),
					/**
					 * Check if the service is ready for receiving requests.
					 * @returns Service is ready.
					 */
					$get: (option?: { config?: T | undefined } | undefined) =>
						fetch<
							Methods_1nbz74g["get"]["resBody"],
							BasicHeaders,
							Methods_1nbz74g["get"]["status"]
						>(prefix, PATH1, GET, option)
							.json()
							.then((r) => r.body),
					$path: () => `${prefix}${PATH1}`,
				},
			},
			projects: {
				_projectId: (val2: string) => {
					const prefix2 = `${PATH2}/${val2}`;

					return {
						roles: {
							_roleId: (val4: string) => {
								const prefix4 = `${prefix2}${PATH3}/${val4}`;

								return {
									/**
									 * Retrieve a role by its ID in a project.
									 * @returns Role details.
									 */
									get: (option?: { config?: T | undefined } | undefined) =>
										fetch<
											Methods_wm61cq["get"]["resBody"],
											BasicHeaders,
											Methods_wm61cq["get"]["status"]
										>(prefix, prefix4, GET, option).json(),
									/**
									 * Retrieve a role by its ID in a project.
									 * @returns Role details.
									 */
									$get: (option?: { config?: T | undefined } | undefined) =>
										fetch<
											Methods_wm61cq["get"]["resBody"],
											BasicHeaders,
											Methods_wm61cq["get"]["status"]
										>(prefix, prefix4, GET, option)
											.json()
											.then((r) => r.body),
									/**
									 * Update an existing role in a project.
									 * @returns Role updated successfully.
									 */
									put: (option: {
										body: Methods_wm61cq["put"]["reqBody"];
										config?: T | undefined;
									}) =>
										fetch<
											Methods_wm61cq["put"]["resBody"],
											BasicHeaders,
											Methods_wm61cq["put"]["status"]
										>(prefix, prefix4, PUT, option).json(),
									/**
									 * Update an existing role in a project.
									 * @returns Role updated successfully.
									 */
									$put: (option: {
										body: Methods_wm61cq["put"]["reqBody"];
										config?: T | undefined;
									}) =>
										fetch<
											Methods_wm61cq["put"]["resBody"],
											BasicHeaders,
											Methods_wm61cq["put"]["status"]
										>(prefix, prefix4, PUT, option)
											.json()
											.then((r) => r.body),
									$path: () => `${prefix}${prefix4}`,
								};
							},
							/**
							 * Retrieve a list of all roles in a project.
							 * @returns A list of roles.
							 */
							get: (option: {
								query: Methods_8bfoyq["get"]["query"];
								config?: T | undefined;
							}) =>
								fetch<
									Methods_8bfoyq["get"]["resBody"],
									BasicHeaders,
									Methods_8bfoyq["get"]["status"]
								>(prefix, `${prefix2}${PATH3}`, GET, option).json(),
							/**
							 * Retrieve a list of all roles in a project.
							 * @returns A list of roles.
							 */
							$get: (option: {
								query: Methods_8bfoyq["get"]["query"];
								config?: T | undefined;
							}) =>
								fetch<
									Methods_8bfoyq["get"]["resBody"],
									BasicHeaders,
									Methods_8bfoyq["get"]["status"]
								>(prefix, `${prefix2}${PATH3}`, GET, option)
									.json()
									.then((r) => r.body),
							/**
							 * Create a new role in a project.
							 * @returns Role created successfully.
							 */
							post: (option: {
								body: Methods_8bfoyq["post"]["reqBody"];
								config?: T | undefined;
							}) =>
								fetch<
									Methods_8bfoyq["post"]["resBody"],
									BasicHeaders,
									Methods_8bfoyq["post"]["status"]
								>(prefix, `${prefix2}${PATH3}`, POST, option).json(),
							/**
							 * Create a new role in a project.
							 * @returns Role created successfully.
							 */
							$post: (option: {
								body: Methods_8bfoyq["post"]["reqBody"];
								config?: T | undefined;
							}) =>
								fetch<
									Methods_8bfoyq["post"]["resBody"],
									BasicHeaders,
									Methods_8bfoyq["post"]["status"]
								>(prefix, `${prefix2}${PATH3}`, POST, option)
									.json()
									.then((r) => r.body),
							$path: (
								option?:
									| {
											method?: "get" | undefined;
											query: Methods_8bfoyq["get"]["query"];
									  }
									| undefined,
							) =>
								`${prefix}${prefix2}${PATH3}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
						},
						usergroups: {
							_groupId: (val4: string) => {
								const prefix4 = `${prefix2}${PATH4}/${val4}`;

								return {
									/**
									 * Retrieve a user group by its ID in a project.
									 * @returns User group details.
									 */
									get: (option?: { config?: T | undefined } | undefined) =>
										fetch<
											Methods_17xdd3j["get"]["resBody"],
											BasicHeaders,
											Methods_17xdd3j["get"]["status"]
										>(prefix, prefix4, GET, option).json(),
									/**
									 * Retrieve a user group by its ID in a project.
									 * @returns User group details.
									 */
									$get: (option?: { config?: T | undefined } | undefined) =>
										fetch<
											Methods_17xdd3j["get"]["resBody"],
											BasicHeaders,
											Methods_17xdd3j["get"]["status"]
										>(prefix, prefix4, GET, option)
											.json()
											.then((r) => r.body),
									/**
									 * Update an existing user group in a project.
									 * @returns User group updated successfully.
									 */
									put: (option: {
										body: Methods_17xdd3j["put"]["reqBody"];
										config?: T | undefined;
									}) =>
										fetch<
											Methods_17xdd3j["put"]["resBody"],
											BasicHeaders,
											Methods_17xdd3j["put"]["status"]
										>(prefix, prefix4, PUT, option).json(),
									/**
									 * Update an existing user group in a project.
									 * @returns User group updated successfully.
									 */
									$put: (option: {
										body: Methods_17xdd3j["put"]["reqBody"];
										config?: T | undefined;
									}) =>
										fetch<
											Methods_17xdd3j["put"]["resBody"],
											BasicHeaders,
											Methods_17xdd3j["put"]["status"]
										>(prefix, prefix4, PUT, option)
											.json()
											.then((r) => r.body),
									$path: () => `${prefix}${prefix4}`,
								};
							},
							/**
							 * Retrieve a list of all user groups in a project.
							 * @returns A list of user groups.
							 */
							get: (option: {
								query: Methods_1t8rjge["get"]["query"];
								config?: T | undefined;
							}) =>
								fetch<
									Methods_1t8rjge["get"]["resBody"],
									BasicHeaders,
									Methods_1t8rjge["get"]["status"]
								>(prefix, `${prefix2}${PATH4}`, GET, option).json(),
							/**
							 * Retrieve a list of all user groups in a project.
							 * @returns A list of user groups.
							 */
							$get: (option: {
								query: Methods_1t8rjge["get"]["query"];
								config?: T | undefined;
							}) =>
								fetch<
									Methods_1t8rjge["get"]["resBody"],
									BasicHeaders,
									Methods_1t8rjge["get"]["status"]
								>(prefix, `${prefix2}${PATH4}`, GET, option)
									.json()
									.then((r) => r.body),
							/**
							 * Create a new user group in a project.
							 * @returns User group created successfully.
							 */
							post: (option: {
								body: Methods_1t8rjge["post"]["reqBody"];
								config?: T | undefined;
							}) =>
								fetch<
									Methods_1t8rjge["post"]["resBody"],
									BasicHeaders,
									Methods_1t8rjge["post"]["status"]
								>(prefix, `${prefix2}${PATH4}`, POST, option).json(),
							/**
							 * Create a new user group in a project.
							 * @returns User group created successfully.
							 */
							$post: (option: {
								body: Methods_1t8rjge["post"]["reqBody"];
								config?: T | undefined;
							}) =>
								fetch<
									Methods_1t8rjge["post"]["resBody"],
									BasicHeaders,
									Methods_1t8rjge["post"]["status"]
								>(prefix, `${prefix2}${PATH4}`, POST, option)
									.json()
									.then((r) => r.body),
							$path: (
								option?:
									| {
											method?: "get" | undefined;
											query: Methods_1t8rjge["get"]["query"];
									  }
									| undefined,
							) =>
								`${prefix}${prefix2}${PATH4}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
						},
						/**
						 * Retrieve a project by its ID.
						 * @returns Project details.
						 */
						get: (option?: { config?: T | undefined } | undefined) =>
							fetch<
								Methods_ijhmng["get"]["resBody"],
								BasicHeaders,
								Methods_ijhmng["get"]["status"]
							>(prefix, prefix2, GET, option).json(),
						/**
						 * Retrieve a project by its ID.
						 * @returns Project details.
						 */
						$get: (option?: { config?: T | undefined } | undefined) =>
							fetch<
								Methods_ijhmng["get"]["resBody"],
								BasicHeaders,
								Methods_ijhmng["get"]["status"]
							>(prefix, prefix2, GET, option)
								.json()
								.then((r) => r.body),
						/**
						 * Update an existing project.
						 * @returns Project updated successfully.
						 */
						put: (option: {
							body: Methods_ijhmng["put"]["reqBody"];
							config?: T | undefined;
						}) =>
							fetch<
								Methods_ijhmng["put"]["resBody"],
								BasicHeaders,
								Methods_ijhmng["put"]["status"]
							>(prefix, prefix2, PUT, option).json(),
						/**
						 * Update an existing project.
						 * @returns Project updated successfully.
						 */
						$put: (option: {
							body: Methods_ijhmng["put"]["reqBody"];
							config?: T | undefined;
						}) =>
							fetch<
								Methods_ijhmng["put"]["resBody"],
								BasicHeaders,
								Methods_ijhmng["put"]["status"]
							>(prefix, prefix2, PUT, option)
								.json()
								.then((r) => r.body),
						$path: () => `${prefix}${prefix2}`,
					};
				},
				/**
				 * Retrieve a list of all projects.
				 * @returns A list of projects.
				 */
				get: (option: {
					query: Methods_4jdmpb["get"]["query"];
					config?: T | undefined;
				}) =>
					fetch<
						Methods_4jdmpb["get"]["resBody"],
						BasicHeaders,
						Methods_4jdmpb["get"]["status"]
					>(prefix, PATH2, GET, option).json(),
				/**
				 * Retrieve a list of all projects.
				 * @returns A list of projects.
				 */
				$get: (option: {
					query: Methods_4jdmpb["get"]["query"];
					config?: T | undefined;
				}) =>
					fetch<
						Methods_4jdmpb["get"]["resBody"],
						BasicHeaders,
						Methods_4jdmpb["get"]["status"]
					>(prefix, PATH2, GET, option)
						.json()
						.then((r) => r.body),
				/**
				 * Create a new project.
				 * @returns Project created successfully.
				 */
				post: (option: {
					body: Methods_4jdmpb["post"]["reqBody"];
					config?: T | undefined;
				}) =>
					fetch<
						Methods_4jdmpb["post"]["resBody"],
						BasicHeaders,
						Methods_4jdmpb["post"]["status"]
					>(prefix, PATH2, POST, option).json(),
				/**
				 * Create a new project.
				 * @returns Project created successfully.
				 */
				$post: (option: {
					body: Methods_4jdmpb["post"]["reqBody"];
					config?: T | undefined;
				}) =>
					fetch<
						Methods_4jdmpb["post"]["resBody"],
						BasicHeaders,
						Methods_4jdmpb["post"]["status"]
					>(prefix, PATH2, POST, option)
						.json()
						.then((r) => r.body),
				$path: (
					option?:
						| {
								method?: "get" | undefined;
								query: Methods_4jdmpb["get"]["query"];
						  }
						| undefined,
				) =>
					`${prefix}${PATH2}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
			},
			users: {
				/**
				 * Retrieve a list of all users.
				 * @returns A list of users.
				 */
				get: (option: {
					query: Methods_4fnyij["get"]["query"];
					config?: T | undefined;
				}) =>
					fetch<
						Methods_4fnyij["get"]["resBody"],
						BasicHeaders,
						Methods_4fnyij["get"]["status"]
					>(prefix, PATH5, GET, option).json(),
				/**
				 * Retrieve a list of all users.
				 * @returns A list of users.
				 */
				$get: (option: {
					query: Methods_4fnyij["get"]["query"];
					config?: T | undefined;
				}) =>
					fetch<
						Methods_4fnyij["get"]["resBody"],
						BasicHeaders,
						Methods_4fnyij["get"]["status"]
					>(prefix, PATH5, GET, option)
						.json()
						.then((r) => r.body),
				/**
				 * Create a new user.
				 * Admin上で管理するユーザを作成するだけであり､真実源はAuth0で管理される
				 * @returns User created successfully.
				 */
				post: (option: {
					body: Methods_4fnyij["post"]["reqBody"];
					config?: T | undefined;
				}) =>
					fetch<
						Methods_4fnyij["post"]["resBody"],
						BasicHeaders,
						Methods_4fnyij["post"]["status"]
					>(prefix, PATH5, POST, option).json(),
				/**
				 * Create a new user.
				 * Admin上で管理するユーザを作成するだけであり､真実源はAuth0で管理される
				 * @returns User created successfully.
				 */
				$post: (option: {
					body: Methods_4fnyij["post"]["reqBody"];
					config?: T | undefined;
				}) =>
					fetch<
						Methods_4fnyij["post"]["resBody"],
						BasicHeaders,
						Methods_4fnyij["post"]["status"]
					>(prefix, PATH5, POST, option)
						.json()
						.then((r) => r.body),
				$path: (
					option?:
						| {
								method?: "get" | undefined;
								query: Methods_4fnyij["get"]["query"];
						  }
						| undefined,
				) =>
					`${prefix}${PATH5}${option && option.query ? `?${dataToURLString(option.query)}` : ""}`,
			},
		},
	};
};

export type ApiInstance = ReturnType<typeof api>;
export default api;
