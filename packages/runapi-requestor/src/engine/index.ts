import { RequestContext } from "../context/request-context";
import AbortablePromise from "promise-abortable";

export abstract class Engine<Response = any> {
  abstract doRequest(requestContext: RequestContext): Promise<Response>;

  doAbort(request: AbortablePromise<Response>) {
    request.abort();
  }
}
