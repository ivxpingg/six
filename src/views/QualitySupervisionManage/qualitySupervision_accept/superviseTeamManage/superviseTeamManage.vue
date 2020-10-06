<template>
    <div class="superviseTeamManage-container">
        <vIvxFilterBox v-show="!isView">
            <Button type="primary"
                    icon="md-add" @click="modal_addStep_open">新增人员</Button>
        </vIvxFilterBox>

        <div class="ivx-table-box">
            <Table border
                   height="280"
                   :loading="tableLoading"
                   :columns="_tableColumns"
                   :data="tableData"></Table>
        </div>
        <!--<div class="ivu-modal-footer">-->
            <!--<Button type="primary"-->
                    <!--size="large"-->
                    <!--@click="save">确定</Button>-->
        <!--</div>-->

        <vAddSuperviseTeamPerson
                ref="modal_addSuperviseTeamPerson"
                :projectId="projectId"
                @modal-callback="modal_addSuperviseTeamPerson_callback"></vAddSuperviseTeamPerson>

    </div>
</template>

<script>
    import vIvxFilterBox from '../../../../components/ivxFilterBox/ivxFilterBox';
    import vAddSuperviseTeamPerson from './addSuperviseTeamPerson/addSuperviseTeamPerson';
    export default {
        name: 'superviseTeamManage', // 监督小组管理
        components: {vIvxFilterBox, vAddSuperviseTeamPerson},
        props: {
            projectId: {
                type: String,
                required: true,
                default: ''
            },
            isView: {
                type: Boolean,
                default: false
            }
        },
        watch:{
            projectId(val) {
                if (val !== '') {
                    this.getData();
                }
            }
        },
        computed: {
            _tableColumns() {
                if (this.isView) {
                    return this.tableColumns;
                }
                else {
                    return this.tableColumns.concat([
                        {
                            title: '操作',
                            width: 100,
                            align: 'center',
                            render: (h, params) => {
                                let list = [
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small',
                                            icon: 'ios-trash-outline'
                                        },
                                        on: {
                                            click: () => {
                                                this.delPerson(params.row);
                                            }
                                        }
                                    }, '移除')
                                ];

                                return h('div',{
                                    class: 'ivx-table-cell-handle'
                                },list);
                            }
                        }
                    ]);
                }
            }
        },
        data() {
            return {
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '人员名称', minWidth: 100, align: 'center', key: 'name' },
                    { title: '类型', width: 100, align: 'center', key: 'monitorTypeLabel' },
                    // { title: '监督项目', align: 'center', key: 'projectName' },
                    { title: '操作时间', width: 140, align: 'center', key: 'insTime',
                        render:(h, params) => {
                            return h('div', this.$moment(params.row.insTime).format('YYYY-MM-DD HH:mm'));
                        }
                    },
                    { title: '操作用户', width: 100, align: 'center', key: 'createBy' }

                ],
                tableData:[
                    // {
                    //     monitorGroupId: '001',  // 主键ID
                    //     userId: '01',          // 人员ID
                    //     name: '王科长',            // 人员名称
                    //     projectName: '霍邱县S310霍邱至众兴路一级公路改建工程',          // 项目名称
                    //     monitorType: 'person_in_charge',     // 人员类型
                    //     monitorTypeLabel: '负责人',
                    //     createBy: '管理员',        // 操作用户
                    //     insTime: '2018-08-01'          // 操作时间
                    // }
                ],
                tableLoading: false
            };
        },
        mounted() {},
        methods: {
            modal_addStep_open() {
                this.$refs.modal_addSuperviseTeamPerson.modalValue = true;
            },
            modal_addSuperviseTeamPerson_callback() {
                this.getData();
                this.$refs.modal_addSuperviseTeamPerson.modalValue = false;
            },
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'get',
                    url: '/monitorGroup/list',
                    params: {
                        projectId: this.projectId
                    }
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data || [];
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            },

            delPerson(row) {
                this.$Modal.confirm({
                    title: '移除人员',
                    content: `确定要移除<${row.name}>?`,
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/monitorGroup/delete',
                            params: {
                                monitorGroupId: row.monitorGroupId
                            }
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '移除成功！'
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
    .superviseTeamManage-container {
    }
</style>