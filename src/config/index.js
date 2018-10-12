export default {
    env: process.env.NODE_ENV,
    /**
     * @description token在Cookie中存储的天数，默认1天
     */
    cookieExpires: 1,
    development: {
        origin: window.location.origin,
        ajaxUrl: '/pqs',
        staticUrl: '',
        cookiePath: '/',
        actionUrl: window.location.origin + '/pqs/file/upload'
    },
    production: {
        origin: window.location.origin,
        ajaxUrl: '/pqs',
        staticUrl: '',
        cookiePath: '/'
    }
}