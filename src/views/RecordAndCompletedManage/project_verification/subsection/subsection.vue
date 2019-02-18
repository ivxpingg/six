<template>
    <div class="subsection-container">
        <Modal v-model="modalValue"
               :width="1300"
               title="分段交工" footer-hide>
            <div class="ivx-table-box">
                <Table border
                       :height="350"
                       :loading="tableLoading"
                       :columns="_tableColumns"
                       :data="tableData"></Table>
            </div>
        </Modal>

        <!--交工检测核验登记-->
        <Modal v-model="modal_edit"
               class-name="modal-body-padding0"
               title="交工检测核验登记"
               :width="1200"
               footer-hide>
            <div style="height: 650px;">
                <vProjectVerification_apply :projectId="currentProject.projectId"
                                            :isView="isView"
                                            @modal_callback="modal_edit_callback"></vProjectVerification_apply>
            </div>
        </Modal>

        <!--材料完整性审核-->
        <Modal v-model="modal_contentAudit"
               class-name="modal-body-padding0"
               title="材料完整性审核"
               :width="1200"
               footer-hide>
            <vContentAudit :projectId="currentProject.projectId"
                           :handoverRecordId="currentProject.handoverRecordId"
                           @modal_callback="modal_callback_contentAudit"></vContentAudit>
        </Modal>

        <!--处理标签审核-->
        <vHandleAudit ref="modal_handleAudit"
                      key="subsection"
                      :projectId="currentProject.projectId"
                      :handoverRecordId="currentProject.handoverRecordId"
                      :auditProcessId="currentProject.auditProcessId"
                      :processStepId="currentProject.processStepId"
                      @modal-auditPass-callback="modal_auditPass_callback"></vHandleAudit>

        <!--下发交工申请核查意见书-->
        <vSendProjectFiles ref="modal_sendProjectFiles"
                           :projectId="currentProject.projectId"
                           :handoverRecordId="currentProject.handoverRecordId"
                           @modal-callback="modal_sendProjectFiles_callback">

        </vSendProjectFiles>
    </div>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    import vProjectVerification_apply from '../edit/projectVerification_apply';
    import vContentAudit from '../content-audit/content-audit';
    import vHandleAudit from '../handleAudit/handleAudit';
    import vSendProjectFiles from '../sendProjectfiles/sendProjectFiles';
    import authMixin from '../../../../lib/mixin/authMixin'
    import MOMENT from 'moment';
    export default {
        name: 'subsection',  // 分段交工列表
        mixins: [modalMixin, authMixin],
        components: {
            vProjectVerification_apply,
            vContentAudit,
            vHandleAudit,
            vSendProjectFiles,
        },
        props: {
            projectId: {
                type: String,
                required: true
            },
            projectName: {
                type: String,
            }
        },
        computed: {
            _tableColumns() {
                return this.auth_add || this.auth_update || this.auth_audit || this.auth_view ? this.tableColumns.concat([{
                    title: '操作',
                    width: 350,
                    align: 'center',
                    fixed: 'right',
                    render: (h, params) => {
                        let list = [];

                        list.push(h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small',
                                icon: 'ios-create-outline'
                            },
                            on: {
                                click: () => {
                                    if (params.row.handleStatus === 'submitted' || params.row.handleStatus === 'replenish') {
                                        this.isView = false;
                                    }
                                    else {
                                        this.isView = true;
                                    }
                                    this.currentProject.projectId = params.row.projectId;
                                    this.modal_edit = true;
                                }
                            }
                        }, '查看'));

                        if ((params.row.handleStatus === 'submitted'
                            || params.row.handleStatus === 'replenish')
                            && this.auth_add) {
                            list.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'md-checkmark-circle'
                                },
                                on: {
                                    click: () => {
                                        this.currentProject.projectId = params.row.projectId;
                                        this.$Modal.confirm({
                                            title: '提交审核',
                                            content: `确定要提交审核<${params.row.projectName}>项目`,
                                            okText: '提交审核',
                                            onOk: () => {
                                                this.$http({
                                                    method: 'get',
                                                    url: '/projectAudit/handoverSubmit',
                                                    params:{
                                                        projectId: params.row.projectId,
                                                        handoverRecordId: params.row.handoverRecordId
                                                    }
                                                }).then(res => {
                                                    if (res.code === 'SUCCESS') {
                                                        this.$Message.success('提交审核成功!');
                                                        this.getData();
                                                        this.currentProject.projectId = '';
                                                        this.currentProject.auditProcessId = '';
                                                        this.currentProject.processStepId = '';
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }
                            }, '提交审核'));
                        }

                        // 受理材料待审核才能审核  并且还没进流程
                        if (params.row.handleStatus === 'handle'
                            && !params.row.auditProcessId
                            && this.auth_audit) {
                            list.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'ios-document'
                                },
                                on: {
                                    click: () => {
                                        this.currentProject.projectId = params.row.projectId;
                                        this.currentProject.handoverRecordId = params.row.handoverRecordId;
                                        this.modal_contentAudit = true;
                                    }
                                }
                            }, '材料完整性审核'));
                        }

                        // 办理状态(handleStatus)是办理中, 并且有审核流程步骤(auditProcessId 和 processStepId)
                        if (params.row.handleStatus === 'handle'
                            && params.row.auditProcessId
                            && params.row.processStepId
                            && this.auth_update) {
                            list.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'ios-create-outline'
                                },
                                on: {
                                    click: () => {
                                        this.currentProject.projectId = params.row.projectId;
                                        this.currentProject.handoverRecordId = params.row.handoverRecordId;
                                        this.currentProject.auditProcessId = params.row.auditProcessId || '';
                                        this.currentProject.processStepId = params.row.processStepId || '';
                                        this.$refs.modal_handleAudit.modalValue = true;

                                        // this.handleLabelCheck(params.row);
                                    }
                                }
                            }, '处理标签审核'));
                        }

                        // 下发工程交工质量核验意见

                        if (params.row.handleStatus === 'handle'
                            && params.row.auditProcessId
                            && !params.row.processStepId
                            && this.auth_update) {

                            list.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'ios-create-outline'
                                },
                                on: {
                                    click: () => {
                                        this.currentProject.projectId = params.row.projectId;
                                        this.$refs.modal_sendProjectFiles.modalValue = true;
                                    }
                                }
                            }, '下发工程交工质量核验意见'));
                        }

                        return h('div', {
                            class: 'ivx-table-cell-handle'
                        }, list);

                    }
                }]) : this.tableColumns;
            }
        },
        data() {
            return {
                searchParams: {},
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '项目名称', width: 180, align: 'center', key: 'projectName' },
                    { title: '标段', width: 180, align: 'center', key: 'part' },
                    { title: '分段交工描述', width: 180, align: 'center', key: 'description' },
                    { title: '地区', width: 180, align: 'center',
                        render: (h, params) => {
                            let str = '';
                            str += params.row.provinceStr || '';
                            str += params.row.cityStr || '';
                            str += params.row.countyStr || '';

                            return h('div', str);
                        } },
                    { title: '项目类型', width: 180, align: 'center', key: 'projectTypeLabel' },
                    { title: '办理状态', width: 180, align: 'center', key: 'handleStatusLabel' },
                    { title: '交工质量检测意见书', width: 180, align: 'center',
                        render: (h, params) => {
                            return h('div', params.row.handoverOpinion === '1' ? '已发送' : '未发送');
                        }
                    },
                    { title: '核验意见编号', width: 180, align: 'center', key: 'handoverOpinionNo' },
                    { title: '整改状态', width: 180, align: 'center', key: 'changeStatusLabel' }

                ],
                tableData: [],
                tableLoading: false,

                // 当前查看的项目
                currentProject: {
                    projectId: '',
                    handoverRecordId: '',
                    auditProcessId: '',
                    processStepId: ''
                },

                // 编辑交工项目
                isView: false,
                modal_edit: false,

                // 材料完整性审核
                modal_contentAudit: false,
            };
        },
        watch: {
            projectId(val) {
                this.getData();
            }
        },
        methods: {
            // 获取表格数据
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'get',
                    url: '/handoverRecord/list',
                    params: {
                        projectId: this.projectId
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

            // 编辑交工项目返回
            modal_edit_callback() {
                this.modal_edit = false;
            },
            // 材料完整性审核
            modal_callback_contentAudit() {
                this.getData();
                this.currentProject.projectId = '';
                this.currentProject.handoverRecordId = '';
                this.currentProject.auditProcessId = '';
                this.currentProject.processStepId = '';
                this.modal_contentAudit = false;
            },

            // 处理标签审核
            // 审核通过
            modal_auditPass_callback() {
                this.currentProject.projectId = '';
                this.currentProject.handoverRecordId = '';
                this.currentProject.auditProcessId = '';
                this.currentProject.processStepId = '';
                this.getData();
            },

            // 下发交工申请核查意见书 回调
            modal_sendProjectFiles_callback() {
                this.currentProject.projectId = '';
                this.currentProject.handoverRecordId = '';
                this.getData();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .subsection-container {
    }
</style>