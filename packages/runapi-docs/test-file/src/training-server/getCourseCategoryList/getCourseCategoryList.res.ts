enum CategoryStatus {
  启用 = 0,
  未启动 = 1
}

export class GetCourseCategoryListResult {
  /** id */
  id!: string | number;

  /** 编号 */
  categoryCode!: string;

  /** 类别名称 */
  categoryName!: string;

  /** 类别状态, 0:启用 1:未启动 */
  categoryStatus!: CategoryStatus;

  /** 类别状态描述 */
  get categoryStatusDesc() {
    return CategoryStatus[this.categoryStatus];
  }
}
