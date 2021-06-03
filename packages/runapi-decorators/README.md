# @runapi/decorators

_基于"@runapi/requestor"的装饰器，使用装饰模式封装接口请求函数。_

## 简介

- 提供一系列装饰器，方便灵活封装接口请求函数。
- 响应数据从普通对象(plain object)转换为类实例对象(class object)。
- 响应数据类型或值不合法校验。
- 支持 mock 数据。
- 提供元数据扫描器，方便分析代码或用于生成自动化文档。

## 安装

Using npm:

```bash
npm install @runapi/decorators
```

## 基本用法

##### 1. Service Decorator

```typescript
import { createAxiosRequestor } from "@runapi/requestor";
import { Service } from "@runapi/decorators";

const requestor = createAxiosRequestor();

@Service(requestor)
class APIService {}

const apiService = new APIService();
```

##### 2. Http & Get & Post & Put & Patch & Delete Decorator

```typescript
import { createAxiosRequestor } from "@runapi/requestor";
import { Delete, Get, Http, Patch, Post, Put, ResponseContextPromise, Service } from "@runapi/decorators";

const requestor = createAxiosRequestor();

class User {
  username!: string;
  phoneNumber!: string;
}

@Service(requestor)
class UserService {
  @Http("GET", "/users", { query: { username: "oyc" } })
  getUsers(): ResponseContextPromise<User[]> {}

  @Get("/user/:username", { params: { username: "oycen" } })
  getUser(): ResponseContextPromise<User> {}

  @Post("/user", { body: { username: "oycen", phoneNumber: "16616263646" } })
  createUser(): ResponseContextPromise<User> {}

  @Put("/user/:userId", { params: { userId: "1" }, body: { username: "oycen", phoneNumber: "16616263646" } })
  updateUser(): ResponseContextPromise<User> {}

  @Patch("/user/:userId/username", { params: { userId: "1" }, body: { username: "oycen" } })
  updateUserName(): ResponseContextPromise<User> {}

  @Delete("/user/:userId", { params: { userId: "1" } })
  deleteUser(): ResponseContextPromise<void> {}
}

const userService = new UserService();

userService.getUsers().then(({ result }) => console.log(result));
```

##### 3. Params & Query & Body Decorator

```typescript
import { createAxiosRequestor } from "@runapi/requestor";
import { Body, Delete, Get, Http, Params, Patch, Post, Put, Query, ResponseContextPromise, Service } from "@runapi/decorators";

const requestor = createAxiosRequestor();

class User {
  username!: string;
  phoneNumber!: string;
}

@Service(requestor)
class UserService {
  @Http("GET", "/users")
  getUsers(@Query() query: { username: string }): ResponseContextPromise<User[]> {}

  @Get("/user/:username")
  getUser(@Params() params: { username: string }): ResponseContextPromise<User> {}

  @Post("/user")
  createUser(@Body() body: { username: string; phoneNumber: string }): ResponseContextPromise<User> {}

  @Put("/user/:userId")
  updateUser(@Params() params: { userId: string }, @Body() body: { username: string; phoneNumber: string }): ResponseContextPromise<User> {}

  @Patch("/user/:userId/username")
  updateUserName(@Params() params: { userId: string }, @Body() body: { username: string }): ResponseContextPromise<User> {}

  @Delete("/user/:userId")
  deleteUser(@Params() params: { userId: string }): ResponseContextPromise<void> {}
}

const userService = new UserService();

userService.getUsers({ username: "oycen" }).then(({ result }) => console.log(result));
userService.getUser({ username: "oycen" }).then(({ result }) => console.log(result));
userService.createUser({ username: "oycen", phoneNumber: "16616263646" }).then(({ result }) => console.log(result));
userService.updateUser({ userId: "1" }, { username: "oycen", phoneNumber: "16616263646" }).then(({ result }) => console.log(result));
userService.updateUserName({ userId: "1" }, { username: "oycen" }).then(({ result }) => console.log(result));
userService.deleteUser({ userId: "1" }).then(({ result }) => console.log(result));
```

##### 4. BaseUrl Decorator

```typescript
import { createAxiosRequestor } from "@runapi/requestor";
import { BaseUrl, Http, Params, ResponseContextPromise, Service } from "@runapi/decorators";

const requestor = createAxiosRequestor();

class User {
  username!: string;
}

@Service(requestor)
class UserService {
  @Http("GET", "/user/:username")
  @BaseUrl("https://api.github.com")
  getUser(@Params() params: { username: string }): ResponseContextPromise<User> {}
}

const userService = new UserService();

userService.getUser({ username: "oycen" }).then(({ result }) => console.log(result));
```

##### 5. Headers Decorator

```typescript
import { createAxiosRequestor } from "@runapi/requestor";
import { Headers, Http, Params, ResponseContextPromise, Service } from "@runapi/decorators";

const requestor = createAxiosRequestor();

class User {
  username!: string;
}

@Service(requestor)
class UserService {
  @Http("GET", "/user/:username")
  @Headers({ "Content-Type": "application/json; charset=utf-8" })
  getUser(@Params() params: { username: string }): ResponseContextPromise<User> {}
}

const userService = new UserService();

userService.getUser({ username: "oycen" }).then(({ result }) => console.log(result));
```

##### 6. Model Decorator

```typescript
import { createAxiosRequestor } from "@runapi/requestor";
import { Http, Model, Params, ResponseContextPromise, Service } from "@runapi/decorators";

const requestor = createAxiosRequestor();

class User {
  firstname!: string;
  lastname!: string;

  get username() {
    return this.firstname + this.lastname;
  }

  uppercaseUsername() {
    return this.username.toLocaleUpperCase();
  }
}

@Service(requestor)
class UserService {
  @Http("GET", "/user/:username")
  getUser1(@Params() params: { username: string }): ResponseContextPromise<User> {}

  @Http("GET", "/user/:username")
  @Model(User)
  getUser2(@Params() params: { username: string }): ResponseContextPromise<User> {}
}

const userService = new UserService();

userService.getUser1({ username: "oycen" }).then(({ result }) => {
  console.log(result?.firstname); // ok
  console.log(result?.lastname); // ok
  console.log(result?.username); // error
  console.log(result?.uppercaseUsername()); // error
});

userService.getUser2({ username: "oycen" }).then(({ result }) => {
  console.log(result?.firstname); // ok
  console.log(result?.lastname); // ok
  console.log(result?.username); // ok
  console.log(result?.uppercaseUsername()); // ok
});
```

##### 7. Validate Decorator

```typescript
import { createAxiosRequestor } from "@runapi/requestor";
import { Http, Model, Params, ResponseContextPromise, Service, Validate } from "@runapi/decorators";
import { IsDefined, IsIn, IsOptional, IsString } from "class-validator";

const requestor = createAxiosRequestor();

class User {
  @IsString()
  @IsDefined()
  username!: string;

  @IsIn(["male", "female"])
  @IsOptional()
  sex?: "male" | "female";
}

@Service(requestor)
class UserService {
  @Http("GET", "/user/:username")
  @Validate()
  @Model(User)
  getUser(@Params() params: { username: string }): ResponseContextPromise<User> {}
}

const userService = new UserService();

userService.getUser({ username: "oycen" }).then(({ errors }) => console.log(errors));
```

##### 8. Mock Decorator

```typescript
import { createAxiosRequestor } from "@runapi/requestor";
import { Http, Mock, ResponseContextPromise, Service } from "@runapi/decorators";
import { Random } from "mockjs";

const requestor = createAxiosRequestor();

class User {
  userId!: number;
  username!: string;
}

@Service(requestor)
class UserService {
  @Http("GET", "/users")
  @Mock({
    // 属性 users 的值是一个数组，其中含有 1 到 10 个元素
    "users|1-10": [
      {
        // 属性 userId 是一个自增数，起始值为 1，每次增 1
        "userId|+1": 1,
        // 属性 username 是一个字符串，值为随机生成的中文姓名
        username: Random.cname(),
      },
    ],
  })
  getUsers(): ResponseContextPromise<User[]> {}
}

const userService = new UserService();

userService.getUsers().then(({ result }) => console.log(result));
```

##### 9. Notification Decorator

```typescript
import { createAxiosRequestor } from "@runapi/requestor";
import { Http, ResponseContextPromise, Service, Notification, Notifier, NotificationMessage } from "@runapi/decorators";
import { Message } from "element-ui";
import { ElMessageOptions } from "element-ui/types/message";

const requestor = createAxiosRequestor();

class User {
  username!: string;
}

class UserNotifier implements Notifier {
  notify(message: string, options?: any): void {
    Message({ message, duration: options?.duration });
  }
}

const CustomNotification = (message: NotificationMessage, options?: Omit<ElMessageOptions, "message">) =>
  Notification(new UserNotifier(), message, options);

@Service(requestor)
class UserService {
  @Http("GET", "/users")
  @Notification(new UserNotifier(), "获取用户失败")
  getUsers1(): ResponseContextPromise<User[]> {}

  @Http("GET", "/users")
  @CustomNotification({ success: "获取用户成功", fail: (error) => error }, { duration: 3000 })
  getUsers2(): ResponseContextPromise<User[]> {}
}

const userService = new UserService();
```
