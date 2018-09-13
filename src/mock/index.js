import Mock from 'mockjs';
import { user, getUserInfo, logout } from "./user";

import app from './app';
// user
Mock.mock(/\/mocklogin/, user);
Mock.mock(/\/getUserInfo/, getUserInfo);
Mock.mock(/\/logout/, logout);

// 菜单列表
Mock.mock(/\/getMenuList/, app.getMenuList);

/******************************************************************************************************
 * 数据字典
 */
import {getDictList} from './systemManage/dataDict';
Mock.mock(/\/getDictList/, getDictList);

/***************************************************************************************************
 * 基础信息管理
 */
// 组织结构
import baseManage from './baseManage/organizetionManage';
Mock.mock(/\/getRoleGroup/, baseManage.getRoleGroup);     // 获取角色列表


/***************************************************************************************************
 * 机构与人员管理
 */
// 从业单位管理
import {
    getUnitList,
    getUnitById,
    getUnitPersonById,
    getUnitAccessory} from './orgAndPersonManage/workUnitManage';
Mock.mock(/\/getUnitList/, getUnitList);
Mock.mock(/\/getUnitById/, getUnitById);
Mock.mock(/\/getUnitPersonById/, getUnitPersonById);
Mock.mock(/\/getUnitAccessory/, getUnitAccessory);

// 从业人员管理
import {
    getUserList,
    getUserInfoById,
    getUserUnitInfo} from './orgAndPersonManage/workPersonManage';
Mock.mock(/\/getUserList/, getUserList);
Mock.mock(/\/getUserById/, getUserInfoById);
Mock.mock(/\/getUserUnitInfo/, getUserUnitInfo);

// 从业单位管理
import {getSupervisorList} from './orgAndPersonManage/supervisorsManage';
Mock.mock(/\/supervisorsManage\/getSupervisorList/, getSupervisorList);

export default Mock;