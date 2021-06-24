import { ServiceModel } from "./service-model";

export interface ProjectModel {
  name: string;
  description: string;
  services: ServiceModel[];
}
