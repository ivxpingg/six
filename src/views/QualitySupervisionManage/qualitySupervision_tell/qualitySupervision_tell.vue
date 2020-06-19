<template>
    <div class="qualitySupervision_tell-container">
        <!--<vIvxFilterBox dashed>-->
            <!--<Button type="primary"-->
                    <!--icon="md-document"-->
                    <!--@click="modalLogView('advance_notice')">查看日志</Button>-->
        <!--</vIvxFilterBox>-->
        <vIvxFilterBox style="position: relative;">
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.condition.projectName"
                           style="width: 220px;"
                           placeholder="项目名称"/>
                </FormItem>
            </Form>

            <Button type="primary" style="position: absolute; top: 0; right: 10px;" @click="onClick_switch">{{historyView ? '受理及交底' : '查看记录'}}</Button>
        </vIvxFilterBox>

        <div class="ivx-table-box" v-if="!historyView">
            <Table border
                   :height="540"
                   :loading="tableLoading"
                   :columns="_tableColumns"
                   :data="tableData"></Table>
            <Page prev-text="上一页"
                  next-text="下一页"
                  show-total
                  :current="searchParams.current"
                  :page-size="searchParams.size"
                  :total="searchParams.total"
                  @on-change="onPageChange"></Page>
        </div>

        <div class="ivx-table-box" v-if="historyView">
            <Table border
                   :height="540"
                   :loading="tableLoading"
                   :columns="_tableColumns_history"
                   :data="tableData_history"></Table>
            <Page prev-text="上一页"
                  next-text="下一页"
                  show-total
                  :current="searchParams.current"
                  :page-size="searchParams.size"
                  :total="searchParams.total"
                  @on-change="onPageChange"></Page>
        </div>

        <!--查看附件-->
        <vViewFiles ref="modal_viewFiles" :data="filesData"></vViewFiles>

        <!--添加质量监督交底-->
        <vAddSupervisionTell ref="modal_addSupervisionTell"
                             :projectId="currentRow.projectId"
                             :projectName="currentRow.projectName"
                             @modal-callback="modal_callback_addSupervisionTell"></vAddSupervisionTell>

        <!--整改通知-->
        <vNoticeModification ref="modal_noticeModification"
                             :projectId="currentRow.projectId"
                             :projectName="currentRow.projectName"
                             :advanceNoticeId="currentRow.advanceNotice.advanceNoticeId"
                             @modal-callback="modal_noticeModification_callback"></vNoticeModification>

        <!--整改回复-->
        <vNoticeReply ref="modal_noticeReply"
                      :projectId="currentRow.projectId"
                      :projectName="currentRow.projectName"
                      :changeNoticeId="currentRow.changeNotice.changeNoticeId"
                      :changeStatus="currentRow.changeNotice.changeStatus"
                      @modal-callback="modal_noticeReply_callback"></vNoticeReply>

        <!--查看日志-->
        <vModalLogView ref="modalLogView" :logType="six_logType" ></vModalLogView>

        <!--项目材料复核-->
        <Modal v-model="modal_projectCheck"
               class-name="modal-body-padding0"
               title="项目材料复核"
               :width="1200">
            <div style="height: 650px;">
                <vProjectCheck v-if="modal_projectCheck"
                       :projectId="currentRow.projectId"></vProjectCheck>
            </div>
            <div slot="footer" v-if="currentRow.projectFileOpinion !== '1'">
                <Button type="primary"
                        size="large"
                        icon="ios-send"
                        @click="openSendCheckFile">下发核查意见书</Button>
            </div>
        </Modal>

        <!--下发核查意见书-->
        <Modal title="下发核查意见书" v-model="modal_sendCheckFile">
            <Form ref="form"
                  :model="sendCheckFileForm"
                  :rules="rules"
                  :label-width="100">
                <FormItem label="核查意见书：" prop="fileId">
                    <div style="width: 350px;"><vFilesSelectButton @modal-callback="onSelect"
                                                                   :projectId="currentRow.projectId"
                                                                   :fileType="'monitor_procedure'" multiple></vFilesSelectButton></div>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" @click="sendCheckFile">确定</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vViewFiles from '../../Common/viewFiles/viewFiles';
    import vAddSupervisionTell from './add/addSupervisionTell';
    import vNoticeModification from './noticeModification/noticeModification';
    import vNoticeReply from './noticeReply/noticeReply.vue';
    import MOMENT from 'moment';
    import logViewMixin from '../../Common/logView/mixin';
    import vProjectCheck from './projectCheck/projectCheck';
    import vFilesSelectButton from '../../Common/filesSelect/filesSelectButton.vue';
    import authMixin from '../../../lib/mixin/authMixin';
    export default {
        name: 'qualitySupervision_tell',
        mixins: [logViewMixin, authMixin],
        components: {
            vIvxFilterBox,
            vViewFiles,
            vAddSupervisionTell,
            vNoticeModification,
            vNoticeReply,
            vProjectCheck,
            vFilesSelectButton},
        computed: {
            _tableColumns() {
                return this.auth_update ? this.tableColumns.concat([{
                    title: '操作',
                    width: 450,
                    align: 'center',
                    fixed: 'right',
                    render: (h, params) => {
                        let list = [];

                        if(params.row.chargeFlag) {  // 如果是负责人
                            list.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'md-send'
                                },
                                on: {
                                    click: () => {
                                        this.currentRow.projectId = params.row.projectId;
                                        this.currentRow.projectName = params.row.projectName;
                                        this.currentRow.projectFileOpinion = params.row.projectFileOpinion;
                                        this.modal_projectCheck = true;
                                    }
                                }
                            }, '项目材料复核'));
                        }

                        if ( params.row.chargeFlag) {
                            if (!params.row.advanceNotice) {
                                list.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'md-add'
                                    },
                                    on: {
                                        click: () => {
                                            this.currentRow.projectId = params.row.projectId;
                                            this.currentRow.projectName = params.row.projectName;
                                            this.$refs.modal_addSupervisionTell.modalValue = true;
                                        }
                                    }
                                }, '备案核查'));
                            }
                            else {
                                list.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'md-done-all'
                                    },
                                    on: {
                                        click: () => {
                                            this.currentRow.projectId = params.row.projectId;
                                            this.tellComplete(params.row);
                                        }
                                    }
                                }, '交底完成'));
                            }

                            // 出现条件
                            // 1.监督交底添加完，只能添加一次整改通知
                            if ((params.row.advanceNotice && !params.row.changeNotice) || (params.row.changeNotice && params.row.changeNotice.changeStatus === 'pass')) {
                                list.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-notifications'
                                    },
                                    on: {
                                        click: () => {
                                            this.currentRow.projectId = params.row.projectId;
                                            this.currentRow.projectName = params.row.projectName;
                                            this.currentRow.advanceNotice.advanceNoticeId = params.row.advanceNotice.advanceNoticeId;

                                            this.$refs.modal_noticeModification.modalValue = true;
                                        }
                                    }
                                }, '整改通知'));
                            }

                            if (params.row.changeNotice) {
                                list.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-undo'
                                    },
                                    on: {
                                        click: () => {
                                            this.currentRow.projectId = params.row.projectId;
                                            this.currentRow.projectName = params.row.projectName;
                                            this.currentRow.changeNotice.changeNoticeId = params.row.changeNotice.changeNoticeId || '';
                                            this.currentRow.changeNotice.changeStatus = params.row.changeNotice.changeStatus || '';
                                            this.$refs.modal_noticeReply.modalValue = true;
                                        }
                                    }
                                }, '查看整改回复'));
                            }

                        }

                        if (params.row.advanceNotice && params.row.advanceNotice.advanceNoticeId) {
                            list.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'ios-eye-outline'
                                },
                                on: {
                                    click: () => {
                                        this.currentRow.projectId = params.row.projectId;
                                        this.getFilesData(params.row);
                                    }
                                }
                            }, '查看附件'));
                        }

                        // 设置列宽度
                        return h('div',{
                            style: {

                            },
                            class: 'ivx-table-cell-handle'
                        },list);
                    }
                }]) : this.tableColumns;
            },
            _tableColumns_history() {
                return this.tableColumns.concat([{
                    title: '操作',
                    width: 150,
                    align: 'center',
                    fixed: 'right',
                    render: (h, params) => {
                        let list = [];
                        if (params.row.advanceNotice && params.row.advanceNotice.advanceNoticeId) {
                            list.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'ios-eye-outline'
                                },
                                on: {
                                    click: () => {
                                        this.currentRow.projectId = params.row.projectId;
                                        this.getFilesData(params.row);
                                    }
                                }
                            }, '查看附件'));
                        }

                        // 设置列宽度
                        return h('div',{
                            style: {

                            },
                            class: 'ivx-table-cell-handle'
                        },list);
                    }
                }]);
            }
        },
        data() {
            return {
                historyView: false,
                tableData_history: [],

                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        projectName: '',      // 模糊查询参数
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
                    { title: '技术等级', width: 180, align: 'center', key: 'technicalLevelLabel' },
                    { title: '项目里程(km)', width: 180, align: 'center', key: 'mileage' },
                    // { title: '路面类型', width: 180, align: 'center', key: '' },
                    { title: '工程性质', width: 180, align: 'center', key: 'projectPropertyLabel' },
                    { title: '投资额(万元)', width: 180, align: 'center', key: 'amount' },
                    { title: '施工合同金额(万元)', width: 180, align: 'center', key: 'constructAmount' },
                    { title: '监理合同金额(万元)', width: 180, align: 'center', key: 'supervisorAmount' },
                    { title: '计划开工时间', width: 180, align: 'center', key: 'planBeginTime',
                        render(h, params) {
                            return h('div', params.row.planBeginTime ? MOMENT(params.row.planBeginTime).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '计划交工时间', width: 180, align: 'center', key: 'planEndTime',
                        render(h, params) {
                            return h('div', params.row.planEndTime ? MOMENT(params.row.planEndTime).format('YYYY-MM-DD') : '');
                        }
                    },
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
                    { title: '受理日期', width: 180, align: 'center', key: 'acceptDate',
                        render(h, params) {
                            return h('div', params.row.acceptDate ? MOMENT(params.row.acceptDate).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '不予受理日期', width: 180, align: 'center', key: 'noAcceptDate',
                        render(h, params) {
                            return h('div', params.row.noAcceptDate ? MOMENT(params.row.noAcceptDate).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '不予受理备注', width: 180, align: 'center', key: 'noAcceptRemark' },

                ],
                tableData: [],
                tableLoading: false,
                // 当前选择的项目信息
                currentRow: {
                    projectId: '',
                    projectName: '',
                    projectFileOpinion: '',
                    changeNotice: {   // 整改通知
                        changeNoticeId: ''
                    },
                    advanceNotice: {  // 上传监督交底
                        advanceNoticeId: '',
                        changeStatus: ''
                    }
                },
                // 查看附件
                filesData: [],

                // 项目材料复核
                modal_projectCheck: false,
                modal_sendCheckFile: false,
                sendCheckFileForm: {
                    fileId: ''
                },
                rules: {
                    fileId: [{ required: true, message: '请上传核查意见书！', trigger: 'blur' }]
                }
            };
        },
        watch: {
            'searchParams.current'() {
                this.historyView ? this.getDataHistory() : this.getData();
            },
            'searchParams.condition': {
                deep: true,
                handler() {
                    this.historyView ? this.getDataHistory() : this.getData();
                }
            }
        },
        mounted() {
            this.getData();
            this.getDataHistory();
        },
        methods: {
            onClick_switch() {
                this.searchParams.current = 1;
                this.historyView = !this.historyView;
                this.historyView ? this.getDataHistory() : this.getData();
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
                    url: '/projectAudit/listForDisclose',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records || [];
                        this.searchParams.total = res.data.total;
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            },

            getDataHistory() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/project/list',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData_history = res.data.records;
                        this.searchParams.total = res.data.total;
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            },

            // 分配监督小组
            modal_callback_superviseTeamManage() {},

            // 查看附件
            getFilesData(row) {
                // TODO 获取监督交底的附件列表

                this.$http({
                    method: 'get',
                    url: '/file/attachList',
                    params: {
                        relationId: row.advanceNotice.advanceNoticeId,
                        fileType: 'acceptance'
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.filesData = res.data || [];
                        this.$refs.modal_viewFiles.modalValue = true;
                    }
                })

            },

            // 添加质量监督交底 回调
            modal_callback_addSupervisionTell() {
                this.$refs.modal_addSupervisionTell.modalValue = false;
                this.getData();
            },

            // 交底完成
            tellComplete(row) {
                this.$Modal.confirm({
                   title: '提示',
                    content: '确定交底完成？交底完成后监督受理通知书、监督计划等将会发送给相关单位。',
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/projectAudit/advanceNoticeComplete',
                            params: {
                                projectId: row.projectId,
                                advanceNoticeId: row.advanceNotice.advanceNoticeId
                            }
                        }).then((res) => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('交底完成！');
                                this.getData();
                            }
                        })
                    }
                });
            },
            modal_noticeModification_callback() {
                this.$refs.modal_noticeModification.modalValue = false;
                this.getData();
            },
            modal_noticeReply_callback() {
                this.resetData();
                this.$refs.modal_noticeReply.modalValue = false;
                this.getData();
            },
            resetData() {
                Object.assign(this.currentRow, {
                    projectId: '',
                    projectName: '',
                    changeNotice: {   // 整改通知
                        changeNoticeId: ''
                    },
                    advanceNotice: {  // 上传监督交底
                        advanceNoticeId: '',
                        changeStatus: ''
                    }
                });
            },
            // 打开下发核查意见书
            openSendCheckFile() {
                this.modal_projectCheck = false;
                this.modal_sendCheckFile = true;
            },
            // 下发核查意见书
            sendCheckFile() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$Modal.confirm({
                            title: '下发核查意见书',
                            content: '确定要下发核查意见书?',
                            onOk: () => {
                                this.$Spin.show();
                                this.$http({
                                    method: 'post',
                                    url: '/projectAudit/sendOpinion',
                                    data: JSON.stringify({
                                        projectId: this.currentRow.projectId,
                                        fileId: this.sendCheckFileForm.fileId
                                    })
                                }).then(res => {
                                    this.$Spin.hide();
                                    this.modal_sendCheckFile = false;
                                    if(res.code === 'SUCCESS') {
                                        this.$Message.success({
                                            content: '下发成功！'
                                        });

                                    }
                                }).catch(e => {
                                    this.$Spin.hide();
                                })
                            }
                        })
                    } else {

                    }
                })
            },
            // 获取上传文件
            onSelect(fileList) {
                if (fileList.length > 0) {
                    this.sendCheckFileForm.fileId = fileList[0].fileId;
                }
                // this.sendCheckFileForm.fileId = fileList.map(v => v.fileId);
            },
        }
    }
</script>

<style lang="scss" scoped>
    .qualitySupervision_tell-container {
    }
</style>
