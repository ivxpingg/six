<template>
    <div class="auditProcessManage-container">
        <div class="left-panel">
            <vIvxFilterBox dashed>
                <Button type="primary"
                        icon="md-add">新增审核方案</Button>
                <Button type="primary"
                        icon="md-add">新增审核方案</Button>
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
                      :on-change="onPageChange"></Page>
            </div>
        </div>
        <div class="right-panel">

        </div>
    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    export default {
        name: 'auditProcessManage',
        components: {
            vIvxFilterBox
        },
        data() {
            return {
                searchParams: {
                    current: 1,        // 当前第几页
                    size: 10,          // 每页几行
                    total: 0,          // 总行数
                    searchKey: ''      // 模糊查询参数
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '方案名称', width: 120, align: 'center', key: 'name' },
                    { title: '流程步骤数', width: 120, align: 'center', key: 'fileFormat' },
                    { title: '过期时间', width: 180, align: 'center', key: 'insTime' },
                    { title: '备注', width: 120, align: 'center', key: 'signatureStatusLabel' },
                    { title: '编辑人', width: 120, align: 'center', key: 'userName' },
                    { title: '编辑时间', width: 140, align: 'left', key: 'url' },
                    {
                        title: '操作',
                        width: 350,
                        align: 'center',
                        render: (h, params) => {
                            let list = [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-create-outline'
                                    }
                                }, '编辑审核方案'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-create-outline'
                                    }
                                }, '编辑方案流程'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'ios-trash-outline'
                                    },
                                    on: {
                                        click: () => {
                                            // this.deleteSignature(params.row);
                                        }
                                    }
                                }, '删除')
                            ];

                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [
                    {
                        signatureId: '001',
                        name: '电子签名',
                        fileFormat: '.png',
                        url: '/user.jpg',
                        insTime: '2018-09-08 00:00:00',
                        signatureStatusLabel: '已授权',
                        userName: '陈亮'
                    },
                    {
                        signatureId: '002',
                        name: '电子签名',
                        fileFormat: '.png',
                        url: '/user.jpg',
                        insTime: '2018-09-08 00:00:00',
                        signatureStatusLabel: '已授权',
                        userName: '陈亮'
                    }
                ],
                tableLoading: true,
            };
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
                    method: 'get',
                    url: '/getUserList',
                    params: this.searchParams
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.page.records;
                        this.searchParams.total = res.data.page.total;
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .auditProcessManage-container {
        display: flex;

        .left-panel {
            width: 1200px;

        }
        .right-panel{
            flex: 1;
        }
    }
</style>