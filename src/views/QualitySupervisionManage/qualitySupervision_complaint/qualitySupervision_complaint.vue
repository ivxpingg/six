<template>
    <div class="qualitySupervision_complaint-container">
        <vIvxFilterBox dashed>
            <Button v-if="auth_add"
                    type="primary"
                    icon="md-add"
                    @click="modal_add_open">登记投诉</Button>
            <Button type="primary"
                    icon="md-document"
                    @click="modalLogView('complaint')">查看日志</Button>
        </vIvxFilterBox>
        <vIvxFilterBox dashed>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.condition.name"
                           style="width: 220px;"
                           placeholder="姓名"/>
                </FormItem>
            </Form>
        </vIvxFilterBox>

        <vIvxFilterBox>
            <Form inline>
                <FormItem label="筛选条件:" :label-width="65">
                    <RadioGroup v-model="searchParams.condition.handleStatus" type="button">
                        <Radio label="">全部</Radio>
                        <Radio v-for="(item, idx) in dict_handleStatus"
                               :label="item.value" :key="'unitType_' + idx">{{item.label}}</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </vIvxFilterBox>
        <div class="ivx-table-box">
            <Table border
                   :loading="tableLoading"
                   :columns="tableColumns"
                   :height="540"
                   :data="tableData"></Table>
            <Page prev-text="上一页"
                  next-text="下一页"
                  show-total
                  :current="searchParams.current"
                  :page-size="searchParams.size"
                  :total="searchParams.total"
                  @on-change="onPageChange"></Page>
        </div>

        <!--<Modal v-model="modal_complaint" title="上报审核">-->

        <!--</Modal>-->

        <!--添加登记投诉-->
        <vAddComplaint ref="modal_addComplaint" @modal-callback="modal_addComplaint_callback"></vAddComplaint>

        <!--监督人员选择-->
        <vModalEmployeeSelect ref="modal_employeeSelect"
                              userSourceType="hasUnit"
                              unitId="8"
                              @modal-callback="modal_employeeSelect_callback"></vModalEmployeeSelect>
        <!--查看附件-->
        <vViewFiles ref="viewFiles" :data="fileList"></vViewFiles>

        <!--查看日志-->
        <vModalLogView ref="modalLogView" :logType="six_logType" ></vModalLogView>

    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import authMixin from '../../../lib/mixin/authMixin';
    import viewFilesMixin from '../../Common/viewFiles/mixin';
    import MOMENT from 'moment';
    import vAddComplaint from './add/addComplaint';
    import vModalEmployeeSelect from '../../Common/employeeSelect/modalEmployeeSelect';
    import logViewMixin from '../../Common/logView/mixin';
    export default {
        name: 'qualitySupervision_complaint',
        mixins: [authMixin, viewFilesMixin, logViewMixin],
        components: {vIvxFilterBox, vAddComplaint, vModalEmployeeSelect},
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        searchKey: '',      // 模糊查询参数
                        handleStatus: ''
                    }
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '编号', minWidth: 120, align: 'center', key: 'complaintNo' },
                    { title: '投诉人', width: 100, align: 'center', key: 'complaintant' },
                    { title: '投诉日期', width: 120, align: 'center', key: 'complaintDate',
                        render(h, params) {
                            return h('div', params.row.complaintDate ? MOMENT(params.row.complaintDate).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '投诉人联系方式', width: 130, align: 'center', key: 'phone' },
                    { title: '投诉人邮箱', width: 180, align: 'center', key: 'email' },
                    { title: '投诉事项', width: 100, align: 'center', key: 'complaintContent' },
                    { title: '回复日期', width: 120, align: 'center', key: 'replyDate',
                        render(h, params) {
                            return h('div', params.row.replyDate ? MOMENT(params.row.replyDate).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '回复内容', width: 100, align: 'center', key: 'replyContent' },
                    {
                        title: '操作',
                        width: 220,
                        align: 'center',
                        fixed: 'right',
                        render: (h, params) => {
                            let list = [];

                            if (params.row.handleStatus === 'submitted') {
                                list.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'md-megaphone'
                                    },
                                    on: {
                                        click: () => {
                                            this.auditInfo.complaintId = params.row.complaintId;
                                            this.$refs.modal_employeeSelect.modalValue = true;
                                        }
                                    }
                                }, '上报审核'));
                            }

                            list.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'ios-eye-outline'
                                },
                                on: {
                                    click: () => {
                                        this.getFiles(params.row.complaintId);
                                        this.$refs.viewFiles.modalValue = true;
                                    }
                                }
                            }, '查看附件'));

                            // 设置列宽度
                            return h('div',{
                                style: {},
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [],
                tableLoading: false,

                // 上报审核
                modal_complaint: false,
                auditInfo: {              // 提交审核内容
                    complaintId: '',
                    auditPerson: ''       // 用户Id
                },

                // 附件列表
                fileList: [],

                dict_handleStatus: []

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
            this.getDict(['handleStatus']);
            this.getData();
        },
        methods: {
            getDict(list) {
                this.$http({
                    method: 'get',
                    url: '/dict/getListByTypes',
                    params: {
                        types: list.join(',')
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        list.forEach(val => {
                            this[`dict_${val}`] = res.data[val];
                        });

                    }
                })
            },
            /**
             * 分页控件-切换页面
             * @param current
             */
            onPageChange(current) {
                this.searchParams.current = current;
            },
            // 获取表格数据
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/complaint/complaintPage',
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
            },
            // 新增
            modal_add_open() {
                this.$refs.modal_addComplaint.modalValue = true;
            },
            modal_addComplaint_callback() {
                this.getData();
            },

            // 选择监督人员
            modal_employeeSelect_callback(selectValue, selectItems) {
                this.auditInfo.auditPerson = selectItems.userId;

                this.$Modal.confirm({
                    title: '上报审核',
                    content: `确定要提交给<${selectItems.name}>审核?`,
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/complaint/submitAudit',
                            params: {
                                complaintId: this.auditInfo.complaintId,
                                auditPerson: this.auditInfo.auditPerson
                            }
                        }).then(res => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('提交审核成功!');
                                this.getData();
                            }
                        })
                    }
                })
            },

            // 获取附件
            getFiles(complaintId) {
                this.$http({
                    method: 'get',
                    url: '/file/attachList',
                    params: {
                        relationId: complaintId,
                        fileType: 'complaint'
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.fileList = res.data || [];
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .qualitySupervision_complaint-container {
    }
</style>