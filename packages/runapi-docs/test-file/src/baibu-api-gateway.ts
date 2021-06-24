import { Gateway } from "@runapi/gateway";
import { createRequestContext } from "@runapi/requestor";

export const gateway = new Gateway();

gateway.configure({
  requestContext: createRequestContext()
    .setCredentials("include")
    .setHeaders({
      "Content-type": "application/json"
    })
});

export const BBService = gateway.getServiceFactory();
