export const bodyMetadataKey = Symbol("params");

export function Body(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(bodyMetadataKey, parameterIndex, target);
  };
}
