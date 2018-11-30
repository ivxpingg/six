<template>
    <div class="fileRegisterRecord-container">
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.projectName"
                           style="width: 220px;"
                           placeholder="项目名称"/>
                </FormItem>
                <FormItem>
                    <!--<Button type="primary" icon="md-download" @click="onClick_export" >导出</Button>-->
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
    export default {
        name: 'fileRegisterRecord',  // 文件类登记台账
        components: {vIvxFilterBox},
        props: {
            // 文件台账类型
            fileRecordType: {
                type: String,
                required: true
            }
        },
        watch: {
            fileRecordType: {
                immediate: true,
                handler(val) {
                    this.searchParams.fileRecordType = val;
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
                    fileRecordType: ''
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '时间', align: 'center', width: 120, key: 'recordDate',
                        render(h, params) {
                            return h('div', params.row.recordDate ? MOMENT(params.row.recordDate).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '文号', align: 'center', width: 120, key: 'recordNo'},
                    { title: '文件名称', align: 'center', width: 120, key: 'fileName'},
                    { title: '文件类型', align: 'center', width: 120, key: 'fileType'},
                    { title: '项目名称', align: 'center', width: 120, key: 'projectName'},
                    { title: '标段', align: 'center', width: 100, key: 'part'},

                    { title: '发出单位', align: 'center', width: 120, key: 'sendUnit'},

                    { title: '接收单位', align: 'center', width: 120, key: 'receiveUnit'},

                    { title: '整改回复状态', align: 'center', width: 120, key: 'changeStatus'},
                    { title: '整改回复时间', align: 'center', width: 120, key: 'changeReplyDate',
                        render(h, params) {
                            return h('div', params.row.changeReplyDate ? MOMENT(params.row.changeReplyDate).format('YYYY-MM-DD') : '');
                        }
                    },

                    { title: '科室', align: 'center', width: 120, key: 'department'},
                    { title: '经办人', align: 'center', width: 120, key: 'operator'},
                    { title: '备注', align: 'center', width: 120, key: 'remark'},

                ],
                tableData: [],
                tableLoading: false
            };
        },
        mounted() {
            this.getData();
        },
        methods: {
            // 获取表格数据
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/record/fileRegisterRecord',
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    .fileRegisterRecord-container {
        padding-top: 10px;
    }
</style>