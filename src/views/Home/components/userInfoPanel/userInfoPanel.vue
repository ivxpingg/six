<template>
    <Card shadow>
        <p slot="title">
            <Icon type="md-person" />
            个人信息
        </p>
        <a href="#" slot="extra">
            <Icon type="ios-create-outline" />
            编辑
        </a>
        <div class="card-content">
            <div class="user-info">
                <Form class="text-info" >
                    <FormItem label="姓名：">{{userInfo.name}}</FormItem>
                    <FormItem label="单位：">{{userInfo.unitName}}</FormItem>
                    <FormItem label="单位类型：">{{userInfo.unitType}}</FormItem>
                    <FormItem label="部门：">{{userInfo.department}}</FormItem>
                    <FormItem label="职务：">{{userInfo.job}}</FormItem>
                    <FormItem label="账号ID：">{{userInfo.userId}}</FormItem>
                    <FormItem label="电话号码：">{{userInfo.phone}}</FormItem>
                </Form>
                <img class="user-img" :src="userInfo.img" alt="">
            </div>
            <div class="btn-list">
                <Row>
                    <i-col span="12">
                        <Button type="success" size="large" @click="modal_todo_open">
                            <Badge type="success" :count="waitHandleNum" show-zero></Badge>
                            待办事项
                        </Button>
                    </i-col>
                    <i-col span="12">
                        <Button type="info" size="large">
                            <Badge type="info" :count="unReadNoticeNum" show-zero></Badge>
                            消息通知
                        </Button>
                    </i-col>
                </Row>
            </div>
        </div>

        <vModalTodo ref="modaltodo" @modal-callback="modal_todo_callback"></vModalTodo>
    </Card>
</template>
<script>
    import imgUrl from '@/assets/images/user.jpg';
    import vModalTodo from './todo/modal_todo';
    export default {
        name: 'userInfoPanel',
        components: {vModalTodo},
        data() {
            return {
                userInfo: {
                    name: '',
                    unitName: '六安市质监局',
                    unitType: '',
                    department: '',
                    job: '',
                    userId: '',
                    phone: '',
                    img: imgUrl,
                    headPortrait: ''
                },

                unReadNoticeNum: 0,
                waitHandleNum: 0
            }
        },
        mounted() {
            this.getData();
            this.getUnReadNoticeNum();
            this.getWaitHandleNum();
        },
        methods: {
            getData() {
                this.$http({
                    method: 'get',
                    url: '/user/query'
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.userInfo, {
                            headPortrait: imgUrl
                        }, res.data);
                    }
                })
            },
            // 获取未读消息通知数量
            getUnReadNoticeNum() {
                this.$http({
                    method: 'get',
                    url: '/index/unReadNoticeNum'
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.unReadNoticeNum = res.data || 0;
                    }
                })
            },

            // 待办事项数量
            getWaitHandleNum() {
                this.$http({
                    method: 'get',
                    url: '/index/waitHandleNum'
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.waitHandleNum = res.data || 0;
                    }
                })
            },

            modal_todo_open() {
                this.$refs.modaltodo.modalValue = true;
            },
            modal_todo_callback() {
                this.getWaitHandleNum();
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    .card-content {
        .user-info {
            position: relative;
            padding-left: 120px;
            .text-info {
                .ivu-form-item {
                    margin-bottom: 0;
                }
            }
            .user-img {
                position: absolute;
                top: 0;
                left: 0;
                width: 80px;
                height: 80px;
                border-radius: 50%;
            }
        }

        .btn-list {
            padding-top: 25px;
            text-align: center;
        }
    }

</style>