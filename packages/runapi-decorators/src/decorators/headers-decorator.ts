import { RequestContext } from "@runapi/requestor";

export const headersMetadataKey = Symbol("headers");

export function Headers(headers: RequestContext["headers"]): MethodDecorator {
  return (target) => {
    Reflect.defineMetadata(headersMetadataKey, headers, target);
  };
}
