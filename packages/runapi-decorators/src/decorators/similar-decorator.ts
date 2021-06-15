import { RequestContext } from "@runapi/requestor";

export const similarMetadataKey = Symbol("similar");

export function Similar(similar: RequestContext["similar"]): MethodDecorator {
  return (target) => {
    Reflect.defineMetadata(similarMetadataKey, similar, target);
  };
}
