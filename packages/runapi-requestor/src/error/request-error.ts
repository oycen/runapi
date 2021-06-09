import { ResponseContext } from "../context/response-context";

export class RequestError<Result = unknown, Response = any> extends Error {
  /** 响应状态 */
  status?: string | number;

  /** 响应状态描述 */
  statusText?: string;

  /** 响应上下文 */
  responseContext?: ResponseContext<Result, Response>;

  constructor(message?: string, status?: string | number, statusText?: string, responseContext?: ResponseContext<Result, Response>) {
    super(message);
    this.name = "RequestError";
    this.status = status;
    this.statusText = statusText;
    this.responseContext = responseContext;
  }
}
