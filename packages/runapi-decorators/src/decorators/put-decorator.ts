import { RequestContext } from "@runapi/requestor";
import { Http } from "./http-decorator";

export function Put(
  path?: string,
  data?: { params?: RequestContext["params"]; query?: RequestContext["query"]; body?: RequestContext["body"] }
): MethodDecorator {
  return Http("PUT", path, data);
}
