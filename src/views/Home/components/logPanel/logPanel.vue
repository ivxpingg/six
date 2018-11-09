<template>
    <Card shadow>
        <p slot="title">
            <!--<Icon type="ios-notifications" />-->
            操作日志
        </p>
        <div class="card-content">
            <Table :columns="tableColumns"
                   :data="tableData"
                   :height="290"></Table>
        </div>
    </Card>
</template>
<script>
    export default {
        name: 'logPanel',
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        logType: 'index'
                    }
                },
                tableColumns: [
                    {
                        type: 'index',
                        title: '序号',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '操作人',
                        width: 80,
                        key: 'operator',
                        align: 'center'
                    }
                    ,
                    {
                        title: '操作类型',
                        width: 90,
                        key: 'operateTypeLabel',
                        align: 'center'
                    },
                    {
                        title: '操作内容',
                        tooltip: true,
                        key: 'operateContent',
                        align: 'center'
                    }
                ],
                tableData: [
                    // {
                    //     operator: '管理员',
                    //     operatorType: '新增',
                    //     operateContent: '添加从业人员添加从业人员添加从业人员'
                    // }
                ]
            }
        },
        mounted() {
            this.getLog();
        },
        methods: {
            getLog() {
                this.$http({
                    method: 'post',
                    url: '/operateLog/list',
                    data: JSON.stringify(this.searchParams)
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records || [];
                    }
                });
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>