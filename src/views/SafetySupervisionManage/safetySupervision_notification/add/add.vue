<template>
    <div class="add-container">
        <Modal v-model="modalValue"
               title="安全文件"
               :width="640">
            <Form ref="form"
                  class="form"
                  inline
                  :model="formData"
                  :rules="rules"
                  :label-width="80">
                <FormItem label="文件名称:" prop="fileName">
                    <Input v-model="formData.fileName"  placeholder="请输入项目名称"/>
                </FormItem>
                <FormItem label="文件编号:" prop="fileNo">
                    <Input v-model="formData.fileNo" placeholder="请输入文件编号"/>
                </FormItem>
                <FormItem label="主编单位:" prop="editUnit">
                    <Input v-model="formData.editUnit"  placeholder="请输入主编单位"/>
                </FormItem>
                <FormItem label="施行日期:" prop="beginTime">
                    <DatePicker
                            :value="formData.beginTime"
                            type="date"
                            transfer
                            @on-change="onChange_beginTime"
                            placeholder="选择时间"></DatePicker>
                </FormItem>
                <FormItem label="简介:" prop="intro">
                    <Input v-model="formData.intro"
                           type="textarea"
                           :rows="5"
                           style="width: 490px;"
                           placeholder="请输入简介"/>
                </FormItem>
                <FormItem label="相关材料:">
                    <Upload :action="uploadActive"
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
                        :loading="saveBtnLoading"
                        @click="save">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    import uploadMixin from '../../../../lib/mixin/uploadMixin';
    export default {
        name: 'add_notification',  // 添加安全通知
        mixins: [modalMixin, uploadMixin],
        components: {},
        computed: {
            uploadActive() {
                return this.uploadParams.actionUrl + '/notice_file';
            }
        },
        data() {
            return {
                uploadParams: {
                    showUploadList: true,
                    multiple: true
                },
                formData: {
                    fileName: '',  // 文件名称
                    fileNo: '',    // 文件编号
                    editUnit: '',  // 主编单位
                    editUnitStr: '',
                    beginTime: '',  // 施行时间
                    intro: '',  // 简介
                    fileNum: null,  // 附件数量
                    insTime: '',  // 创建时间
                    operateUnit: '',  // 操作单位
                    operateUnitStr: '',
                    operator: '',  //  操作人
                    publishTime: '',  // 发布时间
                    cancelTime: '',  // 作废时间
                    fileIds: []
                },
                rules: {
                    fileName: [{ required: true, message: '文件名称不能为空！', trigger: 'blur' }],
                    fileNo: [{ required: true, message: '文件编号不能为空！', trigger: 'blur' }],
                    editUnit: [{ required: true, message: '主编单位不能为空！', trigger: 'blur' }],
                    beginTime: [{ required: true, message: '施行日期不能为空！', trigger: 'blur' }],
                    intro: [{ required: true, message: '简介不能为空！', trigger: 'blur' }],
                    mileage: [{ required: true, type: 'number', message: '项目里程不能为空！', trigger: 'blur' }],

                },
                // 保存按钮状态
                saveBtnLoading: false
            };
        },
        methods:{
            onChange_beginTime(val) {
                this.formData.beginTime = val;
            },

            // 文件移除
            onRemoveFile(file, fileList) {
                this.formData.fileIds = fileList.map(v => v.response.data.fileId);
            },

            fileUploadSuccess(response, file, fileList) {
                this.formData.fileIds = fileList.map(v => v.response.data.fileId);
            },

            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.saveBtnLoading = true;
                        this.$http({
                            method: 'post',
                            url: '/safeNotice/add',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '添加成功！'
                                });
                                this.$emit('modal-callback');
                                this.saveBtnLoading = false;
                            }
                        }).catch(e => {
                            this.saveBtnLoading = false;
                        })

                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .add-container {

    }

    .form {
        .ivu-form-item {
            .ivu-form-item-content > div{
                width: 200px;
            }
        }
    }
</style>