<template>
    <div class="personParticipant-container">
        <vIvxFilterBox v-if="!isView">
            <Button type="primary" @click="open_modal_addPerson">新增人员</Button>
        </vIvxFilterBox>
        <div class="ivx-table-box">
            <Table border
                   height="405"
                   :columns="_tableColumns"
                   :data="tableData"></Table>
        </div>


        <vEmployeeSelect ref="modal_userSelect"
                         userSourceType="hasUnit"
                         :unitId="unitId"
                         multiple
                         :selectedValue="selectedValue"
                         filterSelected
                         @modal-callback="handleSelect_addPerson" ></vEmployeeSelect>

        <vEmployeeSelect ref="modal_userSelect_one"
                         userSourceType="hasUnit"
                         :unitId="unitId"
                         :selectedValue="selectedValue"
                         filterSelected
                         @modal-callback="handleSelect_replacePerson" ></vEmployeeSelect>

    </div>
</template>

<script>
    import vIvxFilterBox from '@/components/ivxFilterBox/ivxFilterBox';
    import vEmployeeSelect from '../../../../../Common/employeeSelect/modalEmployeeSelect';
    import MOMENT from 'moment';
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
            },
            // 项目状态 // register
            projectStatus: {
                type: String,
                default: ''
            }
        },
        created() {

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
                    { title: '姓名', width: 100, align: 'center', key: 'name' },
                    { title: '所属机构', width: 180, align: 'center', key: 'unitName' },
                    { title: '职称级别', width: 120, align: 'center', key: 'titleLevelLabel' },
                    { title: '技术职称', width: 120, align: 'center', key: 'titleNameLabel' },
                    { title: '职务', width: 160, align: 'center', key: 'job' },
                    { title: '到岗时间', width: 110, align: 'center',
                        render: (h, params) => {
                            return h('div', params.row.beginTime ? MOMENT(params.row.beginTime).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '离职时间', width: 110, align: 'center',
                        render: (h, params) => {
                            return h('div', params.row.endTime ? MOMENT(params.row.endTime).format('YYYY-MM-DD') : '');
                        }
                    }
                ],
                tableData: [],
                currentRow: {
                    userId: '',
                    name: '',
                    projectUserId: ''
                }
            };
        },
        computed: {
            selectedValue() {
                return this.tableData.map(v => v.userId);
            },

            _tableColumns() {
               return this.isView ? [
                   { title: '序号', width: 60, align: 'center', type: 'index', },
                   { title: '姓名', width: 100, align: 'center', key: 'name' },
                   { title: '所属机构', width: 180, align: 'center', key: 'unitName' },
                   { title: '职称级别', width: 120, align: 'center', key: 'titleLevelLabel' },
                   { title: '技术职称', width: 120, align: 'center', key: 'titleNameLabel' },
                   { title: '职务', width: 160, align: 'center', key: 'job' },
                   { title: '到岗时间', width: 110, align: 'center',
                       render: (h, params) => {
                           return h('div', params.row.beginTime ? MOMENT(params.row.beginTime).format('YYYY-MM-DD') : '');
                       }
                   },
                   { title: '离职时间', width: 110, align: 'center',
                       render: (h, params) => {
                           return h('div', params.row.endTime ? MOMENT(params.row.endTime).format('YYYY-MM-DD') : '');
                       }
                   }
               ] : [
                   { title: '序号', width: 60, align: 'center', type: 'index', },
                   { title: '姓名', width: 100, align: 'center', key: 'name' },
                   { title: '所属机构', width: 180, align: 'center', key: 'unitName' },
                   { title: '职称级别', width: 120, align: 'center', key: 'titleLevelLabel' },
                   { title: '技术职称', width: 120, align: 'center', key: 'titleNameLabel' },
                   { title: '职务', width: 160, align: 'center', key: 'job' },
                   { title: '到岗时间', width: 110, align: 'center',
                       render: (h, params) => {
                           return h('div', params.row.beginTime ? MOMENT(params.row.beginTime).format('YYYY-MM-DD') : '');
                       }
                   },
                   { title: '离职时间', width: 110, align: 'center',
                       render: (h, params) => {
                           return h('div', params.row.endTime ? MOMENT(params.row.endTime).format('YYYY-MM-DD') : '');
                       }
                   },
                   {
                       title: '操作',
                       width: 170,
                       align: 'center',
                       fixed: 'right',
                       render: (h, params) => {
                           let list = [];

                           // 如果是登记阶段
                           if (this.projectStatus === 'register') {
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
                           }
                           else {  // 特殊菜单权限的移除
                               list.push(h('Button', {
                                   props: {
                                       type: 'error',
                                       size: 'small',
                                       icon: 'ios-trash-outline'
                                   },
                                   on: {
                                       click: () => {
                                           this.removePersonForAdmin(params.row);
                                       }
                                   }
                               }, '移除'));

                               if (!params.row.endTime) {
                                   list.push(h('Button', {
                                       props: {
                                           type: 'error',
                                           size: 'small',
                                           icon: 'md-swap'
                                       },
                                       on: {
                                           click: () => {
                                               this.replacePerson(params.row);
                                           }
                                       }
                                   }, '变更'));
                               }
                           }

                           return h('div',{
                               class: 'ivx-table-cell-handle'
                           },list);
                       }
                   }
               ]
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
                    url: '/project/viewAllProjectUser',
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
                            url: '/project/deleteProjectUser',
                            params: {
                                projectId: this.projectId,
                                projectUserId: row.projectUserId
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
                })
            },
            removePersonForAdmin(row) {
                this.$Modal.confirm({
                    title: '移除人员',
                    content: `确定要移除<${row.name}>?`,
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/project/deleteProjectUserForAdmin',
                            params: {
                                projectId: this.projectId,
                                projectUserId: row.projectUserId
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
                })
            },

            handleSelect_replacePerson(selectValue, selectItems) {
                this.$Modal.confirm({
                    title: '替换人员',
                    content: `确定要用<${selectItems.name}>替换<${this.currentRow.name}>?`,
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/project/changeProjectUser',
                            params: {
                                userId: selectItems.userId,
                                projectUserId: this.currentRow.projectUserId
                            }
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '替换成功！'
                                });
                                this.getData();
                            }
                        })
                    }
                })
            },
            // 替换人员
            replacePerson(row) {
                Object.assign(this.currentRow, row);
                this.$refs.modal_userSelect_one.modalValue = true;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .personParticipant-container {
    }
</style>