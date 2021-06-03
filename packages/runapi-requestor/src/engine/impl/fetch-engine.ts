import { Engine } from "..";
import { RequestContext } from "../../context/request-context";

export class FetchEngine extends Engine<Response> {
  doRequest({ queryUrl, method, headers, credentials, body }: RequestContext) {
    return fetch(queryUrl, {
      method,
      headers,
      credentials: typeof credentials === "boolean" ? "same-origin" : credentials ?? "same-origin",
      body: body ? JSON.stringify(body) : null,
    });
  }
}
