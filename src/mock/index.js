import Mock from 'mockjs';
import { user, getUserInfo, logout } from "./user";

import app from './app';
// user
Mock.mock(/\/login/, user);
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

export default Mock;