enum CategoryStatus {
  启用 = 0,
  未启动 = 1
}
export class SetCourseCategoryBody {
  /** 类别编号 */
  categoryCodes: string[] = [];

  /** 类别状态, 0:启用 1:未启动 */
  categoryStatus!: CategoryStatus;

  /** 类别状态描述 */
  get categoryStatusDesc() {
    return CategoryStatus[this.categoryStatus];
  }
}
