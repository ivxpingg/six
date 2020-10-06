import { setToken, getToken, setMenuListInLocalstorage, setTagNavListInLocalstorage } from '@/lib/util';
import axios from '@/lib/axios';
import Config from '../../config';
export default {
    state: {
        userName: '',
        userId: '',
        avatorImgPath: '',
        userType: '',
        sex: '',
        token: getToken()
    },
    mutations: {
        setAvator (state, avatorPath) {
            state.avatorImgPath = avatorPath
        },
        setUserId (state, id) {
            state.userId = id
        },
        setUserName (state, name) {
            state.userName = name
        },
        setUserSex(state, sex) {
            state.sex = sex;
        },
        setUserType(state, userType) {
            state.userType = userType;
        },
        setToken (state, token) {
            state.token = token
            setToken(token);
        }
    },
    actions: {
        // 登录
        handleLogin ({ commit }, {loginName, password}) {
            loginName = loginName.trim();
            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url: '/ajaxLogin',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    data: {
                        loginName,
                        password
                    }
                }).then((res) => {
                    commit('setToken', res.data.token);
                    setTagNavListInLocalstorage([]);
                    resolve(res);
                }).catch(err => {
                    reject(err)
                });
            })
        },
        // 退出登录
        handleLogOut ({ state, commit }) {
            return new Promise((resolve, reject) => {
                axios({
                    method: 'get',
                    url: '/logout'
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        setMenuListInLocalstorage(null);
                        setTagNavListInLocalstorage([]);
                        commit('setToken', '');
                        resolve(res);
                    }
                    else {
                        reject(res);
                    }
                    // commit('setAccess', [])

                }).catch(err => {
                    reject(err)
                });
                // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
                // commit('setToken', '')
                // commit('setAccess', [])
                // resolve()
            })
        },
        // 获取用户相关信息
        getUserInfo ({ state, commit }) {
            return new Promise((resolve, reject) => {
                axios({
                    method: 'get',
                    url: '/user/query'
                }).then((res) => {
                    const data = res.data;
                    let img = data.headPortraitUrl ? Config[Config.env].filePath + data.headPortraitUrl : '';
                    commit('setAvator', img);
                    commit('setUserName', data.name);
                    commit('setUserSex', data.sex);
                    commit('setUserId', data.userId);
                    commit('setUserType', data.userType);
                    // commit('setAccess', data.access)
                    resolve(data)
                }).catch(err => {
                    reject(err)
                });
            })
        }
    }
}
