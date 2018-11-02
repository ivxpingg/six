<template>
    <div class="qualitySupervision_tell-container">
        <vIvxFilterBox dashed>
            <Button type="primary"
                    icon="ios-notifications"
                    @click="modal_noticeModification_open">整改通知</Button>

            <Button type="primary"
                    icon="ios-undo"
                    @click="modal_seeReply_open">整改回复</Button>
        </vIvxFilterBox>
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.condition.projectName"
                           style="width: 220px;"
                           placeholder="项目名称"/>
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


        <!--附件查看-->
        <vAccessoryFileList
                :value="modal_accessoryFileList"
                @modal_callback="modal_callback_superviseTeamManage"
                @close="modal_addSuperviseTeamPerson_close"></vAccessoryFileList>

        <!--添加质量监督交底-->
        <vAddSupervisionTell ref="modal_addSupervisionTell"
                             :projectId="currentRow.projectId"
                             :projectName="currentRow.projectName"
                             @modal-callback="modal_callback_addSupervisionTell"></vAddSupervisionTell>

        <!--整改通知-->
        <vNoticeModification ref="modal_noticeModification" @modal-callback="modal_noticeModification_callback"></vNoticeModification>
    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vAccessoryFileList from '../qualitySupervision_accept/accessoryFileList/accessoryFileList';
    import vAddSupervisionTell from './add/addSupervisionTell';
    import vNoticeModification from './noticeModification/noticeModification';
    export default {
        name: 'qualitySupervision_tell',
        components: {vIvxFilterBox, vAccessoryFileList, vAddSupervisionTell, vNoticeModification},
        data() {
            return {
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
                        width: 340,
                        align: 'center',
                        fixed: 'right',
                        render: (h, params) => {
                            let list = [];
                            if (!params.row.advanceNoticeId) {
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
                                }, '添加监督交底'));
                            }
                            else{
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



                            // list.push(h('Button', {
                            //     props: {
                            //         type: 'primary',
                            //         size: 'small',
                            //         icon: 'md-arrow-down'
                            //     },
                            //     on: {
                            //         click: () => {
                            //             // this.currentRow.projectId = params.row.projectId;
                            //             this.sendNotice(params.row);
                            //         }
                            //     }
                            // }, '下发受理通知书'));

                            list.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'ios-eye-outline'
                                },
                                on: {
                                    click: () => {
                                        this.currentRow.projectId = params.row.projectId;
                                        this.modal_accessoryFileList = true;
                                    }
                                }
                            }, '查看附件'));



                            // 设置列宽度
                            return h('div',{
                                style: {

                                },
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }

                ],
                tableData: [],
                tableLoading: false,
                // 当前选择的项目信息
                currentRow: {
                    projectId: '',
                    projectName: '',
                },
                // 查看附件
                modal_accessoryFileList: false
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
        },
        methods: {
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
                    params: this.searchParams
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

            // 分配监督小组
            modal_callback_superviseTeamManage() {},

            // 查看附件
            modal_addSuperviseTeamPerson_close(val) {
                this.modal_accessoryFileList = val;
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
                                advanceNoticeId: row.advanceNoticeId
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

            // 下发受理通知书
            sendNotice(row) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确定下发整改通知书？下发后将会发送到参加单位信息中心。',
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/',
                            params: {

                            }
                        }).then((res) => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('下发通知书成功！');
                            }
                        })
                    }
                });
            },

            // 整改通知
            modal_noticeModification_open() {
                this.$refs.modal_noticeModification.modalValue = true;
            },
            modal_noticeModification_callback() {
                this.$refs.modal_noticeModification.modalValue = false;
            },
            // 整改回复
            modal_seeReply_open() {}

        }
    }
</script>

<style lang="scss" scoped>
    .qualitySupervision_tell-container {
    }
</style>