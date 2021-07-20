import "mini-types";
import { Engine, EngineAbortPromise } from "..";
import { RequestContext } from "../../context/request-context";

export class AlipayMiniProgramEngine extends Engine<my.IHttpRequestSuccessResult> {
  doRequest({ url, method, headers, body, others }: RequestContext) {
    let abort = () => {};

    return new EngineAbortPromise<my.IHttpRequestSuccessResult>((resolve, reject) => {
      if (method === "PUT") throw new Error("请求方法'PUT'不受支持");
      if (method === "PATCH") throw new Error("请求方法'PATCH'不受支持");
      if (method === "DELETE") throw new Error("请求方法'DELETE'不受支持");

      const request = my.request({
        url,
        method,
        headers,
        data: body,
        dataType: "json",
        success: resolve,
        fail: reject,
        ...others
      });
      abort = request.abort;
    }, abort);
  }

  async doResponse(response: my.IHttpRequestSuccessResult) {
    const ok = 200 <= (response.status as number) && (response.status as number) <= 299;
    return { ok, status: response.status ?? "", statusText: "", result: response.data };
  }
}
