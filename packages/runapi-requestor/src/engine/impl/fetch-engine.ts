import { Engine } from "..";
import { RequestContext } from "../../context/request-context";

export class FetchEngine extends Engine<Response> {
  doRequest({ queryUrl, method, headers, credentials, body, others }: RequestContext) {
    const { signal, abort } = new AbortController();

    return new Engine.EngineAbortPromise<Response>((resolve, reject) => {
      window
        .fetch(queryUrl, {
          method,
          headers,
          credentials: typeof credentials === "boolean" ? "same-origin" : credentials ?? "same-origin",
          body: body ? JSON.stringify(body) : null,
          ...others,
          signal,
        })
        .then(resolve)
        .catch(reject);
    }, abort);
  }

  async doResponse(response: Response) {
    const result = await response.json();
    return { ok: response.ok, status: response.status, statusText: response.statusText, result };
  }
}
