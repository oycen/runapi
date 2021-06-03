import { Interceptor } from "@runapi/requestor";

export const interceptorsMetadataKey = Symbol("interceptors");

export function Interceptors(...interceptors: Interceptor[]): MethodDecorator {
  return (target) => {
    Reflect.defineMetadata(interceptorsMetadataKey, interceptors, target);
  };
}
