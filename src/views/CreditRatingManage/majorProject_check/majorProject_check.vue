<template>
    <div class="majorProject_check-container">
        <vIvxFilterBox dashed>
            <Button type="primary"
                    icon="md-add"
                    @click="modal_add_open">添加重点项目考勤</Button>
        </vIvxFilterBox>

        <vIvxFilterBox>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.searchKey"
                           style="width: 220px;"
                           placeholder="姓名、联系方式"/>
                </FormItem>
                <FormItem label="项目名称:" :label-width="65">
                    <Select v-model="searchParams.projectId">
                        <Option v-for="item in projectList"
                                :key="item.projectId"
                                :value="item.projectId"
                                :label="item.projectName"></Option>
                    </Select>
                </FormItem>
            </Form>
        </vIvxFilterBox>

        <div class="ivx-table-box">
            <Table border
                   height="540"
                   :loading="tableLoading"
                   :columns="tableColumns"
                   :data="tableData"></Table>
        </div>

        <vAddMajorProject_check ref="modal_add" @modal-callback="modal_add_callback"></vAddMajorProject_check>

    </div>
</template>
<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vAddMajorProject_check from './add/addMajorProject_check';
    export default {
        name: 'majorProject_check',
        components: {
            vIvxFilterBox,
            vAddMajorProject_check
        },
        data() {
            return {
                searchParams: {
                    searchKey: '',
                    projectId: ''
                },
                projectList: [],
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '单位类型', width: 160, align: 'center', key: 'unitTypeLabel' },
                    { title: '人员名称', width: 120, align: 'center', key: 'name' },
                    { title: '职务', width: 100, align: 'center', key: 'projectDutyLabel' },
                    { title: '联系方式', width: 120, align: 'center', key: 'phone' },
                    { title: '身份证号', width: 160, align: 'center', key: 'idNumber' },
                    { title: '初次考勤时间', width: 140, align: 'center', key: 'firstAttendanceTime',
                        render: (h, params) => {
                            return h('div', params.row.firstAttendanceTime ? this.$moment(params.row.firstAttendanceTime).format('YYYY-MM-DD HH:mm') : '');
                        }
                    },
                    { title: '到场天数', width: 100, align: 'center', key: 'attendanceDays' },
                    { title: '工时统计', width: 100, align: 'center', key: 'workHours' },
                    { title: '考勤完成率', width: 100, align: 'center', key: 'completeRate' },
                    { title: '考勤结果', minWidth: 100, align: 'center', key: '' }
                ],
                tableData: [
                    // {
                    //     unitTypeLabel: '建设单位',
                    //     name: '储修华',
                    //     projectDutyLabel: '总监',
                    //     phone: '12030001400',
                    //     idNumber: '655458887811542114',
                    //     firstAttendanceTime: '2018-08-15 11:20',   // 初次考勤时间
                    //     attendanceDays: 12,       // 到场天数
                    //     workHours: 75,            // 工时统计
                    //     completeRate: 60,         // 考勤完成率
                    // }
                ],
                tableLoading: false,
            }
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
            this.getProjectList();
            this.getData();
        },
        methods: {
             // 获取项目列表
            getProjectList() {
                this.$http({
                    method: 'get',
                    url: '/projectAttendance/projectList'
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.projectList = res.data || [];
                        if (this.projectList.length > 0) {
                            this.searchParams.projectId = res.data[0].projectId;
                            this.getData();
                        }
                    }
                })
            },
            // 获取表格数据
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'get',
                    url: '/projectAttendance/projectAttendanceList',
                    params: this.searchParams
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data || [];
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            },
            // 添加
            modal_add_open() {
                this.$refs.modal_add.modalValue = true;
            },

            modal_add_callback() {
                this.getProjectList();
            }
        }
    }
</script>
<style lang="scss" scoped>
    .majorProject_check-container {
    }
</style>