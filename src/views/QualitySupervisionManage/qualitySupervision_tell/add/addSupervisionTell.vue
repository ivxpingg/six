<template>
    <div class="addSupervisionTell-container">
        <Modal v-model="modalValue"
               title="添加监督交底"
               @on-visible-change="onVisibleChange">
            <Form ref="form"
                  class="user-form"
                  :model="formData"
                  :rules="rules"
                  :label-width="120">
                <FormItem label="项目名称:">
                    <Input v-model="projectName" readonly/>
                </FormItem>
                <FormItem label="交底内容:" prop="content">
                    <Input v-model="formData.content" type="textarea" placeholder="请输入内容"/>
                </FormItem>
                <FormItem label="计划开工时间:" prop="planBeginTime">
                    <DatePicker
                            :value="formData.planBeginTime"
                            type="date"
                            transfer
                            @on-change="onChange_planBeginTime"
                            placeholder="选择时间"></DatePicker>
                </FormItem>
                <FormItem label="通知书名称:" prop="noticeName">
                    <Input v-model="formData.noticeName" placeholder="请输入"/>
                </FormItem>
                <FormItem label="相关材料:">
                    <Upload :action="uploadParams.actionUrl"
                            :showUploadList="uploadParams.showUploadList"
                            :multiple="uploadParams.multiple"
                            :accept="uploadParams.accept"
                            :maxSize="uploadParams.maxSize"
                            :before-upload="fileBeforeUpload"
                            :on-exceeded-size="exceededSize"
                            :on-error="fileUploadError"
                            :on-success="fileUploadSuccess">
                        <Button type="primary" icon="ios-cloud-upload-outline">上传材料</Button> 支持扩展名：.png .jpg .gif .jpeg .pdf
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
        name: 'addSupervisionTell',  // 添加质量监督交底
        mixins: [modalMixin, uploadMixin],
        props: {
            projectId: {
                type: String,
                required: true
            },
            projectName: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                formData: {
                    projectId: '',
                    content: '',
                    planBeginTime: '',
                    noticeName: ''
                },
                rules: {
                    content: [{ required: true, message: '交底内容不能为空！', trigger: 'blur' }],
                    planBeginTime: [{ required: true, message: '计划开工时间不能为空！', trigger: 'blur' }],
                    noticeName: [{ required: true, message: '通知书名称不能为空！', trigger: 'blur' }],
                }
            };
        },
        watch: {
            projectId: {
                immediate: true,
                handler(val) {
                    this.formData.projectId = val;
                }
            }
        },
        methods: {
            onChange_planBeginTime(val) {
                this.formData.planBeginTime = val;
            },
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/addUserInfo',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '添加成功！'
                                });
                                this.$emit('modal_callback');
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
    .addSupervisionTell-container {
    }
</style>