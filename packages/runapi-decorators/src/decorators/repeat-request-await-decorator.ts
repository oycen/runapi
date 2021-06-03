export const repeatRequestAwaitMetadataKey = Symbol("repeatRequestAwait");

export function RepeatRequestAwait(): MethodDecorator {
  return (target) => {
    Reflect.defineMetadata(repeatRequestAwaitMetadataKey, true, target);
  };
}
