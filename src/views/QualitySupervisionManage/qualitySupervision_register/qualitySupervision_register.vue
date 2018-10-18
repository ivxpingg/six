<template>
    <div class="qualitySupervision_register-container">
        <vIvxFilterBox>
            <Button v-if="auth_add"
                    type="primary"
                    icon="md-add"
                    @click="modal_add_open">登记项目</Button>

            <Button v-if="auth_audit"
                    type="primary"
                    icon="ios-notifications"
                    @click="modal_noticeModification_open">整改通知</Button>
        </vIvxFilterBox>

        <vIvxFilterBox dashed>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.condition.projectName"
                           style="width: 220px;"
                           placeholder="项目名称"/>
                </FormItem>
            </Form>
        </vIvxFilterBox>

        <vIvxFilterBox>
            <Form inline>
                <FormItem label="筛选条件:" :label-width="65">
                    <RadioGroup v-model="searchParams.condition.handleStatus" type="button">
                        <Radio label="">全部</Radio>
                        <Radio v-for="item in dict_handleStatus"
                               :label="item.value" :key="'handleStatus_' + item.id">{{item.label}}</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </vIvxFilterBox>

        <div class="ivx-table-box">
            <Table border
                   height="540"
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
        <!--质量监督登记-->
        <Modal v-model="modal_add"
               class-name="modal-body-padding0"
               title="质量监督登记"
               :width="1200"
               @on-visible-change="onVisibleChange_add"
               footer-hide>
            <div style="height: 650px;">
                <vAdd v-if="modal_add"
                      @modal_callback="modal_addProject_callback"></vAdd>
            </div>
        </Modal>
        <!--质量监督登记-->
        <Modal v-model="modal_edit"
               class-name="modal-body-padding0"
               title="质量监督登记"
               :width="1200"
               @on-visible-change="onVisibleChange_edit"
               footer-hide>
            <div style="height: 650px;">
                <vEdit v-if="modal_edit"
                       @modal_callback="modal_updateProject_callback"
                       :projectId="projectId"></vEdit>
            </div>
        </Modal>
        <!--提交审核-->
        <Modal v-model="modal_audit"
               title="提交审核"
               :width="450"
               footer-hide>
            <vProjectAudit :projectId="projectId" @modal_callback="modal_callback_audit"></vProjectAudit>
        </Modal>
        <!--材料完整性审核-->
        <Modal v-model="modal_contentAudit"
               class-name="modal-body-padding0"
               title="材料完整性审核"
               :width="1200"
               footer-hide>
            <vContentAudit :projectId="projectId"
                           :processStepId="processStepId"
                           :auditProcessId="auditProcessId"
                           @modal_callback="modal_callback_contentAudit"></vContentAudit>
        </Modal>

        <!--整改通知-->
        <Modal v-model="modal_noticeModification"
               title="整改通知"
               :width="1000"
               footer-hide>
            <vNoticeModification
                    :projectId="projectId"
                    :tableData="tableData"
                    @modal_callback="modal_callback_noticeModification"></vNoticeModification>
        </Modal>


    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import authMixin from '../../../lib/mixin/authMixin';
    import vAdd from './add/add';
    import vEdit from './edit/qualitySupervision_register_edit';
    import vProjectAudit from './audit/project_audit';
    import vContentAudit from './content-audit/content-audit';
    import vNoticeModification from './noticeModification/noticeModification';
    export default {
        name: 'qualitySupervision_register',  // 质量监督登记
        mixins: [authMixin],
        components: {vIvxFilterBox, vAdd, vEdit, vProjectAudit, vContentAudit, vNoticeModification},
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        projectName: '',      // 模糊查询参数
                        handleStatus: ''
                    }
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
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
                    { title: '建设单位', width: 180, align: 'center', key: 'buildUnitStr' },
                    { title: '技术等级', width: 180, align: 'center', key: 'technicalLevelLabel' },
                    { title: '项目里程(km)', width: 180, align: 'center', key: 'mileage' },
                    // { title: '路面类型', width: 180, align: 'center', key: '' },
                    { title: '工程性质', width: 180, align: 'center', key: 'projectPropertyLabel' },
                    { title: '投资额(万元)', width: 180, align: 'center', key: 'amount' },
                    { title: '施工合同金额(万元)', width: 180, align: 'center', key: 'constructAmount' },
                    { title: '监理合同金额(万元)', width: 180, align: 'center', key: 'supervisorAmount' },
                    { title: '计划开工时间', width: 180, align: 'center', key: 'planBeginTime' },
                    { title: '计划交工时间', width: 180, align: 'center', key: 'planEndTime' },
                    { title: '施工单位', width: 180, align: 'center', key: 'constructUnitStr' },
                    { title: '监理单位', width: 180, align: 'center', key: 'supervisorUnitStr' },
                    // TODO 收件日期
                    // { title: '收件日期', width: 180, align: 'center', key: '' },
                    { title: '联系人', width: 180, align: 'center', key: 'contacts' },
                    { title: '联系方式', width: 180, align: 'center', key: 'contactPhone' },
                    { title: '项目状态', width: 180, align: 'center', key: 'projectStatusLabel' },
                    // TODO 流程状态
                    // { title: '流程状态', width: 180, align: 'center', key: '' },
                    { title: '办理状态', width: 180, align: 'center', key: 'handleStatusLabel' },
                    { title: '受理通知书', width: 180, align: 'center', key: 'acceptNotice' },
                    { title: '整改状态', width: 180, align: 'center', key: 'changeStatusLabel' },
                    { title: '受理日期', width: 180, align: 'center', key: 'acceptDate' },
                    { title: '不予受理日期', width: 180, align: 'center', key: 'noAcceptDate' },
                    { title: '不予受理备注', width: 180, align: 'center', key: 'noAcceptRemark' },
                    {
                        title: '操作',
                        width: 330,
                        align: 'center',
                        fixed: 'right',
                        render: (h, params) => {
                            let list = [];
                            list.push(h('Button', {
                                props: {
                                    type: 'info',
                                    size: 'small',
                                    icon: 'ios-eye-outline'
                                },
                                on: {
                                    click: () => {
                                        this.projectId = params.row.projectId;
                                        this.modal_edit = true;
                                    }
                                }
                            }, '查看'));

                            if (this.auth_add) {
                                list.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'md-checkmark-circle'
                                    },
                                    on: {
                                        click: () => {
                                            this.projectId = params.row.projectId;
                                            this.modal_audit = true;
                                        }
                                    }
                                }, '提交审核'));
                            }

                            // 受理材料待审核才能审核
                            if (params.row.projectStatus === 'to_examine' && this.auth_add) {
                                list.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-document'
                                    },
                                    on: {
                                        click: () => {
                                            this.projectId = params.row.projectId;
                                            this.processStepId = params.row.processStepId || '';
                                            this.auditProcessId = params.row.auditProcessId || '';
                                            this.modal_contentAudit = true;
                                        }
                                    }
                                }, '材料完整性审核'));
                            }

                            // 设置列宽度
                            return h('div',{
                                style: {

                                },
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }

                ],
                tableData: [
                    // {
                    //     projectId: '12',
                    //     name: '霍邱县S310霍邱至众兴路一级公路改建工程',      // 项目名称
                    //     part: '毛岔河段',      // 标段
                    //     province: '',  // 省
                    //     provinceStr: '河南省',
                    //     city: '',      // 市
                    //     cityStr: '六安市',
                    //     county: '',    // 区
                    //     countyStr: '',
                    //     projectType: '',    // 项目类型
                    //     projectTypeLabel: '公路',    // 项目类型
                    //     buildUnit: '六安市公路管理局',      // 建设单位
                    //     buildUnitStr: '六安市公路管理局',
                    //     technicalLevel: '',          // 技术等级
                    //     technicalLevelLabel: '二级',
                    //     mileage: 10.2,      // 项目里程(km)
                    //     projectProperty: 'new', // 工程性质
                    //     projectPropertyLabel: '新建',   // 工程性质
                    //     amount: 1.251,       // 投资额(万元)
                    //     constructAmount: 1256.1,  // 施工合同金额(万元)
                    //     supervisorAmount: 14686.25, // 监理合同金额(万元)
                    //     planBeginTime: '2018-10-01',      // 计划开工时间
                    //     planEndTime: '2019-05-05',        // 计划交工时间
                    //     constructUnit: '0125',       // 施工单位
                    //     constructUnitStr: '中铁二局',
                    //     supervisorUnit: '01',      // 监理单位
                    //     supervisorUnitStr: '中铁三局',   //
                    //     contacts: '陈总经理',            // 联系人
                    //     contactPhone: '13959260199',       // 联系电话/联系方式
                    //     projectStatus: 'to_examine',      // 项目状态
                    //     projectStatusLabel: '受理材料待核查',
                    //     handleStatus: 'submitted',           // 办理状态
                    //     handleStatusLabel: '待提交',
                    //     acceptNotice: '未发送',       // 受理通知书
                    //     changeStatus: 'issue',           // 整改状态
                    //     changeStatusLabel: '已下发整改通知',
                    //     acceptDate: '2018-10-01',         // 受理日期
                    //     noAcceptDate: '2018-10-01',      // 不予受理日期
                    //     noAcceptRemark: '备注'     // 不予受理备注
                    // }
                ],
                tableLoading: false,

                projectId: '',
                processStepId: '',
                auditProcessId: '',
                // 办理状态
                dict_handleStatus: [],
                // 登记项目
                modal_add: false,
                // 通知整改
                modal_noticeModification: false,
                // 编辑项目
                modal_edit: false,
                // 提交审核
                modal_audit: false,
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
            this.getData();
            this.getDict_handleStatus();
        },
        methods: {
            // 获取单位类别的数据字典
            getDict_handleStatus() {
                this.$http({
                    method: 'get',
                    url: '/dict/getListByType',
                    params: {
                        type: 'handleStatus'
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.dict_handleStatus = res.data;
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
                    url: '/project/list',
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

            //
            modal_add_open() {
                this.modal_add = true;
            },
            modal_noticeModification_open() {
                this.modal_noticeModification = true;
            },
            // 项目登记弹出框回调
            modal_addProject_callback() {
                this.modal_add = false;
                this.getData();
            },
            modal_updateProject_callback() {
                this.getData();
            },
            // 项目登记弹出框 显示状态发生变化时触发
            onVisibleChange_add(value) {

            },
            // 项目登记弹出框 显示状态发生变化时触发
            onVisibleChange_edit(value) {

            },
            // 提交审核
            modal_callback_audit() {
                this.getData();
            },
            // 材料完整性审核
            modal_callback_contentAudit() {

            },
            // 通知整改
            modal_callback_noticeModification() {}
        }
    }
</script>

<style lang="scss" scoped>
    .qualitySupervision_register-container {
    }
</style>