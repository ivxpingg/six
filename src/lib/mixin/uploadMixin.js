import Config from '../../config';
export default {
    data() {
        return {
            uploadParams: {
                actionUrl: Config[Config.env].origin + Config[Config.env].ajaxUrl + '',
                showUploadList: false,  // 显示已上传列表
                multiple: false,        // 是否支持多选
                data: {},               // 上传附带参数
                //name: '',               // 上传的文件字段名, 默认file
                accept: '',             // 接收上传的文件类型
                format: [],             // 支持的文件类型
                maxSize: 4096,                // 文件大小限制，单位 kb  4M
            }
        }
    },
    methods: {
        fileBeforeUpload() {
            this.$Loading.start();
        },
        exceededSize(file, fileList) {
            this.$Notice.warning({
                title: '超过文件大小限制',
                desc: `文件   ${file.name} 太大, 不能超过 ${this.maxSize / 1024}M.`
            });
        },
        fileUploadError() {
            this.$Loading.error();
            this.$Notice.error({
                title: '超过文件大小限制',
                desc: `${error.message}`
            });
        },
        fileUploadSuccess(response, file, fileList) {
            // this.$Loading.finish();
        }
    }
}