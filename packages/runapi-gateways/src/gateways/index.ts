import { RequestContext, Requestor } from "@runapi/requestor";
import { Service } from "@runapi/decorators";

export function createGateways() {
  return new Gateways();
}

export class Gateways {
  globalRequestContext: RequestContext | undefined;
  services: Record<string, Requestor> = {};

  load(url: string) {
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

  configure(requestContext: RequestContext) {
    this.globalRequestContext = requestContext;
  }

  register(name: string, requestor: Requestor) {
    if (this.globalRequestContext) {
      requestor.requestContext = requestor.requestContext.merge(this.globalRequestContext);
    }

    window.name = name;
    this.services[name] = requestor;
  }

  getService() {
    return Service(() => this.services[window.name]);
  }
}
