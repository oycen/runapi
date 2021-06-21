import { Requestor, RequestContext, createRequestContext } from "@runapi/requestor";
import { serviceMetadataKey } from "./service-decorator";
import { baseUrlMetadataKey } from "./base-url-decorator";
import { headersMetadataKey } from "./headers-decorator";
import { paramsMetadataKey } from "./params-decorator";
import { queryMetadataKey } from "./query-decorator";
import { bodyMetadataKey } from "./body-decorator";
import { mockMetadataKey } from "./mock-decorator";
import { modelMetadataKey } from "./model-decorator";
import { similarMetadataKey } from "./similar-decorator";

export function Http(
  methods?: RequestContext["method"],
  path?: string,
  data?: { params?: RequestContext["params"]; query?: RequestContext["query"]; body?: RequestContext["body"] }
): MethodDecorator {
  return function (target, propertyKey, descriptor: TypedPropertyDescriptor<any>) {
    const httpMetadataKey = `http:${target.constructor.name}:${propertyKey.toString()}`;

    const baseUrl = Reflect.getMetadata(baseUrlMetadataKey, target) as RequestContext["baseUrl"];
    const headers = Reflect.getMetadata(headersMetadataKey, target) as RequestContext["headers"];
    const mock = Reflect.getMetadata(mockMetadataKey, target) as RequestContext["mock"];
    const model = Reflect.getMetadata(modelMetadataKey, target) as RequestContext["model"];
    const similar = Reflect.getMetadata(similarMetadataKey, target) as RequestContext["similar"];

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
      const serviceMetadata = Reflect.getMetadata(serviceMetadataKey, target) as
        | {
            requestor: Requestor | (() => Requestor) | undefined;
            requestContext: RequestContext | undefined;
          }
        | undefined;
      if (!serviceMetadata) return;

      const requestor = typeof serviceMetadata.requestor === "function" ? serviceMetadata.requestor() : serviceMetadata.requestor;
      if (!requestor) return;

      const params = arguments[paramsArgIndex];
      const query = arguments[queryArgIndex];
      const body = arguments[bodyArgIndex];

      return new Promise(async (resolve, reject) => {
        let responseContext;

        try {
          responseContext = await requestor.requestContext
            .merge(serviceMetadata.requestContext ?? createRequestContext())
            .merge(
              createRequestContext()
                .setBaseUrl(baseUrl)
                .setMethod(methods ?? "GET")
                .setHeaders(headers)
                .setPath(path)
                .setParams(Object.assign({}, data?.params ?? {}, params))
                .setQuery(Object.assign({}, data?.query ?? {}, query))
                .setBody(Object.assign({}, data?.body ?? {}, body))
                .setMock(mock)
                .setModel(model)
                .setSimilar(similar)
            )
            .send(requestor);

          resolve(responseContext);
        } catch (error) {
          reject(error);
        }
      });
    };
  };
}
