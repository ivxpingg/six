<template>
    <div class="creditRating_record-container">
        <vIvxFilterBox dashed>
            <Button type="primary"
                    icon="md-add"
                    @click="modal_record_open">添加信用评价记录</Button>

        </vIvxFilterBox>
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.condition.searchKey"
                           style="width: 220px;"
                           placeholder="单位名称"/>
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

        <!--查看附件-->
        <vViewFiles ref="modal_viewFiles" :data="filesData"></vViewFiles>

        <vAddCreditRatingRecord ref="addCreditRatingRecord"
                                :projectList="projectList"
                                @modal_callback="modal_addCreditRatingRecord_callback"></vAddCreditRatingRecord>

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

        <Modal v-model="modal_content"
               title="扣分依据"
               footer-hide>
            <Form :label-width="80">
                <FormItem label="信用类型:">
                    {{creditCode.creditType}}
                </FormItem>
                <FormItem label="一级目录:">
                    {{creditCode.firstDirectory}}
                </FormItem>
                <FormItem label="二级目录:">
                    {{creditCode.scoreStandard}}
                </FormItem>
                <FormItem label="信用内容:">
                    {{creditCode.content}}
                </FormItem>
                <FormItem label="评分标准:">
                    {{creditCode.scoreStandard}}
                </FormItem>
            </Form>
        </Modal>

    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import MOMENT from 'moment';
    import vViewFiles from '../../Common/viewFiles/viewFiles';
    import vAddCreditRatingRecord from './add/addCreditRatingRecord';
    import vNoticeModification_check from './noticeModification_check/noticeModification_check';
    import vNoticeReply_check from './noticeReply_check/noticeReply_check';
    export default {
        name: 'creditRating_record',   // 信用评价记录
        components: {
            vIvxFilterBox,
            vViewFiles,
            vAddCreditRatingRecord,
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
                        projectId: ''
                    }
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '记录时间', width: 180, align: 'center',
                        render: (h, params) => {
                            return h('div', MOMENT(params.row.insTime).format('YYYY-MM-DD'));
                        }},
                    { title: '记录单号', width: 180, align: 'center', key: 'recordNo' },
                    { title: '单位', width: 180, align: 'center', key: 'unitName' },
                    { title: '单位类型', width: 180, align: 'center', key: 'unitTypeLabel' },
                    { title: '扣分项', width: 100, align: 'center', key: 'deductDetail' },
                    { title: '扣分', width: 100, align: 'center', key: 'deduct' },
                    { title: '扣分代码', width: 130, align: 'center', key: 'creditNo' },
                    { title: '扣分依据', width: 100, align: 'center', key: 'content',
                        render: (h, params) => {
                            return h('a', {
                                attrs: {
                                    href: '#'
                                },
                                on: {
                                    click: () => {
                                        this.getCreditCode(params.row);
                                    }
                                }
                            }, '查看');
                        }
                    },
                    { title: '整改情况', width: 120, align: 'center', key: '' },
                    {
                        title: '操作',
                        width: 240,
                        align: 'center',
                        fixed: 'right',
                        render: (h, params) => {
                            let list = [];

                            if (!params.row.changeNotice) {
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
                                            this.currentRow.supervisionCheckId = params.row.evaluateId;
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

                            if (params.row.changeNotice) {
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
                    }

                ],
                tableData: [
                    // {
                    //     evaluateId: '',
                    //     projectId: '',
                    //     insTime: '2018-10-10',
                    //     recordNo: 'N.2555',         // 记录单号
                    //     unitId: '12',
                    //     unitName: '安徽省振非建设工程监理有限公司',
                    //     unitType: '',
                    //     unitTypeLabel: '建设单位',
                    //     creditCodeId: '',
                    //     creditNo: 'NO.1254', // 信用编号、扣分代码
                    //     deduct: null,      // 扣分
                    //     deductDetail: '扣分项',   // 扣分项
                    //     content: '信用内容、扣分依据'         // 信用内容、扣分依据
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
                filesData: [],

                modal_content: false, // 扣分依据内容
                creditCode: {
                    content: '',
                    creditCodeId: '',
                    creditNo: '',
                    creditType: '',
                    firstDirectory: '',
                    scoreStandard: '',
                    secondDirectory: '',
                }
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
        },
        methods: {
            // 获取项目列表
            getProjectList() {
                this.$http({
                    method: 'post',
                    url: '/project/list',
                    data: JSON.stringify({
                        current: 1,      // 当前第几页
                        size: 1000,      // 每页几行
                    })
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.projectList = res.data.records || [];
                        if (this.projectList.length > 0) {
                            this.searchParams.condition.projectId = res.data.records[0].projectId;
                            this.getData();
                        }
                    }
                })
            },

            modal_record_open() {
                this.$refs.addCreditRatingRecord.modalValue = true;
            },
            modal_addCreditRatingRecord_callback() {
                this.$refs.addCreditRatingRecord.modalValue = false;
                this.getData();
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
                    url: '/creditEvaluate/creditEvaluatePage',
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

            // 添加整改通知的回调
            modal_noticeModification_check_callback() {
                this.getData();
                this.$refs.modal_noticeModification_check.modalValue = false;
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

            },

            // 获取评分依据内容
            getCreditCode(row) {
                this.$http({
                    method: 'get',
                    url: '/creditCode/query',
                    params: {
                        creditCodeId: row.creditCodeId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.creditCode, res.data);
                        this.modal_content = true;
                    }
                })
            }

        }
    }
</script>

<style lang="scss" scoped>
    .creditRating_record-container {
    }
</style>