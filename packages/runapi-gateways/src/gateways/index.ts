import * as requestor from "@runapi/requestor";
import { Service } from "@runapi/decorators";

export function createGateways() {
  return new Gateways();
}

export class Gateways {
  static Requestor = requestor;

  configuration: { requestContext?: requestor.RequestContext | undefined } = {};
  services: Record<string, requestor.Requestor> = {};

  static load(url: string) {
    const createScript = (src: string) => {
      const script = document.createElement("script");
      script.setAttribute("type", "text/javascript");
      script.setAttribute("src", src);
      return script;
    };

    return new Promise((resolve, reject) => {
      const script = createScript(url);

      script.addEventListener("load", () => resolve(script));
      script.addEventListener("error", (error) =>
        reject(new URIError("The asset " + (error.target as any)?.src ?? "url" + " didn't load correctly."))
      );

      document.getElementsByTagName("head")[0].appendChild(script);
    });
  }

  configure(configuration: Gateways["configuration"]) {
    this.configuration = configuration;
  }

  inject(name: string, requestor: requestor.Requestor) {
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
