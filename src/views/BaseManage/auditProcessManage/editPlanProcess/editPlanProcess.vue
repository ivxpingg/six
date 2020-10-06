<template>
    <div class="editPlanProcess-container">
        <div class="left-panel">
            <Steps direction="vertical">
                <Step v-for="item in tableData" :content="item.name"  status="process"></Step>
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
               class="modal-addStep"
               :z-index="1000"
               title="新增步骤"
               :width="740"
               footer-hide>
            <vAddStep :auditProcessId="auditProcessId"
                      @modal_addStep_callback="modal_addStep_callback"></vAddStep>
        </Modal>

        <Modal v-model="modal_editStep"
               class="modal-editStep"
               title="编辑步骤"
               :width="740"
               footer-hide>
            <vEditStep :auditProcessId="auditProcessId"
                       :processStepId="processStepId"
                       @modal_editStep_callback="modal_editStep_callback"></vEditStep>
        </Modal>
    </div>
</template>
<script>
    import vIvxFilterBox from '../../../../components/ivxFilterBox/ivxFilterBox';
    import vAddStep from './addStep/addStep.vue';
    import vEditStep from './editStep/editStep.vue';
    export default {
        name: 'editPlanProcess',
        components: {vIvxFilterBox, vAddStep, vEditStep},
        props: {
            auditProcessId: {
                type: String,
                required: true,
                default: ''
            }
        },
        watch: {
            auditProcessId: {
                immediate: true,
                handler(val) {
                    if (val !== '') {
                        this.getData();
                    }
                }
            }
        },
        data() {
            return {
                searchParams: {
                    current: 1,        // 当前第几页
                    size: 10,          // 每页几行
                    total: 0,          // 总行数
                    searchKey: ''      // 模糊查询参数
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '步骤名称', width: 100, align: 'center', key: 'name' },
                    { title: '步骤类型', width: 100, align: 'center', key: 'stepTypeLabel' },
                    { title: '通过期限', width: 85, align: 'center', key: 'timeLimit' },
                    { title: '逾期处理方式', width: 110, align: 'center', key: 'overdueHandleLabel' },
                    // { title: '分配角色', width: 100, align: 'center', key: 'auditRoleStr' },
                    // { title: '配置用户', width: 120, align: 'center', key: 'auditUserName' },
                    { title: '通过规则', width: 100, align: 'center', key: 'passRuleLabel' },
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
                                            this.processStepId = params.row.processStepId;
                                            this.modal_editStep = true;
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
                                            this.delStep(params.row);
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
                                            this.stepUp(params);
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
                                            this.stepDown(params);
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
                    // {
                    //     processStepId: '001',
                    //     name: '报送监督单位人员',
                    //     stepType: '送阅步骤',
                    //     timeLimit: 3,
                    //     overdueHandle: '自动退回',
                    //     auditRoleStr: '科室负责人',
                    //     auditUserName: '林科员、李科员',
                    //     passRule: '一票通过'
                    // },
                    // {
                    //     auditProcessId: "1",
                    //     auditRole: "11",
                    //     auditUser: "1",
                    //     auditUserName: "1",
                    //     insTime: 1537686229000,
                    //     lastTime: 1537686208000,
                    //     name: "11",
                    //     noticeType: "1",
                    //     overdueHandle: "1",
                    //     passRule: "1",
                    //     processStepId: "1",
                    //     step: 1,
                    //     stepType: "1",
                    //     timeLimit: 1
                    // }
                ],
                tableLoading: false,

                // 新增步骤
                modal_addStep: false,
                modal_editStep: false,
                processStepId: ''
            }
        },
        methods: {
            modal_addStep_open() {
                this.modal_addStep = true;
            },
            modal_addStep_callback() {
                this.modal_addStep = false;
                this.getData();
            },
            modal_editStep_callback() {
                this.modal_editStep = false;
            },

            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'get',
                    url: '/processStep/list',
                    params: {
                        auditProcessId: this.auditProcessId
                    }
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data;
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            },

            delStep(row) {
                this.$Modal.confirm({
                    title: '删除',
                    content: `确定要删除<${row.name}>步骤`,
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/processStep/delete',
                            params: {
                                processStepId: row.processStepId
                            }
                        }).then((res) => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '删除成功！'
                                });
                                this.getData();

                                this.$emit('modal_editPanelProcess_callback');
                            }
                        })
                    }
                });
            },
            // 上移
            stepUp(params) {
                if (params.index !== 0) {
                    let processStepIds = `${this.tableData[params.index].processStepId},${this.tableData[params.index - 1].processStepId}`;
                    this.stepMove(processStepIds, '上移');
                }

            },
            // 下移
            stepDown(params) {
                if (params.index !== this.tableData.length) {
                    let processStepIds = `${this.tableData[params.index].processStepId},${this.tableData[params.index + 1].processStepId}`;
                    this.stepMove(processStepIds, '下移');
                }
            },
            // 上移下移
            stepMove(processStepIds, tip) {
                this.$http({
                    method: 'get',
                    url: '/processStep/move',
                    params: {
                        processStepIds: processStepIds
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.$Message.success({
                            content: `${tip}成功！`
                        });
                        this.getData();
                    }
                })
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
<style lang="scss">
    .modal-addStep {
        .ivu-modal-mask {

        }
    }
</style>