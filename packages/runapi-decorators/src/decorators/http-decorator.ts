import { Requestor, RequestContext, ModelConstructor, Interceptor } from "@runapi/requestor";
import { serviceMetadataKey } from "./service-decorator";
import { baseUrlMetadataKey } from "./base-url-decorator";
import { headersMetadataKey } from "./headers-decorator";
import { paramsMetadataKey } from "./params-decorator";
import { queryMetadataKey } from "./query-decorator";
import { bodyMetadataKey } from "./body-decorator";
import { mockMetadataKey } from "./mock-decorator";
import { transformMetadataKey } from "./transform-decorator";
import { interceptorsMetadataKey } from "./interceptors-decorator";
import { repeatRequestAbortMetadataKey } from "./repeat-request-abort-decorator";
import { repeatRequestAwaitMetadataKey } from "./repeat-request-await-decorator";

export function Http(
  methods?: RequestContext["method"],
  path?: string,
  data?: { params?: RequestContext["params"]; query?: RequestContext["query"]; body?: RequestContext["body"] }
): MethodDecorator {
  return function (target, propertyKey, descriptor: TypedPropertyDescriptor<any>) {
    const httpMetadataKey = `http:${target.constructor.name}:${propertyKey.toString()}`;

    const baseUrl = Reflect.getMetadata(baseUrlMetadataKey, target) as RequestContext["baseUrl"] | undefined;
    const headers = Reflect.getMetadata(headersMetadataKey, target) as RequestContext["headers"] | undefined;
    const mockTemplate = Reflect.getMetadata(mockMetadataKey, target) as RequestContext["mockTemplate"] | undefined;
    const repeatRequestAbort = Reflect.getMetadata(repeatRequestAbortMetadataKey, target) as RequestContext["repeatRequestAbort"] | undefined;
    const repeatRequestAwait = Reflect.getMetadata(repeatRequestAwaitMetadataKey, target) as RequestContext["repeatRequestAwait"] | undefined;
    const model = Reflect.getMetadata(transformMetadataKey, target) as ModelConstructor | undefined;
    const interceptors = Reflect.getMetadata(interceptorsMetadataKey, target) as Interceptor[] | undefined;

    const paramsArgIndex = Reflect.getMetadata(paramsMetadataKey, target);
    const queryArgIndex = Reflect.getMetadata(queryMetadataKey, target);
    const bodyArgIndex = Reflect.getMetadata(bodyMetadataKey, target);

    const designParamtypes = Reflect.getMetadata("design:paramtypes", target, propertyKey);

    Reflect.defineMetadata(
      httpMetadataKey,
      {
        path: path ?? "",
        headers: headers ?? {},
        params: designParamtypes[paramsArgIndex]?.name ?? {},
        query: designParamtypes[queryArgIndex]?.name ?? {},
        body: designParamtypes[bodyArgIndex]?.name ?? {},
      },
      target
    );

    descriptor.value = function () {
      const requestor = Reflect.getMetadata(serviceMetadataKey, target) as Requestor | undefined;

      if (!requestor) return;

      if (interceptors) requestor.use(...interceptors);

      const params = arguments[paramsArgIndex];
      const query = arguments[queryArgIndex];
      const body = arguments[bodyArgIndex];

      return new Promise(async (resolve, reject) => {
        let responseContext;

        try {
          responseContext = await new RequestContext()
            .setBaseUrl(baseUrl ?? requestor.requestContext.baseUrl)
            .setMethod(methods ?? "GET")
            .setHeaders(requestor.requestContext.headers ?? {}, headers ?? {})
            .setPath(path)
            .setParams(data?.params ?? {}, params ?? {})
            .setQuery(data?.query ?? {}, query ?? {})
            .setBody(data?.body ?? {}, body ?? {})
            .setMockTemplate(mockTemplate)
            .setRepeatRequestAbort(repeatRequestAbort)
            .setRepeatRequestAwait(repeatRequestAwait)
            .send(requestor);

          if (model) responseContext.transform(model);

          resolve(responseContext);
        } catch (error) {
          reject(error);
        }
      });
    };
  };
}
