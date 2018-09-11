<template>
    <div class="unitPersons-container">
        <vIvxFilterBox>
            <Button type="primary">新增人员</Button>
            <Button type="primary">人员变更</Button>
        </vIvxFilterBox>
        <div class="ivx-table-box">
            <Table border
                   height="540"
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
        name: 'unitPersons',  // 单位人员
        components: {vIvxFilterBox},
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    beginDate: '',     // 开始时间
                    endDate: '',       // 结束时间
                    searchKey: ''      // 模糊查询参数
                },
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '单位名称', width: 180, align: 'center', key: 'unitName' },
                    { title: '机构代码', width: 180, align: 'center', key: 'orgCode' },
                    { title: '资质类别', width: 180, align: 'center', key: 'qualificationTypeLabel' },
                    { title: '资质许可等级', width: 180, align: 'center', key: 'qualification' },
                    { title: '单位类型', width: 180, align: 'center', key: 'unitTypeLabel' },
                    { title: '负责人', width: 180, align: 'center', key: 'leader' },
                    { title: '联系方式', width: 180, align: 'center', key: 'telephone' },
                    { title: '电子邮件', width: 180, align: 'center', key: 'email' },
                    { title: '公司地址', width: 180, align: 'center', key: 'companyAddress' },
                    { title: '备案', width: 180, align: 'center', key: 'unitName' },
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
                                    }
                                }, '查看')
                            ];

                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [
                    { index: '我是测试的数据', unitName: '厦门卫星定位应用股份有限公司' },
                    {  index: '我是测试的数据' },
                    { index: '我是测试的数据' },
                    { index: '我是测试的数据' },
                    {  index: '我是测试的数据' },
                    { index: '我是测试的数据' },
                    {  index: '我是测试的数据' },
                    { index: '我是测试的数据' },
                    { index: '我是测试的数据' },
                    {  index: '我是测试的数据' }

                ],
            };
        },
        methods: {
            /**
             * 分页控件-切换页面
             * @param current
             */
            onPageChange(current) {
                this.searchParams.current = current;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .unitPersons-container {
    }
</style>