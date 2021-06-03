---
sidebarDepth: 2
---

# 指南

## Requestor

"Requestor"是一个类。用来创建请求实例，发起网络请求。它在"@runapi/requestor"包中导出。

### 构造函数创建实例

"Requestor"构造函数有三个参数。第一个为请求引擎实例，该引擎需要实现"Engine"抽象类，必须参数；第二个为请求实例全局配置选项，可选参数；第三个为环境配置对象，可选参数。

此处以内置提供的引擎"AxiosEngine"为例：

```typescript
import { Requestor, AxiosEngine } from "@runapi/requestor";

const requestor = new Requestor(new AxiosEngine());
```

### 工厂方法创建实例（推荐）

"createRequestor"工厂方法有三个参数。第一个为请求引擎实例，该引擎需要实现"Engine"抽象类，必须参数；第二个为请求实例全局配置选项，可选参数；第三个为环境配置对象，可选参数。

此处以内置提供的引擎"AxiosEngine"为例：

```typescript
import { createRequestor, AxiosEngine } from "@runapi/requestor";

const requestor = createRequestor(new AxiosEngine());
```

### 创建 Axios Requestor 实例

在浏览器环境下，可以直接创建基于"Axios"的请求实例。"createAxiosRequestor"工厂方法有两个参数。必须参数；第一个为请求实例全局配置选项，可选参数；第二个为环境配置对象，可选参数。

```typescript
import { createAxiosRequestor } from "@runapi/requestor";

const requestor = createAxiosRequestor();
```

### 创建 Wxmp Requestor 实例（微信小程序）

在微信小程序环境下，可以直接创建基于"wx.request()"的请求实例。"createAxiosRequestor"工厂方法有两个参数。必须参数；第一个为请求实例全局配置选项，可选参数；第二个为环境配置对象，可选参数。

```typescript
import { createWxmpRequestor } from "@runapi/requestor";

const requestor = createWxmpRequestor();
```

## Engine

"Engine"是 Http 网络请求引擎。它是发起网络请求时，底层真正的调用引擎对象。RunAPI 可以自由切换底层引擎，以达到跨客户端请求时使用统一的 API 调用风格。"Engine"在创建"Requestor"实例时需要用到。我们可以使用内置提供的两个"Engine"："AxiosEngine"和"WxmpEngine"创建"Engine"实例，也可以自己实现"Engine"抽象类自定义请求引擎。它们都在"@runapi/requestor"包中导出。

现在我们简单自定义实现一个"Engine"，使用浏览器 Fetch API 作为底层请求对象：

```typescript
import { Engine, RequestContext, ResponseContext } from "@runapi/requestor";

export class FetchEngine extends Engine<Response> {
  http: typeof window.fetch;

  constructor() {
    super();
    this.http = window.fetch;
  }

  doRequest(requestContext: RequestContext) {
    return this.http(requestContext.url, { method: requestContext.method });
  }

  doRequestInterceptor(requestContext: RequestContext): Promise<RequestContext> {
    return Promise.resolve(requestContext);
  }

  async doResponseInterceptor<Result = unknown>(requestContext: RequestContext, responseContext: ResponseContext<Result, Response>) {
    responseContext.setResult(await responseContext.response.json());

    return Promise.resolve(responseContext);
  }
}
```

## RequestContext

待补充...

## ResponseContext

待补充...
