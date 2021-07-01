import { Body, Post, Model } from "@runapi/decorators";
import { BBService } from "../baibu-api-gateway";
import { Result } from "../baibu-api-result";
import { PwdLoginBody, SmsLoginBody } from "./login/login.req";
import { LoginResult } from "./login/login.res";

/**
 * @summary 鉴权服务
 * @description 鉴权服务相关接口
 */
@BBService()
class AuthService {
  /** 用户登录，用户密码验证登录或手机号验证登录 */
  @Post("/auth/login_by_password")
  @Model(LoginResult)
  login(@Body() body: PwdLoginBody | SmsLoginBody): Result<LoginResult> {}
}

export const authService = new AuthService();
