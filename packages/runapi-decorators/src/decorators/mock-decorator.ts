import { RequestContext } from "@runapi/requestor";

export const mockMetadataKey = Symbol("mock");

export function Mock(mock: RequestContext["mock"]): MethodDecorator {
  return (target) => {
    Reflect.defineMetadata(mockMetadataKey, mock, target);
  };
}
