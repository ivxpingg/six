<template>
    <div class="modalSendFile-container">
        <Modal v-model="modalValue"
               :width="450"
               title="发送文件">
            <Form ref="form"
                  :model="formData"
                  :rules="rules"
                  :label-width="85">
                <FormItem label="文件标题：" prop="fileName">
                    <Input v-model="formData.fileName" />
                </FormItem>
                <FormItem label="内容：" prop="fileContent">
                    <Input v-model="formData.fileContent"
                           type="textarea"
                           :rows="5" />
                </FormItem>
                <FormItem label="项目：" v-if="userType !== 'supervisor'">
                    <Select v-model="formData.projectId" placeholder="请选择项目">
                        <Option v-for="item in projectList"
                                :key="item.projectId"
                                :value="item.projectId"
                                :label="item.projectName"></Option>
                    </Select>
                </FormItem>
                <FormItem label="选择用户：" prop="userIds">
                    <Select ref="selectUser"
                            v-if="userType === 'supervisor'"
                            @on-open-change="auditUser_onFocus"
                            v-model="formData.userIds"
                            multiple>
                        <Option v-for="item in formData.userList"
                                :key="item.userId"
                                :value="item.userId"
                                :label="item.name"></Option>
                    </Select>

                    <Select v-if="userType !== 'supervisor'"
                            v-model="formData.userIds"
                            multiple>
                        <Option v-for="item in formData.userList"
                                :key="item.userId"
                                :value="item.userId"
                                :label="`${item.name} - ${item.job || ''} - ${item.phone || ''}`"></Option>
                    </Select>
                </FormItem>
                <FormItem label="文件：">
                    <div style="width: 330px;"><vFilesSelectButton @modal-callback="onSelect"
                                                                   :projectId="formData.projectId"
                                                                   fileType="user_attach"
                                                                   multiple></vFilesSelectButton></div>

                </FormItem>

            </Form>

            <div slot="footer">
                <Button type="primary"
                        size="large"
                        @click="save">保存</Button>
            </div>

        </Modal>

        <!--用户选择-->
        <vModalEmployeeSelect ref="modal_userSelect"
                              multiple
                              :selectedValue="formData.userIds"
                              :zIndex="2000"
                              filterSelected
                              @modal-callback="modal_userSelect_callback" ></vModalEmployeeSelect>

    </div>
</template>

<script>
    import modalMixin from '../../../../../lib/mixin/modalMixin';
    import uploadMixin from '../../../../../lib/mixin/uploadMixin';
    import vModalEmployeeSelect from '../../../../Common/employeeSelect/modalEmployeeSelect';
    import vFilesSelectButton from '../../../../Common/filesSelect/filesSelectButton.vue';
    export default {
        name: 'modalSendFile',
        mixins: [modalMixin, uploadMixin],
        components: {vModalEmployeeSelect, vFilesSelectButton},
        computed: {
            uploadActive() {
                return this.uploadParams.actionUrl + '/receive_send';
            },
            userType() {
                return this.$store.state.user.userType;
            }
        },
        data() {
            return {
                projectList: [],
                uploadParams: {
                    showUploadList: true,
                    multiple: true
                },
                formData: {
                    fileName: '',
                    fileContent: '',
                    projectId: '',
                    userIds: [],
                    userList: [],
                    fileIds: []
                },
                rules: {
                    fileName: [{required: true, message: '文件名称不能为空！', trigger: 'blur'}],
                    fileContent: [{required: true, message: '文件内容不能为空！', trigger: 'blur'}],
                    userIds: [{required: true, type: 'array', message: '用户不能为空！', trigger: 'blur'}],
                    fileIds: [{required: true, type: 'array', message: '附件不能为空！', trigger: 'blur'}],
                }
            };
        },
        watch: {
            'formData.projectId'() {
                this.formData.userIds = [];
                this.formData.userList = [];
                this.getUserListByProjectId();
            }
        },
        mounted() {
            this.getProjectList();
        },
        methods: {
            // 根据项目获取相关用户列表
            getUserListByProjectId() {
                this.$http({
                    method: 'get',
                    url: '/project/projectCorrelationPersons',
                    params: {
                        projectId: this.formData.projectId
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.formData.userList = res.data || [];
                    }
                });
            },

            getProjectList() {
                this.$http({
                    method: 'post',
                    url: '/archive/archiveList',
                    data: JSON.stringify({
                        projectName: ''
                    })
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.projectList = res.data || [];
                    }
                });
            },
            onSelect(fileList) {
                this.formData.fileIds = fileList.map(v => v.fileId);
            },
            // 选择用户
            auditUser_onFocus(value) {
                if (value) {
                    this.$refs.modal_userSelect.modalValue = value;
                    this.$refs.selectUser.visible = false;
                }
            },
            modal_userSelect_callback(selectValue, selectItems) {
                this.formData.userList = this.formData.userList.filter(v => this.formData.userIds.indexOf(v.userId) > -1);
                this.formData.userList = this.formData.userList.concat(selectItems);
                this.formData.userIds = [];
                this.formData.userList.forEach((val) => {
                    this.formData.userIds.push(val.userId);
                });
                this.$refs.form.validate();
            },
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/receiveSend/add',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '发送成功！'
                                });
                                this.$emit('modal-callback');
                                this.modalValue = false;
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
    .modalSendFile-container {
    }
</style>