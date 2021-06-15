---
sidebarDepth: 2
---

# 指南

## Requestor

[@runapi/requestor](https://www.npmjs.com/package/@runapi/requestor): 它提供了一个核心类"Requestor"，通过"Requestor"实例发送 Http 网络请求。

### 创建请求实例

#### 内置工厂方法创建

目前内置提供了三个工厂方法用于创建"Requestor"实例，分别是：

- 基于浏览器"Fetch API"引擎的"createFetchRequestor"。
- 基于微信小程序"wx.request"引擎的"createWxmpRequestor"。
- 自动适配所在客户端的"createAutoAdaptRequestor"，目前可自动适配浏览器端与微信小程序端。

他们都有两个可选参数。分别是：

1. 全局请求上下文实例，对请求进行全局配置。
2. 第二个为请求环境配置，用于快速切换当前请求环境。

下面以"createFetchRequestor"为例：

```typescript
import { createRequestContext, createFetchRequestor } from "@runapi/requestor";

const requestContext = createRequestContext()
  .setBaseUrl("https://development.xxx.com")
  .setCredentials(true)
  .setHeaders({ "content-type": "application/json" });

const requestor = createFetchRequestor(requestContext);
```

#### 自定义工厂方法创建

通过 Requestor 构造函数自定义工厂，但这需要传入一个"Engine"。

下面以"createFetchRequestor"声明为例：

```typescript
import { FetchEngine, RequestContext, RequestEnv, Requestor } from "@runapi/requestor";

function createFetchRequestor<Environment extends string = any>(requestContext?: RequestContext, requestEnv?: RequestEnv<Environment>) {
  return new Requestor<Response, Environment>(new FetchEngine(), requestContext, requestEnv);
}
```

### 发送请求

通过"Requestor"实例的"request"方法可以发送请求。

下面以"createFetchRequestor"发送请求为例：

```typescript
import { createRequestContext, createFetchRequestor } from "@runapi/requestor";

const requestContext = createRequestContext().setCredentials(true).setHeaders({ "content-type": "application/json" });

const requestEnv = {
  development: "https://development.xxx.com",
  test: "https://test.xxx.com",
};

const requestor = createFetchRequestor(requestContext, requestEnv);

requestor.switch("development");

requestor.request(createRequestContext({ method: "GET", path: "/xxx" }));
```

### Engine

"Engine"是 Http 网络请求引擎。它是发起网络请求时，底层真正的调用引擎对象。RunAPI 可以自由切换底层引擎，以达到跨客户端请求时使用统一的 API 调用风格。"Engine"在创建"Requestor"实例时需要用到。我们可以使用内置提供的两个"Engine"："FetchEngine"和"WxmpEngine"创建"Engine"实例，也可以自己实现"Engine"抽象类自定义请求引擎。

现在我们简单自定义实现一个"Engine"，使用浏览器 Fetch API 作为底层请求对象：

```typescript
import { Engine, RequestContext } from "@runapi/requestor";

export class FetchEngine extends Engine<Response> {
  doRequest(requestContext: RequestContext) {
    return fetch(requestContext.url, { method: requestContext.method });
  }
}
```

### RequestContext

"RequestContext"是请求上下文对象，它来用携带 Http 请求时配置的相关信息，比如"请求头"，"请求路径"，"请求参数"等。可以通过工厂方法"createRequestContext"创建该实例。在创建"Requestor"实例时传入即为全局配置，在调用"request"发起请求时传入将会与全局配置进行合并，每个配置项都有特定的合并规则。

实例属性：

| 名称        | 作用/描述                | 类型                   | 默认值    | 合并规则                  |
| :---------- | ------------------------ | ---------------------- | --------- | ------------------------- |
| baseUrl     | 请求基础 URL             | string                 | undefined | 覆盖                      |
| basePath    | 请求基础路径             | string                 | undefined | 以"/"开头覆盖，反之则拼接 |
| path        | 请求路径                 | string                 | undefined | 覆盖                      |
| method      | 请求方法                 | RequestMethod          | "GET"     | 覆盖                      |
| headers     | 请求头                   | Record<string, string> | undefined | Object.assign             |
| credentials | 是否允许携带跨域 cookies | RequestCredentials     | undefined | 覆盖                      |
| params      | 请求路径参数             | Record<string, any>    | undefined | Object.assign             |
| query       | 请求查询参数             | Record<string, any>    | undefined | Object.assign             |
| body        | 请求体参数               | Record<string, any>    | undefined | Object.assign             |
| mock        | 模拟数据模板             | any                    | undefined | 覆盖                      |
| model       | 响应结果模型             | Constructor            | undefined | 覆盖                      |
| similar     | 类似请求处理方式         | RequestSimilar         | undefined | 覆盖                      |
| others      | 需要传递给引擎的其他参数 | any                    | undefined | 覆盖                      |
| contextTap  | 请求前后回调函数         | ContextTap             | undefined | 覆盖                      |

实例计算属性：

| 名称        | 作用/描述                  | 类型   |
| ----------- | -------------------------- | ------ |
| fullpath    | 请求完整路径               | string |
| url         | 请求完整 URL               | string |
| queryString | 查询字符串                 | string |
| queryUrl    | 带查询字符串的请求完整 URL | string |

实例方法：

| 名称  | 作用/描述            | 参数                 |
| ----- | -------------------- | -------------------- |
| send  | 发送请求             | "Requestor"实例      |
| merge | 合并另一个请求上下文 | "RequestContext"实例 |

以下是用"'requestContext.send'"发送请求:

```typescript
import { createFetchRequestor, createRequestContext } from "@runapi/requestor";

const requestor = createFetchRequestor(createRequestContext().setBaseUrl("https://development.xxx.com"));

async function getUsers() {
  await createRequestContext({ method: "GET", path: "/users" }).send(requestor);
}

getUsers();
```

### ResponseContext

"ResponseContext"是响应上下文对象，在完成响应时将会返回一个"ResponseContext"实例。

实例属性：

| 名称           | 作用/描述        |
| -------------- | ---------------- |
| requestContext | 请求上下文       |
| response       | 请求引擎响应对象 |
| status         | 响应状态         |
| statusText     | 响应状态描述     |
| result         | 响应结果数据     |

### 异常处理

在发送请求时发生错误时，均会向外抛出"RequestError"类型异常。

以请求失败时，作出友好提示处理为例：

```typescript
import { createFetchRequestor, createRequestContext, RequestError } from "@runapi/requestor";

const requestor = createFetchRequestor(
  createRequestContext()
    .setBaseUrl("https://development.xxx.com")
    .setContextTap((reqCtx) => (resCtx) => {
      if (!resCtx.ok) throw new Error("Request failed");
    })
);

async function getUsers() {
  try {
    await createRequestContext({ method: "GET", path: "/users" }).send(requestor);
  } catch (error) {
    if (error instanceof RequestError) alert(`${error.status}:${error.message}`);
    // if (error.name === 'RequestError') alert(`${error.status}:${error.message}`);
    console.log(error);
  }
}

getUsers();
```
