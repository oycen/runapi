import { RequestContext } from "../context/request-context";

export class EngineAbortPromise<T> {
  abort: () => void;

  promise: Promise<T>;
  then: Promise<T>["then"];
  catch: Promise<T>["catch"];
  finally: Promise<T>["finally"];

  constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void, abort: () => void) {
    this.promise = new Promise<T>(executor);
    this.then = this.promise.then.bind(this.promise);
    this.catch = this.promise.catch.bind(this.promise);
    this.finally = this.promise.finally.bind(this.promise);
    this.abort = abort;
  }
}

export abstract class Engine<Response = any> {
  abstract doRequest(requestContext: RequestContext): Promise<Response> | EngineAbortPromise<Response>;

  abstract doResponse(
    response: Response,
    requestContext: RequestContext
  ): Promise<{ ok: boolean; status: string | number; statusText: string; result: any }>;
}
