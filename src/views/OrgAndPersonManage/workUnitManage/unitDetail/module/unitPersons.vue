<template>
    <div class="unitPersons-container">
        <vIvxFilterBox>
            <Button type="primary" @click="open_modal_addPerson">新增人员</Button>
            <!--<Button type="primary">人员变更</Button>-->
        </vIvxFilterBox>
        <div class="ivx-table-box">
            <Table border
                   height="405"
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

        <!--<Modal v-model="modal_addPerson"-->
               <!--className="modal-unitPersons-add"-->
               <!--title="从业人员"-->
               <!--:width="1200"-->
               <!--footer-hide>-->
            <!--<vEmployeeSelect v-if="modal_addPerson"-->
                             <!--@handleSelect="addPersons"></vEmployeeSelect>-->
        <!--</Modal>-->

        <vModalEmployeeSelect
                ref="modalEmployeeSelect"
                :selectedValue="selectedValue"
                userSourceType="noUnit"
                filterSelected
                multiple
                @modal-callback="modal_addSelectedPerson_callback"></vModalEmployeeSelect>
    </div>
</template>

<script>
    import vIvxFilterBox from '@/components/ivxFilterBox/ivxFilterBox';
    import vModalEmployeeSelect from '../../../../Common/employeeSelect/modalEmployeeSelect';
    export default {
        name: 'unitPersons',  // 单位人员
        components: {vIvxFilterBox, vModalEmployeeSelect},
        props: {
            unitId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 7,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        userSource: 'hasUnit',
                        unitId: ''
                    }

                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '姓名', width: 120, align: 'center', key: 'name' },
                    // { title: 'UID', width: 80, align: 'center', key: 'uId' },
                    { title: '性别', width: 70, align: 'center', key: 'sexLabel' },
                    { title: '年龄', width: 70, align: 'center', key: 'age' },
                    { title: '民族', width: 100, align: 'center', key: 'nation' },
                    { title: '职称级别', width: 120, align: 'center', key: 'titleLevelLabel' },
                    { title: '技术职称', width: 120, align: 'center', key: 'titleNameLabel' },
                    { title: '学历', width: 120, align: 'center', key: 'educationLabel' },
                    { title: '联系电话', width: 120, align: 'center', key: 'phone' },
                    { title: '身份证号码', width: 160, align: 'center', key: 'idNumber' },
                    { title: '岗位', width: 160, align: 'center', key: 'job' },
                    {
                        title: '操作',
                        width: 120,
                        align: 'center',
                        fixed: 'right',
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
                                            this.removePerson(params.row);
                                        }
                                    }
                                }, '移除')
                            ];

                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [],

                // 添加从业人员
                modal_addPerson: false
            };
        },
        watch: {
            'searchParams.current'() {
                this.getData();
            },
            unitId: {
                immediate: true,
                handler(val) {
                    if (val) {
                        this.searchParams.condition.unitId = this.unitId;
                        this.getData();
                    }
                }
            }
        },
        computed: {
            // 已选人员userId [1,2,3]
            selectedValue() {
                return this.tableData.map(v => v.userId);
            }
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
                this.$http({
                    method: 'post',
                    url: '/user/list',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records || [];
                        this.searchParams.total = res.data.total;
                    }
                })
            },

            open_modal_addPerson() {
                this.$refs.modalEmployeeSelect.modalValue = true;
            },

            /**
             * 添加人员
             * @param selectValue
             * @param selectItems
             */
            modal_addSelectedPerson_callback(selectValue, selectItems) {
                let datas = selectItems.map(val => val.userId);
                this.$http({
                    method: 'get',
                    url: '/unit/addUser',
                    params: {
                        unitId: this.unitId,
                        userIds: datas.join(',')
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.$Message.success({
                            content: '添加成功！'
                        });
                        this.getData();
                    }
                });
            },

            // 移除人员
            removePerson(row) {
                this.$Modal.confirm({
                    title: '移除人员',
                    content: `确定要移除<${row.name}>?`,
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/unit/deleteUser',
                            params: {
                                userId: row.userId,
                                unitId: this.unitId
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
    .unitPersons-container {
    }
</style>
<style lang="scss">
    .modal-unitPersons-add {
        z-index: 1001;
        .ivu-modal-body {
            /*padding: 0;*/
        }
    }
</style>