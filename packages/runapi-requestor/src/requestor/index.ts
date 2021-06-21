import { Engine, EngineAbortPromise } from "../engine";
import { Interceptor } from "../interceptor";
import { FetchEngine } from "../engine/impl/fetch-engine";
import { WxmpEngine } from "../engine/impl/wxmp-engine";
import { RequestContext } from "../context/request-context";
import { ResponseContext } from "../context/response-context";
import { RequestError } from "../error/request-error";
import { splitHostnameByHyphen, isDomainUrl, isLocalUrl, getApplicationClient, waitDone } from "../helpers";

export type RequestEnv<Environment extends string> = Record<Environment, string | undefined>;
export type RequestClient = "browser" | "wechatminiapp";

export function createRequestor<Environment extends string = any, Response = any>(
  engine: Engine<Response>,
  requestContext?: RequestContext,
  requestEnv?: RequestEnv<Environment>
) {
  return new Requestor<Response, Environment>(engine, requestContext, requestEnv);
}

export function createFetchRequestor<Environment extends string = any>(requestContext?: RequestContext, requestEnv?: RequestEnv<Environment>) {
  return new Requestor<Response, Environment>(new FetchEngine(), requestContext, requestEnv);
}

export function createWxmpRequestor<Environment extends string = any>(requestContext?: RequestContext, requestEnv?: RequestEnv<Environment>) {
  return new Requestor<any, Environment>(new WxmpEngine(), requestContext, requestEnv);
}

export function createAutoAdaptRequestor<Environment extends string = any>(requestContext?: RequestContext, requestEnv?: RequestEnv<Environment>) {
  let engine: Engine,
    client = Requestor.client;

  if (client === "wechatminiapp") {
    engine = new WxmpEngine();
  } else if (client === "browser") {
    engine = new FetchEngine();
  } else {
    throw new Error("当前运行环境不受支持");
  }

  return new Requestor<any, Environment>(engine, requestContext, requestEnv);
}

export class Requestor<Response = any, Environment extends string = any> {
  /** 所属客户端，目前仅识别浏览器端 */
  static readonly client: RequestClient = getApplicationClient();

  /** 浏览器端相关工具属性，方法 */
  static readonly browser = {
    PROTOCOL: window.location.protocol,
    HOSTNAME: window.location.hostname,
    PORT: window.location.port,
    ORIGIN: window.location.origin,
    IS_LOCAL: isLocalUrl(window.location.hostname),
    IS_DOMAIN: isDomainUrl(window.location.hostname),
    HOSTNAME_HYPHEN_PREFIX: splitHostnameByHyphen(window.location.hostname)[0],
    HOSTNAME_HYPHEN_SUFFIX: splitHostnameByHyphen(window.location.hostname)[1],
  };

  /** 获取环境变量 */
  static processenv<T = string>(name: string[]) {
    return name
      .map((name) => process.env[name] as unknown as T | undefined)
      .filter(Boolean)
      .pop();
  }

  /** 请求环境对象集合 */
  readonly requestEnv?: RequestEnv<Environment>;

  /** 当前请求环境 */
  env?: Environment[number];

  /** 请求引擎 */
  readonly engine: Engine<Response>;

  /** 请求拦截器 */
  readonly interceptors: Interceptor<Response>[] = [];

  /** 全局请求上下文 */
  requestContext: RequestContext = new RequestContext();

  /** 请求池 */
  readonly requestPool: Map<string, Promise<Response> | EngineAbortPromise<Response>> = new Map();

  constructor(engine: Engine<Response>, requestContext?: RequestContext, requestEnv?: RequestEnv<Environment>) {
    this.engine = engine;
    this.requestEnv = requestEnv;

    if (requestContext) this.requestContext = this.requestContext.merge(requestContext);

    if (Requestor.client === "browser") this.switch(window.localStorage.getItem("request_env") as Environment);
  }

  /** 发起请求 */
  async request<Result = unknown>(requestContext: RequestContext) {
    let reqContext;
    let resContext;
    let reqContextTap;
    let resContextTap;
    let request: Promise<Response> | EngineAbortPromise<Response>;
    let similarRequestKey: string | undefined;

    try {
      reqContext = this.requestContext.merge(requestContext);

      const [requestIntercepts, responseIntercepts] = [
        this.interceptors.map(({ requestIntercept }) => requestIntercept),
        this.interceptors.map(({ responseIntercept }) => responseIntercept),
      ];

      reqContextTap = reqContext.contextTap;
      if (reqContextTap) resContextTap = await reqContextTap(reqContext);

      for await (const requestIntercept of requestIntercepts) {
        reqContext = await requestIntercept(reqContext);
      }

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

      if (resContextTap) await resContextTap(resContext);

      for await (const responseIntercept of responseIntercepts) {
        resContext = await responseIntercept(resContext);
      }

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

  /** 使用拦截器 */
  use(...interceptors: Interceptor[]) {
    this.interceptors.concat(interceptors);
    return this;
  }
}
