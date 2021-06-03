import { Requestor, createRequestor } from "@runapi/requestor";

export const serviceMetadataKey = Symbol("service");

export function Service(request: Requestor): ClassDecorator;
export function Service(...args: Parameters<typeof createRequestor>): ClassDecorator;

export function Service(...args: [Requestor] | Parameters<typeof createRequestor>): ClassDecorator {
  const request = args[0] instanceof Requestor ? args[0] : new Requestor(args[0], args[1], args[2]);
  return (target) => {
    Reflect.defineMetadata(serviceMetadataKey, request, target.prototype);
  };
}
