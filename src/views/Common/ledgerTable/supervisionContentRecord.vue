<template>
    <div class="supervisionContentRecord-container">
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.projectName"
                           style="width: 220px;"
                           placeholder="项目名称"/>
                </FormItem>
                <FormItem label="选择时间:" :label-width="65">
                    <DatePicker type="year"
                                @on-change="onChage_daterange"
                                placeholder="选择时间"
                                style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem>
                    <!--<Button type="primary" icon="md-download" @click="onClick_export" >导出</Button>-->
                </FormItem>
            </Form>
        </vIvxFilterBox>
        <div class="ivx-table-box">
            <Table border
                   :height="540"
                   :loading="tableLoading"
                   :columns="tableColumns"
                   :data="tableData"></Table>
        </div>
    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import MOMENT from 'moment';
    export default {
        name: 'supervisionContentRecord',   // 监督内容登记表台账
        components: {vIvxFilterBox},
        props: {
            // 监督内容登记表台账类型
            checkType: {
                type: String,
                required: true
            }
        },
        watch: {
            checkType: {
                immediate: true,
                handler(val) {
                    this.searchParams.checkType = val;
                }
            },
            searchParams: {
                deep: true,
                handler() {
                    this.getData();
                }
            }
        },
        data() {
            return {
                searchParams: {
                    projectName: '',      // 模糊查询参数
                    year: '',
                    checkType: ''
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '时间', align: 'center', width: 120, key: 'recordDate',
                        render(h, params) {
                            return h('div', params.row.recordDate ? MOMENT(params.row.recordDate).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '编号', align: 'center', width: 120, key: 'recordNo'},
                    { title: '项目名称', align: 'center', width: 120, key: 'projectName'},
                    { title: '标段', align: 'center', width: 100, key: 'part'},
                    { title: '责任单位', align: 'center', width: 120, key: 'dutyUnit'},
                    { title: '发出单位', align: 'center', width: 120, key: 'sendUnit'},
                    { title: '发出人员', align: 'center', width: 120, key: 'sendUser'},
                    { title: '监督负责人', align: 'center', width: 120, key: 'supervisor'},
                    { title: '整改回复状态', align: 'center', width: 120, key: 'changeStatus'},
                    { title: '整改回复时间', align: 'center', width: 120, key: 'changeReplyDate',
                        render(h, params) {
                            return h('div', params.row.changeReplyDate ? MOMENT(params.row.changeReplyDate).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '内容', align: 'center', width: 120, key: 'content'},
                    { title: '备注', align: 'center', width: 120, key: 'remark'},

                ],
                tableData: [],
                tableLoading: false
            };
        },
        mounted() {
            this.getData();
        },
        methods: {
            onChage_daterange(value) {
                this.searchParams.year = value;
            },

            // 获取表格数据
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/record/supervisionContentRecord',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data || [];
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            },
            // 导出
            onClick_export() {
                this.$http({
                    method: 'post',
                    url: '/record/',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {

                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .supervisionContentRecord-container {
        padding-top: 10px;
    }
</style>