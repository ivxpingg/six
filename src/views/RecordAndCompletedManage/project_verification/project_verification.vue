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
    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    export default {
        name: 'project_verification',   // 交工检测核验
        components: {vIvxFilterBox},
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
                    { title: '地市', width: 180, align: 'center', key: '' },
                    { title: '项目类型', width: 180, align: 'center', key: '' },
                    { title: '建设单位', width: 180, align: 'center', key: '' },
                    { title: '技术等级', width: 180, align: 'center', key: '' },

                    { title: '项目里程(km)', width: 180, align: 'center', key: '' },
                    { title: '路面类型', width: 180, align: 'center', key: '' },
                    { title: '工程性质', width: 180, align: 'center', key: '' },
                    { title: '投资额(万元)', width: 180, align: 'center', key: '' },
                    { title: '施工合同金额(万元)', width: 180, align: 'center', key: '' },
                    { title: '监理合同金额(万元)', width: 180, align: 'center', key: '' },
                    { title: '计划开工时间', width: 180, align: 'center', key: '' },
                    { title: '计划交工时间', width: 180, align: 'center', key: '' },
                    { title: '施工单位', width: 180, align: 'center', key: '' },
                    { title: '监理单位', width: 180, align: 'center', key: '' },
                    { title: '收件日期', width: 180, align: 'center', key: '' },

                    { title: '联系人', width: 180, align: 'center', key: '' },
                    { title: '联系方式', width: 180, align: 'center', key: '' },
                    { title: '项目状态', width: 180, align: 'center', key: '' },
                    { title: '流程状态', width: 180, align: 'center', key: '' },
                    { title: '办理状态', width: 180, align: 'center', key: '' },
                    { title: '交工质量检测意见书', width: 180, align: 'center', key: '' },
                    { title: '整改状态', width: 180, align: 'center', key: '' },
                    { title: '监督负责人', width: 180, align: 'center', key: '' },
                    { title: '监督成员', width: 180, align: 'center', key: '' },
                    { title: '核验意见编号', width: 180, align: 'center', key: '' },
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
                                        this.handleLabelCheck(params.row);
                                    }
                                }
                            }, '处理标签审核'));

                            list.push(h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small',
                                    icon: 'md-checkmark'
                                },
                                on: {
                                    click: () => {
                                       this.pass(params.row);
                                    }
                                }
                            }, '审核通过'));

                            list.push(h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    icon: 'md-close'
                                },
                                on: {
                                    click: () => {
                                        this.noPass(params.row);
                                    }
                                }
                            }, '审核不通过'));

                            return h('div', {
                                class: 'ivx-table-cell-handle'
                            }, list);

                        }
                    }
                ],
                tableData: [],
                tableLoading: true,

                dict_handleStatus: []
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

            // 交工验收审核登记
            modal_add_open() { },

            // 处理标签审核
            handleLabelCheck(row) {

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