import { Requestor, createRequestor } from "@runapi/requestor";

export const serviceMetadataKey = Symbol("service");

export function Service(requestor: Requestor): ClassDecorator;
export function Service(requestor: () => Requestor): ClassDecorator;
export function Service(...args: Parameters<typeof createRequestor>): ClassDecorator;

export function Service(...args: [Requestor] | [() => Requestor] | Parameters<typeof createRequestor>): ClassDecorator {
  let request: Requestor | (() => Requestor) | undefined;
  if (typeof args[0] === "function" || args[0] instanceof Requestor) {
    request = args[0];
  } else {
    request = new Requestor(args[0], args[1], args[2]);
  }
  return (target) => {
    Reflect.defineMetadata(serviceMetadataKey, request, target.prototype);
  };
}
