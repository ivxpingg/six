import Mock from 'mockjs';
import { user, getUserInfo, logout } from "./user";

import app from './app';
// user
Mock.mock(/\/mocklogin/, user);
Mock.mock(/\/getUserInfo/, getUserInfo);
Mock.mock(/\/logout/, logout);

// 菜单列表
Mock.mock(/\/getMenuList/, app.getMenuList);


/**
 * 基础信息管理
 */
// 组织结构
import baseManage from './baseManage/organizetionManage';
Mock.mock(/\/getRoleGroup/, baseManage.getRoleGroup);     // 获取角色列表


/**
 * 机构与人员管理
 */
// 从业单位管理
import {getUnitList} from './orgAndPersonManage/workUnitManage';
Mock.mock(/\/getUnitList/, getUnitList);

// 从业人员管理
import workPersonManage from './orgAndPersonManage/workPersonManage';

// 从业单位管理
import supervisorsManage from './orgAndPersonManage/supervisorsManage';

export default Mock;