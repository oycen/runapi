export const paramsMetadataKey = Symbol("params");

export function Params(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(paramsMetadataKey, parameterIndex, target);
  };
}
