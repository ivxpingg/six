<template>
    <div class="modalSafetySupervisionSelect-container">
        <Modal v-model="modalValue"
               title="采信依据选择"
               :width="894"
               footer-hide>

            <div class="modal-body">
                <vIvxFilterBox>
                    <Form inline>
                        <FormItem label="搜索条件:" :label-width="65">
                            <Input v-model="searchParams.condition.searchKey"
                                   style="width: 220px;"
                                   placeholder="项目名称"/>
                        </FormItem>
                    </Form>
                </vIvxFilterBox>

                <div class="ivx-table-box">
                    <Table ref="table"
                           border
                           :height="300"
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
        </Modal>

        <!--查看附件-->
        <vViewFiles ref="modal_viewFiles" :data="filesData"></vViewFiles>
    </div>
</template>

<script>
    import modalMixin from '../../../lib/mixin/modalMixin';
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vViewFiles from '../../Common/viewFiles/viewFiles';
    import MOMENT from 'moment';
    export default {
        name: 'modalSafetySupervisionSelect',
        mixins: [modalMixin],
        components: {vIvxFilterBox, vViewFiles},
        props: {
            projectId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        searchKey: '',      // 模糊查询参数
                        projectId: '',
                        moduleType: 'security'  // 安全监督
                    }
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '督查时间', width: 120, align: 'center',
                        render: (h, params) => {
                            return h('div', MOMENT(params.row.checkTime).format('YYYY-MM-DD'));
                        }},
                    { title: '督察方式', width: 120, align: 'center', key: 'checkWayLabel' },
                    { title: '督查内容', minWidth: 180, align: 'center', key: 'content' },
                    { title: '督查类型', width: 180, align: 'center', key: 'checkTypeLabel' },
                    {
                        title: '操作',
                        width: 120,
                        align: 'center',
                        render: (h, params) => {
                            let list = [];

                            list.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'ios-eye-outline'
                                },
                                on: {
                                    click: () => {
                                        this.currentRow.projectId = params.row.projectId;
                                        this.getFilesData(params.row);
                                    }
                                }
                            }, '查看附件'));


                            // 设置列宽度
                            return h('div',{
                                style: {

                                },
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }

                ],
                tableData: [],
                tableLoading: false,

                currentRow: {
                    projectId: '',
                    projectName: '',
                    supervisionCheckId: '',
                    changeNotice: {   // 整改通知
                        changeNoticeId: '',
                        changeStatus: ''
                    },
                },

                selectItems: [],
                // 查看附件
                filesData: []
            };
        },
        watch: {
            projectId: {
                immediate: true,
                handler(val) {
                    if (val !== '') {
                        this.searchParams.condition.projectId = val;
                        this.getData();
                    }
                }
            }
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
                this.$http({
                    method: 'post',
                    url: '/supervisionCheck/list',
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
            },
            // 查看附件
            getFilesData(row) {
                this.$http({
                    method: 'get',
                    url: '/file/attachList',
                    params: {
                        relationId: row.changeNotice.changeNoticeId,
                        fileType: 'monitor_procedure'
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.filesData = res.data || [];
                        this.$refs.modal_viewFiles.modalValue = true;
                    }
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
    .modalSafetySupervisionSelect-container {
    }
</style>