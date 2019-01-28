<template>
    <div class="QA_report-container">
        <vIvxFilterBox v-if="auth_add">
            <Button type="primary"
                    icon="md-add"
                    @click="modal_add_open">上传报表</Button>
        </vIvxFilterBox>
        <div class="ivx-table-box">
            <Table border
                   :height="540"
                   :loading="tableLoading"
                   :columns="_tableColumns"
                   :data="tableData"></Table>
        </div>

        <vAddReport ref="modal_add" @modal-callback="modal_add_callback"></vAddReport>

        <vViewFiles ref="modal_viewFiles" :data="fileList"></vViewFiles>
    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vAddReport from './addReport/addReport';
    import viewFilesMixin from '../../Common/viewFiles/mixin';
    import authMixin from '../../../lib/mixin/authMixin';
    export default {
        name: 'QA_report',  // 质量检测报表
        mixins: [viewFilesMixin, authMixin],
        components: {vIvxFilterBox, vAddReport},
        computed: {
            _tableColumns() {
                return this.auth_del || this.auth_view ? this.tableColumns.concat([{
                    title: '操作',
                    width: 170,
                    align: 'center',
                    // fixed: 'right',
                    render: (h, params) => {
                        let list = [];

                        if (this.auth_del) {
                            list.push(h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    icon: 'ios-trash-outline'
                                },
                                on: {
                                    click: () => {
                                        this.del(params.row);
                                    }
                                }
                            }, '删除'));
                        }

                        list.push(h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small',
                                icon: 'ios-eye'
                            },
                            on: {
                                click: () => {
                                    this.getData_vViewFile(params.row.reportRecordId, 'report', 'fileList');
                                    this.$refs.modal_viewFiles.modalValue = true;
                                }
                            }
                        }, '查看'));

                        return h('div', {
                            class: 'ivx-table-cell-handle'
                        }, list);
                    }
                }]) : this.tableColumns;
            }
        },
        data() {
            return {
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '报表名称', align: 'center', key: 'reportName' },
                    { title: '年度报表', width: 180, align: 'center', key: 'reportYear' },
                    { title: '上传时间', width: 180, align: 'center', key: 'insTime',
                        render: (h, params) => {
                            return h('div', params.row.insTime ? this.$moment(params.row.insTime).format('YYYY-MM-DD HH:mm:ss') : '');
                        }
                    },
                    { title: '操作人', width: 180, align: 'center', key: 'userName' },
                    { title: '备注', width: 180, align: 'center', key: 'remark' },

                ],
                tableData: [ ],
                tableLoading: false,

                // 附件
                fileList: []
            };
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
        mounted() {
            this.getData();
        },
        methods: {
            modal_add_open() {
                this.$refs.modal_add.modalValue = true;
            },
            // 获取表格数据
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'get',
                    url: '/report/list'
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data;
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            },
            // 删除
            del(row) {
                this.$Modal.confirm({
                    title: '删除',
                    content: `确认要删除<${row.reportName}>报表?`,
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/report/delete',
                            params: {
                                reportRecordId: row.reportRecordId
                            }
                        }).then((res) => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('删除成功!');
                                this.getData();
                            }
                        });
                    }
                })
            },

            modal_add_callback() {
                this.getData();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .QA_report-container {
    }
</style>