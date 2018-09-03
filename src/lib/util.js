// 项目类工具
import Cookies from 'js-cookie';
import config from '@/config';
import { forEach } from './tools';

export const TOKEN_KEY = 'token';
export const setToken = (token) => {
    Cookies.set(TOKEN_KEY, token, {expires: config.cookieExpires || 1})
};
export const getToken = () => {
    const token = Cookies.get(TOKEN_KEY)
    if (token) return token
    else return false
}

export const hasChild = (item) => {
    return item.children && item.children.length !== 0
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (routeMetched, homeRoute) => {
    let res = routeMetched.filter(item => {
        return item.meta === undefined || !item.meta.hide
    }).map(item => {
        let obj = {
            icon: (item.meta && item.meta.icon) || '',
            name: item.name,
            meta: item.meta
        }
        return obj
    })
    res = res.filter(item => {
        return !item.meta.hideInMenu
    })
    return [Object.assign(homeRoute, { to: homeRoute.path }), ...res]
};

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
    localStorage.tagNaveList = JSON.stringify(list);
};
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */

export const getTagNavListFromLocalstorage = () => {
    const list = localStorage.tagNaveList;
    return list ? JSON.parse(list) : []
};

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = routers => {
    let i = -1
    let len = routers.length;
    let homeRoute = {};
    while (++i < len) {
        let item = routers[i];
        if (item.children && item.children.length) {
            let res = getHomeRoute(item.children);
            if (res.name) return res;
        } else {
            if (item.name === 'home') homeRoute = item;
        }
    }
    return homeRoute;
};

/**
 * 通过路由获取对应的菜单信息
 * @param route 路由信息
 * @param menuList 当前有权限的菜单列表
 * @returns {*}
 */
const getMenuByRoute = (route, menuList) => {
    for(let i = 0; i < menuList.length; i++) {
        if (route.name === menuList[i].name) {
            return menuList[i];
        }
        else if (hasChild(menuList[i])) {
            let res = getMenuByRoute(route, menuList[i].children);
            if (res) {
                return res;
            }
        }
    }
    return null;
};
/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @param {*} menuList 当前有权限的菜单列表
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute, menuList) => {
    const { name, path, meta } = getMenuByRoute(newRoute, menuList);
    let newList = [...list]
    if (newList.findIndex(item => item.name === name) >= 0) return newList;
    else {
        newList.push({ name, path, meta });
    }
    return newList
};

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextName = (list, name) => {
    let res = '';
    if (list.length === 2) {
        res = 'home'
    } else {
        if (list.findIndex(item => item.name === name) === list.length - 1) res = list[list.length - 2].name
        else res = list[list.findIndex(item => item.name === name) + 1].name
    }
    return res;


};
