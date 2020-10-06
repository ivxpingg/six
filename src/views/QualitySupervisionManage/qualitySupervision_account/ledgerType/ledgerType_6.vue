<template>
    <div class="ledgerType_6-container">
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
                   height="540"
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
        name: 'ledgerType_6',  // 质量告知单登记台帐
        data() {
            return {
                searchParams: {
                    projectName: '',      // 模糊查询参数
                    beginTime: '',
                    endTime: ''
                },

                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '日期', width: 180, align: 'center', key: 'recordDate',
                        render: (h, params) => {
                            return h('div', MOMENT(params.row.recordDate).format('YYYY-MM-DD'));
                        }},
                    { title: '编号', width: 180, align: 'center', key: 'recordNo' },
                    { title: '项目名称', width: 180, align: 'center', key: 'projectName' },
                    { title: '标段', width: 180, align: 'center', key: 'part' },
                    { title: '督查类型', width: 180, align: 'center', key: '' },
                    { title: '督查内容', width: 180, align: 'center', key: '' },
                    { title: '发出单位', width: 180, align: 'center', key: '' },
                    { title: '责任单位', width: 180, align: 'center', key: '' },
                    { title: '整改回复状态', width: 180, align: 'center', key: '' },
                    { title: '发出人员', width: 180, align: 'center', key: '' },
                    { title: '监督负责人', width: 180, align: 'center', key: 'supervisor' },
                    { title: '备注', width: 180, align: 'center', key: 'remark' }

                ],
                tableData: [],
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
                    url: '/record/qualityNoticeRecord',
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
    .ledgerType_6-container {
    }
</style>