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

        <Modal v-model="modal_addPerson"
               className="modal-participant-add"
               title="单位人员"
               :width="1000"
               footer-hide>
            <vEmployeeSelectUnit unitId="unitId" @handleSelect="handleSelect_addPerson" ></vEmployeeSelectUnit>
        </Modal>


    </div>
</template>

<script>
    import vIvxFilterBox from '@/components/ivxFilterBox/ivxFilterBox';
    import vEmployeeSelectUnit from '../../../../../Common/employeeSelect_unit/employeeSelect_unit';
    
    export default {
        name: 'personParticipant',  // 单位参与人员
        components: {vIvxFilterBox, vEmployeeSelectUnit},
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
            }
        },
        created() {
            if (!this.isView) {
                let columns = [
                    {
                        title: '操作',
                        width: 120,
                        align: 'center',
                        fixed: 'right',
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
        data() {
            return {
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '姓名', width: 120, align: 'center', key: 'name' },
                    { title: 'UID', width: 80, align: 'center', key: 'uId' },
                    { title: '性别', width: 70, align: 'center', key: 'sexStr' },
                    { title: '年龄', width: 70, align: 'center', key: 'age' },
                    { title: '民族', width: 100, align: 'center', key: 'nationStr' },
                    { title: '职称级别', width: 120, align: 'center', key: 'titleLevel' },
                    { title: '技术职称', width: 120, align: 'center', key: 'titleName' },
                    { title: '学历', width: 120, align: 'center', key: 'education' },
                    { title: '联系电话', width: 120, align: 'center', key: 'phone' },
                    { title: '身份证号码', width: 160, align: 'center', key: 'IdNumber' },
                    { title: '岗位', width: 160, align: 'center', key: 'job' }
                ],
                tableData: [],

                // 添加从业人员
                modal_addPerson: false
            };
        },
        mounted() {},
        methods: {
            open_modal_addPerson() {
                this.modal_addPerson = true;
            },
            // 获取表格数据
            getData() {
                this.$http({
                    method: 'post',
                    url: '/user/list',
                    params: {
                        projectUnitId: this.projectUnitId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records || [];
                        this.searchParams.total = res.data.total;
                    }
                })
            },
            /**
             * 添加单位参与人员
             * @param selectValue  人员数组 userId ['44551', '444545']
             */
            handleSelect_addPerson(selectValue) {
                if (selectValue.length > 0) {
                    this.$http({
                        method: 'get',
                        url: '',
                        params: {
                            projectUnitId: this.projectUnitId,
                            userIds: selectValue.join(',')
                        }
                    }).then(res => {
                        if(res.code === 'SUCCESS') {
                            this.$Message.success({
                                content: '添加成功！'
                            });
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
                            url: '',
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