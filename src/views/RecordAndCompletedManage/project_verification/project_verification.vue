<template>
    <div class="project_verification-container">
        <vIvxFilterBox>
            <Button type="primary"
                    icon="md-add"
                    @click="modal_add_open">交工验收申请登记</Button>
        </vIvxFilterBox>

        <vIvxFilterBox dashed>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.condition.searchKey"
                           style="width: 220px;"
                           placeholder="请输入"/>
                </FormItem>
            </Form>
        </vIvxFilterBox>

        <vIvxFilterBox>
            <Form inline>
                <FormItem label="筛选条件:" :label-width="65">
                    <RadioGroup v-model="searchParams.condition.handleStatus" type="button">
                        <Radio label="">全部</Radio>
                        <Radio v-for="(item, idx) in dict_handleStatus"
                               :label="item.value" :key="'handleStatus_' + idx">{{item.label}}</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </vIvxFilterBox>

        <div class="ivx-table-box">
            <Table border
                   :height="540"
                   :loading="tableLoading"
                   :columns="tableColumns"
                   :data="tableData"></Table>
            <Page prev-text="上一页"
                  next-text="下一页"
                  show-total
                  :current="searchParams.current"
                  :page-size="searchParams.size"
                  :total="searchParams.total"
                  @on-change="onPageChange"></Page>
        </div>

        <!--交工项目选择-->
        <!--<vHandleProjectSelect ref="modal_handleProjectSelect" @modal-callback="modal_selectProject_callback"></vHandleProjectSelect>-->
        <Modal v-model="modal_projectSelect"
               title="选择项目"
               :width="400">
            <Form>
                <FormItem label="项目：" :label-width="60">
                    <Select v-model="currentProject.projectId" filterable>
                        <Option v-for="item in projectList"
                                :value="item.projectId"
                                :key="item.projectId" :label="`${item.projectName}(${item.part})`"></Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary"
                        size="large"
                        @click="onClick_add">添加</Button>
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
                           @modal_callback="modal_callback_contentAudit"></vContentAudit>
        </Modal>

        <!--处理标签审核-->
        <vHandleAudit ref="modal_handleAudit"
                      :projectId="currentProject.projectId"
                      :auditProcessId="currentProject.auditProcessId"
                      :processStepId="currentProject.processStepId"
                      @modal-auditPass-callback="modal_auditPass_callback"></vHandleAudit>

    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vProjectVerification_apply from './edit/projectVerification_apply';
    import vContentAudit from './content-audit/content-audit';
    import vHandleAudit from './handleAudit/handleAudit';
    import authMixin from '../../../lib/mixin/authMixin'
    import MOMENT from 'moment';
    export default {
        name: 'project_verification',   // 交工检测核验
        mixins: [authMixin],
        components: {
            vIvxFilterBox,
            vProjectVerification_apply,
            vContentAudit,
            vHandleAudit
        },
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        searchKey: '',      // 模糊查询参数
                        handleStatus: ''
                    }
                },
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '项目名称', width: 180, align: 'center', key: 'projectName' },
                    { title: '标段', width: 180, align: 'center', key: 'part' },
                    { title: '地区', width: 180, align: 'center',
                        render: (h, params) => {
                            let str = '';
                            str += params.row.provinceStr || '';
                            str += params.row.cityStr || '';
                            str += params.row.countyStr || '';

                            return h('div', str);
                        } },
                    { title: '项目类型', width: 180, align: 'center', key: 'projectTypeLabel' },
                    { title: '技术等级', width: 180, align: 'center', key: 'technicalLevelLabel' },

                    { title: '项目里程(km)', width: 180, align: 'center', key: 'mileage' },
                    { title: '路面类型', width: 180, align: 'center', key: 'structureTypeLabel' },
                    { title: '工程性质', width: 180, align: 'center', key: 'projectPropertyLabel' },
                    { title: '投资额(万元)', width: 180, align: 'center', key: 'amount' },
                    { title: '施工合同金额(万元)', width: 180, align: 'center', key: 'constructAmount' },
                    { title: '监理合同金额(万元)', width: 180, align: 'center', key: 'supervisorAmount' },
                    { title: '计划开工时间', width: 180, align: 'center', key: 'planBeginTime',
                        render(h, params) {
                            return h('div', MOMENT(params.row.planBeginTime).format('YYYY-MM-DD'));
                        }
                    },
                    { title: '计划交工时间', width: 180, align: 'center', key: 'planEndTime',
                        render(h, params) {
                            return h('div', MOMENT(params.row.planEndTime).format('YYYY-MM-DD'));
                        }
                    },
                    // { title: '收件日期', width: 180, align: 'center', key: '' },

                    { title: '联系人', width: 180, align: 'center', key: 'contacts' },
                    { title: '联系方式', width: 180, align: 'center', key: 'contactPhone' },
                    { title: '项目状态', width: 180, align: 'center', key: 'projectStatusLabel' },
                    // { title: '流程状态', width: 180, align: 'center', key: '' },
                    { title: '办理状态', width: 180, align: 'center', key: 'handleStatusLabel' },
                    { title: '交工质量检测意见书', width: 180, align: 'center',
                        render: (h, params) => {
                            return h('div', params.row.handoverOpinion === '1' ? '已发送' : '未发送');
                        }
                    },
                    { title: '核验意见编号', width: 180, align: 'center', key: 'handoverOpinionNo' },
                    { title: '整改状态', width: 180, align: 'center', key: 'changeStatusLabel' },
                    { title: '监督负责人', width: 180, align: 'center', key: '' },
                    { title: '监督成员', width: 180, align: 'center', key: '' },
                    {
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

                            if ((params.row.handleStatus === 'submitted' || params.row.handleStatus === 'replenish') && this.auth_add) {
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
                                                            projectId: params.row.projectId
                                                        }
                                                    }).then(res => {
                                                        if (res.code === 'SUCCESS') {
                                                            this.$Message.success('提交审核成功!');
                                                            this.getData();
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
                                && this.auth_audit
                                && params.row.projectStatus === 'handover_apply' ) {
                                list.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-document'
                                    },
                                    on: {
                                        click: () => {
                                            this.currentProject.projectId = params.row.projectId;
                                            this.modal_contentAudit = true;
                                        }
                                    }
                                }, '材料完整性审核'));
                            }

                            // 办理状态(handleStatus)是办理中, 并且有审核流程步骤(auditProcessId 和 processStepId)
                            if (params.row.handleStatus === 'handle'
                                && params.row.auditProcessId
                                && params.row.processStepId
                                && params.row.projectStatus === 'handover_apply') {
                                list.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-create-outline'
                                    },
                                    on: {
                                        click: () => {
                                            this.currentProject.projectId = params.row.projectId;
                                            this.currentProject.auditProcessId = params.row.auditProcessId || '';
                                            this.currentProject.processStepId = params.row.processStepId || '';
                                            this.$refs.modal_handleAudit.modalValue = true;

                                            // this.handleLabelCheck(params.row);
                                        }
                                    }
                                }, '处理标签审核'));
                            }

                            return h('div', {
                                class: 'ivx-table-cell-handle'
                            }, list);

                        }
                    }
                ],
                tableData: [],
                tableLoading: true,

                // 字典
                dict_handleStatus: [],

                // 选择用于交工的项目列表
                modal_projectSelect: false,
                projectList: [],

                // 当前查看的项目
                currentProject: {
                    projectId: '',
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
            'searchParams.current'() {
                this.getData();
            },
            'searchParams.condition': {
                deep: true,
                handler() {
                    this.getData();
                }
            }
        },
        mounted() {
            this.getProjectList();
            this.getData();
            this.getDict();
        },
        methods: {
            getDict() {
                this.$http({
                    method: 'get',
                    url: '/dict/getListByType',
                    params: {
                        type: 'handleStatus'
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.dict_handleStatus = res.data;
                    }
                })
            },

            // 获取交工项目列表
            getProjectList() {
                this.$http({
                    method: 'get',
                    url: '/projectAudit/chooseProjectListForHandover'
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.projectList = res.data || [];
                    }
                })
            },

            /**
             * 分页控件-切换页面
             * @param current
             */
            onPageChange(current) {
                this.searchParams.current = current;
            },
            // 获取表格数据
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/projectAudit/listForHandover',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records;
                        this.searchParams.total = res.data.total;
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            },

            // 交工验收审核登记, 选择项目
            modal_add_open() {
                this.currentProject.projectId = '';
                this.modal_projectSelect = true;
            },
            // 登记添加项目
            onClick_add() {
                this.$http({
                    method: 'get',
                    url: '/projectAudit/handoverRegister',
                    params: {
                        projectId: this.currentProject.projectId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.isView = false;
                        this.modal_projectSelect = false;
                        this.modal_edit = true;
                        this.getData();
                        this.getProjectList();
                    }
                });
            },
            // 编辑交工项目返回
            modal_edit_callback() {
                this.modal_edit = false;
            },
            // 材料完整性审核
            modal_callback_contentAudit() {
                this.getData();
                this.currentProject.projectId = '';
                this.currentProject.auditProcessId = '';
                this.currentProject.processStepId = '';
                this.modal_contentAudit = false;
            },

            // 处理标签审核
            // 审核通过
            modal_auditPass_callback() {
                this.getData();
            },

            // 审核通过
            pass(row) {
                this.$Modal.confirm({
                    title: '审核',
                    content: `确认要<${row.name}>通过审核?`,
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/',
                            params: {
                                // safeNoticeId: row.safeNoticeId
                            }
                        }).then((res) => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('通过审核成功!');
                                this.getData();
                            }
                        });
                    }
                })
            },
            // 审核不通过
            noPass(row) {
                this.$Modal.confirm({
                    title: '审核',
                    content: `确认要<${row.name}>不通过审核?`,
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/',
                            params: {
                                // safeNoticeId: row.safeNoticeId
                            }
                        }).then((res) => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('审核不通过成功!');
                                this.getData();
                            }
                        });
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .project_verification-container {
    }
</style>