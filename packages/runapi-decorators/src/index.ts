import "reflect-metadata";
import { ResponseContext } from "@runapi/requestor";

export type ResponseContextPromise<T = unknown, U = any> = Promise<ResponseContext<T, U>> & void;

export * from "./decorators/service-decorator";
export * from "./decorators/base-url-decorator";
export * from "./decorators/headers-decorator";
export * from "./decorators/params-decorator";
export * from "./decorators/query-decorator";
export * from "./decorators/body-decorator";
export * from "./decorators/http-decorator";
export * from "./decorators/get-decorator";
export * from "./decorators/post-decorator";
export * from "./decorators/put-decorator";
export * from "./decorators/patch-decorator";
export * from "./decorators/delete-decorator";
export * from "./decorators/mock-decorator";
export * from "./decorators/model-decorator";
export * from "./decorators/similar-decorator";

export * from "./scanner/service-scanner";
