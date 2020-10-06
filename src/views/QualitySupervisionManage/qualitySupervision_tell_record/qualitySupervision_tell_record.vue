<template>
    <div class="qualitySupervision_tell_record-container">
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
        <!--质量监督登记编辑-->
        <Modal v-model="modal_edit"
               class-name="modal-body-padding0"
               title="质量监督登记"
               :width="1200"
               @on-visible-change="onVisibleChange_edit"
               footer-hide>
            <div style="height: 650px;">
                <vEdit v-if="modal_edit"
                       isView
                       :projectId="modal_edit_param.projectId"></vEdit>
            </div>
        </Modal>

    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vViewFiles from '../../Common/viewFiles/viewFiles';
    import vEdit from '../qualitySupervision_register/edit/qualitySupervision_register_edit';
    import MOMENT from 'moment';
    export default {
        name: 'qualitySupervision_tell_record',
        components: {
            vIvxFilterBox,
            vViewFiles,
            vEdit
        },
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
                    {title: '序号', width: 60, align: 'center', type: 'index',},
                    {title: '项目名称', width: 180, align: 'center', key: 'projectName'},
                    {title: '标段', width: 180, align: 'center', key: 'part'},
                    {
                        title: '地区', width: 180, align: 'center',
                        render: (h, params) => {
                            let str = '';
                            str += params.row.provinceStr || '';
                            str += params.row.cityStr || '';
                            str += params.row.countyStr || '';

                            return h('div', str);
                        }
                    },
                    {title: '项目类型', width: 180, align: 'center', key: 'projectTypeLabel'},
                    {title: '技术等级', width: 180, align: 'center', key: 'technicalLevelLabel'},
                    {title: '项目里程(km)', width: 180, align: 'center', key: 'mileage'},
                    // { title: '路面类型', width: 180, align: 'center', key: '' },
                    {title: '工程性质', width: 180, align: 'center', key: 'projectPropertyLabel'},
                    {title: '投资额(万元)', width: 180, align: 'center', key: 'amount'},
                    {title: '施工合同金额(万元)', width: 180, align: 'center', key: 'constructAmount'},
                    {title: '监理合同金额(万元)', width: 180, align: 'center', key: 'supervisorAmount'},
                    {
                        title: '计划开工时间', width: 180, align: 'center', key: 'planBeginTime',
                        render(h, params) {
                            return h('div', params.row.planBeginTime ? MOMENT(params.row.planBeginTime).format('YYYY-MM-DD') : '');
                        }
                    },
                    {
                        title: '计划交工时间', width: 180, align: 'center', key: 'planEndTime',
                        render(h, params) {
                            return h('div', params.row.planEndTime ? MOMENT(params.row.planEndTime).format('YYYY-MM-DD') : '');
                        }
                    },
                    // TODO 收件日期
                    // { title: '收件日期', width: 180, align: 'center', key: '' },
                    {title: '联系人', width: 180, align: 'center', key: 'contacts'},
                    {title: '联系方式', width: 180, align: 'center', key: 'contactPhone'},
                    {title: '项目状态', width: 180, align: 'center', key: 'projectStatusLabel'},
                    // TODO 流程状态
                    // { title: '流程状态', width: 180, align: 'center', key: '' },
                    {title: '办理状态', width: 180, align: 'center', key: 'handleStatusLabel'},
                    {title: '受理通知书', width: 180, align: 'center', key: 'acceptNotice'},
                    {title: '整改状态', width: 180, align: 'center', key: 'changeStatusLabel'},
                    {
                        title: '受理日期', width: 180, align: 'center', key: 'acceptDate',
                        render(h, params) {
                            return h('div', params.row.acceptDate ? MOMENT(params.row.acceptDate).format('YYYY-MM-DD') : '');
                        }
                    },
                    {
                        title: '不予受理日期', width: 180, align: 'center', key: 'noAcceptDate',
                        render(h, params) {
                            return h('div', params.row.noAcceptDate ? MOMENT(params.row.noAcceptDate).format('YYYY-MM-DD') : '');
                        }
                    },
                    {title: '不予受理备注', width: 180, align: 'center', key: 'noAcceptRemark'},
                    {
                        title: '操作',
                        width: 100,
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
                                        this.modal_edit_param.projectId = params.row.projectId;
                                        this.modal_edit = true;
                                    }
                                }
                            }, '查看'));

                            // 设置列宽度
                            return h('div', {
                                style: {},
                                class: 'ivx-table-cell-handle'
                            }, list);
                        }
                    }

                ],
                tableData: [],
                tableLoading: false,
                // 编辑项目
                modal_edit: false,
                modal_edit_param: {
                    projectId: ''
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
        }
    }
</script>

<style lang="scss" scoped>
    .qualitySupervision_tell_record-container {
    }
</style>