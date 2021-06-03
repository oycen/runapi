import Mock from "mockjs";
import { ClassTransformOptions, plainToClass } from "class-transformer";
import { RequestContext } from "./request-context";

export type ModelConstructor<T = any> = { new (...args: any[]): T };

export class ResponseContext<Result = unknown, Response = any> {
  /** 请求上下文 */
  requestContext: RequestContext;

  /** 响应对象 */
  response?: Response;

  /** 响应状态 */
  status?: string | number;

  /** 响应状态描述 */
  statusText?: string;

  /** 响应数据结果 */
  result?: Result;

  /** 响应数据不合法错误集 */
  resultErrors?: any;

  constructor(requestContext: RequestContext, response?: Response) {
    this.requestContext = requestContext;
    this.response = response;
  }

  /** 模拟响应数据 */
  mock(status: ResponseContext["status"] = 200, statusText: ResponseContext["statusText"] = "mock succeeded") {
    if (this.requestContext.mockTemplate) {
      const mockData = Mock.mock(this.requestContext.mockTemplate);
      this.status = status;
      this.statusText = statusText;
      this.result = mockData;
    }
    return this;
  }

  /**
   * 转换数据，从普通对象(plain object)转换为类实例对象(class object)
   * @see https://github.com/typestack/class-transformer
   */
  transform(model: ModelConstructor, transformOptions?: ClassTransformOptions) {
    const result = plainToClass(model, this.result, transformOptions);
    this.result = result;
    return this;
  }
}
