import { Engine, EngineAbortPromise } from "../engine";
import { RequestContext } from "../context/request-context";
import { ResponseContext } from "../context/response-context";
import { RequestError } from "../error/request-error";
import { waitDone } from "../utils";

export type RequestEnv<Environment extends string> = Record<Environment, string | undefined>;
export class Requestor<Response = any, Environment extends string = any> {
  /** 请求环境对象集合 */
  readonly requestEnv?: RequestEnv<Environment>;

  /** 当前请求环境 */
  env?: Environment[number];

  /** 请求引擎 */
  readonly engine: Engine<Response>;

  /** 全局请求上下文 */
  requestContext: RequestContext = new RequestContext();

  /** 请求池 */
  readonly requestPool: Map<string, Promise<Response> | EngineAbortPromise<Response>> = new Map();

  constructor(engine: Engine<Response>, requestContext?: RequestContext, requestEnv?: RequestEnv<Environment>) {
    this.engine = engine;
    this.requestEnv = requestEnv;

    if (requestContext) this.requestContext = this.requestContext.merge(requestContext);
  }

  /** 发起请求 */
  async request<Result = unknown>(requestContext: RequestContext) {
    let reqContext;
    let resContext;
    let beforeCallBack;
    let afterCallBack;
    let request: Promise<Response> | EngineAbortPromise<Response>;
    let similarRequestKey: string | undefined;

    try {
      reqContext = this.requestContext.merge(requestContext);

      beforeCallBack = reqContext.around;
      if (beforeCallBack) afterCallBack = await beforeCallBack(reqContext);

      if (reqContext.mock) {
        resContext = new ResponseContext<Result, Response>(reqContext, {}).mock();
      } else {
        let similar = reqContext.similar;
        if (typeof reqContext.similar === "function") {
          const dynamicSimilar = reqContext.similar(reqContext);
          similarRequestKey = dynamicSimilar[0];
          similar = dynamicSimilar[1];
        } else {
          similarRequestKey = `${reqContext.method.toLocaleUpperCase()}:${reqContext.queryUrl}`;
        }

        if (similar === "abort") {
          const similarRequest = this.requestPool.get(similarRequestKey);
          if (similarRequest instanceof EngineAbortPromise) similarRequest.abort();
        } else if (similar === "wait-done") {
          await waitDone(() => this.requestPool.has(similarRequestKey as string), 300);
        }

        request = this.engine.doRequest(reqContext);
        this.requestPool.set(similarRequestKey, request);

        const response = await request;
        this.requestPool.delete(similarRequestKey);

        const { ok, status, statusText, result } = await this.engine.doResponse(response, reqContext);
        resContext = new ResponseContext<Result, Response>(reqContext, response);
        resContext.ok = ok;
        resContext.status = status;
        resContext.statusText = statusText;
        resContext.result = result;
      }

      if (afterCallBack) await afterCallBack(resContext);

      if (resContext.ok) resContext.model();

      return resContext;
    } catch (error) {
      similarRequestKey && this.requestPool.delete(similarRequestKey);

      throw new RequestError(error.name, error.message, resContext?.status, resContext?.statusText, resContext);
    }
  }

  /** 切换请求环境 */
  switch(env: Environment) {
    if (this.requestEnv && this.requestEnv[env]) {
      this.requestContext.baseUrl = this.requestEnv[env];
      this.env = env;
    }
    return this;
  }
}
