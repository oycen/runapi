import { RequestContext } from "@runapi/requestor";

export const baseUrlMetadataKey = Symbol("baseUrl");

export function BaseUrl(baseUrl: RequestContext["baseUrl"]): MethodDecorator {
  return (target) => {
    Reflect.defineMetadata(baseUrlMetadataKey, baseUrl, target);
  };
}
