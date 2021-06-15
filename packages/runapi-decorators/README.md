---
sidebarDepth: 2
---

# 指南

## Decorators

[@runapi/requestor](https://www.npmjs.com/package/@runapi/decorators): 基于"@runapi/requestor"的装饰器，使用装饰模式定义接口请求函数。

### Service Decorator

使用 Service 装饰器将 class 定义为 Service

```typescript
import { createFetchRequestor, createRequestContext } from "@runapi/requestor";
import { Service } from "@runapi/decorators";

const requestor = createFetchRequestor(createRequestContext().setBaseUrl("https://xxx.com"));

@Service(requestor)
class UserService {}

export const userService = new UserService();
```

### Http Decorator

使用 Http 装饰器定义请求方法

```typescript
import { createFetchRequestor, createRequestContext } from "@runapi/requestor";
import { Http, ResponseContextPromise, Service } from "@runapi/decorators";

const requestor = createFetchRequestor(createRequestContext().setBaseUrl("https://xxx.com"));

interface User {
  userId: string;
  username: string;
  gender: string;
}

@Service(requestor)
class UserService {
  @Http("GET", "/user/:userId", { params: { userId: "1" } })
  findUserByUserId(): ResponseContextPromise<User> {}
}

export const userService = new UserService();
```

### Get Decorator

使用 Get 装饰器定义获取资源请求方法

```typescript
import { createFetchRequestor, createRequestContext } from "@runapi/requestor";
import { Get, ResponseContextPromise, Service } from "@runapi/decorators";

const requestor = createFetchRequestor(createRequestContext().setBaseUrl("https://xxx.com"));

interface User {
  userId: string;
  username: string;
  gender: string;
}

@Service(requestor)
class UserService {
  @Get("/users", { query: { username: "jake", page: 1, size: 10 } })
  findUsersByPage(): ResponseContextPromise<User[]> {}
}

export const userService = new UserService();
```

### Post Decorator

使用 Post 装饰器定义创建资源请求方法

```typescript
import { createFetchRequestor, createRequestContext } from "@runapi/requestor";
import { Post, ResponseContextPromise, Service } from "@runapi/decorators";

const requestor = createFetchRequestor(createRequestContext().setBaseUrl("https://xxx.com"));

interface User {
  userId: string;
  username: string;
  gender: string;
}

@Service(requestor)
class UserService {
  @Post("/user", { body: { username: "jake", gender: "male" } })
  createUser(): ResponseContextPromise<User> {}
}

export const userService = new UserService();
```

### Put Decorator

使用 Put 装饰器定义替换资源请求方法

```typescript
import { createFetchRequestor, createRequestContext } from "@runapi/requestor";
import { Put, ResponseContextPromise, Service } from "@runapi/decorators";

const requestor = createFetchRequestor(createRequestContext().setBaseUrl("https://xxx.com"));

interface User {
  userId: string;
  username: string;
  gender: string;
}

@Service(requestor)
class UserService {
  @Put("/user", { body: { userId: "1", username: "jake", gender: "female" } })
  updateUser(): ResponseContextPromise<User> {}
}

export const userService = new UserService();
```

### Patch Decorator

使用 Patch 装饰器定义更新资源请求方法

```typescript
import { createFetchRequestor, createRequestContext } from "@runapi/requestor";
import { Patch, ResponseContextPromise, Service } from "@runapi/decorators";

const requestor = createFetchRequestor(createRequestContext().setBaseUrl("https://xxx.com"));

interface User {
  userId: string;
  username: string;
  gender: string;
}

@Service(requestor)
class UserService {
  @Patch("/user", { body: { userId: "2", username: "rose" } })
  updateUser(): ResponseContextPromise<User> {}
}

export const userService = new UserService();
```

### Delete Decorator

使用 Delete 装饰器定义删除资源请求方法

```typescript
import { createFetchRequestor, createRequestContext } from "@runapi/requestor";
import { Delete, ResponseContextPromise, Service } from "@runapi/decorators";

const requestor = createFetchRequestor(createRequestContext().setBaseUrl("https://xxx.com"));

interface User {
  userId: string;
  username: string;
  gender: string;
}

@Service(requestor)
class UserService {
  @Delete("/user/:userId", { params: { userId: "1" } })
  deleteUser(): ResponseContextPromise<User> {}
}

export const userService = new UserService();
```

### Params Decorator

使用 Params 装饰器定义路径参数

```typescript
import { createFetchRequestor, createRequestContext } from "@runapi/requestor";
import { Get, Params, ResponseContextPromise, Service } from "@runapi/decorators";

const requestor = createFetchRequestor(createRequestContext().setBaseUrl("https://xxx.com"));

interface User {
  userId: string;
  username: string;
  gender: string;
}

@Service(requestor)
class UserService {
  @Get("/user/:userId")
  findUserByUserId(@Params() params: { userId: string }): ResponseContextPromise<User> {}
}

export const userService = new UserService();
```

### Query Decorator

使用 Query 装饰器定义查询字符串参数

```typescript
import { createFetchRequestor, createRequestContext } from "@runapi/requestor";
import { Get, Query, ResponseContextPromise, Service } from "@runapi/decorators";

const requestor = createFetchRequestor(createRequestContext().setBaseUrl("https://xxx.com"));

interface User {
  userId: string;
  username: string;
  gender: string;
}

@Service(requestor)
class UserService {
  @Get("/users")
  findUsersByPage(@Query() query: { username: string; page: number; size: number }): ResponseContextPromise<User[]> {}
}

export const userService = new UserService();
```

### Body Decorator

使用 Body 装饰器定义请求体参数

```typescript
import { createFetchRequestor, createRequestContext } from "@runapi/requestor";
import { Body, Put, ResponseContextPromise, Service } from "@runapi/decorators";

const requestor = createFetchRequestor(createRequestContext().setBaseUrl("https://xxx.com"));

interface User {
  userId: string;
  username: string;
  gender: string;
}

@Service(requestor)
class UserService {
  @Put("/user")
  updateUser(@Body() body: { userId: string; username: string; gender: string }): ResponseContextPromise<User> {}
}

export const userService = new UserService();
```

### BaseUrl Decorator

使用 BaseUrl 装饰器定义请求基础 URL

```typescript
import { createFetchRequestor, createRequestContext } from "@runapi/requestor";
import { BaseUrl, Get, Params, ResponseContextPromise, Service } from "@runapi/decorators";

const requestor = createFetchRequestor(createRequestContext());

interface User {
  userId: string;
  username: string;
  gender: string;
}

@Service(requestor)
class UserService {
  @Get("/user/:userId")
  @BaseUrl("https://xxx.com")
  findUserByUserId(@Params() params: { userId: string }): ResponseContextPromise<User> {}
}

export const userService = new UserService();
```

### Headers Decorator

使用 Headers 装饰器定义请求头

```typescript
import { createFetchRequestor, createRequestContext } from "@runapi/requestor";
import { BaseUrl, Headers, Get, Params, ResponseContextPromise, Service } from "@runapi/decorators";

const requestor = createFetchRequestor(createRequestContext());

interface User {
  userId: string;
  username: string;
  gender: string;
}

@Service(requestor)
class UserService {
  @Get("/user/:userId")
  @BaseUrl("https://xxx.com")
  @Headers({ "content-type": "application/json" })
  findUserByUserId(@Params() params: { userId: string }): ResponseContextPromise<User> {}
}

export const userService = new UserService();
```

### Mock Decorator

使用 Mock 装饰器定义请求模拟数据模版

```typescript
import { createFetchRequestor, createRequestContext } from "@runapi/requestor";
import { Get, Mock, Query, ResponseContextPromise, Service } from "@runapi/decorators";

const requestor = createFetchRequestor(createRequestContext().setBaseUrl("https://xxx.com"));

interface User {
  userId: string;
  username: string;
  gender: string;
}

@Service(requestor)
class UserService {
  @Get("/users")
  @Mock({
    "users|1-10": [
      {
        "id|+1": 1,
        username: "@cname",
        gender: "gender",
      },
    ],
  })
  findUsersByPage(@Query() query: { username: string; page: number; size: number }): ResponseContextPromise<{ users: User[] }> {}
}

export const userService = new UserService();
```

### Model Decorator

使用 Model 装饰器定义响应数据模型

```typescript
import { createFetchRequestor, createRequestContext } from "@runapi/requestor";
import { Get, Model, Params, ResponseContextPromise, Service } from "@runapi/decorators";

const requestor = createFetchRequestor(createRequestContext().setBaseUrl("https://xxx.com"));

class User {
  userId!: string;
  firstname!: string;
  lastname!: string;
  gender!: string;

  get username() {
    return this.firstname + this.lastname;
  }
}

@Service(requestor)
class UserService {
  @Get("/user/:userId")
  @Model(User)
  findUserByUserId(@Params() params: { userId: string }): ResponseContextPromise<User> {}
}
```

### Similar Decorator

使用 Similar 装饰器定义类似请求处理方式

```typescript
import { createFetchRequestor, createRequestContext } from "@runapi/requestor";
import { Get, Query, ResponseContextPromise, Service, Similar } from "@runapi/decorators";

const requestor = createFetchRequestor(createRequestContext().setBaseUrl("https://xxx.com"));

interface User {
  userId: string;
  username: string;
  gender: string;
}

@Service(requestor)
class UserService {
  @Get("/users")
  // @Similar("wait-done")
  @Similar("abort")
  findUsersByPage(@Query() query: { username: string; page: number; size: number }): ResponseContextPromise<User[]> {}
}

export const userService = new UserService();
```
