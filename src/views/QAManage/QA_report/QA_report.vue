<template>
    <div class="QA_report-container">
        <vIvxFilterBox>
            <Button type="primary"
                    icon="md-add"
                    @click="modal_add_open">上传报表</Button>
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
        name: 'QA_report',  // 质量检测报表
        components: {vIvxFilterBox},
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,        // 每页几行
                    total: 0,        // 总行数
                    condition: {
                        searchKey: '',      // 模糊查询参数
                        handleStatus: ''
                    }

                },
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '报表名称', align: 'center', key: 'name' },
                    { title: '年度报表', width: 180, align: 'center', key: '2' },
                    { title: '上传时间', width: 180, align: 'center', key: '3' },
                    { title: '操作人', width: 180, align: 'center', key: '4' },
                    { title: '备注', width: 180, align: 'center', key: '5' },
                    {
                        title: '操作',
                        width: 110,
                        align: 'center',
                        // fixed: 'right',
                        render: (h, params) => {
                            let list = [];

                            list.push(h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    icon: 'ios-trash-outline'
                                },
                                on: {
                                    click: () => {
                                        this.del(params.row);
                                    }
                                }
                            }, '删除'));

                            return h('div', {
                                class: 'ivx-table-cell-handle'
                            }, list);

                        }
                    }
                ],
                tableData: [
                    {
                        'name': '六安市2015年年度交通建设项目质量状况分析报告',
                        '2': '2015年度',
                        '3': '2016-3-1',
                        '4': '陈亮'
                    },
                    {
                        'name': '质量检测报告',
                        '2': '2015年度',
                        '3': '2016-3-1',
                        '4': '陈亮'
                    }
                ],
                tableLoading: false
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
        },
        methods: {
            modal_add_open() {},
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
                    url: '/',
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
            // 备案删除
            del(row) {
                this.$Modal.confirm({
                    title: '删除',
                    content: `确认要删除<${row.name}>报告?`,
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/',
                            params: {
                                // safeNoticeId: row.safeNoticeId
                            }
                        }).then((res) => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('删除成功!');
                            }
                        });
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .QA_report-container {
    }
</style>