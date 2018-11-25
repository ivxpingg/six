<template>
    <div class="handoverCountRecord-container">
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
    export default {
        name: 'handoverCountRecord',  // 交工项目综合评价台账
        components: {vIvxFilterBox},
        data() {
            return {
                searchParams: {
                    projectName: '',      // 模糊查询参数
                    year: ''
                },
                tableColumns: [],
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
                    url: '/record/handoverCountRecord',
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
    .handoverCountRecord-container {
        padding-top: 10px;
    }
</style>