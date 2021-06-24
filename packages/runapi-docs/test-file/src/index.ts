export { Requestor, createFetchRequestor, createRequestContext } from "@runapi/requestor";
export { gateway } from "./baibu-api-gateway";

/** 鉴权服务 */
export * from "./auth-server/auth.service";

/** 培训服务 */
export * from "./training-server/role.service";
export * from "./training-server/course.service";
