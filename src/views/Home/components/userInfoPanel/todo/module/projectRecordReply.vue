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
                <FormItem label="整改回复:" prop="replyContent">
                    <Input v-model="formData.replyContent"
                           type="textarea"
                           :rows="5"
                           placeholder="请输入回复"/>
                </FormItem>
            </Form>

            <div slot="footer">
                <Button type="error" size="large" @click="back">退回</Button>
                <Button type="primary" size="large" @click="save">保存提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import modalMixin from '../../../../../../lib/mixin/modalMixin';
    export default {
        name: 'projectRecordReply',
        mixins: [modalMixin],
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
                formData: {
                    replyContent: ''
                },
                rules: {
                    replyContent: [{ required: true, message: '回复内容不能为空！', trigger: 'blur' }]
                }
            };
        },
        methods:{
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
                                this.$Message.success('提交回复成功！');
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

            }
        }
    }
</script>

<style lang="scss" scoped>
    .projectRecordReply-container {
    }
</style>