import { Requestor, AxiosEngine, RequestContext } from "../src";

const requestor = new Requestor(new AxiosEngine());

test("requestor", async () => {
  const response = await requestor.request<any>(
    new RequestContext({
      method: "GET",
      baseUrl: "https://api.github.co",
      path: "/users/oycen",
    })
  );
  expect(response.result.name).toBe("oycen");
});
