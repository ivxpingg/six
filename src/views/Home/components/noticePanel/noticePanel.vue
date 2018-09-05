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
            <CellGroup>
                <Cell v-for="(item, idx) in list" :title="item.title" :extra="item.time" :key="idx"></Cell>
            </CellGroup>
        </div>
    </Card>
</template>
<script>
    export default {
        name: 'noticePanel',
        data() {
            return {
                list: [
                    {title: '关于交通局下发项目监督管理等', time: '2018-09-05'},
                    {title: '关于交通局下发项目监督管理等', time: '2018-09-05'},
                    {title: '关于交通局下发项目监督管理等', time: '2018-09-05'},
                    {title: '关于交通局下发项目监督管理等', time: '2018-09-05'},
                    {title: '关于交通局下发项目监督管理等', time: '2018-09-05'},
                    {title: '关于交通局下发项目监督管理等', time: '2018-09-05'},
                    {title: '关于交通局下发项目监督管理等', time: '2018-09-05'}
                ]
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>