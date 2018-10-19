<template>
    <div class="creditRating_record-container">
        <vIvxFilterBox dashed>
            <Button type="primary"
                    icon="md-add"
                    @click="modal_record_open">添加信用评价记录</Button>

        </vIvxFilterBox>
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.condition.searchKey"
                           style="width: 220px;"
                           placeholder="项目名称"/>
                </FormItem>
                <FormItem label="项目名称:" :label-width="65">
                    <Select v-model="searchParams.condition.projectId">
                        <Option v-for="item in projectList"
                                :key="item.projectId"
                                :value="item.projectId"
                                :label="item.projectName"></Option>
                    </Select>
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

        <vAddCreditRatingRecord ref="addCreditRatingRecord"
                                :projectList="projectList"
                                @modal_callback="modal_addCreditRatingRecord_callback"></vAddCreditRatingRecord>
    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import MOMENT from 'moment';
    import vAddCreditRatingRecord from './add/addCreditRatingRecord';
    export default {
        name: 'creditRating_record',   // 信用评价记录
        components: {vIvxFilterBox, vAddCreditRatingRecord},
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        searchKey: '',      // 模糊查询参数
                        projectId: ''
                    }
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '记录时间', width: 180, align: 'center',
                        render: (h, params) => {
                            return h('div', MOMENT(params.row.insTime).format('YYYY-MM-DD'));
                        }},
                    { title: '记录单号', width: 180, align: 'center', key: 'recordNo' },
                    { title: '单位', width: 180, align: 'center', key: 'unitName' },
                    { title: '单位类型', width: 180, align: 'center', key: 'unitTypeLabel' },
                    { title: '扣分项', width: 100, align: 'center', key: 'deductDetail' },
                    { title: '扣分', width: 100, align: 'center', key: 'deduct' },
                    { title: '扣分代码', width: 130, align: 'center', key: 'creditNo' },
                    { title: '扣分依据', width: 100, align: 'center', key: 'content' },
                    { title: '整改情况', width: 120, align: 'center', key: '' }

                ],
                tableData: [
                    {
                        evaluateId: '',
                        projectId: '',
                        insTime: '2018-10-10',
                        recordNo: 'N.2555',         // 记录单号
                        unitId: '12',
                        unitName: '安徽省振非建设工程监理有限公司',
                        unitType: '',
                        unitTypeLabel: '建设单位',
                        creditCodeId: '',
                        creditNo: 'NO.1254', // 信用编号、扣分代码
                        deduct: null,      // 扣分
                        deductDetail: '扣分项',   // 扣分项
                        content: '信用内容、扣分依据'         // 信用内容、扣分依据
                    }
                ],
                tableLoading: false,

                projectList: [],
            };
        },
        mounted() {
            this.getProjectList();
        },
        methods: {
            // 获取项目列表
            getProjectList() {
                this.$http({
                    method: 'post',
                    url: '/project/list',
                    data: JSON.stringify({
                        current: 1,      // 当前第几页
                        size: 1000,      // 每页几行
                    })
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.projectList = res.data.records || [];
                        if (this.projectList.length > 0) {
                            this.searchParams.condition.projectId = res.data.records[0].projectId;
                            this.getData();
                        }
                    }
                })
            },

            modal_record_open() {
                this.$refs.addCreditRatingRecord.modalValue = true;
            },
            modal_addCreditRatingRecord_callback() {
                this.$refs.addCreditRatingRecord.modalValue = false;
                this.getData();
            },

            /**
             * 分页控件-切换页面
             * @param current
             */
            onPageChange(current) {
                this.searchParams.current = current;
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
    .creditRating_record-container {
    }
</style>