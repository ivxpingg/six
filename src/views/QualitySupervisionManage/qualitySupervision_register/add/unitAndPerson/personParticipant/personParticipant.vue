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
                tableData: [
                    // {
                    //     age: 20,
                    //     certificate: "二级建造师",
                    //     certificateNo: "00247946",
                    //     graduateSchool: "中国科学技术大学",
                    //     idNumber: "342401196707274917",
                    //     name: "储修华",
                    //     nation: "汉",
                    //     phone: "12030001400",
                    //     profession: "计算机应用",
                    //     sexLabel: "男",
                    //     titleLevelLabel: "高级",
                    //     titleNameLabel: "工程师",
                    //     unitName: "安徽巢湖路桥建设集团有限公司",
                    //     unitTypeLabel: "建设单位",
                    //     userId: "30",
                    //     userNo: "E56152",
                    // }
                ]
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    .personParticipant-container {
    }
</style>