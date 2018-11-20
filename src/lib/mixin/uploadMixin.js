import Config from '../../config';
export default {
    data() {
        return {
            uploadParams: {
                actionUrl: Config[Config.env].actionUrl + '',
                showUploadList: false,  // 显示已上传列表
                multiple: false,        // 是否支持多选
                data: {},               // 上传附带参数
                //name: '',               // 上传的文件字段名, 默认file
                accept: '.jpg,.png,jpeg,.gif,.doc,.docx,.xls,.xlsx,.pdf,.ppt,.pptx',             // 接收上传的文件类型
                format: [],             // 支持的文件类型
                maxSize: 20480000,                // 文件大小限制，单位 kb  4000M
            }
        }
    },
    methods: {
        // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者 Promise 则停止上传
        fileBeforeUpload() {
            this.$Loading.start();
        },
        // 文件大小判断
        exceededSize(file, fileList) {
            this.$Loading.error();
            this.$Notice.warning({
                title: '超过文件大小限制',
                desc: `文件   ${file.name} 太大, 不能超过 ${this.maxSize / 1024}M.`
            });
        },
        // on-error 文件上传失败时的钩子
        fileUploadError(error, file, fileList) {
            this.$Loading.error();
            this.$Notice.error({
                title: '文件上传出错',
                desc: `${error.message}`
            });
        },
        //on-remove 文件列表移除文件时的钩子
        fileRemove(file, fileList) {

        },
        fileUploadSuccess(response, file, fileList) {
            this.$Loading.finish();
        }
    }
}