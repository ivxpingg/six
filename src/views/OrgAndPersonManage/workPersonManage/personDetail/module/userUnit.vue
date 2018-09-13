<template>
    <div class="userUnit-container">
        <div class="ivx-table-box">
            <Table border
                   height="490"
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
</template>

<script>
    export default {
        name: 'userUnit',
        props: {
            userId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 9,      // 每页几行
                    total: 0,     // 总行数
                    beginDate: '',     // 开始时间
                    endDate: '',       // 结束时间
                    userId: ''
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '单位名称', width: 140, align: 'center', key: 'unitName' },
                    { title: '部门名称', width: 120, align: 'center', key: 'department' },
                    { title: '职务', width: 120, align: 'center', key: 'job' },
                    { title: '技术职称', width: 120, align: 'center', key: 'titleName' },
                    { title: '级别', width: 120, align: 'center', key: 'titleLevel' },
                    { title: '联系方式', width: 110, align: 'center', key: 'phone' },
                    { title: '在职情况', width: 100, align: 'center', key: 'state' },
                    { title: '入职时间', width: 100, align: 'center', key: 'beginTime' },
                    { title: '离职时间', width: 100, align: 'center', key: 'endTime' }
                ],
                tableData: []
            };
        },
        watch: {
            userId: {
                handler(val) {
                    if (val) {
                        this.getData();
                    }
                }
            }
        },
        mounted() {
            this.searchParams.userId = this.userId;
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
            getData() {
                this.$http({
                    method: 'get',
                    url: '/getUserUnitInfo',
                    params: {
                        userId: this.userId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records;
                        this.searchParams.total = res.data.total;
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .userUnit-container {
    }
</style>