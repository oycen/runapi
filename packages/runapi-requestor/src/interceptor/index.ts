import { RequestContext } from "../context/request-context";
import { ResponseContext } from "../context/response-context";

export abstract class Interceptor<Response = any> {
  abstract requestIntercept(requestContext: RequestContext): Promise<RequestContext>;

  abstract responseIntercept<Result = unknown>(responseContext: ResponseContext<Result, Response>): Promise<ResponseContext<Result, Response>>;
}
