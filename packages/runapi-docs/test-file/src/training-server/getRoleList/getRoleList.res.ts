export class GetRoleListResult {
  /** 角色ID */
  roleId!: number | string;
  /** 角色名称 */
  roleDesc!: string;
  /** 角色描述 */
  roleName!: string;

  // testId!: string;

  // status!: Status; // 1, 2, ,3

  // get statusDesc() {
  //   return Status[this.status];
  // }
}

enum Status {
  未响应 = 1,
  响应中 = 2
}
