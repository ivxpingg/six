<template>
    <div class="qualitySupervision_check-container">
        <vIvxFilterBox dashed>
            <Button type="primary"
                    icon="md-add"
                    @click="modal_addSupervisionRecord_open">添加监督记录</Button>
        </vIvxFilterBox>
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.condition.searchKey"
                           style="width: 220px;"
                           placeholder="检索内容"/>
                </FormItem>
                <FormItem label="项目名称:" :label-width="65">
                    <Select v-model="searchParams.condition.projectId">
                        <Option v-for="item in projectList"
                                :key="item.projectId"
                                :value="item.projectId"
                                :label="item.projectName"></Option>
                    </Select>
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

        <!--查看附件-->
        <vViewFiles ref="modal_viewFiles" :data="filesData"></vViewFiles>

        <!--添加监督记录-->
        <vAddSupervisionRecord ref="modal_addSupervisionRecord"
                               :projectList="projectList"
                               @modal-callback="modal_addSupervisionRecord_callback"></vAddSupervisionRecord>

        <!--整改通知-->
        <vNoticeModification_check ref="modal_noticeModification_check"
                                   :projectId="currentRow.projectId"
                                   :projectName="currentRow.projectName"
                                   :supervisionCheckId="currentRow.supervisionCheckId"
                                   @modal-callback="modal_noticeModification_check_callback" ></vNoticeModification_check>
        <!--整改回复-->
        <vNoticeReply_check ref="modal_noticeReply_check"
                            :projectId="currentRow.projectId"
                            :projectName="currentRow.projectName"
                            :changeNoticeId="currentRow.changeNotice.changeNoticeId"
                            @modal-callback="modal_noticeReply_check_callback"></vNoticeReply_check>
    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import MOMENT from 'moment';
    import vViewFiles from '../../Common/viewFiles/viewFiles';
    import vAddSupervisionRecord from './add/addSupervisionRecord';
    import vNoticeModification_check from './noticeModification_check/noticeModification_check';
    import vNoticeReply_check from './noticeReply_check/noticeReply_check';
    export default {
        name: 'qualitySupervision_check',  // 质量监督检查
        components: {
            vIvxFilterBox,
            vViewFiles,
            vAddSupervisionRecord,
            vNoticeModification_check,
            vNoticeReply_check
        },
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        searchKey: '',      // 模糊查询参数
                        projectId: '',
                        moduleType: 'quality'
                    }
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '督查时间', width: 120, align: 'center',
                        render: (h, params) => {
                            return h('div', MOMENT(params.row.checkTime).format('YYYY-MM-DD'));
                        }},
                    { title: '督察方式', width: 120, align: 'center', key: 'checkWayLabel' },
                    { title: '督查内容', minWidth: 180, align: 'center', key: 'content' },
                    { title: '督查类型', width: 180, align: 'center', key: 'checkTypeLabel' },
                    // { title: '下发单位', width: 100, align: 'center', key: '' },
                    { title: '发出人或负责人', width: 130, align: 'center', key: 'creator' },
                    { title: '整改状态', width: 100, align: 'center', key: 'changeStatusLabel' },
                    { title: '通知查看时间', width: 120, align: 'center', key: '',
                        render(h, params) {
                         return h('div', params.row.checkTime ? MOMENT(params.row.checkTime).format('YYYY-MM-DD') : '');
                        }
                    },
                    // { title: '整改回复时间', width: 120, align: 'center', key: '' },
                    // { title: '回复内容', width: 120, align: 'center', key: '' },
                    {
                        title: '操作',
                        width: 240,
                        render: (h, params) => {
                            let list = [];

                            if (!params.row.changeNotice || params.row.changeNotice.changeStatus === 'pass') {
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
                                            this.currentRow.supervisionCheckId = params.row.supervisionCheckId;
                                            this.$refs.modal_noticeModification_check.modalValue = true;
                                        }
                                    }
                                }, '整改通知'));
                            }

                            if (params.row.changeNotice && params.row.changeNotice.changeStatus !== 'pass') {
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
                                            this.currentRow.changeNotice.changeNoticeId = params.row.changeNotice.changeNoticeId;
                                            this.$refs.modal_noticeReply_check.modalValue = true;
                                        }
                                    }
                                }, '查看整改回复'));
                            }

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
                        // supervisionCheckId: '',
                        // projectId: '12',
                        // checkTime: '2018-10-10',
                        // checkWay: '',   // 督察方式
                        // checkWayLabel: '日常督查',
                        // content: '现场某某情况违规',          // 督查内容
                        // checkType: '',        // 督查类型
                        // checkTypeLabel: '质量告知单',
                        // supervisionType: '',  // 监督类别（质量/安全）
                        // supervisionTypeLabel: '',
                        // moduleType: ''      // 模块类别（质量监督、安全监督、信用评价）
                    // }
                ],
                tableLoading: false,
                projectList: [],

                currentRow: {
                    projectId: '',
                    projectName: '',
                    supervisionCheckId: '',
                    changeNotice: {   // 整改通知
                        changeNoticeId: ''
                    },
                },

                // 查看附件
                filesData: []

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
            // this.getData();
            this.getProjectList();
        },
        methods: {
            // 获取项目列表
            getProjectList() {
                this.$http({
                    method: 'get',
                    url: '/supervisionCheck/monitorProjectList'
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.projectList = res.data || [];
                        if (this.projectList.length > 0) {
                            this.searchParams.condition.projectId = res.data[0].projectId;
                            this.getData();
                        }
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
                this.$http({
                    method: 'post',
                    url: '/supervisionCheck/list',
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

            // 添加监督记录
            modal_addSupervisionRecord_open() {
                this.$refs.modal_addSupervisionRecord.modalValue = true;
            },
            modal_addSupervisionRecord_callback() {
                this.getData();
                this.$refs.modal_addSupervisionRecord.modalValue = false;
            },

            // 添加整改通知的回调
            modal_noticeModification_check_callback() {
                this.$refs.modal_noticeModification_check.modalValue = false;
                this.getData();
            },
            // 整改通过的回调
            modal_noticeReply_check_callback() {
                this.$refs.modal_noticeReply_check.modalValue = false;
                this.getData();
            },
            // 查看附件
            getFilesData(row) {
                this.$http({
                    method: 'get',
                    url: '/file/attachList',
                    params: {
                        relationId: row.changeNotice.changeNoticeId,
                        fileType: 'monitor_procedure'
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.filesData = res.data || [];
                        this.$refs.modal_viewFiles.modalValue = true;
                    }
                })

            }

        }
    }
</script>

<style lang="scss" scoped>
    .qualitySupervision_check-container {
    }
</style>