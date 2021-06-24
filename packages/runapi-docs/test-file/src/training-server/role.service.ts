import { Body, Get, Post, Put, Delete, Model, Params, Query } from "@runapi/decorators";
import { BBService } from "../baibu-api-gateway";
import { Result } from "../baibu-api-result";
import { AddRoleBody } from "./addRole/addRole.req";
import { AddRoleResult } from "./addRole/addRole.res";
import { DeleteRoleByIdResult } from "./deleteRoleById/deleteRoleById.res";
import { GetRoleByIdResult } from "./getRoleById/getRoleById.res";
import { GetRoleListBody } from "./getRoleList/getRoleList.req";
import { GetRoleListResult } from "./getRoleList/getRoleList.res";
import { UpdateRoleBody } from "./updateRole/updateRole.req";
import { UpdateRoleResult } from "./updateRole/updateRole.res";
import { AssignUserRoleBody } from "./assignUserRole/assignUserRole.req";
import { AssignUserRoleResult } from "./assignUserRole/assignUserRole.res";
import { EditUserRoleBody } from "./editUserRole/editUserRole.req";
import { EditUserRoleResult } from "./editUserRole/editUserRole.res";
import { GetUserRoleListResult } from "./getUserRoleList/getUserRoleList.res";

@BBService()
class RoleService {
  /** 新增角色 */
  @Post("/trainingServer/role/web/add")
  @Model(AddRoleResult)
  addRole(@Body() body: AddRoleBody): Result<AddRoleResult> {}

  /** 编辑角色 */
  @Put("/trainingServer/role/web/update")
  @Model(UpdateRoleResult)
  updateRole(@Body() body: UpdateRoleBody): Result<UpdateRoleResult> {}

  /** 删除角色 */
  @Delete("/trainingServer/role/web/:roleId")
  @Model(DeleteRoleByIdResult)
  deleteRoleById(@Params() params: { roleId: number | string }): Result<void> {}

  /** 获取角色信息 */
  @Get("/trainingServer/role/web/:roleId")
  @Model(GetRoleByIdResult)
  getRoleById(@Params() params: { roleId: number | string }): Result<GetRoleByIdResult> {}

  /** 获取角色信息 */
  @Post("/trainingServer/role/web/list")
  @Model(GetRoleListResult)
  getRoleList(@Body() body: GetRoleListBody): Result<GetRoleListResult> {}

  /** 给用户分配角色 */
  @Post("/trainingServer/role/web/assign")
  @Model(AssignUserRoleResult)
  assignUserRole(@Body() body: AssignUserRoleBody): Result<AssignUserRoleResult> {}

  /** 编辑用户的相关角色信息 */
  @Put("/trainingServer/role/web/user/role")
  @Model(EditUserRoleResult)
  editUserRole(@Body() body: EditUserRoleBody): Result<EditUserRoleResult> {}

  /** 获取已分配的角色账户列表 */
  @Post("/trainingServer/role/web/account")
  @Model(GetUserRoleListResult)
  getUserRoleList(): Result<GetUserRoleListResult> {}

  /** 批量移除用户的相关角色信息 */
  @Put("/trainingServer/role/web/user/role/remove")
  // @Model(EditUserRoleResult)
  removeUserRole(@Body() body: any): Result<any> {}

  /** 板块列表 */
  @Post("/trainingServer/plate/web/list")
  // @Model()
  getPlateList(@Body() body: any): Result<any> {}

  /** 排序 */
  @Put("/trainingServer/plate/web/sort")
  // @Model()
  setPlateSort(@Body() body: any): Result<any> {}

  /** 添加板块 */
  @Post("/trainingServer/plate/web/create")
  // @Model()
  createPlate(@Body() body: any): Result<any> {}

  /** 编辑板块 */
  @Put("/trainingServer/plate/web/update")
  // @Model()
  updatePlate(@Body() body: any): Result<any> {}

  /** 删除角色下的板块 */
  @Delete("/trainingServer/plate/web/:id")
  // @Model()
  deletePlateById(@Params() params: { id: number | string }): Result<void> {}

  /** 删除指定角色的板块下的课程 */
  @Delete("/trainingServer/plate/web/course/:id")
  // @Model()
  deletePlateCourseById(@Params() params: { id: number | string }): Result<any> {}

  /** 用户关联角色 */
  @Post("/trainingServer/role/web/associate/user")
  // @Model()
  setAssociateUser(@Body() body: any): Result<any> {}

  /** 获取部门 */
  @Get("/authManage/manager/government/organization_tree")
  // @Model()
  getOrganizationTree(): Result<any> {}

  /** 根据关键字检索用户 */
  @Get("/authManage/user/:keyword")
  //  @Model()
  getOrganizationUser(@Params() params: any): Result<any> {}
}

export const roleService = new RoleService();
