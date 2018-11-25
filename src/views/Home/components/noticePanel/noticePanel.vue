<template>
    <Card shadow>
        <p slot="title">
            <Icon type="ios-notifications" />
            通知公告
        </p>
        <!--<a href="#" slot="extra">-->
            <!--<Icon type="ios-more" />-->
            <!--更多-->
        <!--</a>-->
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
                fileList: []

            }
        },
        mounted() {
            this.getNoticeList();
        },
        methods: {
            getTime(time) {
                return MOMENT(time).format('YYYY-MM-DD');
            },
            getNoticeStatus(noticeStatus) {
                return noticeStatus === 'unRead' ? 1 : 0;
            },
            getNoticeList() {
                this.$http({
                    method: 'post',
                    url: '/notice/list',
                    data: JSON.stringify(this.searchParams)
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.list = res.data.records;
                        this.searchParams.total = res.data.total;
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