<template>
    <div class="supervisionContentRecord-container">
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.projectName"
                           style="width: 220px;"
                           placeholder="项目名称"/>
                </FormItem>
                <FormItem label="选择时间:" :label-width="65">
                    <DatePicker type="year"
                                @on-change="onChage_daterange"
                                placeholder="选择时间"
                                style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem>
                    <!--<Button type="primary" icon="md-download" @click="onClick_export" >导出</Button>-->
                    <Button icon="ios-download-outline" type="primary" :to="downloadUrl" target="_blank">导出</Button>
                </FormItem>
            </Form>
        </vIvxFilterBox>
        <div class="ivx-table-box">
            <Table border
                   :height="540"
                   :loading="tableLoading"
                   :columns="tableColumns"
                   :data="tableData"></Table>
        </div>

        <Modal v-model="modal_remark"
               title="备注"
               :width="400"
               @on-ok="saveRemark">
            <Form>
                <FormItem :label-width="60" label="备注:">
                    <Input v-model="formData.remark" type="textarea" placeholder="备注" />
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import MOMENT from 'moment';
    import Config from '../../../config';
    export default {
        name: 'supervisionContentRecord',   // 监督内容登记表台账
        components: {vIvxFilterBox},
        computed: {
            downloadUrl() {
                return Config[Config.env].origin
                    + Config[Config.env].ajaxUrl + '/record/exportSupervisionContent'
                    + `?projectName=${encodeURIComponent(this.searchParams.projectName)}&year=${this.searchParams.year}&checkType=${this.searchParams.checkType}`;
            }
        },
        props: {
            // 监督内容登记表台账类型
            checkType: {
                type: String,
                required: true
            }
        },
        watch: {
            checkType: {
                immediate: true,
                handler(val) {
                    this.searchParams.checkType = val;
                }
            },
            searchParams: {
                deep: true,
                handler() {
                    this.getData();
                }
            }
        },
        data() {
            return {
                searchParams: {
                    projectName: '',      // 模糊查询参数
                    year: '',
                    checkType: ''
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '时间', align: 'center', width: 120, key: 'recordDate',
                        render(h, params) {
                            return h('div', params.row.recordDate ? MOMENT(params.row.recordDate).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '编号', align: 'center', width: 120, key: 'recordNo'},
                    { title: '项目名称', align: 'center', width: 120, key: 'projectName'},
                    { title: '标段', align: 'center', width: 100, key: 'part'},
                    { title: '责任单位', align: 'center', width: 120, key: 'dutyUnit'},
                    { title: '发出单位', align: 'center', width: 120, key: 'sendUnit'},
                    { title: '发出人员', align: 'center', width: 120, key: 'sendUser'},
                    { title: '监督负责人', align: 'center', width: 120, key: 'supervisor'},
                    { title: '整改回复状态', align: 'center', width: 120, key: 'changeStatusLabel'},
                    { title: '整改回复时间', align: 'center', width: 120, key: 'completeTime',
                        render(h, params) {
                            return h('div', params.row.completeTime ? MOMENT(params.row.completeTime).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '内容', align: 'center', width: 120, key: 'content'},
                    { title: '备注', align: 'center', width: 120, key: 'remark'},
                    {
                        title: '操作',
                        width: 120,
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
                                        this.formData.supervisionRecordId = params.row.supervisionRecordId;
                                        this.formData.remark = params.row.remark;
                                        this.modal_remark = true;
                                    }
                                }
                            }, '备注'));

                            return h('div', list);
                        }
                    }

                ],
                tableData: [],
                tableLoading: false,

                // 备注
                modal_remark: false,
                formData: {
                    supervisionRecordId: '',
                    remark: ''
                }
            };
        },
        mounted() {
            this.getData();
        },
        methods: {
            onChage_daterange(value) {
                this.searchParams.year = value;
            },

            // 获取表格数据
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/record/supervisionContentRecord',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data || [];
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            },
            // 导出
            onClick_export() {
                this.$http({
                    method: 'post',
                    url: '/record/',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {

                })
            },
            // 保存备注
            saveRemark() {
                this.$http({
                    method: 'post',
                    url: '/record/updateSupervisionRecord',
                    data: JSON.stringify(this.formData)
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.$Message.success({
                            content: '保存备注成功！'
                        });
                        this.getData();
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .supervisionContentRecord-container {
        padding-top: 10px;
    }
</style>