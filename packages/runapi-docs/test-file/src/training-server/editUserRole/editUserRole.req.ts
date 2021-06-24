export class EditUserRoleBody {
  /** 用户ID	 */
  userId!: number | string;

  /** 账户名	 */
  accountName!: string;

  /** 部门ID	 */
  deptId!: string;

  /** 部门名称	 */
  deptName!: string;

  /** 角色ID */
  roleId!: number[];
}
