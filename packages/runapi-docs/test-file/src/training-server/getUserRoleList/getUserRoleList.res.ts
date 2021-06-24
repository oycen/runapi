class AccountRoles {
  /** 角色ID */
  roleId!: number | string;

  /** 角色名称 */
  roleName!: string;
}

export class GetUserRoleListResult {
  /** 用户ID	 */
  userId!: number | string;

  /** 账户名	 */
  accountName!: string;

  /** 部门ID	 */
  deptId!: string;

  /** 部门名称	 */
  deptName!: string;

  /** 角色ID */
  accountRoles!: AccountRoles[];
}
