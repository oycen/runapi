import { ModelConstructor } from "@runapi/requestor";

export const transformMetadataKey = Symbol("model");

export function Transform(model: ModelConstructor): MethodDecorator {
  return (target) => {
    Reflect.defineMetadata(transformMetadataKey, model, target);
  };
}
