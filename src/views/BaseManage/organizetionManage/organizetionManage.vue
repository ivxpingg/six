<template>
    <div class="organizetionManage-container ivu-card ivu-card-bordered ivu-card-dis-hover">
        <div class="left-panel">
            <vBTree @onSelectChange="onSelectChange"></vBTree>
        </div>
        <div class="right-panel" v-show="selectType === 'role'">
            <Card :bordered="false" dis-hover>
                <vIvxFilterBox>
                    <Button type="primary" @click="onClick_addUser" :class="{'six-auth-hide': !auth_add}">添加人员</Button>
                </vIvxFilterBox>

                <div class="ivx-table-box">
                    <Table border
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
            </Card>
        </div>

        <Modal v-model="modal_userDetail"
               className="modal-userDetail modal-body-padding0"
               :title="userType === 'employee' ? '从业人员详情' : '监督人员详情'"
               :width="1200"
               footer-hide>
            <vPersonDetail v-show="userType === 'employee'" :userId="userId"></vPersonDetail>
            <vSupervisorDetail v-show="userType === 'supervisor'" :userId="userId"></vSupervisorDetail>
        </Modal>

        <vModalEmployeeSelect
                ref="modalEmployeeSelect"
                :selectedValue="selectedValue"
                filterSelected
                multiple
                @modal-callback="modal_addSelectedPerson_callback"></vModalEmployeeSelect>



        <Modal v-model="modal_eSignatrueSelect"
               title="电子签名选择"
               :width="800"
               footer-hide>
            <vESignnatureSelect v-if="modal_eSignatrueSelect"
                                @handleSelect="add_eSignature"
                                class="six-modal-body-inner">  </vESignnatureSelect>
        </Modal>
    </div>
</template>
<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vBTree from './bTree/bTree';
    import vPersonDetail from '../../OrgAndPersonManage/workPersonManage/personDetail/personDetail';
    import vSupervisorDetail from '../../OrgAndPersonManage/supervisorsManage/supervisorDetail/supervisorDetail';
    import vEmployeeSelect from '../../Common/employeeSelect/employeeSelect';
    import vESignnatureSelect from '../../Common/eSignatureSelect/eSignatureSelect';
    import authMixin from '../../../lib/mixin/authMixin';
    import vModalEmployeeSelect from '../../Common/employeeSelect/modalEmployeeSelect';
    export default {
        name: 'organizetionManage',   // 组织结构
        components: {
            vIvxFilterBox,
            vBTree,
            vPersonDetail,
            vSupervisorDetail,
            vEmployeeSelect,
            vESignnatureSelect,
            vModalEmployeeSelect},
        mixins: [authMixin],
        data() {
            return {
                selectType: '',   // 当前选中节点类型 'group': 分组; 'role' : 角色
                nodeItem: { // 当前选中节点 角色分组节点数据
                    roleId: '',
                    parentId: '',
                    roleNo: '',
                    name: '',
                    remark: '',
                    nodeType: '',
                    sort: 0,
                },
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        searchKey: '',      // 模糊查询参数
                        unitType: '',
                        roleId: ''
                    }

                },
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '姓名', width: 100, align: 'center', key: 'userName' },
                    { title: '单位', width: 100, align: 'center', key: 'unitName' },
                    { title: '职务', width: 100, align: 'center', key: 'job' },
                    { title: '联系电话', width: 120, align: 'center', key: 'phone' },
                    // { title: '电子签名授权状态', width: 100, align: 'center', key: 'signatureStatusLabel' },
                    { title: '被授权的电子签名名称', minWidth: 100, align: 'center', key: 'signatureName' },
                    {
                        title: '操作',
                        width: 310,
                        // align: 'center',
                        render: (h, params) => {
                            let list = [
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small',
                                        icon: 'ios-eye-outline'
                                    },
                                    on: {
                                        click: () => {
                                            this.userId = params.row.userId;
                                            this.userType = params.row.userType;
                                            this.modal_userDetail = true;
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    'class': {
                                        'six-auth-hide': !this.auth_add
                                    },
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-image'
                                    },
                                    on: {
                                        click: () => {
                                            this.userId = params.row.userId;
                                            this.modal_eSignatrueSelect = true;
                                        }
                                    }
                                }, '授权电子签名'),
                                h('Button', {
                                    'class': {
                                        'six-auth-hide': !this.auth_del
                                    },
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'ios-trash-outline'
                                    },
                                    on: {
                                        click: () => {
                                            this.removeUser(params.row);
                                        }
                                    }
                                }, '移除人员')
                            ];

                            return h('div',{
                                'class': 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [],
                tableLoading: false,

                // 查看人员详情， 分为从业人员详情和监督单位人员详情
                modal_userDetail: false,
                userType: '',         //用户类型， 从业人员或者监督人员
                userId: '',

                // 授权电子签名
                modal_eSignatrueSelect: false
            }
        },
        computed: {
            // 已选人员userId [1,2,3]
            selectedValue() {
                return this.tableData.map(v => v.userId);
            }
        },
        mounted() { },
        methods: {
            /**
             * 分页控件-切换页面
             * @param current
             */
            onPageChange(current) {
                this.searchParams.current = current;
            },
            onClick_addUser() {
                this.$refs.modalEmployeeSelect.modalValue = true;
            },
            modal_addSelectedPerson_callback(selectValue, selectItems) {
                let datas = [];
                selectItems.forEach(val => {
                    datas.push({
                        userId: val.userId,
                        roleId: this.nodeItem.roleId
                    })
                });

                this.$http({
                    method: 'post',
                    url: '/userRole/add',
                    data: JSON.stringify(datas)
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.$Message.success({
                            content: '添加成功！'
                        });
                        this.getData();
                    }
                });
            },

            // 获取表格数据
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/user/userListByRoleType',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records || [];
                        this.searchParams.total = res.data.total;
                    }
                }).catch(() => {
                    this.tableLoading = false;
                });
            },

            // 选择角色
            onSelectChange(item) {
                if (item.length === 0) {
                    this.selectType = '';
                }
                else {
                    this.selectType = item[0].nodeType;
                    this.nodeItem = Object.assign(this.nodeItem, item[0]);

                    if (this.selectType === 'role') {
                        this.searchParams.condition.roleId = this.nodeItem.roleId;
                        this.getData();
                    }
                }
            },

            // 移除人员
            removeUser(row) {
                this.$Modal.confirm({
                   title: '移除人员',
                   content: `确定要移除<${row.name}人员？>`,
                    onOk:() => {
                        this.$http({
                            method: 'post',
                            url: '/userRole/delete',
                            data: JSON.stringify([
                                {
                                    userId: row.userId,
                                    roleId: this.nodeItem.roleId
                                }
                            ])
                        }).then((res) => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success({
                                   content: '移除成功！'
                                });
                                this.getData();
                            }
                        })
                    }
                });

            },
            // 授权电子签名
            add_eSignature(selectValue, selectItems) {
                this.$http({
                    method: 'post',
                    url: '/signature/userSignature',
                    data: JSON.stringify({
                        signatureId: selectItems.signatureId,
                        userId: this.userId
                    })
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.$Message.success({
                            content: '授权成功！'
                        });
                        this.modal_eSignatrueSelect = false;
                        this.getData();
                    }
                })
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    .organizetionManage-container {
        position: relative;
        display: flex;
        min-height: 700px;
        .left-panel {
            width: 300px;
            height: 100%;
            min-height: 700px;
            border-right: 1px solid #dcdee2;
        }
        .right-panel {
            flex: 1;
        }
    }
</style>

<style lang="scss">

</style>