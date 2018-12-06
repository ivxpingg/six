<template>
    <Card shadow id="noticePanel">
        <p slot="title">
            <Icon type="ios-notifications" />
            通知公告
        </p>
        <a href="#" slot="extra" @click="onClick_more">
            <Icon type="ios-more" />
            更多
        </a>
        <div class="card-content">
            <CellGroup @on-click="onClick_notice">
                <Cell v-for="(item, idx) in list"
                      :name="item.noticeId"
                      class="notice-cell"
                      :extra="getTime(item.insTime)"
                      :key="`notice${item.noticeId}`">
                    <Badge :count="getNoticeStatus(item.noticeStatus)"
                           type="error"
                           class="notice-badge-alone"
                           dot>
                        <div class="badge-content">{{item.noticeTitle}}</div>
                    </Badge>
                </Cell>
            </CellGroup>
        </div>

        <Modal v-model="modal_notice"
               :width="350">
            <div class="ivu-modal-confirm-head" slot="header">
                <div class="ivu-modal-confirm-head-icon ivu-modal-confirm-head-icon-info">
                    <i class="ivu-icon ivu-icon-ios-information-circle"></i>
                </div>
                <div class="ivu-modal-confirm-head-title">{{currentItem.noticeTitle}}</div>
            </div>
            <div>{{currentItem.noticeContent}}</div>

            <div slot="footer" v-show="fileList.length > 0" style="text-align: left;">
                <div v-for="item in fileList" :key="item.fileId">
                    <a :href="getFileUrl(item.url)" :download="item.fileName">
                        <Icon type="ios-link" />
                        {{item.fileName}}
                    </a>
                </div>
            </div>
        </Modal>

        <!--查看更多通知-->
        <Modal v-model="modal_more"
               title="通知公告"
               :width="600"
               footer-hide>
            <div class="ivx-table-box">
                <Table ref="table"
                       border
                       size="small"
                       height="330"
                       @on-row-dblclick="onRowDbclick"
                       :data="tableData"
                       :columns="tableColumns"></Table>
                <Page prev-text="上一页"
                      next-text="下一页"
                      show-total
                      :current="searchParams_more.current"
                      :page-size="searchParams_more.size"
                      :total="searchParams_more.total"
                      @on-change="onPageChange"></Page>
            </div>
        </Modal>

    </Card>
</template>
<script>
    import MOMENT from 'moment';
    import Config from '../../../../config';
    export default {
        name: 'noticePanel',
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0     // 总行数
                },
                list: [],

                // 查看通知
                modal_notice: false,
                currentItem: {
                    noticeTitle: '',
                    noticeContent: ''
                },
                // 查看更多
                searchParams_more: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0     // 总行数
                },
                modal_more: false,
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index'},
                    { title: '标题',  align: 'left', key: 'noticeTitle',
                        render: (h, params) => {
                            let list = [];
                            if(params.row.noticeStatus === 'unRead') {
                                list.push(h('Badge', {
                                    props: {
                                        count: 1,
                                        type: 'error',
                                        dot: true
                                    },
                                    class: {
                                        'notice-badge-alone': true
                                    }
                                }, params.row.noticeTitle));
                            }
                            else {
                                list.push(h('div', params.row.noticeTitle));
                            }
                            return h('div', list);
                        }
                    },
                    { title: '时间', width: 160, align: 'center', key: 'insTime',
                        render: (h, params) => {
                            return h('div', params.row.insTime ? this.$moment(params.row.insTime).format('YYYY-MM-DD HH:mm:ss') : '');
                        }
                    }
                ],
                //noticeStatus
                tableData: [],

                fileList: []
            }
        },
        watch: {
            searchParams_more: {
                deep: true,
                handler() {
                    this.getNoticeList('more');
                }
            }
        },
        mounted() {
            this.getNoticeList();
            this.getNoticeList('more');

        },
        methods: {
            /**
             * 分页控件-切换页面
             * @param current
             */
            onPageChange(current) {
                this.searchParams_more.current = current;
            },
            // 查看更多
            onClick_more() {
                this.modal_more = true;
            },
            // 表格双击查看
            onRowDbclick(row, row2) {
                this.onClick_notice(row.noticeId);
                this.getNoticeList('more');
            },
            getTime(time) {
                return MOMENT(time).format('YYYY-MM-DD');
            },
            getNoticeStatus(noticeStatus) {
                return noticeStatus === 'unRead' ? 1 : 0;
            },
            getNoticeList(type) {
                this.$http({
                    method: 'post',
                    url: '/notice/list',
                    data: JSON.stringify(type === 'more' ?this.searchParams_more : this.searchParams)
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        if (type === 'more') {
                            this.tableData = res.data.records;
                            this.searchParams_more.total = res.data.total;
                        }
                        else {
                            this.list = res.data.records;
                            this.searchParams.total = res.data.total;
                        }
                    }
                })
            },

            onClick_notice(noticeId) {

                let item = this.getItem(noticeId)[0];

                // this.$Modal.info({
                //     title: item.noticeTitle,
                //     content: item.noticeContent
                // });
                Object.assign(this.currentItem, item);

                this.getFilesData(noticeId);
                this.modal_notice = true;

                this.updateStatus(noticeId);

            },

            updateStatus(noticeId) {
                this.$http({
                    method: 'get',
                    url: '/notice/updateStatus',
                    params: {
                        noticeId: noticeId
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.getNoticeList();
                    }
                });
            },

            getItem(noticeId) {
                return this.list.filter(v => v.noticeId === noticeId);
            },

            // 获取附件
            getFilesData(noticeId) {
                this.$http({
                    method: 'get',
                    url: '/file/attachList',
                    params: {
                        relationId: noticeId,
                        fileType: 'notice_file'
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.fileList = res.data;
                    }
                });
            },
            getFileUrl(url) {
                if (url.length > 0 && url.indexOf('http://') === -1) {
                    return Config[Config.env].filePath + url;
                }
                else {
                    return url;
                }
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" >
    .notice-badge-alone {
        .ivu-badge-dot {
            top: 3px;
            left: -3px;
            right: auto;
        }
    }

    .notice-cell {
        .ivu-cell-main {
            width: 75%;

            .notice-badge-alone{
                width: 100%;

                .badge-content {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    width: 100%;
                }
            }
        }
    }

</style>