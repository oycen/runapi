import { ModelConstructor } from "@runapi/requestor";

export const modelMetadataKey = Symbol("model");

export function Model(model: ModelConstructor): MethodDecorator {
  return (target) => {
    Reflect.defineMetadata(modelMetadataKey, model, target);
  };
}
