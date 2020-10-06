// 项目类工具
import Cookies from 'js-cookie';
import config from '@/config';
import { objEqual } from './tools';

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
    localStorage.tagNaveList_six = JSON.stringify(list);
};
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */

export const getTagNavListFromLocalstorage = () => {
    const list = localStorage.tagNaveList_six;
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
    const { name, path, meta, icon } = getMenuByRoute(newRoute, menuList);
    let newList = [...list]
    if (newList.findIndex(item => item.name === name) >= 0) return newList;
    else {
        newList.push({ name, path, meta, icon });
    }
    return newList
};

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
    let res = {}
    if (list.length === 2) {
        res = getHomeRoute(list)
    } else {
        const index = list.findIndex(item => routeEqual(item, route))
        if (index === list.length - 1) res = list[list.length - 2]
        else res = list[index + 1]
    }
    return res
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
    const params1 = route1.params || {}
    const params2 = route2.params || {}
    const query1 = route1.query || {}
    const query2 = route2.query || {}
    return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

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


/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
    const keyValueArr = url.split('?')[1].split('&')
    let paramObj = {}
    keyValueArr.forEach(item => {
        const keyValue = item.split('=')
        paramObj[keyValue[0]] = keyValue[1]
    })
    return paramObj
};

export const transformMenu = menuList => {
    let attr = [];
    menuList.forEach((val) => {
        let obj = {
            icon: val.icon,
            name: val.url,
            meta: {
                title: val.menuName
            }
        };

        if (val.isShow === '0') {
            obj.meta.hideInMenu = true;
        }

        if (val.url.indexOf('http://') > -1) {
            obj.meta.href = val.url;
        }

        if (hasChild(val) && val.children[0].url) {
            obj.children = transformMenu(val.children);
        }
        attr.push(obj);
    });

    return attr;
};

export const setMenuAuth = (menuList, authList) => {
    menuList.forEach((val) => {
        authList[val.url] = [];
        if (hasChild(val) && val.children[0].url) {
            setMenuAuth(val.children, authList);
        }
        else if (hasChild(val) && val.url.indexOf('http://') === -1) {

            val.children.forEach(v => {
                if (v.permission) {
                    authList[val.url].push(v.permission.split(':').reverse()[0]);
                }
            });
        }
        else if (!hasChild(val) && authList[val.url]) {
            authList[val.url].push('all');
        }
    });
};

// 本地存储菜单权限数据
export const setMenuListInLocalstorage = list => {
    if (list == null) {
        localStorage.menuList_six = null;
    }
    else {
        localStorage.menuList_six = JSON.stringify(list);
    }
};
// 获取本地存储菜单权限数据
export const getMenuListInLocalstorage = () => {
    const list = localStorage.menuList_six;
    return list ? JSON.parse(list) : null
};
