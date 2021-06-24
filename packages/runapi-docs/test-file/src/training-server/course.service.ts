import { Body, Get, Post, Put, Delete, Model, Params, Query } from "@runapi/decorators";
import { BBService } from "../baibu-api-gateway";
import { Result } from "../baibu-api-result";
import { GetCourseCategoryListResult } from "./getCourseCategoryList/getCourseCategoryList.res";
import { AddCourseCategoryBody } from "./addCourseCategory/addCourseCategory.req";
import { AddCourseCategoryResult } from "./addCourseCategory/addCourseCategory.res";
import { UpdateCourseCategoryBody } from "./updateCourseCategory/updateCourseCategory.req";
import { UpdateCourseCategoryResult } from "./updateCourseCategory/updateCourseCategory.res";
import { DeleteCourseCategoryResult } from "./deleteCourseCategory/deleteCourseCategory.res";
import { SetCourseCategoryBody } from "./setCourseCategory/setCourseCategory.req";
import { SetCourseCategoryResult } from "./setCourseCategory/setCourseCategory.res";

@BBService()
class CourseService {
  /** 类别信息列表 */
  @Post("/trainingServer/category/web/list")
  @Model(GetCourseCategoryListResult)
  getCourseCategoryList(@Body() body: any): Result<GetCourseCategoryListResult> {}

  /** 新建类别 */
  @Post("/trainingServer/category/web/create")
  @Model(AddCourseCategoryResult)
  addCourseCategory(@Body() body: AddCourseCategoryBody): Result<AddCourseCategoryResult> {}

  /** 类别信息编辑 */
  @Put("/trainingServer/category/web/update")
  @Model(UpdateCourseCategoryResult)
  updateCourseCategory(@Body() body: UpdateCourseCategoryBody): Result<UpdateCourseCategoryResult> {}

  /** 批量删除类别 */
  @Put("/trainingServer/category/web/batchDeleteCategory")
  @Model(DeleteCourseCategoryResult)
  deleteCourseCategory(@Body() body: number[]): Result<void> {}

  /** 类别信息启用/停用,支持单个或批量操作 */
  @Put("/trainingServer/category/web/status/setting")
  @Model(SetCourseCategoryResult)
  setCourseCategory(@Body() body: SetCourseCategoryBody): Result<SetCourseCategoryResult> {}

  /** 课程创建 */
  @Post("/trainingServer/course/web/create")
  //  @Model()
  createCourse(@Body() body: any): Result<any> {}

  /** 课程创建 */
  @Post("/trainingServer/course/web/update")
  //  @Model()
  updateCourse(@Body() body: any): Result<any> {}

  /** 课程创建 */
  @Post("/trainingServer/course/web/list")
  //  @Model()
  getCourseList(@Body() body: any): Result<any> {}

  /** 课程启用/停用,支持单个或批量操作 */
  @Post("/trainingServer/course/web/status/setting")
  //  @Model()
  setCourStatus(@Body() body: any): Result<any> {}

  /** 删除课程 */
  @Put("/trainingServer/course/web/:id")
  @Model(DeleteCourseCategoryResult)
  deleteCourseById(@Params() params: string | number): Result<void> {}

  /**
   * @summary 板块课程查询
   * @description 板块课程查询描述
   */
  @Post("/trainingServer/course/web/query")
  //  @Model()
  queryCoursePlateList(@Body() body: any): Result<any> {}
}

export const courseService = new CourseService();
