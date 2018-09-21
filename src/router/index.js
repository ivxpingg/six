import Vue from 'vue';
import Router from 'vue-router';
import iView from 'iview';
import routes from './routers';

Vue.use(Router);
const router = new Router({
    base: '/',
    routes,
    // mode: 'history'
});
// const LOGIN_PAGE_NAME = 'user';

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    // let router = new Router();
    if (to.name === 'roleManage') {

    }
    next();

    // if (!token && to.name !== LOGIN_PAGE_NAME) {
    //     // 未登录且要跳转的页面不是登录页
    //     next({
    //         name: LOGIN_PAGE_NAME // 跳转到登录页
    //     })
    // } else if (!token && to.name === LOGIN_PAGE_NAME) {
    //     // 未登陆且要跳转的页面是登录页
    //     next() // 跳转
    // } else if (token && to.name === LOGIN_PAGE_NAME) {
    //     // 已登录且要跳转的页面是登录页
    //     next({
    //         name: 'home' // 跳转到home页
    //     })
    // } else {
    //     next();
    // }
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

export default router;