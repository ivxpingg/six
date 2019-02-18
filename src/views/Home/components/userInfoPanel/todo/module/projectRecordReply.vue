<template>
    <div class="projectRecordReply-container">
        <Modal v-model="modalValue" title="工程备案回复">
            <Form ref="form"
                  class="form"
                  :model="formData"
                  :rules="rules"
                  :label-width="80">
                <FormItem label="项目名称:">
                    <Input :value="`${projectName}(${part})`" readonly/>
                </FormItem>
                <FormItem label="备案说明:">
                    <Input :value="dataDetail.recordContent" type="textarea" :rows="5" readonly/>
                </FormItem>
                <FormItem label="回复:" prop="replyContent">
                    <Input v-model="formData.replyContent"
                           type="textarea"
                           :rows="5"
                           placeholder="请输入回复"/>
                </FormItem>
                <FormItem label="查看附件:" v-show="viewFilesData.length > 0">
                    <Button type="primary" icon="md-images" @click="onClick_viewFile_open">查看附件</Button>
                </FormItem>
            </Form>

            <div slot="footer">
                <Button type="error" size="large" @click="back">退回</Button>
                <Button type="primary" size="large" @click="save">审核通过</Button>
            </div>
        </Modal>

        <vViewFiles ref="viewFiles" :data="viewFilesData"></vViewFiles>
    </div>
</template>

<script>
    import modalMixin from '../../../../../../lib/mixin/modalMixin';
    import viewFilesMixin from '../../../../../Common/viewFiles/mixin';
    export default {
        name: 'projectRecordReply',  // 工程备案回复
        mixins: [modalMixin, viewFilesMixin],
        props: {
            projectRecordId: {
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
            }
        },
        data() {
            return {
                dataDetail: {
                    recordContent: '',
                    recordType: ''
                },
                formData: {
                    replyContent: ''
                },
                rules: {
                    replyContent: [{ required: true, message: '回复内容不能为空！', trigger: 'blur' }]
                },

                viewFilesData: []
            };
        },
        watch: {
            projectRecordId(val) {
                if(val !== ''){
                    this.getData();
                    this.getFiles();
                }

            }
        },
        methods:{
            // 获取工程备案详情
            getData() {
                this.$http({
                    method: 'get',
                    url: '/projectRecord/query',
                    params: {
                        projectRecordId: this.projectRecordId
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.dataDetail.recordContent = res.data.recordContent || '';

                    }
                })
            },

            save() {
                this.$refs.form.validate(valid => {
                    if(valid) {
                        this.$http({
                            method: 'post',
                            url: '/projectRecord/handleReply',
                            data: JSON.stringify({
                                projectRecordId: this.projectRecordId,
                                replyContent: this.formData.replyContent
                            })
                        }).then(res => {
                            if (res.code === 'SUCCESS') {
                                this.modalValue = false;
                                this.$Message.success('审核通过成功！');
                                this.$emit('modal-callback');
                            }
                        })
                    }
                })
            },

            back() {
                this.$Modal.confirm({
                    title: '退回',
                    content: '确定要退回补充吗?',
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/projectRecord/backReplenish',
                            params: {
                                projectRecordId: this.projectRecordId
                            }
                        }).then(res => {
                            if (res.code === 'SUCCESS') {
                                this.modalValue = false;
                                this.$Message.success('退回成功！');
                                this.$emit('modal-callback');
                            }
                        })
                    }
                })

            },

            // 获取附件
            getFiles() {
                this.$http({
                    method: 'get',
                    url: '/file/attachList',
                    params: {
                        relationId: this.projectRecordId,
                        fileType: 'monitor_procedure'
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.viewFilesData = res.data || [];
                    }
                })
            },

            onClick_viewFile_open() {
                this.$refs.viewFiles.modalValue = true;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .projectRecordReply-container {
    }
</style>