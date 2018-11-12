<template>
    <div class="addComplaint-container">
        <Modal v-model="modalValue"
               title="添加监督记录"
               :width="640"
               @on-visible-change="onVisibleChange">
            <Form ref="form"
                  class="form"
                  inline
                  :model="formData"
                  :rules="rules"
                  :label-width="80">
                <FormItem label="投诉项目:" prop="projectId">
                    <Select v-model="formData.projectId" style="width: 490px;">
                        <Option v-for="item in projectList"
                                :key="item.projectId"
                                :value="item.projectId"
                                :label="`${item.projectName}(${item.part})`"></Option>
                    </Select>
                </FormItem>
                <FormItem label="投诉人:" prop="complainant">
                    <Input v-model="formData.complainant" placeholder="请输入" />
                </FormItem>
                <FormItem label="投诉时间:" prop="complainDate">
                    <DatePicker
                            :value="formData.complainDate"
                            type="date"
                            transfer
                            @on-change="onChange_complainDate"
                            placeholder="选择时间"></DatePicker>
                </FormItem>
                <FormItem label="联系电话:" prop="phone">
                    <Input v-model="formData.phone" placeholder="请输入" />
                </FormItem>
                <FormItem label="邮箱:">
                    <Input v-model="formData.email" placeholder="请输入" />
                </FormItem>
                <FormItem label="投诉事项:" prop="complaintContent">
                    <Input v-model="formData.complaintContent" type="textarea" :rows="3" style="width: 490px;" placeholder="请输入" />
                </FormItem>
                <FormItem label="备注:">
                    <Input v-model="formData.remark" type="textarea" :rows="3" style="width: 490px;" placeholder="请输入" />
                </FormItem>
                <FormItem label="相关材料:">
                    <Upload :action="uploadAtion"
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
                        @click="save">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    import uploadMixin from '../../../../lib/mixin/uploadMixin';
    export default {
        name: 'addComplaint',  // 登记投诉
        mixins: [modalMixin, uploadMixin],
        computed: {
            uploadAtion() {
                return this.uploadParams.actionUrl + '/complaint';  // 投诉附件
            }
        },
        data() {
            return {
                uploadParams: {
                    multiple: true,
                    showUploadList: true
                },
                formData: {
                    complainant: '',   // 投诉人
                    complainDate: '',
                    projectId: '',
                    phone: '',
                    email: '',
                    complaintContent: '',
                    remark: '',
                    fileIds: []
                },
                rules: {
                    complainant: [{ required: true, message: '投诉人不能为空！', trigger: 'blur' }],
                    complainDate: [{ required: true, message: '投诉时间不能为空！', trigger: 'blur' }],
                    projectId: [{ required: true, message: '投诉项目不能为空！', trigger: 'blur' }],
                    phone: [{ required: true, message: '联系电话不能为空！', trigger: 'blur' }],
                    complaintContent: [{ required: true, message: '投诉内容不能为空！', trigger: 'blur' }],
                },

                projectList: []
            };
        },
        mounted() {
            this.getProjectList();
        },
        methods: {
            // 获取表格数据
            getProjectList() {
                this.$http({
                    method: 'get',
                    url: '/creditEvaluate/chooseProjectList'
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.projectList = res.data || [];
                    }
                })
            },
            onChange_complainDate(val) {
                this.formData.complainDate = val;
            },

            //on-remove 文件列表移除文件时的钩子
            fileRemove(file, fileList) {
                this.formData.fileIds = fileList.map(v => v.response.data.fileId);
            },
            // 文件上传
            fileUploadSuccess(response, file, fileList) {
                this.$Loading.finish();
                this.formData.fileIds = fileList.map(v => v.response.data.fileId);
            },
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/complaint/add',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '添加投诉成功！'
                                });
                                this.$emit('modal-callback');
                                this.modalValue = false;
                            }
                        })

                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .addComplaint-container {
    }
    .form {
        .ivu-form-item {
            .ivu-form-item-content > div{
                width: 200px;
            }
        }
    }
</style>