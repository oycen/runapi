export const queryMetadataKey = Symbol("query");

export function Query(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(queryMetadataKey, parameterIndex, target);
  };
}
