<template>
    <div class="auditProcessSelect-container">
        <div class="modal-body">
            <vIvxFilterBox>
                <Form inline>
                    <FormItem label="关键字:" :label-width="65">
                        <Input v-model="searchParams.condition.searchKey" placeholder="流程名称" />
                    </FormItem>
                    <FormItem :label-width="20">
                        <Button type="primary"
                                @click="getData">检索</Button>
                    </FormItem>
                </Form>
            </vIvxFilterBox>

            <div class="ivx-table-box">
                <Table ref="table"
                       border
                       :columns="tableColumns"
                       :data="tableData"
                       highlight-row
                       @on-row-dblclick="onRowDbclick"
                       @on-current-change="onCurrentChange"></Table>
                <Page prev-text="上一页"
                      next-text="下一页"
                      show-total
                      :current="searchParams.current"
                      :page-size="searchParams.size"
                      :total="searchParams.total"
                      @on-change="onPageChange"></Page>
            </div>
        </div>

        <div class="ivu-modal-footer six-modal-footer-padding-bottom-0">
            <Button type="primary"
                    size="large"
                    @click="add">确定</Button>
        </div>
    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import MOMENT from 'moment';
    export default {
        name: 'auditProcessSelect',  // 审核流程选择， 默认单选
        components: {
            vIvxFilterBox
        },
        watch: {
            'searchParams.current'() {
                this.getData();
            },
            'searchParams.condition': {
                deep: true,
                handler() {
                    this.getData();
                }
            }
        },
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 7,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        searchKey: ''
                    }
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '方案名称', width: 160, align: 'center', key: 'name' },
                    { title: '流程步骤数', width: 100, align: 'center', key: 'steps' },
                    { title: '过期时间', width: 90, align: 'center',
                        render: (h, params) => {
                            return h('div', `${params.row.timeLimit}天`)
                        } },
                    { title: '编辑人', width: 120, align: 'center', key: 'operator' },
                    { title: '编辑时间', width: 150, align: 'center', key: 'operateTime',
                        render: (h, params) => {
                            return h('div', `${MOMENT(params.row.operateTime).format('YYYY-MM-DD HH:mm:ss')}`)
                        }},
                    { title: '备注', width: 180, align: 'center', key: 'remark' }
                ],
                tableData: [],
                tableLoading: false,
                selectValue: [],
                selectItems: []
            };
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
            // 获取表格数据
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/auditProcess/list',
                    params: this.searchParams
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records || [];
                        this.searchParams.total = res.data.page.total;
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            },
            onRowDbclick() {
                this.add();
            },
            onCurrentChange(currentRow, oldCurrentRow) {
                this.selectItems = currentRow;
                this.selectValue = currentRow.auditProcessId;
            },
            add() {
                this.$emit('handleSelect', this.selectValue, this.selectItems);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .auditProcessSelect-container {
    }
</style>