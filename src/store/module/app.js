import { getBreadCrumbList, setTagNavListInLocalstorage, getTagNavListFromLocalstorage, getHomeRoute } from '@/lib/util';
import routers from '@/router/routers'
import axios from '@/lib/axios';
export default {
    state: {
        menuList: [],
        breadCrumbList: [],
        tagNavList: [],
        homeRoute: getHomeRoute(routers),
        // 自适应
        htmlClientWidth: 0,
        mianLayoutWidth: 0

    },
    getters: { },
    mutations: {
        setMenuList (state, mList) {
            state.menuList = mList;
        },
        setBreadCrumb (state, routeMetched) {
            state.breadCrumbList = getBreadCrumbList(routeMetched, state.homeRoute);
        },
        setTagNavList (state, list) {
            if (list) {
                state.tagNavList = [...list];
                setTagNavListInLocalstorage([...list]);
            }
            else {
                state.tagNavList = getTagNavListFromLocalstorage();
            }
        },
        addTag (state, item, type = 'unshift') {
            if (state.tagNavList.findIndex(tag => tag.name === item.name) < 0) {
                if (type === 'push') state.tagNavList.push(item);
                else state.tagNavList.unshift(item);
                setTagNavListInLocalstorage([...state.tagNavList]);
            }
        },
        setMianLayoutWidth(state, width) {
            state.mianLayoutWidth = width;
        },
        onresize(state) {
            state.htmlClientWidth = document.documentElement.clientWidth;
            let dom = document.querySelector('#mian_layout');
            if (dom) {
                state.mianLayoutWidth = dom.clientWidth;
            }
        }
    },
    actions: {
        getMenuList({commit}) {
            return new Promise(((resolve, reject) => {
                axios({
                    method: 'get',
                    url: '/getMenuList'
                }).then(res => {
                    if (res.status === 1) {
                        commit('setMenuList', res.result);
                    }
                    resolve(res.result);
                }).catch(err => {
                    reject(err);
                })
            }));
        }
    }
}