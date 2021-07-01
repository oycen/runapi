import { ApiModel } from "./api-model";

export interface ServiceModel {
  filename: string | null;
  filepath: string | null;
  name: string | null;
  summary: string | null;
  description: string | null;
  apis: ApiModel[] | null;
}
