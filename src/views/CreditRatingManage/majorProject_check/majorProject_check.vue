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

        <vAddMajorProject_check ref="modal_add"></vAddMajorProject_check>

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
                    { title: '单位类型', width: 180, align: 'center', key: 'unitTypeLabel' },
                    { title: '人员名称', width: 180, align: 'center', key: 'name' },
                    { title: '职务', width: 180, align: 'center', key: 'job' },
                    { title: '联系方式', width: 180, align: 'center', key: 'phone' },
                    { title: '身份证号', width: 180, align: 'center', key: 'idNumber' },
                    { title: '初次考勤时间', width: 180, align: 'center', key: '' },
                    { title: '到场天数', width: 180, align: 'center', key: '' },
                    { title: '工时统计', width: 180, align: 'center', key: '' },
                    { title: '考勤完成率', width: 180, align: 'center', key: '' },
                    { title: '考勤结果', width: 180, align: 'center', key: '' }
                ],
                tableData: [],
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
            }
        }
    }
</script>
<style lang="scss" scoped>
    .majorProject_check-container {
    }
</style>