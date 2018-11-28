<template>
    <div class="sendProjectFiles-container">
        <Modal v-model="modalValue"
               title="下发交工申请核查意见书">

            <Form ref="form"
                  :model="formData"
                  :rules="rules"
                  inline>
                <FormItem label="交工申请核查意见书:" :label-width="135" prop="fileIds">
                    <Upload :action="uploadAction"
                            :showUploadList="uploadParams.showUploadList"
                            :multiple="uploadParams.multiple"
                            :accept="uploadParams.accept"
                            :maxSize="uploadParams.maxSize"
                            :on-remove="fileRemove"
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
                        @click="add">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    import vIvxFilterBox from '../../../../components/ivxFilterBox/ivxFilterBox';
    import uploadMixin from '../../../../lib/mixin/uploadMixin';
    export default {
        name: 'sendProjectFiles',
        components: {vIvxFilterBox},
        mixins: [modalMixin, uploadMixin],
        computed: {
            uploadAction() {
                return this.uploadParams.actionUrl + '/handover';
            }
        },
        props: {
            projectId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                uploadParams: {
                    multiple: true,
                    showUploadList: true
                },

                formData: {
                    fileIds: []
                },
                rules: {
                    fileIds: [{ required: true, type: 'array', message: '请上传文件！', trigger: 'blur' }]
                }
            };
        },
        methods: {
            fileRemove(file, fileList) {
                let idx = this.formData.fileIds.indexOf(file.response.data.fileId);
                if(idx > -1) {
                    this.formData.fileIds.splice(idx, 1);
                }
            },
            // 文件上传
            fileUploadSuccess(response, file, fileList) {
                this.formData.fileIds = fileList.map(v => v.response.data.fileId);
                this.$Loading.finish();
            },

            // 下发交工申请核查意见书
            add() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/projectAudit/handoverSendOpinion',
                            data: JSON.stringify({
                                projectId: this.projectId,
                                fileIds: this.formData.fileIds
                            })
                        }).then((res) => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('下发成功！');
                                this.modalValue = false;
                                this.$emit('modal-callback');
                            }
                        })
                    }
                });

            }

        }
    }
</script>

<style lang="scss" scoped>
    .sendProjectFiles-container {
    }
</style>