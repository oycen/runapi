import { ApiModel } from "./api-model";

export interface ServiceModel {
  [key: string]: any;
  filename: string;
  filepath: string;
  name: string;
  summary: string;
  description: string;
  apis: ApiModel[];
}
