import { RequestContext } from "../context/request-context";

export class RequestPromise<T> extends Promise<T> {
  abort: () => void;

  constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void, abort: () => void) {
    super(executor);
    this.abort = abort;
  }
}

export abstract class Engine<Response = any> {
  static RequestPromise = RequestPromise;

  abstract doRequest(requestContext: RequestContext): Promise<Response> | RequestPromise<Response>;

  abstract doResponse(response: Response): Promise<{ ok: boolean; status: string | number; statusText: string; result: any }>;
}
