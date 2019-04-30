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
        <a href="#" slot="extra" style="margin-left: 15px;" @click.prevent="onClick_modal_file_value">
            <Icon type="ios-more"></Icon>
            更多
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

        <Modal v-model="modal_file_value"
               :width="1000"
                :title="type === 'receive' ? '收文': '发文'" >
            <Table v-show="type === 'receive'"
                   :columns="tableColumns_receive"
                   :height="460"
                   :data="modal_tableData_receive"></Table>
            <div style="text-align: center; margin-top: 10px;">
                <Page v-show="type === 'receive'"
                       prev-text="上一页"
                       next-text="下一页"
                       show-total
                      size="small"
                       :current="searchParams_receive.current"
                       :page-size="searchParams_receive.size"
                       :total="searchParams_receive.total"
                       @on-change="onPageChange_receive"></Page></div>

            <Table v-show="type === 'send'"
                   :columns="tableColumns_send"
                   :height="460"
                   :data="modal_tableData_send"></Table>
            <div style="text-align: center; margin-top: 10px;">
            <Page v-show="type === 'send'"
                  prev-text="上一页"
                  next-text="下一页"
                  show-total
                  size="small"
                  :current="searchParams_send.current"
                  :page-size="searchParams_send.size"
                  :total="searchParams_send.total"
                  @on-change="onPageChange_send"></Page>
            </div>
        </Modal>

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
                    { title: '文件名称', key: 'fileName', minWidth: 120, align: 'center' },
                    { title: '收文日期', key: 'insTime', minWidth: 120, align: 'center',
                        render(h, params) {
                            return h('div', params.row.insTime ? MOMENT(params.row.insTime).format('YYYY-MM-DD HH:mm:ss'):'');
                        }
                    },
                    { title: '状态', key: 'noticeStatusLabel', width: 120, align: 'center' },
                    { title: '发件单位', key: 'unitName', minWidth: 120, tooltip: true, align: 'center' },
                    { title: '发件人', key: 'userName', width: 120, align: 'center' },
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
                    { title: '文件名称', key: 'fileName', minWidth: 120, align: 'center' },
                    { title: '发文日期', key: 'insTime', minWidth: 120, align: 'center',
                        render(h, params) {
                            return h('div', params.row.insTime ? MOMENT(params.row.insTime).format('YYYY-MM-DD HH:mm:ss'):'');
                        }
                    },
                    { title: '收件单位', key: 'unitName', minWidth: 120, tooltip: true,  align: 'center' },
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
                modal_tableData_receive: [],
                modal_tableData_send: [],
                modal_file_value: false,

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
            },
            'searchParams_receive.current' () {
                this.modal_getData_receive();
            },
            'searchParams_send.current' () {
                this.modal_getData_send();
            },
        },
        mounted() {
            this.getUnReadNum();
            this.getData_receive();
            this.getData_send();
            this.modal_getData_receive();
            this.modal_getData_send();

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
            //
            getData_receive() {
                this.$http({
                    method: 'post',
                    url: '/receiveSend/list',
                    data: JSON.stringify({
                        current: 1,      // 当前第几页
                        size: 10,      // 每页几行
                        total: 0,     // 总行数
                        condition: {
                            receiveSendType: 'receive'     // 收发文类型
                        }
                    })
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
                    data: JSON.stringify({
                        current: 1,      // 当前第几页
                        size: 10,      // 每页几行
                        total: 0,     // 总行数
                        condition: {
                            receiveSendType: 'send'     // 收发文类型
                        }
                    })
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.tableData_send = res.data.records || [];
                    }
                })
            },

            onClick_modal_file_value() {
                this.modal_file_value = true;
            },
            /**
             * 分页控件-切换页面
             * @param current
             */
            onPageChange_receive(current) {
                this.searchParams_receive.current = current;
            },
            /**
             * 分页控件-切换页面
             * @param current
             */
            onPageChange_send(current) {
                this.searchParams_send.current = current;
            },
            modal_getData_receive() {
                this.$http({
                    method: 'post',
                    url: '/receiveSend/list',
                    data: JSON.stringify(this.searchParams_receive)
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.modal_tableData_receive = res.data.records || [];
                        this.searchParams_receive.total = res.data.total;
                    }
                })
            },
            modal_getData_send() {
                this.$http({
                    method: 'post',
                    url: '/receiveSend/list',
                    data: JSON.stringify(this.searchParams_send)
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.modal_tableData_send = res.data.records || [];
                        this.searchParams_send.total = res.data.total;
                    }
                })
            },
            onClick_sendFile() {
                this.$refs.modal_sendFile.modalValue = true;
            },
            modal_sendFile_callback() {
                this.getData_send();
                this.modal_getData_send();
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