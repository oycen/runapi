import { BodyModel } from "./body-model";
import { HeadersModel } from "./headers-model";
import { ParamsModel } from "./params-model";
import { QueryModel } from "./query-model";
import { ResponseModel } from "./response-model";

export interface ApiModel {
  [key: string]: any;
  name: string;
  summary: string;
  description: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  headers: HeadersModel;
  params: ParamsModel;
  query: QueryModel;
  body: BodyModel;
  response: ResponseModel;
}
