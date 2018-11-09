<template>
    <Card shadow>
        <p slot="title">
            <Icon type="ios-folder" />
            文件管理
        </p>
        <a href="#" slot="extra" @click.prevent="onClick_sendFile">
            <Icon type="ios-send"></Icon>
            发送文件
        </a>
        <div class="card-content">
            <div class="left-content">

                <Button :type="type === 'receive' ? 'primary' : 'default'"
                        size="large"
                        @click="onClickFile('receive')"
                        custom-icon="iconfont icon-receive-file">
                    <Badge :count="unReadNum" type="error" :offset="[-5,-5]">收到文件</Badge>
                </Button>

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
                       :data="tableData_receive"></Table>

                <Table v-show="type === 'send'"
                       :columns="tableColumns_send"
                       :width="tableWidth"
                       :height="288"
                       :data="tableData_send"></Table>
            </div>
        </div>

        <vModalSendFile ref="modal_sendFile" @modal-callback="modal_sendFile_callback"></vModalSendFile>

        <vViewFiles ref="viewFile" :data="viewFilesList"></vViewFiles>

    </Card>
</template>
<script>
    import vModalSendFile from './sendFile/modalSendFile';
    import viewFilesMixin from '../../../Common/viewFiles/mixin';
    import MOMENT from 'moment';
    export default {
        name: 'filesManagePanel',
        mixins: [viewFilesMixin],
        components: {vModalSendFile},
        data() {
            return {
                searchParams_receive: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        receiveSendType: 'receive'     // 收发文类型
                    }
                },
                searchParams_send: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        receiveSendType: 'send'     // 收发文类型
                    }
                },
                type: 'receive',
                tableColumns_receive: [
                    { type: 'index', title: '序号', width: 60, align: 'center'},
                    { title: '文件名称', key: 'fileName', width: 120, align: 'center' },
                    { title: '发文日期', key: 'insTime', width: 120, align: 'center',
                        render(h, params) {
                            return h('div', params.row.insTime ? MOMENT(params.row.insTime).format('YYYY-MM-DD HH:mm:ss'):'');
                        }
                    },
                    { title: '状态', key: 'noticeStatusLabel', width: 120, align: 'center' },
                    { title: '收件单位', key: 'unitName', width: 120, tooltip: true, align: 'center' },
                    { title: '收件人', key: 'userName', width: 120, align: 'center' },
                    {
                        title: '操作',
                        key: 'operator',
                        width: 80,
                        align: 'center',
                        fixed: 'right',
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.getData_vViewFile(params.row.receiveSendId, 'receive_send', 'viewFilesList');
                                        this.$refs.viewFile.modalValue = true;

                                        this.updateState_receiveSend(params.row);
                                    }
                                }
                            }, '查看');
                        }
                    }
                ],
                tableColumns_send: [
                    { type: 'index', title: '序号', width: 60, align: 'center'},
                    { title: '文件名称', key: 'fileName', width: 120, align: 'center' },
                    { title: '发文日期', key: 'insTime', width: 120, align: 'center',
                        render(h, params) {
                            return h('div', params.row.insTime ? MOMENT(params.row.insTime).format('YYYY-MM-DD HH:mm:ss'):'');
                        }
                    },
                    { title: '收件单位', key: 'unitName', width: 120, tooltip: true,  align: 'center' },
                    { title: '收件人', key: 'userName', width: 120, align: 'center' },
                    {
                        title: '操作',
                        key: 'operator',
                        width: 120,
                        align: 'center',
                        fixed: 'right',
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.getData_vViewFile(params.row.receiveSendId, 'receive_send', 'viewFilesList');
                                        this.$refs.viewFile.modalValue = true;
                                    }
                                }
                            }, '查看');
                        }
                    }
                ],
                tableData_receive: [],
                tableData_send: [],

                // 未读文件数量
                unReadNum: 0,

                tableWidth: 0,

                // 附件列表
                viewFilesList: []
            }
        },
        watch: {
            '$store.state.app.mianLayoutWidth' () {
                setTimeout(() => {
                    this.tableWidth = this.$refs.rightConent.clientWidth;
                },200);
            }
        },
        mounted() {
            this.getUnReadNum();
            this.getData_receive();
            this.getData_send();

            setTimeout(() => {
                this.tableWidth = this.$refs.rightConent.clientWidth;
            },200);
        },
        methods: {
            onClickFile(type) {
                this.type = type;
            },
            getUnReadNum() {
                this.$http({
                    method: 'get',
                    url: '/receiveSend/unReadNum'
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.unReadNum = res.data || 0;
                    }
                })
            },
            getData_receive() {
                this.$http({
                    method: 'post',
                    url: '/receiveSend/list',
                    data: JSON.stringify(this.searchParams_receive)
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.tableData_receive = res.data.records || [];
                    }
                })
            },
            getData_send() {
                this.$http({
                    method: 'post',
                    url: '/receiveSend/list',
                    data: JSON.stringify(this.searchParams_send)
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.tableData_send = res.data.records || [];
                    }
                })
            },
            onClick_sendFile() {
                this.$refs.modal_sendFile.modalValue = true;
            },
            modal_sendFile_callback() {
                this.getData_send();
            },

            // 标记收到文件为已读
            updateState_receiveSend(row) {
                this.$http({
                    method: 'get',
                    url: '/receiveSend/updateStatus',
                    params: {
                        receiveSendId: row.receiveSendId
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.getUnReadNum();
                        this.getData_receive();
                    }
                })
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
            margin-left: 10px;
            overflow: hidden;
        }
    }
</style>