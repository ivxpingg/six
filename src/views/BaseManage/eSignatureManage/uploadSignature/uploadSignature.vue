<template>
    <div class="uploadSignature-container">
        <Form ref="form"
              :label-width="98"
              :model="formData"
              :rules="rules">
            <FormItem label="签名名称:" prop="name">
                <Input v-model="formData.name" placeholder="名称" />
            </FormItem>
            <FormItem label="电子签名上传:" prop="fileId">
                <Upload ref="upload"
                        :action="uploadParams.actionUrl"
                        :showUploadList="uploadParams.showUploadList"
                        :multiple="uploadParams.multiple"
                        :accept="uploadParams.accept"
                        :maxSize="uploadParams.maxSize"
                        :before-upload="fileBeforeUpload"
                        :on-exceeded-size="exceededSize"
                        :on-error="fileUploadError"
                        :on-success="fileUploadSuccess">
                    <Button type="primary" icon="ios-cloud-upload-outline">上传电子签名</Button>
                </Upload>
            </FormItem>
        </Form>
        <div class="ivu-modal-footer">
            <Button type="primary"
                    size="large"
                    @click="save">保存</Button>
        </div>
    </div>
</template>

<script>
    import Config from '../../../../config';
    export default {
        name: 'uploadSignature',
        data() {
            return {
                uploadParams: {
                    actionUrl: Config[Config.env].actionUrl + '/signature',
                    showUploadList: true,  // 显示已上传列表
                    multiple: false,        // 是否支持多选
                    data: {},               // 上传附带参数
                    //name: '',               // 上传的文件字段名, 默认file
                    accept: '.png,.jpg,.gif,.bmp',             // 接收上传的文件类型
                    maxSize: 4096,                // 文件大小限制，单位 kb
                },
                formData: {
                    name: '',
                    fileId: ''
                },
                rules: {
                    name: [{ required: true, message: '电子签名不能为空！', trigger: 'blur' }],
                    fileId: [{ required: true, message: '必须上传电子签名！', trigger: 'blur' }],
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
            fileUploadError(error, file, fileList) {
                this.$Loading.error();
                this.$Notice.error({
                    title: '文件上传失败',
                    desc: `${error.message}`
                });
            },
            fileUploadSuccess(response, file, fileList) {

                this.$Loading.finish();
                this.formData.fileId = response.data.fileId;
            },
            // 添加电子签名
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/signature/add',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '添加成功！'
                                });
                                this.$emit('addSignaturCallback');

                                this.$refs.upload.fileList = [];
                            }
                        })
                    } else {

                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .uploadSignature-container {
        padding-bottom: 61px;
        .ivu-modal-footer {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }
</style>