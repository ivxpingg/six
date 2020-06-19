<template>
    <div class="detailMajorProject_check-container">
        <Modal v-model="modalValue"
               :width="800"
               title="项目人员考勤明细">
            <div class="ivx-table-box">
                <Table border
                       height="300"
                       :loading="tableLoading"
                       :columns="tableColumns"
                       :data="tableData"></Table>
            </div>

        </Modal>
    </div>

</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    export default {
        name: 'detailMajorProject_check',
        mixins: [modalMixin],
        props: {
            projectAttendanceId: {
                type: String,
                default: ''
            },
            name: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index' },
                    { title: '人员名称', width: 170, align: 'center',
                        render: (h) => {
                            return h('span', this.name)
                        }
                    },
                    { title: '月份', width: 200, align: 'center', key: 'attendanceMonth' },
                    { title: '到场天数', width: 150, align: 'center', key: 'attendanceDays' },
                    { title: '考勤结果',  width: 186,align: 'center', key: 'attendanceResult' },
                ],
                tableData: [],
                tableLoading: false,
            }
        },
        watch: {
            projectAttendanceId(val) {
                this.getData();
            }
        },
        methods: {
            // 获取表格数据
            getData() {
                this.$http({
                    method: 'get',
                    url: '/projectAttendance/userAttendanceDetailList',
                    params: {
                        projectAttendanceId: this.projectAttendanceId
                    }
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
    .detailMajorProject_check {
    }
</style>
