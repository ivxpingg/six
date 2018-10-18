<template>
    <div class="addUnitAndPerson-container">
        <vIvxFilterBox dashed v-if="!isView">
            <Button type="primary"
                    icon="md-add"
                    @click="modal_addUnit_open">添加参建单位</Button>
        </vIvxFilterBox>
        <div class="ivx-table-box">
            <Table border
                   height="540"
                   :loading="tableLoading"
                   :columns="tableColumns"
                   :data="tableData"></Table>
        </div>

        <!--<Modal v-model="modal_addUnit"-->
               <!--title="添加从业单位"-->
               <!--:width="1000"-->
               <!--footer-hide>-->
            <!--<vUnitSelect @handleSelect="handleSelect_addUnit"></vUnitSelect>-->
        <!--</Modal>-->

        <vModalUnitSelect ref="modal_unitSelect"
                          :zIndex="2000"
                          @modal-callback="modal_unitSelect_callback" ></vModalUnitSelect>

        <Modal v-model="modal_participant"
               title="单位参建人员"
               :width="1000"
               footer-hide>
            <vPersonParticipant isView projectUnitId="projectUnitId"></vPersonParticipant>
        </Modal>



    </div>
</template>

<script>
    import vIvxFilterBox from '../../../../../components/ivxFilterBox/ivxFilterBox';
    // import vUnitSelect from '../../../../Common/unitSelect/unitSelect';
    import vPersonParticipant from './personParticipant/personParticipant';
    import vModalUnitSelect from '../../../../Common/unitSelect/modalUnitSelect';
    export default {
        name: 'addUnitAndPerson',  // 质量监督登记-参建单位与人员
        components: {vIvxFilterBox, vPersonParticipant, vModalUnitSelect},
        props: {
            isView: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            projectId: {
                type: String,
                default: ''
            }
        },
        created() {
            let columns = [
                {
                    title: '操作',
                    width: this.isView ? 120 : 220,
                    align: 'center',
                    fixed: 'right',
                    render: (h, params) => {
                        let list = [];

                        list.push(h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small',
                                icon: 'ios-create-outline'
                            },
                            on: {
                                click: () => {
                                    this.projectUnitId = params.row.projectUnitId;
                                    this.modal_participant = true;
                                }
                            }
                        }, '人员信息'));

                        if (!this.isView) {
                            list.push(h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    icon: 'ios-trash-outline'
                                },
                                on: {
                                    click: () => {
                                        this.projectUnitId = params.row.projectUnitId;
                                        this.removeUnit(params.row);
                                    }
                                }
                            }, '移除单位'));
                        }

                        return h('div',{
                            class: 'ivx-table-cell-handle'
                        },list);
                    }
                }
            ];

            this.tableColumns = this.tableColumns.concat(columns);
        },
        data() {
            return {
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '单位名称', width: 180, align: 'center', key: 'unitName' },
                    { title: '机构代码', width: 180, align: 'center', key: 'orgCode' },
                    { title: '资质类别', width: 180, align: 'center', key: 'qualificationTypeLabel' },
                    { title: '资质许可等级', width: 180, align: 'center', key: 'qualification' },
                    { title: '单位类型', width: 180, align: 'center', key: 'unitTypeLabel' },
                    { title: '负责人', width: 180, align: 'center', key: 'leader' },
                    { title: '联系方式', width: 180, align: 'center', key: 'telephone' },
                    { title: '电子邮件', width: 180, align: 'center', key: 'email' },
                    { title: '公司地址', width: 180, align: 'center', key: 'companyAddress' },
                    // { title: '备案', width: 180, align: 'center', key: 'unitName' }
                ],
                tableData: [],
                tableLoading: false,

                // 添加单位
                modal_addUnit: false,

                // 选中的参建单位
                unitId: '',

                // 参建单位人员信息
                modal_participant: false,
                projectUnitId: ''
            };
        },
        watch: {
            projectId: {
                immediate: true,
                handler(val) {
                    if (val !== '') {
                        this.getData();
                    }
                }
            }
        },
        mounted() {
        },
        methods: {
            modal_addUnit_open() {
                // this.modal_addUnit = true;
                this.$refs.modal_unitSelect.modalValue = true;
            },
            modal_unitSelect_callback(selectValue, selectItems) {

                this.$http({
                    method: 'post',
                    url: '/project/addProjectUnit',
                    data: JSON.stringify({
                        projectId: this.projectId,
                        unitId: selectItems.unitId
                    })
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.$Message.success('添加参建成功!');
                        this.getData();
                    }
                });

            },
            // 获取表格数据
            getData() {

                this.tableLoading = true;
                this.$http({
                    method: 'get',
                    url: '/project/projectUnitList',
                    params: {
                        projectId: this.projectId
                    }
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data;
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            },

            /**
             * 添加新增选择的单位
             * @param selectValue 单位数组 unitId
             */
            handleSelect_addUnit(selectValue) {

            },
            // 移除参建单位
            removeUnit(row) {
                this.$Modal.confirm({
                    title: '移除',
                    content: `确定要移除<${row.unitName}>单位？`,
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/',
                            params: {
                                projectId: this.projectId,
                                unitId: row.unitId
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
    .addUnitAndPerson-container {
    }
</style>