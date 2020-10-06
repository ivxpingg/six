<template>
    <div class="ledgerType_3-container">
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.condition.searchKey"
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
            <Page prev-text="上一页"
                  next-text="下一页"
                  show-total
                  :current="searchParams.current"
                  :page-size="searchParams.size"
                  :total="searchParams.total"
                  @on-change="onPageChange"></Page>
        </div>
    </div>
</template>

<script>
    import vIvxFilterBox from '../../../../components/ivxFilterBox/ivxFilterBox';
    import MOMENT from 'moment';
    export default {
        name: 'ledgerType_3',  // 综合督查通报台帐
        components: {vIvxFilterBox},
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        searchKey: '',      // 模糊查询参数
                        beginTime: '',
                        endTime: ''
                    }
                },

                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '日期', width: 180, align: 'center', key: 'recordDate',
                        render: (h, params) => {
                            return h('div', MOMENT(params.row.recordDate).format('YYYY-MM-DD'));
                        }},
                    { title: '编号', width: 180, align: 'center', key: '' },
                    { title: '项目名称', width: 180, align: 'center', key: 'projectName' },
                    { title: '标段', width: 180, align: 'center', key: 'part' },
                    { title: '督查类型', width: 180, align: 'center', key: '' },
                    { title: '督查内容', width: 180, align: 'center', key: '' },
                    { title: '发出单位', width: 180, align: 'center', key: '' },
                    { title: '责任单位', width: 180, align: 'center', key: '' },
                    { title: '整改回复状态', width: 180, align: 'center', key: '' },
                    { title: '整改回复时间', width: 180, align: 'center', key: 'recordDate',
                        render: (h, params) => {
                            return h('div', MOMENT(params.row.recordDate).format('YYYY-MM-DD'));
                        }},
                    { title: '发出人员', width: 180, align: 'center', key: '' },
                    { title: '监督负责人', width: 180, align: 'center', key: 'supervisor' },
                    { title: '备注', width: 180, align: 'center', key: 'remark' }

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
            'searchParams.current'() {
                this.getData();
            },
            'searchParams.condition': {
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
            /**
             * 分页控件-切换页面
             * @param current
             */
            onPageChange(current) {
                this.searchParams.current = current;
            },
            onChage_daterange(value) {
                this.searchParams.condition.beginTime = value[0];
                this.searchParams.condition.endTime = value[1];
            },
            // 获取表格数据
            getData() {
                this.$http({
                    method: 'post',
                    url: '/',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records;
                        this.searchParams.total = res.data.total;
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            }

        }
    }
</script>

<style lang="scss" scoped>
    .ledgerType_3-container {
        padding-top:  10px;
    }
</style>