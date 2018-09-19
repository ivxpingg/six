<template>
    <div class="organizetionManage-container ivu-card ivu-card-bordered ivu-card-dis-hover">
        <div class="left-panel">
            <vBTree @onSelectChange="onSelectChange"></vBTree>
        </div>
        <div class="right-panel">
            <Card :bordered="false" dis-hover>
                <vIvxFilterBox>
                    <Button type="primary" @click="onClick_addUser">添加人员</Button>
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
                          :on-change="onPageChange"></Page>
                </div>
            </Card>
        </div>

        <Modal v-model="modal_userDetail"
               className="modal-userDetail"
               :title="userType === '0' ? '从业人员详情' : '监督人员详情'"
               :width="1200"
               footer-hide>
            <vPersonDetail v-show="userType === '0'" :user-id="userId"></vPersonDetail>
            <vSupervisorDetail v-show="userType === '1'" :user-id="userId"></vSupervisorDetail>
        </Modal>

        <Modal v-model="modal_addUser"
               title="人员选择"
               :width="1200"
               footer-hide>

        </Modal>
    </div>
</template>
<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vBTree from './bTree/bTree';
    import vPersonDetail from '../../OrgAndPersonManage/workPersonManage/personDetail/personDetail';
    import vSupervisorDetail from '../../OrgAndPersonManage/supervisorsManage/supervisorDetail/supervisorDetail';
    export default {
        name: 'organizetionManage',   // 组织结构
        components: {vIvxFilterBox, vBTree, vPersonDetail, vSupervisorDetail},
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    beginDate: '',     // 开始时间
                    endDate: '',       // 结束时间
                    searchKey: '',      // 模糊查询参数
                    unitType: ''
                },
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '姓名', width: 120, align: 'center', key: 'name' },
                    { title: '单位', width: 160, align: 'center', key: 'unitName' },
                    { title: '职务', width: 160, align: 'center', key: 'job' },
                    { title: '联系电话', width: 120, align: 'center', key: 'phone' },
                    { title: '电子签名授权状态', width: 180, align: 'center', key: 'signatureStatusLabel' },
                    { title: '被授权的电子签名名称', width: 180, align: 'center', key: 'signatureName' },
                    {
                        title: '操作',
                        width: 120,
                        align: 'center',
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
                                }, '查看')
                            ];

                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [
                    {
                        userId: '001',
                        name: '陈亮',
                        userType: '0',
                        unitName: '市交通质监局',
                        job: '负责人',
                        phone: '13959625414',
                        signatureStatusLabel: '已授权',
                        signatureName: '陈亮电子签名'
                    },
                    {
                        userId: '002',
                        name: '陈亮',
                        userType: '1',
                        unitName: '市交通质监局',
                        job: '负责人',
                        phone: '13959625414',
                        signatureStatusLabel: '已授权',
                        signatureName: '陈亮电子签名'
                    }
                ],
                tableLoading: false,

                // 查看人员详情， 分为从业人员详情和监督单位人员详情
                modal_userDetail: false,
                userType: '',         //用户类型， 从业人员或者监督人员
                userId: '',

                // 添加人员
                modal_addUser: false
            }
        },
        methods: {
            /**
             * 分页控件-切换页面
             * @param current
             */
            onPageChange(current) {
                this.searchParams.current = current;
            },
            onClick_addUser() {
                this.modal_addUser = true;
            },

            // 获取表格数据
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'get',
                    url: '/getUserList',
                    params: this.searchParams
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records;
                        this.searchParams.total = res.data.total;
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            },

            onSelectChange(item) {}
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
    .modal-userDetail {
        .ivu-modal-body {
            padding: 0;
        }
    }
</style>