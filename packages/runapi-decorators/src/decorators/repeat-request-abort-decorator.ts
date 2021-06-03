export const repeatRequestAbortMetadataKey = Symbol("repeatRequestAbort");

export function RepeatRequestAbort(): MethodDecorator {
  return (target) => {
    Reflect.defineMetadata(repeatRequestAbortMetadataKey, true, target);
  };
}
