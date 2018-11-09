<template>
    <div class="personParticipant-container">
        <vIvxFilterBox v-if="!isView">
            <Button type="primary" @click="open_modal_addPerson">新增人员</Button>
        </vIvxFilterBox>
        <div class="ivx-table-box">
            <Table border
                   height="405"
                   :columns="tableColumns"
                   :data="tableData"></Table>
        </div>


        <vEmployeeSelect ref="modal_userSelect"
                         userSourceType="hasUnit"
                         :unitId="unitId"
                         multiple
                         :selectedValue="selectedValue"
                         filterSelected
                         @modal-callback="handleSelect_addPerson" ></vEmployeeSelect>

    </div>
</template>

<script>
    import vIvxFilterBox from '@/components/ivxFilterBox/ivxFilterBox';
    import vEmployeeSelect from '../../../../../Common/employeeSelect/modalEmployeeSelect';

    export default {
        name: 'personParticipant',  // 单位参与人员
        components: {vIvxFilterBox, vEmployeeSelect},
        props: {
            isView: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            projectUnitId: {
                type: String,
                required: true
            },
            unitId:  {
                type: String,
                required: true
            },
            projectId: {
                type: String,
                default: ''
            }
        },
        created() {
            if (!this.isView) {
                let columns = [
                    {
                        title: '操作',
                        width: 120,
                        align: 'center',
                        // fixed: 'right',
                        render: (h, params) => {
                            let list = [];

                            list.push(h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    icon: 'ios-trash-outline'
                                },
                                on: {
                                    click: () => {
                                        this.removePerson(params.row);
                                    }
                                }
                            }, '移除'));
                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ];

                this.tableColumns = this.tableColumns.concat(columns);
            }
        },
        watch: {
            projectUnitId(val) {
                if (val !== '') {
                    this.getData();
                }
            }
        },
        data() {
            return {
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '姓名', width: 120, align: 'center', key: 'name' },
                    { title: '所属机构', width: 180, align: 'center', key: 'unitName' },
                    { title: '职务', width: 180, align: 'center', key: '职务' }
                ],
                tableData: [
                    // {
                    //     beginTime: 1540880320000,
                    //     job: "局长",
                    //     name: "郑兆宇",
                    //     projectUnitId: "e6bdadfaed9d46909a89412a31a904b4",
                    //     unitName: "安徽省路港工程有限责任公司",
                    //     userId: "3"
                    // }
                ]
            };
        },
        computed: {
            selectedValue() {
                return this.tableData.map(v => v.userId);
            }
        },
        mounted() {},
        methods: {
            open_modal_addPerson() {
                this.$refs.modal_userSelect.modalValue = true;
            },
            // 获取表格数据
            getData() {
                this.$http({
                    method: 'get',
                    url: '/project/viewProjectUser',
                    params: {
                        projectUnitId: this.projectUnitId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data || [];
                    }
                })
            },
            /**
             * 添加单位参与人员
             * @param selectValue  人员数组 userId ['44551', '444545']
             */
            handleSelect_addPerson(selectValue, selectItems) {
                if (selectValue.length > 0) {
                    this.$http({
                        method: 'get',
                        url: '/project/addProjectUser',
                        params: {
                            projectId: this.projectId,
                            projectUnitId: this.projectUnitId,
                            userIds: selectValue.join(',')
                        }
                    }).then(res => {
                        if (res.code === 'SUCCESS') {
                            this.$Message.success({
                                content: '添加成功！'
                            });
                            this.getData();
                        }
                    })
                }

            },
            removePerson(row) {
                this.$Modal.confirm({
                    title: '移除人员',
                    content: `确定要移除<${row.name}>?`,
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/project/',
                            params: {
                                projectUserId: row.projectUserId
                            }
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '移除成功！'
                                });
                            }
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .personParticipant-container {
    }
</style>