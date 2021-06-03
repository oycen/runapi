# @runapi/requestor

_JavaScript Http 网络请求库。提供多端统一的 Promise API。_

## 简介

- 提供 JavaScript 运行环境下 Http 网络请求 Promise API。
- 内置支持浏览器端，微信小程序端，其他端支持可通过实现"Engine"接口自行实现。
- 用 Typescript 编写，类型定义完善。

## 安装

Using npm:

```bash
npm install @runapi/requestor
```

## 基本用法

##### 一、创建 Requestor 实例

```typescript
import { AxiosEngine, createAxiosRequestor, createRequestor, createWxmpRequestor, Requestor } from "@runapi/requestor";

// 1. 通过构造函数创建实例
const requestor1 = new Requestor(new AxiosEngine());

// 2. 通过工厂方法创建实例
const requestor2 = createRequestor(new AxiosEngine());

// 3. 通过工厂方法直接创建axios requestor实例
const requestor3 = createAxiosRequestor();

// 4. 通过工厂方法直接创建微信小程序requestor实例
const requestor4 = createWxmpRequestor();
```

##### 二、通过 Requestor 实例发起网络请求

```typescript
import { createAxiosRequestor } from "@runapi/requestor";

async function fetch() {
  try {
    const requestor = createAxiosRequestor();
    const { response, result } = await requestor.request({
      baseUrl: "https://api.github.com",
      path: "/users/oycen/repos",
    });
    console.log("response", response);
    console.log("result", result);
  } catch (error) {
    console.error(error);
  }
}

fetch();
```
