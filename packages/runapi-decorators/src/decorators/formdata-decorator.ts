export const formdataMetadataKey = Symbol("formdata");

export function Formdata(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(formdataMetadataKey, parameterIndex, target);
  };
}
