<template>
    <div class="userUnit-container">
        <div class="ivx-table-box">
            <Table border
                   height="490"
                   :columns="tableColumns"
                   :data="tableData"></Table>
        </div>
    </div>
</template>

<script>
    import MOMENT from 'moment';
    import AuthMixin from '../../../../../lib/mixin/authMixin';
    export default {
        name: 'userUnit',
        mixins: [AuthMixin],
        props: {
            userId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '单位名称', width: 140, align: 'center', key: 'unitName' },
                    // { title: '部门名称', width: 120, align: 'center', key: 'department' },
                    { title: '职务', width: 120, align: 'center', key: 'job' },
                    { title: '技术职称', width: 120, align: 'center', key: 'titleNameLabel' },
                    { title: '级别', width: 120, align: 'center', key: 'titleLevelLabel' },
                    { title: '联系方式', width: 110, align: 'center', key: 'phone' },
                    { title: '在职情况', width: 100, align: 'center', key: 'workStatusLabel' },
                    { title: '入职时间', width: 100, align: 'center', key: 'beginTime',
                        render(h, params) {
                            return h('div',params.row.beginTime ? MOMENT(params.row.beginTime).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '离职时间', width: 100, align: 'center', key: 'endTime',
                        render(h, params) {
                            return h('div', params.row.endTime? MOMENT(params.row.endTime).format('YYYY-MM-DD') : '');
                        }
                    }
                ],
                tableData: []
            };
        },
        watch: {
            userId: {
                handler(val) {
                    if (val) {
                        this.getData();
                    }
                }
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            // 获取用户供职单位
            getData() {
                this.$http({
                    method: 'get',
                    url: '/user/workUnitRecordList',
                    params: {
                        userId: this.userId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data || [];
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .userUnit-container {
    }
</style>