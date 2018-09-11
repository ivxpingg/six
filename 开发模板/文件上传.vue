<template>
    <div class="文件上传-container">

        <Upload :action="uploadParams.actionUrl"
                :showUploadList="uploadParams.showUploadList"
                :multiple="uploadParams.multiple"
                :accept="uploadParams.accept"
                :maxSize="uploadParams.maxSize"
                :before-upload="fileBeforeUpload"
                :on-exceeded-size="exceededSize"
                :on-error="fileUploadError"
                :on-success="fileUploadSuccess" >
            <Button type="primary" icon="ios-cloud-upload-outline">导入单位</Button>
        </Upload>

    </div>
</template>

<script>
    import Config from '../src/config';
    export default {
        name: '文件上传',
        data() {
            return {
                uploadParams: {
                    actionUrl: Config[Config.env].origin + Config[Config.env].ajaxUrl + '',
                    showUploadList: false,  // 显示已上传列表
                    multiple: false,        // 是否支持多选
                    data: {},               // 上传附带参数
                    //name: '',               // 上传的文件字段名, 默认file
                    accept: '.png,jpg',             // 接收上传的文件类型
                    // format: ['.png'],             // 支持的文件类型
                    maxSize: 4096,                // 文件大小限制，单位 kb
                }
            };
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
                this.$Loading.finish();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .文件上传-container {
    }
</style>