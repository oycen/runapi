import { Engine, EngineAbortPromise } from "..";
import { RequestContext } from "../../context/request-context";

export interface WxmpResponse {
  cookies: string[];
  data: any;
  header: Record<string, any>;
  profile: any;
  statusCode: number;
  errMsg: string;
}

export class WxmpEngine extends Engine<WxmpResponse> {
  doRequest({ url, method, headers, body, others }: RequestContext) {
    let abort = () => {};

    return new EngineAbortPromise<WxmpResponse>((resolve, reject) => {
      if (method === "PATCH") throw new Error("请求方法'PATCH'不受支持");

      const request = wx.request({
        url,
        method,
        header: headers,
        data: body,
        dataType: "json",
        success: resolve,
        fail: reject,
        ...others,
      });
      abort = request.abort;
    }, abort);
  }

  async doResponse(response: WxmpResponse) {
    const ok = 200 <= response.statusCode && response.statusCode <= 299;
    return { ok, status: response.statusCode, statusText: response.errMsg, result: response.data };
  }
}
