import { BodyModel } from "./body-model";
import { HeadersModel } from "./headers-model";
import { ParamsModel } from "./params-model";
import { QueryModel } from "./query-model";
import { ResponseModel } from "./response-model";

export interface ApiModel {
  name: string | null;
  summary: string | null;
  description: string | null;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | null;
  path: string | null;
  headers: HeadersModel | null;
  params: ParamsModel | null;
  query: QueryModel | null;
  body: BodyModel | null;
  response: ResponseModel | null;
}
