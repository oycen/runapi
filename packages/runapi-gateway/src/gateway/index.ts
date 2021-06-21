import { RequestContext, Requestor } from "@runapi/requestor";
import { Service } from "@runapi/decorators";

export class Gateway {
  configuration: { requestContext?: RequestContext | undefined } = {};
  services: Record<string, Requestor> = {};

  configure(configuration: Gateway["configuration"]) {
    this.configuration = configuration;
  }

  register(name: string, requestor: Requestor) {
    if (this.configuration.requestContext) {
      requestor.requestContext = requestor.requestContext.merge(this.configuration.requestContext);
    }

    window.name = name;
    this.services[name] = requestor;
  }

  getService() {
    return Service(() => this.services[window.name]);
  }
}
