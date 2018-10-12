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
            <FormItem label="步骤类型:">
                <Select v-model="formData.stepType">
                    <Option v-for="item in dict_stepType"
                            :value="item.value"
                            :label="item.label"
                            :key="`dict_${item.id}`"></Option>
                </Select>
            </FormItem>
            <FormItem label="步骤审核角色:" prop="auditRole">
                <Input v-model="formData.auditRoleLabel" readonly @on-focus="auditRole_onFocus" />
            </FormItem>
            <FormItem label="配置用户:" prop="auditUser">
                <Input v-model="formData.auditUser"
                       :disabled="formData.auditRole === ''"
                       @on-focus="auditUser_onFocus" />
            </FormItem>
            <FormItem label="通过规则:">
                <Select v-model="formData.passRule">
                    <Option v-for="item in dict_passRule"
                            :value="item.value"
                            :label="item.label"
                            :key="`dict_${item.id}`"></Option>
                </Select>
            </FormItem>
            <FormItem label="通过期限:" prop="timeLimit">
                <Input v-model="formData.timeLimit" number>
                <span slot="append">天</span>
                </Input>
            </FormItem>
            <FormItem label="逾期处理方式:">
                <Select v-model="formData.overdueHandle">
                    <Option v-for="item in dict_overdueHandle"
                            :value="item.value"
                            :label="item.label"
                            :key="`dict_${item.id}`"></Option>
                </Select>
            </FormItem>
            <FormItem label="通知方式:">
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

        <Modal v-model="modal_roleSelect"
               title="角色选择"
               :width="350"
               footer-hide>
            <vRoleSelect  @onSelectRole="onSelectRole"></vRoleSelect>
        </Modal>
    </div>
</template>
<script>
    import vRoleSelect from '../../../../Common/roleSelect/roleSelect';
    export default {
        name: 'editStep',
        components: {vRoleSelect},
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
                    auditUser: '',
                    auditUserName: '',
                    passRule: '',
                    timeLimit: 0,
                    overdueHandle:'',
                    noticeType: ''
                },
                rules: {
                    name: [{ required: true, message: '步骤名称不能为空！', trigger: 'blur' }],
                    auditRole: [{ required: true, message: '步骤审核角色不能为空！', trigger: 'blur' }],
                    auditUser: [{ required: true, message: '用户不能为空！', trigger: 'blur' }],
                    timeLimit: [{ required: true, type: 'Number', message: '通过期限不能为空！', trigger: 'blur' }],
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

                // 角色选择
                modal_roleSelect: false
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
            // 选择角色
            auditRole_onFocus() {
                this.modal_roleSelect = true;
            },
            onSelectRole(item) {
                if (item.length === 0) {
                    this.formData.auditRole = '';
                    this.formData.auditRoleLabel = '';
                }
                else {
                    if (item[0].nodeType === 'role') {
                        this.formData.auditRole = item[0].roleId;
                        this.formData.auditRoleLabel = item[0].name;
                    }
                }
                this.modal_roleSelect = false;
            },
            // 选择用户
            auditUser_onFocus() {
                if (this.formData.auditRole === '') {
                    this.$Message.warning({
                        content: '请先选择角色'
                    })
                }
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