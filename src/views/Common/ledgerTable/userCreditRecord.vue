<template>
    <div class="userCreditRecord-container">
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.projectName"
                           style="width: 220px;"
                           placeholder="请输入项目名称"/>
                </FormItem>
                <FormItem label="" :label-width="0">
                    <Input v-model="searchParams.searchKey"
                           style="width: 220px;"
                           placeholder="请输入人员名称"/>
                </FormItem>
                <FormItem label="选择时间:" :label-width="65">
                    <DatePicker type="year"
                                @on-change="onChage_daterange"
                                placeholder="选择时间"
                                style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem>
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
    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import MOMENT from 'moment';
    import Config from '../../../config';
    export default {
        name: 'userCreditRecord',  // 人员信用台账
        components: {vIvxFilterBox},
        computed: {
            downloadUrl() {
                return Config[Config.env].origin
                    + Config[Config.env].ajaxUrl + '/record/exportUserCreditRecord'
                    + `?searchKey=${encodeURIComponent(this.searchParams.searchKey)}&year=${this.searchParams.year}`;
            }
        },
        data() {
            return {
                searchParams: {
                    projectName: '',
                    searchKey: '',      // 模糊查询参数
                    year: ''
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '日期', align: 'center', width: 120, key: 'recordDate',
                        render: (h, params) => {
                            return h('div', params.row.recordDate ? MOMENT(params.row.recordDate).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '姓名', align: 'center', width: 180, key: 'name'},
                    { title: '证书编号', align: 'center', width: 180, key: 'certificateNo'},
                    { title: '资格证书', align: 'center', width: 120, key: 'certificate'},
                    { title: '身份证号', align: 'center', width: 120, key: 'idNumber'},
                    { title: '单位名称', align: 'center', width: 120, key: 'unitName'},
                    { title: '在企业的登记时间', align: 'center', width: 160, key: 'registerTime',
                        render: (h, params) => {
                            return h('div', params.row.registerTime ? MOMENT(params.row.registerTime).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '项目名称', align: 'center', width: 160, key: 'projectName'},
                    { title: '标段', align: 'center', width: 100, key: 'part'},
                    { title: '职务', align: 'center', width: 120, key: 'job'},
                    { title: '失信代码', align: 'center', width: 120, key: 'creditNo'},
                    { title: '失信行为', align: 'center', width: 160, key: 'content'},
                    { title: '扣分标准', align: 'center', width: 120, key: 'scoreStandard'},
                    { title: '实际扣分', align: 'center', width: 120, key: 'deduct'},
                    { title: '情况说明（扣分项）', align: 'center', width: 160, key: 'deductDetail'},
                    { title: '采信依据', align: 'center', width: 120, key: 'creditAccording'}
                ],
                tableData: [],
                tableLoading: false
            };
        },
        watch: {
            searchParams: {
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
            onChage_daterange(value) {
                this.searchParams.year = value;
            },
            // 获取表格数据
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/record/userCreditRecord',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data || [];
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .userCreditRecord-container {
        padding-top: 10px;
    }
</style>