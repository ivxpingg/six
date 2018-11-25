<template>
    <div class="addProjectRecord-container">
        <Modal v-model="modalValue"
               title="添加工程备案"
               :width="640">
            <Form ref="form"
                  class="form"
                  inline
                  :model="formData"
                  :rules="rules"
                  :label-width="80">
                <FormItem label="项目名称:" prop="projectId">
                    <Select v-model="formData.projectId" style="width: 510px;">
                        <Option v-for="(item, idx) in projectList"
                                :key="item.projectId + idx"
                                :value="item.projectId"
                                :label="`${item.projectName} (标段：${item.part})`"></Option>
                    </Select>
                </FormItem>
                <FormItem label="参建单位:" prop="projectUnitId">
                    <Select v-model="formData.projectUnitId">
                        <Option v-for="item in projectUnitList"
                                :key="item.projectUnitId"
                                :value="item.projectUnitId"
                                :label="item.unitName"></Option>
                    </Select>
                </FormItem>
                <FormItem label="负责人:" prop="projectUserId">
                    <Select v-model="formData.projectUserId" @on-change="onChange_user">
                        <Option v-for="item in projectUserList"
                                :key="item.projectUserId"
                                :value="item.projectUserId"
                                :label="item.name"></Option>
                    </Select>
                </FormItem>
                <FormItem label="联系方式:">
                    <Input v-model="formData.phone"/>
                </FormItem>
                <FormItem label="备案内容:">
                    <Select v-model="formData.recordType">
                        <Option v-for="item in dict_recordType"
                                :key="item.id"
                                :value="item.value"
                                :label="item.label"></Option>
                    </Select>
                </FormItem>
                <FormItem label="备案:" prop="recordContent">
                    <Input v-model="formData.recordContent"
                           type="textarea"
                           style="width: 510px;"
                           :rows="5"
                           placeholder="请输入"/>
                </FormItem>
                <FormItem label="相关材料:">
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
                        @click="save">保存</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    import uploadMixin from '../../../../lib/mixin/uploadMixin';
    export default {
        name: 'addProjectRecord',
        mixins: [modalMixin, uploadMixin],
        computed: {
            uploadAction() {
                return this.uploadParams.actionUrl + '/monitor_procedure'
            }
        },
        data() {
            return {
                uploadParams: {
                    multiple: true,
                    showUploadList: true
                },
                formData: {
                    projectId: '',
                    projectUnitId: '',
                    unitName: '',
                    projectUserId: '',
                    userName: '',
                    phone: '',
                    recordType: '',
                    recordContent: '',
                    fileIds: []
                },
                rules: {
                    projectUnitId: [{ required: true, message: '参建单位不能为空！', trigger: 'blur' }],
                    projectUserId: [{ required: true, message: '负责人不能为空！', trigger: 'blur' }]
                },

                // 项目列表
                projectList: [],
                // 参建单位列表
                projectUnitList: [],
                // 参建单位用户列表
                projectUserList: [],

                //
                dict_recordType: []
            };
        },
        watch: {
            'formData.projectId'(val) {
                if (val) {
                    this.getProjectUnitList(val);
                }
                this.projectUserList = [];
                this.formData.projectUnitId = '';
                this.formData.projectUserId = '';
                this.formData.phone = '';
            },
            'formData.projectUnitId'(val) {
                if (val) {
                    this.getProjectUser_unit(val);
                }
                this.formData.projectUserId = '';
                this.formData.phone = '';
            }
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
                    if(res.code === 'SUCCESS') {
                        list.forEach(val => {
                            this[`dict_${val}`] = res.data[val];
                        });

                    }
                })
            },
            // 获取项目列表
            getProjectList() {
                this.$http({
                    method: 'post',
                    url: '/project/list',
                    data: JSON.stringify({
                        current: 1,      // 当前第几页
                        size: 10000,      // 每页几行
                    })
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.projectList = res.data.records;
                    }
                })
            },

            // 获取参建单位列表
            getProjectUnitList(projectId) {
                this.$http({
                    method: 'get',
                    url: '/project/projectUnitList',
                    params: {
                        projectId: projectId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.projectUnitList = res.data || [];
                    }
                })
            },

            // 获取参建单位用户列表
            getProjectUser_unit(projectUnitId) {
                this.$http({
                    method: 'get',
                    url: '/project/viewProjectUser',
                    params: {
                        projectUnitId: projectUnitId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.projectUserList = res.data || [];
                    }
                })
            },

            //
            onChange_user(value) {
                this.projectUserList.forEach(v => {
                    if(v.projectUserId === value) {
                        this.formData.phone = v.phone;
                    }
                })
            },

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

            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {

                        this.$http({
                            method: 'post',
                            url: '/projectRecord/add',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '添加成功！'
                                });
                                this.modalValue = false;
                                this.$emit('modal_callback');
                            }
                        })

                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .addProjectRecord-container {
    }

    .form {
        .ivu-form-item {
            .ivu-form-item-content > div{
                width: 210px;
            }
        }
    }
</style>