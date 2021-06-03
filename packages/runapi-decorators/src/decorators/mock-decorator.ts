import { RequestContext } from "@runapi/requestor";

export const mockMetadataKey = Symbol("mock");

export function Mock(mockTemplate: RequestContext["mockTemplate"]): MethodDecorator {
  return (target) => {
    Reflect.defineMetadata(mockMetadataKey, mockTemplate, target);
  };
}
