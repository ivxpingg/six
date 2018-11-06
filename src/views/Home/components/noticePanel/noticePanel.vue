<template>
    <Card shadow>
        <p slot="title">
            <Icon type="ios-notifications" />
            通知公告
        </p>
        <a href="#" slot="extra">
            <Icon type="ios-more" />
            更多
        </a>
        <div class="card-content">
            <CellGroup @on-click="onClick_notice">
                <Cell v-for="(item, idx) in list"
                      :name="item.noticeId"
                      :title="item.noticeTitle"
                      :extra="getTime(item.insTime)"
                      :key="`notice${item.noticeId}`"></Cell>
            </CellGroup>
        </div>
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
                })
            },

            getItem(noticeId) {
                return this.list.filter(v => v.noticeId === noticeId);
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>