<template>
    <div class="editStep-container">
        <Form ref="form"
              inline
              class="addPlan-form"
              :model="formData"
              :rules="rules"
              :label-width="100">
            <FormItem label="步骤名称:" prop="name">
                <Input v-model="formData.name"/>
            </FormItem>
            <FormItem label="步骤类型:" prop="stepType">
                <Select v-model="formData.stepType">
                    <Option v-for="item in dict_stepType"
                            :value="item.value"
                            :label="item.label"
                            :key="`dict_${item.id}`"></Option>
                </Select>
            </FormItem>
            <FormItem label="配置用户:" prop="userIds">
                <Select ref="selectUser"
                        @on-open-change="auditUser_onFocus"
                        v-model="formData.userIds"
                        multiple>
                    <Option v-for="item in formData.userList"
                            :key="item.userId"
                            :value="item.userId"
                            :label="item.name"></Option>
                </Select>
            </FormItem>
            <FormItem label="通过规则:" prop="passRule">
                <Select v-model="formData.passRule">
                    <Option v-for="item in dict_passRule"
                            :value="item.value"
                            :label="item.label"
                            :key="`dict_${item.id}`"></Option>
                </Select>
            </FormItem>
            <FormItem label="通过期限:" prop="timeLimit">
                <Input v-model="formData.timeLimit" number placeholder="单位：天" />
            </FormItem>
            <FormItem label="逾期处理方式:" prop="overdueHandle">
                <Select v-model="formData.overdueHandle">
                    <Option v-for="item in dict_overdueHandle"
                            :value="item.value"
                            :label="item.label"
                            :key="`dict_${item.id}`"></Option>
                </Select>
            </FormItem>
            <FormItem label="通知方式:" prop="noticeType">
                <Select v-model="formData.noticeType">
                    <Option v-for="item in dict_noticeType"
                            :value="item.value"
                            :label="item.label"
                            :key="`dict_${item.id}`"></Option>
                </Select>
            </FormItem>
        </Form>

        <div class="ivu-modal-footer">
            <Button type="primary"
                    size="large"
                    @click="save">保存</Button>
        </div>

        <vModalEmployeeSelect ref="modal_userSelect"
                              multiple
                              :selectedValue="formData.userIds"
                              :zIndex="2000"
                              filterSelected
                              @modal-callback="modal_userSelect_callback" ></vModalEmployeeSelect>
    </div>
</template>
<script>
    import vModalEmployeeSelect from '../../../../Common/employeeSelect/modalEmployeeSelect';
    export default {
        name: 'editStep',
        components: {vModalEmployeeSelect},
        props: {
            auditProcessId: {
                type: String,
                required: true,
                default: ''
            },
            processStepId: {
                type: String,
                required: true,
                default: ''
            }
        },
        data() {
            return {
                formData: {
                    auditProcessId: '',
                    processStepId: '',
                    name: '',
                    stepType: '',
                    auditRole: '',
                    auditRoleLabel: '',
                    userIds: [],
                    userList: [],
                    passRule: '',
                    timeLimit: 0,
                    overdueHandle:'',
                    noticeType: ''
                },
                rules: {
                    name: [{ required: true, message: '步骤名称不能为空！', trigger: 'blur' }],
                    // auditRole: [{ required: true, message: '步骤审核角色不能为空！', trigger: 'blur' }],
                    stepType: [{ required: true, message: '步骤类型不能为空！', trigger: 'blur' }],
                    userIds: [{ required: true, type: 'array', message: '用户不能为空！', trigger: 'blur' }],
                    timeLimit: [{ required: true, type:'number', message: '通过期限不能为空！', trigger: 'blur' }],
                    passRule: [{ required: true, message: '通过规则不能为空！', trigger: 'blur' }],
                    overdueHandle: [{ required: true, message: '逾期处理方式不能为空！', trigger: 'blur' }],
                    noticeType: [{ required: true, message: '通知方式不能为空！', trigger: 'blur' }],
                },

                // 字典
                // 步骤类型
                dict_stepType: [],
                // 通过规则
                dict_passRule: [],
                // 逾期处理方式
                dict_overdueHandle: [],
                // 通知方式
                dict_noticeType: [],
                modal_userSelect: false
            }
        },
        watch: {
            auditProcessId: {
                immediate: true,
                handler(val) {
                    if (val !== '') {
                        this.formData.auditProcessId = val;
                    }
                }
            },
            processStepId: {
                immediate: true,
                handler(val) {
                    if (val !== '') {
                        this.formData.processStepId = val;
                        this.getData();
                    }
                }
            }
        },
        mounted() {
            this.getDict();
        },
        methods: {
            getDict() {
                this.$http({
                    method: 'get',
                    url: '/dict/getListByTypes',
                    params: {
                        types: 'stepType,passRule,overdueHandle,noticeType'
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.dict_stepType = res.data.stepType;
                        this.dict_passRule = res.data.passRule;
                        this.dict_overdueHandle = res.data.overdueHandle;
                        this.dict_noticeType = res.data.noticeType;
                    }
                });
            },
            // 选择用户
            auditUser_onFocus(value) {
                if (value) {
                    this.$refs.modal_userSelect.modalValue = value;
                    this.$refs.selectUser.visible = false;
                }
            },
            modal_userSelect_callback(selectValue, selectItems) {
                this.formData.userList = this.formData.userList.concat(selectItems);
                this.formData.userIds = [];
                this.formData.userList.forEach((val) => {
                    this.formData.userIds.push(val.userId);
                });
                this.$refs.form.validate();
            },
            getData() {
                this.$http({
                    method: 'get',
                    url: '/processStep/query',
                    params: {
                        processStepId: this.processStepId
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.formData = Object.assign(this.formData, res.data);
                        if (res.data.userList) {
                            this.formData.userIds = this.formData.userList.map(v => {return v.userId});
                        }
                        else{
                            this.formData.userIds = [];
                        }
                    }
                })
            },
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/processStep/update',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '修改成功！'
                                });
                                this.$emit('modal_editStep_callback');
                            }
                        })
                    } else {

                    }
                })
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    .editStep-container {
        margin-bottom: 61px;
        .addPlan-form {
            .ivu-form-item {
                .ivu-form-item-content > div{
                    width: 240px;
                }
            }
        }
        .ivu-modal-footer {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }
</style>