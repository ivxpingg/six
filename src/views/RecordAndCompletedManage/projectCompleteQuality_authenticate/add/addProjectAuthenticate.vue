<template>
    <div class="addProjectAuthenticate-container">
        <Modal v-model="modalValue"
               title="添加工程备案"
               :width="540">
            <Form ref="form"
                  class="form"
                  :model="formData"
                  :rules="rules"
                  :label-width="120">
                <FormItem label="项目名称:" prop="projectId">
                    <Select v-model="formData.projectId">
                        <Option v-for="item in projectList"
                                :key="item.projectId"
                                :value="item.projectId"
                                :label="`${item.projectName} (标段：${item.part})`"></Option>
                    </Select>
                </FormItem>

                <FormItem label="工程质量鉴定报告:">
                    <Upload ref="upload_1"
                            :action="uploadAction"
                            :showUploadList="uploadParams.showUploadList"
                            :multiple="uploadParams.multiple"
                            :accept="uploadParams.accept"
                            :maxSize="uploadParams.maxSize"
                            :on-remove="fileRemove1"
                            :before-upload="fileBeforeUpload"
                            :on-exceeded-size="exceededSize"
                            :on-error="fileUploadError"
                            :on-success="fileUploadSuccess1">
                        <Button type="primary" icon="ios-cloud-upload-outline">上传文件</Button>
                    </Upload>
                </FormItem>
                <FormItem label="监督管理工作报告:">
                    <Upload ref="upload_2"
                            :action="uploadAction"
                            :showUploadList="uploadParams.showUploadList"
                            :multiple="uploadParams.multiple"
                            :accept="uploadParams.accept"
                            :maxSize="uploadParams.maxSize"
                            :on-remove="fileRemove2"
                            :before-upload="fileBeforeUpload"
                            :on-exceeded-size="exceededSize"
                            :on-error="fileUploadError"
                            :on-success="fileUploadSuccess2">
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
    import Config from '../../../../config';
    export default {
        name: 'addProjectAuthenticate',
        mixins: [modalMixin, uploadMixin],
        computed: {
            uploadAction() {
                return Config[Config.env].actionUrl + '/complete';
            }
        },
        data() {
            return {
                formData: {
                    projectId: '',
                    fileIds: [] // 项目文件内容合并
                },
                uploadParams: {
                    multiple: true,
                    showUploadList: true
                },
                fileIds1: [],   // 工程质量鉴定报告
                fileIds2: [],   // 监督管理工作报告
                rules: {
                    projectId: [{ required: true, message: '项目不能为空！', trigger: 'blur' }]
                },

                // 项目列表
                projectList: []
            };
        },
        mounted() {
            this.getProjectList();
            this.getDict(['recordType']);
        },
        methods: {
            getDict(list) {
                this.$http({
                    method: 'get',
                    url: '/dict/getListByTypes',
                    params: {
                        types: list.join(',')
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        list.forEach(val => {
                            this[`dict_${val}`] = res.data[val];
                        });

                    }
                })
            },
            // 获取用于太添加竣工项目列表
            getProjectList() {
                this.$http({
                    method: 'get',
                    url: '/projectAudit/chooseProjectListForHandover'
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.projectList = res.data || [];
                    }
                })
            },

            fileRemove1(file, fileList) {
                let idx = this.fileIds1.indexOf(file.response.data.fileId);
                if(idx > -1) {
                    this.fileIds1.splice(idx, 1);
                }
                this.formData.fileIds = this.fileIds1.concat(this.fileIds2);
            },
            fileRemove2(file, fileList) {
                let idx = this.fileIds2.indexOf(file.response.data.fileId);
                if(idx > -1) {
                    this.fileIds2.splice(idx, 1);
                }
                this.formData.fileIds = this.fileIds1.concat(this.fileIds2);
            },
            fileUploadSuccess1(response, file, fileList) {
                this.fileIds1 = fileList.map(v => v.response.data.fileId);
                this.formData.fileIds = this.fileIds1.concat(this.fileIds2);

            },
            fileUploadSuccess2(response, file, fileList) {
                this.fileIds2 = fileList.map(v => v.response.data.fileId);
                this.formData.fileIds = this.fileIds1.concat(this.fileIds2);

            },

            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {

                        this.$http({
                            method: 'post',
                            url: '/projectAudit/completeApply',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '添加成功！'
                                });
                                this.$emit('modal_callback');
                                this.modalValue = false;
                                this.fileIds1 = [];
                                this.fileIds2 = [];
                                this.formData.fileIds = [];
                                this.$refs.upload_1.clearFiles();
                                this.$refs.upload_2.clearFiles();
                            }
                        })

                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .addProjectAuthenticate-container {
    }
</style>