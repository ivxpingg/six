<template>
    <div class="ledgerType_0-container">
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.projectName"
                           style="width: 220px;"
                           placeholder="项目名称"/>
                </FormItem>
                <FormItem label="选择时间:" :label-width="65">
                    <DatePicker type="daterange"
                                @on-change="onChage_daterange"
                                placeholder="选择时间"
                                style="width: 200px"></DatePicker>
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
    import vIvxFilterBox from '../../../../components/ivxFilterBox/ivxFilterBox';
    import MOMENT from 'moment';
    export default {
        name: 'ledgerType_0',  // 在监项目督查台账
        components: {vIvxFilterBox},
        data() {
            return {
                searchParams: {
                    projectName: '',      // 模糊查询参数
                    beginTime: '',
                    endTime: ''
                },

                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '日期', width: 120, align: 'center', key: 'recordDate',
                        render: (h, params) => {
                            return h('div', MOMENT(params.row.recordDate).format('YYYY-MM-DD'));
                        }},
                    { title: '项目名称', minWidth: 180, align: 'center', key: 'projectName' },
                    { title: '标段', width: 180, align: 'center', key: 'part' },
                    { title: '累计监督次数', width: 180, align: 'center', key: 'totalSupTimes' },
                    { title: '告知单及检查单（份数）', width: 180, align: 'center', key: 'noticeNum' },
                    { title: '抽查意见书（份数）', width: 180, align: 'center', key: 'opinionNum' },
                    { title: '督查通报（份数）', width: 180, align: 'center', key: 'notifyNum' },
                    { title: '不良行为（份数）', width: 180, align: 'center', key: 'badBehaviorNum' },
                    { title: '监督负责人', width: 180, align: 'center', key: 'supervisor' },
                    { title: '监督成员', width: 180, align: 'center', key: 'supervisorMember' },
                    { title: '备注', width: 180, align: 'center', key: 'remark' },

                ],
                tableData: [
                    {
                        projectId: '12',
                        recordDate: '2018-10-10',
                        projectName: '',   // 项目名称
                        part: '',          // 标段
                        supervisor: '',   // 监督负责人
                        remark: ''        // 备注
                    }
                ],
                tableLoading: false,
            };
        },
        watch: {
            searchParams: {
                deep: true,
                handler(val) {
                    this.getData();
                }
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            onChage_daterange(value) {
                this.searchParams.beginTime = value[0];
                this.searchParams.endTime = value[1];
            },
            // 获取表格数据
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/record/supervisionCountRecord',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data || [];
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            }

        }
    }
</script>

<style lang="scss" scoped>
    .ledgerType_0-container {
        padding-top:  10px;
    }
</style>