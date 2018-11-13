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
                      :extra="getTime(item.insTime)"
                      :key="`notice${item.noticeId}`">
                    <Badge :count="getNoticeStatus(item.noticeStatus)"
                           type="error"
                           class="notice-badge-alone"
                           dot>
                        {{item.noticeTitle}}
                    </Badge>
                </Cell>
            </CellGroup>
        </div>

        <Modal></Modal>

    </Card>
</template>
<script>
    import MOMENT from 'moment';
    export default {
        name: 'noticePanel',
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0     // 总行数
                },
                list: []
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

                this.$Modal.info({
                    title: item.noticeTitle,
                    content: item.noticeContent
                });

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
</style>