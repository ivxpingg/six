<template>
    <div class="modalLogView-container">
        <Modal v-model="modalValue"
               :width="800"
               title="日志查看"
               footer-hide>
            <div class="ivx-table-box">
                <Table ref="table"
                       border
                       :height="434"
                       size="small"
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
        </Modal>
    </div>
</template>

<script>
    import modalMixin from '../../../lib/mixin/modalMixin';
    export default {
        name: 'modalLogView',
        mixins: [modalMixin],
        props: {
            logType: {
                type: String,
                required: true
            }
        },
        watch: {
            modalValue(val) {
                this.searchParams.condition.logType = this.logType;
                if(val && this.logType !== '') {
                    this.getData();
                }
            }
        },
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        logType: 'index'
                    }
                },
                tableColumns: [
                    {
                        type: 'index',
                        title: '序号',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '操作人',
                        width: 80,
                        key: 'operator',
                        align: 'center'
                    }
                    ,
                    {
                        title: '操作类型',
                        width: 90,
                        key: 'operateTypeLabel',
                        align: 'center'
                    },
                    {
                        title: '操作内容',
                        minWidth: 120,
                        tooltip: true,
                        key: 'operateContent',
                        align: 'center'
                    },
                    {
                        title: '操作时间',
                        width: 150,
                        tooltip: true,
                        key: 'operateTime',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', params.row.operateTime ? this.$moment(params.row.operateTime).format('YYYY-MM-DD HH:mm') : '');
                        }
                    }
                ],
                tableData: [],
                tableLoading: false,
            };
        },
        methods: {
            /**
             * 分页控件-切换页面
             * @param current
             */
            onPageChange(current) {
                this.searchParams.current = current;
            },
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/operateLog/list',
                    data: JSON.stringify(this.searchParams)
                }).then(res => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records || [];
                    }
                }).catch(() => {
                    this.tableLoading = false;
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modalLogView-container {
    }
</style>