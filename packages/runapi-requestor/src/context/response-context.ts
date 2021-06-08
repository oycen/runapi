import Mock from "mockjs";
import { plainToClass } from "class-transformer";
import { RequestContext } from "./request-context";

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

  constructor(requestContext: RequestContext, response?: Response) {
    this.requestContext = requestContext;
    this.response = response;
  }

  /** 模拟响应数据 */
  mock() {
    if (this.requestContext.mock) {
      const mockData = Mock.mock(this.requestContext.mock);
      this.status = 200;
      this.statusText = "mock succeeded";
      this.result = mockData;
    }
    return this;
  }

  /**
   * 转换为数据模型，从普通对象(plain object)转换为类实例对象(class object)
   * @see https://github.com/typestack/class-transformer
   */
  model() {
    if (this.requestContext.model) {
      const result = plainToClass(this.requestContext.model, this.result);
      this.result = result;
    }
    return this;
  }
}
