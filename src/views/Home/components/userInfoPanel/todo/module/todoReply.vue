<template>
    <div class="todoReply-container">
        <Modal v-model="modalValue" title="整改回复">
            <Form ref="form"
                  class="form"
                  :model="formData"
                  :rules="rules"
                  :label-width="80">
                <FormItem label="项目名称:">
                    <Input :value="`${projectName}(${part})`" readonly/>
                </FormItem>
                <FormItem label="整改标题:">
                    <Input :value="formData.changeTitle" readonly/>
                </FormItem>
                <FormItem label="整改内容:">
                    <Input :value="formData.changeContent" readonly/>
                </FormItem>
                <FormItem label="整改回复:" prop="reply">
                    <Input v-model="formData.reply"
                           type="textarea"
                           :rows="5"
                           placeholder="请输入整改回复"/>
                </FormItem>
                <FormItem label="回复材料:">
                    <Upload :action="uploadAction"
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
                <FormItem label="相关材料:">
                    <Button type="primary" icon="md-images" @click="onClick_viewFile_open">查看附件</Button>
                </FormItem>
            </Form>

            <div slot="footer">
                <Button type="primary" size="large" @click="save">保存提交</Button>
            </div>
        </Modal>

        <vViewFiles ref="viewFiles" :data="formData.fileList"></vViewFiles>
    </div>
</template>

<script>
    import modalMixin from '../../../../../../lib/mixin/modalMixin';
    import MOMENT from 'moment';
    import viewFilesMixin from '../../../../../Common/viewFiles/mixin';
    import uploadMixin from '../../../../../../lib/mixin/uploadMixin';
    export default {
        name: 'todoReply',   // 整改回复
        mixins: [modalMixin, viewFilesMixin, uploadMixin],
        props: {
            projectId: {
                type: String,
                default: ''
            },
            projectName: {
                type: String,
                default: ''
            },
            part: {
                type: String,
                default: ''
            },
            changeNoticeId: {
                type: String,
                default: ''
            }
        },
        computed:{
            uploadAction() {
                return this.uploadParams.actionUrl + '/monitor_procedure';
            }
        },
        data() {
            return {
                uploadParams: {
                    showUploadList: true,
                    multiple: true
                },
                formData: {
                    changeTitle: '',
                    changeContent: '',
                    fileList: [],
                    changeReplyList: [],
                    reply: '',
                    fileIds: []
                },
                rules: {
                    reply: [{ required: true, message: '回复内容不能为空！', trigger: 'blur' }]
                }
            };
        },
        watch: {
            changeNoticeId(val) {
                if(val) {
                    this.getReply();
                }
            }
        },
        methods: {

            // 文件移除
            onRemoveFile(file, fileList) {
                this.formData.fileIds = fileList.map(v => v.response.data.fileId);
            },

            fileUploadSuccess(response, file, fileList) {
                this.formData.fileIds = fileList.map(v => v.response.data.fileId);
            },

            // 获取整改回复的信息
            getReply() {
                this.$http({
                    method: 'get',
                    url: '/changeNotice/viewChangeReply',
                    params: {
                        projectId: this.projectId,
                        changeNoticeId: this.changeNoticeId
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        Object.assign(this.formData, res.data, {
                            beginTime: res.data.beginTime ? MOMENT(res.data.beginTime).format('YYYY-MM-DD') : '',
                            endTime: res.data.endTime ? MOMENT(res.data.endTime).format('YYYY-MM-DD') : ''
                        });
                    }
                })
            },

            onClick_viewFile_open() {
                this.$refs.viewFiles.modalValue = true;
            },

            save() {
                this.$refs.form.validate(valid => {
                    if(valid) {
                        this.$http({
                            method: 'post',
                            url: '/changeNotice/addChangeReply',
                            data: JSON.stringify({
                                projectId: this.projectId,
                                changeNoticeId: this.changeNoticeId,
                                reply: this.formData.reply,
                                fileIds: this.formData.fileIds
                            })
                        }).then(res => {
                            if (res.code === 'SUCCESS') {
                                this.modalValue = false;
                                this.$Message.success('提交回复成功！');
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
    .todoReply-container {
    }
</style>