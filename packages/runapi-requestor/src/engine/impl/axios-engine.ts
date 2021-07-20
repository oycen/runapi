import axios, { AxiosResponse } from "axios";
import { Engine, EngineAbortPromise } from "..";
import { RequestContext } from "../../context/request-context";

export class AxiosEngine extends Engine<AxiosResponse> {
  doRequest({ url, method, headers, credentials, query, body, others }: RequestContext) {
    const source = axios.CancelToken.source();

    return new EngineAbortPromise<AxiosResponse>((resolve, reject) => {
      axios({
        url,
        method,
        headers,
        withCredentials: typeof credentials === "boolean" ? credentials : false,
        params: query,
        data: body,
        cancelToken: source.token,
        ...others,
      })
        .then(resolve)
        .catch(reject);
    }, source.cancel);
  }

  async doResponse(response: AxiosResponse) {
    const ok = 200 <= response.status && response.status <= 299;
    return { ok, status: response.status, statusText: response.statusText, result: response.data };
  }
}
