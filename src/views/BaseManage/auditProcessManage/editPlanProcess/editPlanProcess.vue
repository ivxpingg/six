<template>
    <div class="editPlanProcess-container">
        <div class="left-panel">
            <Steps direction="vertical">
                <Step v-for="item in tableData" :content="item.name" :key="`step_${item.processStepId}`" status="process"></Step>
            </Steps>
        </div>
        <div class="right-panel">
            <vIvxFilterBox>
                <Button type="primary"
                        icon="md-add" @click="modal_addStep_open">新增步骤</Button>
            </vIvxFilterBox>

            <div class="ivx-table-box">
                <Table border
                       height="505"
                       :loading="tableLoading"
                       :columns="tableColumns"
                       :data="tableData"></Table>
            </div>

        </div>

        <Modal v-model="modal_addStep"
               title="新增步骤"
               :width="700"
               footer-hide>
            <vAddStep @modal_addStep_callback="modal_addStep_callback"></vAddStep>
        </Modal>
    </div>
</template>
<script>
    import vIvxFilterBox from '../../../../components/ivxFilterBox/ivxFilterBox';
    import vAddStep from './addStep/addStep.vue';
    export default {
        name: 'editPlanProcess',
        components: {vIvxFilterBox},
        props: {
            auditProcessId: {
                type: String,
                required: true,
                default: ''
            }
        },
        data() {
            return {
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '步骤名称', width: 100, align: 'center', key: 'name' },
                    { title: '步骤类型', width: 100, align: 'center', key: 'stepType' },
                    { title: '通过期限', width: 85, align: 'center', key: 'timeLimit' },
                    { title: '逾期处理方式', width: 110, align: 'center', key: 'overdueHandle' },
                    { title: '分配角色', width: 100, align: 'center', key: 'auditRoleStr' },
                    { title: '配置用户', width: 120, align: 'center', key: 'auditUserName' },
                    { title: '通过规则', width: 100, align: 'center', key: 'passRule' },
                    {
                        title: '操作',
                        width: 310,
//                        fixed: 'right',
                        align: 'center',
                        render: (h, params) => {
                            let list = [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-create-outline'
                                    },
                                    on: {
                                        click: () => {
                                            this.auditProcessId = params.row.auditProcessId;
                                            this.modal_editPlan = true;
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'ios-trash-outline'
                                    },
                                    on: {
                                        click: () => {
                                            this.delPlan(params.row);
                                        }
                                    }
                                }, '删除'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'md-arrow-up'
                                    },
                                    on: {
                                        click: () => {
                                            this.delPlan(params.row);
                                        }
                                    }
                                }, '上移'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'md-arrow-down'
                                    },
                                    on: {
                                        click: () => {
                                            this.delPlan(params.row);
                                        }
                                    }
                                }, '下移'),
                            ];

                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [
                    {
                        processStepId: '001',
                        name: '报送监督单位人员',
                        stepType: '送阅步骤',
                        timeLimit: 3,
                        overdueHandle: '自动退回',
                        auditRoleStr: '科室负责人',
                        auditUserName: '林科员、李科员',
                        passRule: '一票通过'
                    },
                    {
                        processStepId: '002',
                        name: '报送监督单位人员',
                        stepType: '送阅步骤',
                        timeLimit: 3,
                        overdueHandle: '自动退回',
                        auditRoleStr: '科室负责人',
                        auditUserName: '林科员、李科员',
                        passRule: '一票通过'
                    },{
                        processStepId: '003',
                        name: '报送监督单位人员',
                        stepType: '送阅步骤',
                        timeLimit: 3,
                        overdueHandle: '自动退回',
                        auditRoleStr: '科室负责人',
                        auditUserName: '林科员、李科员',
                        passRule: '一票通过'
                    },{
                        processStepId: '004',
                        name: '报送监督单位人员',
                        stepType: '送阅步骤',
                        timeLimit: 3,
                        overdueHandle: '自动退回',
                        auditRoleStr: '科室负责人',
                        auditUserName: '林科员、李科员',
                        passRule: '一票通过'
                    }
                ],
                tableLoading: false,

                // 新增步骤
                modal_addStep: false
            }
        },
        methods: {
            modal_addStep_open() {
                this.modal_addStep = true;
            },
            modal_addStep_callback() {
                this.modal_addStep = false;
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    .editPlanProcess-container {
        display: flex;
        height: 600px;
        .left-panel{
            width: 180px;
            padding: 16px;
            border-right: 1px solid #dcdee2;
            height: 100%;
            overflow-y: auto;
        }
        .right-panel {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            overflow-x: hidden;
        }
    }
</style>