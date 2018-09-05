<template>
    <Card shadow>
        <p slot="title">
            <Icon type="ios-folder" />
            文件管理
        </p>
        <div class="card-content">
            <div class="left-content">
                <Button :type="type === 'receive' ? 'primary' : 'default'"
                        size="large"
                        @click="onClickFile('receive')"
                        custom-icon="iconfont icon-receive-file">收到文件</Button>
                <Button :type="type === 'send' ? 'primary' : 'default'"
                        size="large"
                        @click="onClickFile('send')"
                        custom-icon="iconfont icon-send-file">发出文件</Button>
            </div>
            <div class="right-content" ref="rightConent">
                <Table v-show="type === 'receive'"
                       :columns="tableColumns_receive"
                       :width="tableWidth"
                       :height="288"
                       :data="tableData"></Table>

                <Table v-show="type === 'send'"
                       :columns="tableColumns_receive"
                       :width="tableWidth"
                       :height="288"
                       :data="tableData"></Table>
            </div>
        </div>
    </Card>
</template>
<script>
    export default {
        name: 'filesManagePanel',
        data() {
            return {
                type: 'receive',
                tableColumns_receive: [
                    { type: 'index', title: '序号', width: 60, align: 'center'},
                    { title: '文件名称', key: 'folderName', width: 120, align: 'center' },
                    { title: '文件类型', key: 'folderType', width: 120, align: 'center' },
                    { title: '收文日期', key: 'time', width: 120, align: 'center' },
                    { title: '截止处理日期', key: 'time2', width: 120, align: 'center' },
                    { title: '状态', key: 'state', width: 120, align: 'center' },
                    { title: '附件', key: 'num', width: 120, align: 'center' },
                    { title: '发件单位', key: 'unit', width: 120, align: 'center' },
                    { title: '发件部门', key: 'depart', width: 120, align: 'center' },
                    { title: '发件人', key: 'userName', width: 120, align: 'center' },
                    { title: '操作', width: 120, align: 'center' }
                ],
                tableColumns_send: [
                    { type: 'index', title: '序号', width: 60, align: 'center'},
                    { title: '文件名称', key: 'folderName', width: 120, align: 'center' },
                    { title: '文件类型', key: 'folderType', width: 120, align: 'center' },
                    { title: '发文日期', key: 'time', width: 120, align: 'center' },
                    { title: '截止处理日期', key: 'time2', width: 120, align: 'center' },
                    { title: '状态', key: 'state', width: 120, align: 'center' },
                    { title: '附件', key: 'num', width: 120, align: 'center' },
                    { title: '收件单位', key: 'unit', width: 120, align: 'center' },
                    { title: '收件部门', key: 'depart', width: 120, align: 'center' },
                    { title: '收件人', key: 'userName', width: 120, align: 'center' },
                    { title: '操作', key: 'operator', width: 120, align: 'center' }
                ],
                tableData: [
                    {
                        folderName: '关于某专项督查活动通知',
                        folderType: '通知',
                        time: '2018-09-05',
                        time2: '2018-09-05',
                        state: '未查看',
                        num: '1份',
                        unit: '质监局',
                        depart: '安全科',
                        userName: '余科长'
                    },
                    {
                        folderName: '关于某专项督查活动通知',
                        folderType: '通知',
                        time: '2018-09-05',
                        time2: '2018-09-05',
                        state: '未查看',
                        num: '1份',
                        unit: '质监局',
                        depart: '安全科',
                        userName: '余科长'
                    },
                    {
                        folderName: '关于某专项督查活动通知',
                        folderType: '通知',
                        time: '2018-09-05',
                        time2: '2018-09-05',
                        state: '未查看',
                        num: '1份',
                        unit: '质监局',
                        depart: '安全科',
                        userName: '余科长'
                    },
                    {
                        folderName: '关于某专项督查活动通知',
                        folderType: '通知',
                        time: '2018-09-05',
                        time2: '2018-09-05',
                        state: '未查看',
                        num: '1份',
                        unit: '质监局',
                        depart: '安全科',
                        userName: '余科长'
                    },
                    {
                        folderName: '关于某专项督查活动通知',
                        folderType: '通知',
                        time: '2018-09-05',
                        time2: '2018-09-05',
                        state: '未查看',
                        num: '1份',
                        unit: '质监局',
                        depart: '安全科',
                        userName: '余科长'
                    }
                ],

                tableWidth: 0
            }
        },
        mounted() {
            this.tableWidth = this.$refs.rightConent.clientWidth;
        },
        methods: {
            onClickFile(type) {
                this.type = type;
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    .card-content {
        height: 100%;
        display: flex;

        .left-content {
            width: 160px;
            .ivu-btn {
                width: 100%;
                height: 50%;
                font-size: 16px;
                border-width: 0;

                &:hover, &:active {
                    border-width: 0;
                }

                .ivu-icon {
                    font-size: 16px;
                }
            }
        }

        .right-content {
            flex: 1;
            width: 100%;
            margin-left: 10px;
        }
    }
</style>