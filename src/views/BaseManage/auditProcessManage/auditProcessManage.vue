<template>
    <div class="auditProcessManage-container">
        <div class="left-panel">
            <vIvxFilterBox dashed>
                <Button type="primary"
                        icon="md-add" @click="modal_addPlan_open">新增审核方案</Button>
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
        <div class="right-panel">

        </div>

        <Modal v-model="modal_addPlan"
               title="新增审核方案"
               :width="360"
               footer-hide>
            <vAddPlan @modal_addPanel_callback="modal_addPanel_callback"></vAddPlan>
        </Modal>

        <Modal v-model="modal_editPlan"
               title="修改审核方案"
               :width="360"
               footer-hide>
            <vEditPlan :auditProcessId="auditProcessId" @modal_editPanel_callback="modal_editPanel_callback"></vEditPlan>
        </Modal>

        <Modal v-model="modal_editPlanProcess"
               className="modal-editPlanProcess"
               title="审核步骤"
               :width="1100"
               footer-hide>
            <vEditPlanProcess :auditProcessId="auditProcessId"
                              @modal_editPanelProcess_callback="modal_editPanelProcess_callback"></vEditPlanProcess>
        </Modal>
    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vAddPlan from './addPlan/addPlan.vue';
    import vEditPlan from './editPlan/editPlan.vue';
    import vEditPlanProcess from './editPlanProcess/editPlanProcess.vue';
    import MOMENT from 'moment';
    export default {
        name: 'auditProcessManage',
        components: {
            vIvxFilterBox,
            vAddPlan,
            vEditPlan,
            vEditPlanProcess
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
                    current: 1,        // 当前第几页
                    size: 10,          // 每页几行
                    total: 0,          // 总行数
                    condition: {
                        searchKey: ''  // 模糊查询参数
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
                    { title: '备注', width: 180, align: 'center', key: 'remark' },
                    {
                        title: '操作',
                        width: 350,
                        align: 'center',
                        render: (h, params) => {
                            let list = [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-create-outline'
                                    },
                                    on: {
                                        click: () => {
                                            this.auditProcessId = params.row.auditProcessId;
                                            this.modal_editPlan = true;
                                        }
                                    }
                                }, '编辑审核方案'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-create-outline'
                                    },
                                    on: {
                                        click: () => {
                                            this.auditProcessId = params.row.auditProcessId;
                                            this.modal_editPlanProcess = true;
                                        }
                                    }
                                }, '编辑方案流程'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'ios-trash-outline'
                                    },
                                    on: {
                                        click: () => {
                                             this.delPlan(params.row);
                                        }
                                    }
                                }, '删除')
                            ];

                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [
                    // {
                    //     auditProcessId: "1",
                    //     name: "质量监督受理流程",
                    //     operateTime: 1537473902000,
                    //     operator: "管理员",
                    //     remark: "测试使用",
                    //     steps: 4,
                    //     timeLimit: 10
                    // }
                ],
                tableLoading: true,

                // 新增审核方案
                modal_addPlan: false,

                // 编辑审核方案
                modal_editPlan: false,
                auditProcessId: '',

                // 编辑审核方案流程
                modal_editPlanProcess: false
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
                        this.tableData = res.data.records;
                        this.searchParams.total = res.data.page.total;
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            },

            modal_addPlan_open(){
                this.modal_addPlan = true;
            },
            modal_addPanel_callback() {
                this.modal_addPlan = false;
                this.getData();
            },
            modal_editPanel_callback() {
                this.modal_editPlan = false;
                this.getData();
            },
            modal_editPanelProcess_callback() {
                this.getData();
            },
            // 删除审核方案
            delPlan(row) {
                this.$Modal.confirm({
                    title: '删除',
                    content: `确定要删除<${row.name}>审核方案？`,
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/auditProcess/delete',
                            params: {
                                auditProcessId: row.auditProcessId
                            }
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '删除成功！'
                                });
                                this.getData();
                            }
                        })
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .auditProcessManage-container {
        display: flex;

        .left-panel {
            width: 1212px;

        }
        .right-panel{
            flex: 1;
        }
    }
</style>

<style lang="scss">
    .modal-editPlanProcess {
        .ivu-modal-body {
            padding: 0;
        }
    }
</style>