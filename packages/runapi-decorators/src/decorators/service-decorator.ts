import { Requestor, createRequestor, RequestContextPlain, RequestContext, createRequestContext } from "@runapi/requestor";

export const serviceMetadataKey = Symbol("service");

export function Service(requestor: Requestor, requestContextPlain?: RequestContextPlain): ClassDecorator;
export function Service(requestor: () => Requestor, requestContextPlain?: RequestContextPlain): ClassDecorator;
export function Service(...args: Parameters<typeof createRequestor>): ClassDecorator;

export function Service(...args: any): ClassDecorator {
  let requestor: Requestor | (() => Requestor) | undefined;
  let requestContext: RequestContext | undefined;
  if (typeof args[0] === "function" || args[0] instanceof Requestor) {
    requestor = args[0];
    requestContext = createRequestContext(args[1]);
  } else {
    requestor = new Requestor(args[0], args[1], args[2]);
  }
  return (target) => {
    Reflect.defineMetadata(serviceMetadataKey, { requestor, requestContext }, target.prototype);
  };
}
