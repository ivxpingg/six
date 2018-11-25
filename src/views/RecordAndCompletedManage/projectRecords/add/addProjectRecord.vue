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
                <FormItem label="参建单位:" prop="unitId">
                    <Input v-model="formData.unitName"
                           readonly
                           @on-focus="modal_unitSelect_open" />
                </FormItem>
                <FormItem label="负责人:" prop="userId">
                    <Input v-model="formData.userName"
                           readonly @on-focus="modal_userSelect_open"/>
                </FormItem>
                <FormItem label="联系方式:">
                    <Input v-model="formData.phone" readonly/>
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
                    <Upload :action="uploadParams.actionUrl"
                            :showUploadList="uploadParams.showUploadList"
                            :multiple="uploadParams.multiple"
                            :accept="uploadParams.accept"
                            :maxSize="uploadParams.maxSize"
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

        <!--单位选择-->
        <vModalUnitSelect ref="unitSelect"
                          @modal-callback="modal_unitSelect_callback"></vModalUnitSelect>

        <vModalEmployeeSelect ref="employeeSelect"
                              userSourceType="hasUnit"
                              :unitId="formData.unitId"
                              @modal-callback="modal_employeeSelect_callback"></vModalEmployeeSelect>
    </div>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    import uploadMixin from '../../../../lib/mixin/uploadMixin';
    import vModalUnitSelect from '../../../Common/unitSelect/modalUnitSelect';
    import vModalEmployeeSelect from '../../../Common/employeeSelect/modalEmployeeSelect';
    export default {
        name: 'addProjectRecord',
        mixins: [modalMixin, uploadMixin],
        components: {vModalUnitSelect, vModalEmployeeSelect},
        data() {
            return {
                formData: {
                    projectId: '',
                    unitId: '',
                    unitName: '',
                    userId: '',
                    userName: '',
                    phone: '',
                    recordType: '',
                    recordContent: ''
                },
                rules: {
                    unitId: [{ required: true, message: '参建单位不能为空！', trigger: 'blur' }],
                    userId: [{ required: true, message: '负责人不能为空！', trigger: 'blur' }]
                },

                // 项目列表
                projectList: [],

                //
                dict_recordType: []
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

            // 单位选择
            modal_unitSelect_open() {
                this.$refs.unitSelect.modalValue = true;
            },
            modal_unitSelect_callback(selectValue, selectItems) {
                this.formData.unitId = selectItems.unitId;
                this.formData.unitName = selectItems.unitName;
                this.formData.userId = '';
                this.formData.userName = '';
                this.$refs.form.validateField('unitId');
                this.$refs.unitSelect.modalValue = false;
            },
            // 负责人选择
            modal_userSelect_open() {
                this.$refs.form.validateField('unitId', (msg) => {
                    if (msg === '') {
                        this.$refs.employeeSelect.modalValue = true;
                    }
                });
            },
            modal_employeeSelect_callback(selectValue, selectItems) {
                this.formData.userId = selectItems.userId;
                this.formData.userName = selectItems.userName || '';
                this.formData.phone = selectItems.phone || '';
                this.$refs.form.validateField('userId');
                this.$refs.employeeSelect.modalValue = false;
            },

            // 文件上传
            fileUploadSuccess(response, file, fileList) {
                // TODO 文件上传
                console.dir(response);
                // this.$Loading.finish();
            },

            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {

                        this.$http({
                            method: 'post',
                            url: '/',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '添加成功！'
                                });
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