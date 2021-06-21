import { buildUrl, combinePath, compilePath, objectToQueryString } from "../helpers";
import { Requestor } from "../requestor";
import { ResponseContext } from "./response-context";

export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type RequestCredentials = "include" | "omit" | "same-origin" | boolean;

export type Similar = "abort" | "wait-done";
export type RequestSimilar = Similar | ((requestContext: RequestContext) => [string, Similar]);

export type RequestContextTap<T> = (requestContext: RequestContext) => T;
export type ResponseContextTap<T> = (responseContext: ResponseContext<any, any>) => T;
export type ContextTap =
  | RequestContextTap<void>
  | RequestContextTap<ResponseContextTap<void>>
  | RequestContextTap<ResponseContextTap<Promise<void>>>
  | RequestContextTap<Promise<ResponseContextTap<void>>>
  | RequestContextTap<Promise<ResponseContextTap<Promise<void>>>>;

export type ModelConstructor<T = any> = { new (...args: any[]): T };

export function createRequestContext(requestContextPlain?: RequestContextPlain) {
  return new RequestContext()
    .setBaseUrl(requestContextPlain?.baseUrl)
    .setPath(requestContextPlain?.path)
    .setMethod(requestContextPlain?.method ?? "GET")
    .setHeaders(requestContextPlain?.headers)
    .setCredentials(requestContextPlain?.credentials)
    .setParams(requestContextPlain?.params)
    .setQuery(requestContextPlain?.query)
    .setBody(requestContextPlain?.body)
    .setMock(requestContextPlain?.mock)
    .setModel(requestContextPlain?.model)
    .setSimilar(requestContextPlain?.similar)
    .setOthers(requestContextPlain?.others)
    .setContextTap(requestContextPlain?.contextTap);
}

export interface RequestContextPlain {
  /** 请求基础URL */
  baseUrl?: string;

  /** 请求路径 */
  path?: string;

  /** 请求方法 */
  method?: RequestMethod;

  /** 请求头 */
  headers?: Record<string, string>;

  /**
   * 是否允许携带跨域cookies
   * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Request/credentials
   */
  credentials?: RequestCredentials;

  /** 请求路径参数 */
  params?: Record<string, any>;

  /** 请求查询参数 */
  query?: Record<string, any>;

  /** 请求体参数 */
  body?: Record<string, any>;

  /**
   * 模拟数据模板
   * @see https://github.com/nuysoft/Mock/wiki/Mock.mock()
   */
  mock?: any;

  /** 响应对象模型 */
  model?: ModelConstructor;

  /** 类似请求处理方式 */
  similar?: RequestSimilar;

  /** 需要传递给引擎的其他参数 */
  others?: any;

  /** 请求上下文与响应上下文监听回调函数 */
  contextTap?: ContextTap;
}

export class RequestContext {
  /** 请求基础URL */
  baseUrl?: string;

  /** 请求路径 */
  path?: string;

  /** 请求方法 */
  method: RequestMethod = "GET";

  /** 请求头 */
  headers?: Record<string, string>;

  /**
   * 是否允许携带跨域cookies
   * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Request/credentials
   */
  credentials?: RequestCredentials;

  /** 请求路径参数 */
  params?: Record<string, any>;

  /** 请求查询参数 */
  query?: Record<string, any>;

  /** 请求体参数 */
  body?: Record<string, any>;

  /**
   * 模拟数据模板
   * @see https://github.com/nuysoft/Mock/wiki/Mock.mock()
   */
  mock?: any;

  /** 响应对象模型 */
  model?: ModelConstructor;

  /** 类似请求处理方式 */
  similar?: RequestSimilar;

  /** 需要传递给引擎的其他参数 */
  others?: any;

  /** 请求上下文与响应上下文监听回调函数 */
  contextTap?: ContextTap;

  /** 请求完整路径 */
  get fullpath() {
    return compilePath(this.path ?? "", this.params);
  }

  /** 请求完整URL */
  get url() {
    return buildUrl(this.baseUrl ?? "", this.fullpath);
  }

  /** 查询字符串 */
  get queryString() {
    return objectToQueryString(this.query);
  }

  /** 带查询字符串的请求完整URL */
  get queryUrl() {
    return `${this.url}${this.queryString}`;
  }

  /** 设置请求基础URL */
  setBaseUrl(baseUrl: RequestContext["baseUrl"]) {
    this.baseUrl = baseUrl;
    return this;
  }

  /** 设置请求路径 */
  setPath(path: RequestContext["path"]) {
    this.path = path;
    return this;
  }

  /** 设置请求方法 */
  setMethod(method: RequestContext["method"]) {
    this.method = method;
    return this;
  }

  /** 设置请求头 */
  setHeaders(headers: RequestContext["headers"]) {
    this.headers = headers;
    return this;
  }

  /** 设置是否允许携带跨域cookies */
  setCredentials(credentials: RequestContext["credentials"]) {
    this.credentials = credentials;
    return this;
  }

  /** 设置请求路径参数 */
  setParams(params: RequestContext["params"]) {
    this.params = params;
    return this;
  }

  /** 设置请求查询参数 */
  setQuery(query: RequestContext["query"]) {
    this.query = query;
    return this;
  }

  /** 设置请求体参数 */
  setBody(body: RequestContext["body"]) {
    this.body = body;
    return this;
  }

  /** 设置模拟数据模板 */
  setMock(mock: RequestContext["mock"]) {
    this.mock = mock;
    return this;
  }

  /** 设置响应对象模型 */
  setModel(model: RequestContext["model"]) {
    this.model = model;
    return this;
  }

  /** 设置类似请求处理方式 */
  setSimilar(similar: RequestContext["similar"]) {
    this.similar = similar;
    return this;
  }

  /** 设置需要传递给引擎的其他参数 */
  setOthers(others: RequestContext["others"]) {
    this.others = others;
    return this;
  }

  /** 设置请求上下文与响应上下文监听 */
  setContextTap(contextTap: RequestContext["contextTap"]) {
    this.contextTap = contextTap;
    return this;
  }

  /** 发送请求 */
  send(requestor: Requestor) {
    return requestor.request(this);
  }

  /** 合并请求上下文 */
  merge(source: RequestContext) {
    return new RequestContext()
      .setBaseUrl(source.baseUrl ?? this.baseUrl)
      .setPath(combinePath(this.path ?? "", source.path ?? ""))
      .setMethod(source.method ?? this.method)
      .setHeaders(Object.assign({}, this.headers, source.headers))
      .setCredentials(source.credentials ?? this.credentials)
      .setParams(Object.assign({}, this.params, source.params))
      .setQuery(Object.assign({}, this.query, source.query))
      .setBody(Object.assign({}, this.body, source.body))
      .setMock(source.mock ?? this.mock)
      .setModel(source.model ?? this.model)
      .setSimilar(source.similar ?? this.similar)
      .setOthers(source.others ?? this.others)
      .setContextTap(source.contextTap ?? this.contextTap);
  }
}
