import { setToken, getToken } from '@/libs/util';
import axios from '@/lib/axios';
export default {
    state: {
        userName: '',
        userId: '',
        avatorImgPath: '',
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
        setToken (state, token) {
            state.token = token
            setToken(token);
        }
    },
    actions: {
        // 登录
        handleLogin ({ commit }, {userName, password}) {
            userName = userName.trim();
            return new Promise((resolve, reject) => {
                axios({
                    method: 'get',
                    url: '/user',
                    params: {
                        userName,
                        password
                    }
                }).then((res) => {
                    commit('setToken', res.result.token);
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
                    commit('setToken', '')
                    commit('setAccess', [])
                    resolve(res);
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
                    url: '/getUserInfo'
                }).then((res) => {
                    const data = res.data
                    commit('setAvator', data.avator)
                    commit('setUserName', data.user_name)
                    commit('setUserId', data.user_id)
                    commit('setAccess', data.access)
                    resolve(data)
                }).catch(err => {
                    reject(err)
                });
            })
        }
    }
}
