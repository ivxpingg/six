export default {
    env: process.env.NODE_ENV,
    /**
     * @description token在Cookie中存储的天数，默认1天
     */
    cookieExpires: 1,
    development: {
        origin: window.location.origin,
        ajaxUrl: '',
        staticUrl: '',
        cookiePath: '/'
    },
    production: {
        origin: window.location.origin,
        ajaxUrl: '',
        staticUrl: '',
        cookiePath: '/'
    }
}