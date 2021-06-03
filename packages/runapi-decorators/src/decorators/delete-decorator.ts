import { RequestContext } from "@runapi/requestor";
import { Http } from "./http-decorator";

export function Delete(
  path?: string,
  data?: { params?: RequestContext["params"]; query?: RequestContext["query"]; body?: RequestContext["body"] }
): MethodDecorator {
  return Http("DELETE", path, data);
}
