<template>
    <div class="addReport-container">
        <Modal v-model="modalValue" title="上传报表">
            <Form ref="form"
                  :model="formData"
                  :rules="rules"
                  :label-width="95">
                <FormItem label="报表名称：" prop="reportName">
                    <Input v-model="formData.reportName" placeholder="请输入" />
                </FormItem>
                <FormItem label="报表年度" prop="reportYear">
                    <DatePicker :value="formData.reportYear" type="year" placeholder="请选择年份" style="width: 200px" @on-change="onChange_year"></DatePicker>
                </FormItem>
                <FormItem label="备注：">
                    <Input v-model="formData.remark" type="textarea" placeholder="请输入" />
                </FormItem>
                <FormItem label="报表:" prop="fileId">
                    <Upload ref="upload"
                            :action="uploadActive"
                            :showUploadList="uploadParams.showUploadList"
                            :multiple="uploadParams.multiple"
                            :accept="uploadParams.accept"
                            :maxSize="uploadParams.maxSize"
                            :on-remove="onRemoveFile"
                            :before-upload="fileBeforeUpload"
                            :on-exceeded-size="exceededSize"
                            :on-error="fileUploadError"
                            :on-success="fileUploadSuccess">
                        <Button type="primary" icon="ios-cloud-upload-outline">上传文件</Button>
                    </Upload>
                </FormItem>
            </Form>

            <div slot="footer">
                <Button type="primary"
                        size="large"
                        @click="save">保存</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    import uploadMixin from '../../../../lib/mixin/uploadMixin';
    export default {
        name: 'addReport',
        mixins: [modalMixin, uploadMixin],
        computed: {
            uploadActive() {
                return this.uploadParams.actionUrl + '/report';
            }
        },
        data() {
            return {
                uploadParams: {
                    showUploadList: true
                },
                formData: {
                    reportName: '',
                    reportYear: '',
                    remark: '',
                    fileId: ''
                },
                rules: {
                    reportName: [{ required: true, message: '报表名称不能为空！', trigger: 'blur' }],
                    reportYear: [{ required: true, message: '报表年度不能为空！', trigger: 'blur' }],
                    fileId: [{ required: true, message: '请上传报表！', trigger: 'blur' }]
                }
            };
        },
        methods: {
            onChange_year(value) {
                this.formData.reportYear = value;
            },
            // 文件移除
            onRemoveFile(file, fileList) {
                this.formData.fileId = '';
                this.$refs.form.validateField('fileId');
            },
            fileBeforeUpload() {
                this.$Loading.start();
                this.$refs.upload.clearFiles();
            },

            fileUploadSuccess(response, file, fileList) {
                this.formData.fileId = response.data.fileId;
                if (this.formData.reportName.trim() === '') {
                    this.formData.reportName = response.data.fileName;
                }
                this.$refs.form.validateField('fileId');
            },

            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/report/add',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '上传报表成功！'
                                });
                                this.modalValue = false;
                                this.$emit('modal-callback');
                            }
                        })

                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .addReport-container {
    }
</style>