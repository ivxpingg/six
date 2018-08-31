import Mock from 'mockjs';
import { user, getUserInfo, logout } from "./user";
import app from './app';
// user
Mock.mock(/\/login/, user);
Mock.mock(/\/getUserInfo/, getUserInfo);
Mock.mock(/\/logout/, logout);

// 菜单列表
Mock.mock(/\/getMenuList/, app.getMenuList);

export default Mock;