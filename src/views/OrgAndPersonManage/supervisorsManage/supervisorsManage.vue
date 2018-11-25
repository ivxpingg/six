<template>
    <Card class="supervisorsManage-container">
        <!--<vIvxFilterBox dashed>-->
            <!--<Button type="primary"-->
                    <!--icon="md-add"-->
                    <!--@click="modal_addSupervisor_open">新增人员</Button>-->
        <!--</vIvxFilterBox>-->
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.condition.name"
                           style="width: 220px;"
                           placeholder="请输入检索内容"/>
                </FormItem>
            </Form>
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

        <Modal v-model="modal_addSupervisor"
               title="新增监督单位人员"
               :width="1200"
               footer-hide>
            <vAddSupervisor @modal_addSupervisor_callback="modal_addSupervisor_callback"></vAddSupervisor>
        </Modal>

        <Modal v-model="modal_supervisorDetail"
               title="监督单位人员详情"
               :width="1200"
               footer-hide>
            <vSupervisorDetail :userId="userId" @modal-callback="modal_supervisorDetail_callback" editable></vSupervisorDetail>
        </Modal>

    </Card>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vAddSupervisor from './addSupervisor/addSupervisor';
    import vSupervisorDetail from './supervisorDetail/supervisorDetail';
    export default {
        // 监督单位人员
        name: 'supervisorsManage',
        components: {vIvxFilterBox, vAddSupervisor, vSupervisorDetail},
        data() {
            return {
                searchParams: {
                    current: 1,        // 当前第几页
                    size: 10,          // 每页几行
                    total: 0,          // 总行数
                    condition: {
                        name: '',      // 模糊查询参数
                        userType: 'supervisor'
                    }
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '姓名', width: 120, align: 'center', key: 'name' },
                    // { title: 'UID', width: 100, align: 'center', key: 'userNo' },
                    { title: '科室', width: 120, align: 'center', key: 'department' },
                    { title: '职务', width: 120, align: 'center', key: 'job' },
                    { title: '级别', width: 120, align: 'center', key: 'titleLevelLabel' },
                    { title: '所属单位', width: 120, align: 'center', key: 'unitName' },
                    { title: '办公固话', width: 120, align: 'center', key: 'telephone' },
                    { title: '移动小号', width: 120, align: 'center', key: 'mobileShortNum' },
                    { title: '手机', width: 120, align: 'center', key: 'phone' },
                    { title: '任职时间', width: 120, align: 'center', key: 'tenureTime' },
                    { title: '性别', width: 80, align: 'center', key: 'sexLabel' },
                    { title: '民族', width: 120, align: 'center', key: 'nation' },
                    { title: '祖籍', width: 120, align: 'center', key: 'nativePlace' },
                    { title: '年龄', width: 80, align: 'center', key: 'age' },
                    { title: '出生年月', width: 120, align: 'center', key: 'birthday' },
                    { title: '工作年月', width: 120, align: 'center', key: 'workDate' },
                    { title: '入党年月', width: 120, align: 'center', key: 'joinPartyDate' },
                    { title: '学历', width: 120, align: 'center', key: 'educationLabel' },
                    { title: '毕业院校', width: 120, align: 'center', key: 'graduateSchool' },
                    { title: '专业', width: 120, align: 'center', key: 'profession' },
                    { title: '身份类别', width: 120, align: 'center', key: 'identityType' },
                    { title: '执法证类型', width: 120, align: 'center', key: 'lawTypeLabel' },
                    { title: '执法证号码', width: 120, align: 'center', key: 'lawNumber' },
                    { title: '领导分工及科室人员', width: 180, align: 'center', key: 'divideWork' },
                    { title: '备注', width: 100, align: 'center', key: 'remark' },

                    {
                        title: '操作',
                        width: 120,
                        align: 'center',
                        fixed: 'right',
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
                                            this.modal_supervisorDetail = true;
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
                tableData: [],
                tableLoading: true,

                // 新增监督人员
                modal_addSupervisor: false,

                // 监督人员详情
                modal_supervisorDetail: false,
                userId: '',

            };
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

            modal_addSupervisor_open() {
                this.modal_addSupervisor = true;
            },
            modal_addSupervisor_callback() {
                this.modal_addSupervisor = false;
                this.getData();
            },
            // 更新人员回调
            modal_supervisorDetail_callback() {
                this.getData();
                this.modal_supervisorDetail = false;
            },

            // 获取表格数据
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/user/list',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records;
                        this.searchParams.total = res.data.total;
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .supervisorsManage-container {
    }
</style>