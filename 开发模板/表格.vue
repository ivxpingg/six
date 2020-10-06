<template>

    <div class="ivx-table-box">
        <Table border
               height="520"
               :columns="tableColumns"
               :data="tableData"></Table>
        <Page prev-text="上一页"
              next-text="下一页"
              show-total
              :current="searchParams.current"
              :page-size="searchParams.size"
              :total="searchParams.total"></Page>
    </div>

</template>

<script>
    export default {
        name: '表格',
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    beginDate: '',     // 开始时间
                    endDate: '',       // 结束时间
                    searchKey: ''      // 模糊查询参数
                },
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '单位名称', width: 180, align: 'center', key: '' },
                    {
                        title: '操作',
                        width: 240,
                        align: 'center',
                        fixed: 'right',
                        render: (h, params) => {
                            let list = [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-create-outline'
                                    }
                                }, '编辑'),

                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'ios-trash-outline'
                                    }
                                }, '删除'),

                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small',
                                        icon: 'ios-eye-outline'
                                    }
                                }, '查看'),

                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-notifications-outline'
                                    }
                                }, '通知整改'),

                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-checkmark-circle-outline'
                                    }
                                }, '提交')
                            ];

                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: []
            };
        }
    }
</script>

<style lang="scss" scoped>
</style>