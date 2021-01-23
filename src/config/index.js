const PROJECT_NAME = '/pqs';
// const PROJECT_NAME = '';

export default {
    env: process.env.NODE_ENV,
    /**
     * @description token在Cookie中存储的天数，默认1天
     */
    cookieExpires: 1,
    passwordKey: '65f9a7e8f08d4578b68f6373416fc483',
    development: {
        origin: window.location.origin,
        ajaxUrl: PROJECT_NAME,
        staticUrl: '',
        cookiePath: '/',
        actionUrl: window.location.origin + PROJECT_NAME + '/file/upload',  // 文件上传路径
        filePath: window.location.origin + PROJECT_NAME + '/'               // 文件路径前缀
    },
    production: {
        origin: window.location.origin,
        ajaxUrl: PROJECT_NAME,
        staticUrl: '',
        cookiePath: '/',
        actionUrl: window.location.origin + PROJECT_NAME + '/file/upload',  // 文件上传路径
        filePath: window.location.origin + PROJECT_NAME + '/'               // 文件路径前缀
    }
}
