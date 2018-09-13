<template>
    <div class="unitEvaluate-container">
        <vIvxFilterBox>
            <Button type="primary" @click="open_modal_add">新增登记</Button>
        </vIvxFilterBox>

        <div class="ivx-table-box">
            <Table border
                   height="405"
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
    </div>
</template>

<script>
    import vIvxFilterBox from '@/components/ivxFilterBox/ivxFilterBox';
    export default {
        name: 'unitEvaluate',  // 单位信用评价
        components: {vIvxFilterBox},
        props: {
            unitId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 7,      // 每页几行
                    total: 0,     // 总行数
                    beginDate: '',     // 开始时间
                    endDate: '',       // 结束时间
                    unitId: ''
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '姓名', width: 120, align: 'center', key: 'name' },
                    { title: 'UID', width: 80, align: 'center', key: 'uId' },
                    { title: '性别', width: 70, align: 'center', key: 'sexStr' },
                    { title: '年龄', width: 70, align: 'center', key: 'age' },
                    { title: '民族', width: 100, align: 'center', key: 'nationStr' },
                    { title: '职称级别', width: 120, align: 'center', key: 'titleLevel' },
                    { title: '技术职称', width: 120, align: 'center', key: 'titleName' },
                    { title: '学历', width: 120, align: 'center', key: 'education' },
                    { title: '联系电话', width: 120, align: 'center', key: 'phone' },
                    { title: '身份证号码', width: 160, align: 'center', key: 'IdNumber' },
                    { title: '岗位', width: 160, align: 'center', key: 'job' }
                ],
                tableData: [],
                modal_add: false
            };
        },
        watch: {
            'searchParams.current'() {
                this.getData();
            }
        },
        mounted() {
            this.searchParams.unitId = this.unitId;
           // this.getData();
        },
        methods: {
            /**
             * 分页控件-切换页面
             * @param current
             */
            onPageChange(current) {
                this.searchParams.current = current;
            },
            // 获取表格数据
            getData() {
                this.$http({
                    method: 'post',
                    url: '/getUnitPersonById',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {
                    if (res.code === 1) {
                        this.tableData = res.data.records;
                        this.searchParams.total = res.data.total;
                    }
                })
            },
            open_modal_add() {
                this.modal_add = true;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .unitEvaluate-container {
    }
</style>