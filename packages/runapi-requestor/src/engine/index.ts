import { RequestContext } from "../context/request-context";

export abstract class Engine<Response = any> {
  abstract doRequest(requestContext: RequestContext): Promise<Response>;
}
