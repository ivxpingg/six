<template>
    <div class="complaintReply-container">
        <Modal v-model="modalValue" title="质量安全投诉回复">
            <Form ref="form"
                  class="form"
                  :model="formData"
                  :rules="rules"
                  :label-width="80">
                <FormItem label="项目名称:">
                    <Input :value="`${projectName}(${part})`" readonly/>
                </FormItem>
                <FormItem label="投诉时间:">
                    <Input :value="formData.complainDate" readonly/>
                </FormItem>
                <FormItem label="投诉内容:">
                    <Input :value="formData.complaintContent"
                           type="textarea"
                           :rows="3" readonly/>
                </FormItem>
                <FormItem label="整改回复:" prop="replyContent">
                    <Input v-model="formData.replyContent"
                           type="textarea"
                           :rows="5"
                           placeholder="请输入回复"/>
                </FormItem>
                <FormItem label="相关材料:">
                    <Button type="primary" icon="md-images" @click="onClick_viewFile_open">查看附件</Button>
                </FormItem>
            </Form>

            <div slot="footer">
                <Button type="primary" size="large" @click="save">保存提交</Button>
            </div>
        </Modal>

        <vViewFiles ref="viewFiles" :data="fileList"></vViewFiles>
    </div>
</template>

<script>
    import modalMixin from '../../../../../../lib/mixin/modalMixin';
    import MOMENT from 'moment';
    import viewFilesMixin from '../../../../../Common/viewFiles/mixin';
    export default {
        name: 'complaintReply',
        mixins: [modalMixin, viewFilesMixin],
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
            complaintId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                formData: {
                    complainDate: '',
                    complaintContent: '',
                    changeReplyList: [],
                    replyContent: ''
                },
                rules: {
                    replyContent: [{ required: true, message: '回复内容不能为空！', trigger: 'blur' }]
                },

                fileList: []
            };
        },
        watch: {
            complaintId(val) {
                if(val) {
                    this.getReply();
                    this.getFiles();
                }
            }
        },
        methods: {
            // 获取回复的信息
            getReply() {
                this.$http({
                    method: 'get',
                    url: '/complaint/query',
                    params: {
                        complaintId: this.complaintId
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        Object.assign(this.formData, res.data, {
                            complainDate: res.data.complainDate ? MOMENT(res.data.complainDate).format('YYYY-MM-DD') : ''
                        });
                    }
                })
            },
            // 获取附件
            getFiles() {
                this.$http({
                    method: 'get',
                    url: '/file/attachList',
                    params: {
                        relationId: this.complaintId,
                        fileType: 'complaint'
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.fileList = res.data || [];
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
                            url: '/complaint/handleReply',
                            data: JSON.stringify({
                                complaintId: this.complaintId,
                                reply: this.formData.reply
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
    .complaintReply-container {
    }
</style>