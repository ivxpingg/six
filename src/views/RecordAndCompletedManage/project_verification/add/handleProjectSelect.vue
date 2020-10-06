<template>
    <div class="handleProjectSelect-container">
        <Modal v-model="modalValue"
               title="选择交工项目">
            <vIvxFilterBox>
                <Form inline>
                    <FormItem label="关键字:" :label-width="65">
                        <Input v-model="searchParams.projectName" placeholder="项目名称" />
                    </FormItem>
                </Form>
            </vIvxFilterBox>

            <div class="ivx-table-box">
                <Table ref="table"
                       border
                       :columns="tableColumns"
                       :data="filterTableData"
                       highlight-row
                       @on-row-dblclick="onRowDbclick"
                       @on-current-change="onCurrentChange"></Table>
                <!--<Page prev-text="上一页"-->
                      <!--next-text="下一页"-->
                      <!--show-total-->
                      <!--:current="searchParams.current"-->
                      <!--:page-size="searchParams.size"-->
                      <!--:total="searchParams.total"-->
                      <!--@on-change="onPageChange"></Page>-->
            </div>

            <div slot="footer">
                <Button type="primary"
                        size="large"
                        @click="add">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    import vIvxFilterBox from '../../../../components/ivxFilterBox/ivxFilterBox';
    export default {
        name: 'handleProjectSelect',   // 交工项目选择
        components: {vIvxFilterBox},
        mixins: [modalMixin],
        computed: {
            filterTableData() {
                return this.tableData.filter(val => val.projectName.indexOf(this.searchParams.projectName) > -1);
            }
        },
        data() {
            return {
                searchParams: {
                    projectName: ''
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '项目名称', minWidth: 160, align: 'center', key: 'projectName' },
                    { title: '标段', width: 160, align: 'center', key: 'part' }
                ],
                tableData: [],
                tableLoading: false,

                selectItems: null
            };
        },
        mounted() {
            this.getData();
        },
        methods: {
            // 获取表格数据
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'get',
                    url: '/projectAudit/chooseProjectListForHandover'
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records || [];
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
            },
            add() {
                this.$emit('modal-callback', this.selectItems);
                this.modalValue = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .handleProjectSelect-container {
    }
</style>