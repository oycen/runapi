import { plainToClass } from "class-transformer";
import { buildUrl, combineUrl, compilePath, objectToQueryString } from "../helpers";
import { Requestor } from "../requestor";
import { ResponseContext } from "./response-context";

export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestCredentials = "include" | "omit" | "same-origin" | boolean;

export function createRequestContext() {
  return new RequestContext();
}

export class RequestContext {
  static merge(target: RequestContext, source?: RequestContext) {
    return new RequestContext()
      .setBaseUrl(source?.baseUrl ?? target.baseUrl)
      .setBasePath(source?.basePath ?? target.basePath)
      .setPath(source?.path ?? target.path)
      .setMethod(source?.method ?? target.method)
      .setHeaders(source?.headers ?? target.headers)
      .setCredentials(source?.credentials ?? target.credentials)
      .setParams(target.params, source?.params)
      .setQuery(target.query, source?.query)
      .setBody(target.body, source?.body)
      .setContextTap(source?.contextTap ?? target.contextTap)
      .setMockTemplate(source?.mockTemplate ?? target.mockTemplate)
      .setRepeatRequestAbort(source?.repeatRequestAbort ?? target.repeatRequestAbort)
      .setRepeatRequestAwait(source?.repeatRequestAwait ?? target.repeatRequestAwait)
      .setOthers(source?.baseUrl ?? target.baseUrl);
  }

  /** 请求基础URL */
  baseUrl?: string;

  /** 请求基础路径 */
  basePath?: string;

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

  /** 请求上下文与响应上下文监听回调函数 */
  contextTap?: (requestContext: RequestContext) => (responseContext: ResponseContext<any, any>) => ResponseContext<any, any>;

  /**
   * 模拟数据模板
   * @see https://github.com/nuysoft/Mock/wiki/Mock.mock()
   */
  mockTemplate?: any;

  /** 是否取消处理中的重复请求 */
  repeatRequestAbort?: boolean;

  /** 是否等待处理中的重复请求 */
  repeatRequestAwait?: boolean;

  /** 需要传递给引擎的其他参数 */
  others?: any;

  /** 请求完整路径 */
  get fullpath() {
    return compilePath(combineUrl(this.basePath ?? "", this.path ?? ""), this.params);
  }

  /** 请求完整URL */
  get url() {
    return buildUrl(this.baseUrl ?? "", this.fullpath);
  }

  /** 带查询字符串的请求完整URL */
  get queryUrl() {
    return `${this.url}${objectToQueryString(this.query)}`;
  }

  /** 设置请求基础URL */
  setBaseUrl(baseUrl: RequestContext["baseUrl"]) {
    this.baseUrl = baseUrl;
    return this;
  }

  /** 设置请求基础路径 */
  setBasePath(basePath: RequestContext["basePath"]) {
    this.basePath = basePath;
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
  setHeaders(...headers: RequestContext["headers"][]) {
    this.headers = Object.assign({}, ...headers);
    return this;
  }

  /** 设置是否允许携带跨域cookies */
  setCredentials(credentials: RequestContext["credentials"]) {
    this.credentials = credentials;
    return this;
  }

  /** 设置请求路径参数 */
  setParams(...params: RequestContext["params"][]) {
    this.params = Object.assign({}, ...params);
    return this;
  }

  /** 设置请求查询参数 */
  setQuery(...query: RequestContext["query"][]) {
    this.query = Object.assign({}, ...query);
    return this;
  }

  /** 设置请求体参数 */
  setBody(...body: RequestContext["body"][]) {
    this.body = Object.assign({}, ...body);
    return this;
  }

  /** 设置请求上下文与响应上下文监听 */
  setContextTap(contextTap: RequestContext["contextTap"]) {
    this.contextTap = contextTap;
    return this;
  }

  /** 设置模拟数据模板 */
  setMockTemplate(mockTemplate: RequestContext["mockTemplate"]) {
    this.mockTemplate = mockTemplate;
    return this;
  }

  /** 设置是否取消处理中的重复请求 */
  setRepeatRequestAbort(repeatRequestAbort: RequestContext["repeatRequestAbort"]) {
    this.repeatRequestAbort = repeatRequestAbort;
    return this;
  }

  /** 设置是否等待处理中的重复请求 */
  setRepeatRequestAwait(repeatRequestAwait: RequestContext["repeatRequestAwait"]) {
    this.repeatRequestAwait = repeatRequestAwait;
    return this;
  }

  /** 设置需要传递给引擎的其他参数 */
  setOthers(others: RequestContext["others"]) {
    this.others = others;
    return this;
  }

  /** 发送请求 */
  send(requestor: Requestor) {
    return requestor.request(this);
  }
}
