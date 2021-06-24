export class PwdLoginBody {
  /** 登录方式 */
  loginType!: "PASSWORD";

  /** 账号 */
  employeeName!: string;

  /** 密码 */
  password!: string;
}

export class SmsLoginBody {
  /** 登录方式 */
  loginType!: "SMS";

  /** 手机号码 */
  telephone!: string;

  /** 短信验证码 */
  captcha!: string;
}
