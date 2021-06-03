import { Engine } from "..";
import { RequestContext } from "../../context/request-context";

export class WxmpEngine extends Engine<unknown> {
  doRequest({ url, method, headers, body }: RequestContext) {
    return new Promise((resolve, reject) => {
      if (method === "PATCH") throw new Error("请求方法'PATCH'不受支持");

      wx.request({
        url,
        method,
        header: headers,
        data: body,
        dataType: "json",
        success: resolve,
        fail: reject,
      });
    });
  }
}
