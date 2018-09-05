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
                tableColumns: [
                    {
                        type: 'index',
                        title: '序号',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '操作人',
                        key: 'operator',
                        align: 'center'
                    }
                    ,
                    {
                        title: '操作类型',
                        key: 'operatorType',
                        align: 'center'
                    },
                    {
                        title: '操作内容',
                        key: 'content',
                        align: 'center'
                    }
                ],
                tableData: [
                    {
                        operator: '管理员',
                        operatorType: '新增',
                        content: '添加从业人员'
                    },
                    {
                        operator: '管理员',
                        operatorType: '新增',
                        content: '添加从业人员'
                    },
                    {
                        operator: '管理员',
                        operatorType: '新增',
                        content: '添加从业人员'
                    },{
                        operator: '管理员',
                        operatorType: '新增',
                        content: '添加从业人员'
                    },{
                        operator: '管理员',
                        operatorType: '新增',
                        content: '添加从业人员'
                    },{
                        operator: '管理员',
                        operatorType: '新增',
                        content: '添加从业人员'
                    },{
                        operator: '管理员',
                        operatorType: '新增',
                        content: '添加从业人员'
                    }
                ]
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>