<template>
    <Card class="workUnitManage-container">

        <vIvxFilterBox dashed>
            <Button type="primary">导入单位</Button>
        </vIvxFilterBox>

        <vIvxFilterBox dashed>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.searchKey"
                           style="width: 220px;"
                           placeholder="单位名称、机构代码、负责人、电话号码"/>
                </FormItem>
                <FormItem label="搜索条件:"  :label-width="65">
                    <Input v-model="searchParams.searchKey"
                           style="width: 220px;"
                           placeholder="单位名称、机构代码、负责人、电话号码"/>
                </FormItem>
                <FormItem label="搜索条件:"  :label-width="65">
                    <Input v-model="searchParams.searchKey"
                           style="width: 220px;"
                           placeholder="单位名称、机构代码、负责人、电话号码"/>
                </FormItem>
                <FormItem label="搜索条件:"  :label-width="65">
                    <Input v-model="searchParams.searchKey"
                           style="width: 220px;"
                           placeholder="单位名称、机构代码、负责人、电话号码"/>
                </FormItem>
                <FormItem label="搜索条件:"  :label-width="65">
                    <Input v-model="searchParams.searchKey"
                           style="width: 220px;"
                           placeholder="单位名称、机构代码、负责人、电话号码"/>
                </FormItem>
            </Form>
        </vIvxFilterBox>

        <vIvxFilterBox>
            <Form inline>
                <FormItem label="筛选条件:" :label-width="65">
                    <RadioGroup v-model="searchParams.searchKey" type="button">
                        <Radio label="北京"></Radio>
                        <Radio label="上海"></Radio>
                        <Radio label="深圳"></Radio>
                        <Radio label="杭州"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="筛选条件:" :label-width="65">
                    <RadioGroup v-model="searchParams.searchKey" type="button">
                        <Radio label="北京"></Radio>
                        <Radio label="上海"></Radio>
                        <Radio label="深圳"></Radio>
                        <Radio label="杭州"></Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </vIvxFilterBox>

        <div class="ivx-table-box">
            <Table border
                   height="540"
                   :columns="tableColumns"
                   :data="tableData"></Table>
            <Page prev-text="上一页"
                  next-text="下一页"
                  show-total
                  :current="searchParams.pageIndex"
                  :page-size="searchParams.pageSize"
                  :total="searchParams.totalCount"></Page>
        </div>

    </Card>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    export default {
        // 从业单位管理
        name: 'workUnitManage',
        components: {vIvxFilterBox},
        data() {
            return {
                searchParams: {
                    pageIndex: 1,      // 当前第几页
                    pageSize: 10,      // 每页几行
                    totalCount: 0,     // 总行数
                    beginDate: '',     // 开始时间
                    endDate: '',       // 结束时间
                    searchKey: ''      // 模糊查询参数
                },
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '单位名称', width: 180, align: 'center', key: 'unitName' },
                    { title: '机构代码', width: 180, align: 'center', key: 'orgCode' },
                    { title: '资质类别', width: 180, align: 'center', key: 'qualificationType' },
                    { title: '资质许可等级', width: 180, align: 'center', key: 'qualificationLevel' },
                    { title: '单位类型', width: 180, align: 'center', key: 'unitType' },
                    { title: '负责人', width: 180, align: 'center', key: 'leader' },
                    { title: '联系方式', width: 180, align: 'center', key: 'telephone' },
                    { title: '电子邮件', width: 180, align: 'center', key: 'email' },
                    { title: '公司地址', width: 180, align: 'center', key: 'companyAddress' },
                    { title: '备案', width: 180, align: 'center', key: 'unitName' },
                    {
                        title: '操作',
                        width: 260,
                        align: 'center',
                        fixed: 'right',
                        render: (h, params) => {
                            let list = [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-create-outline'
                                    }
                                }, '编辑'),

                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'ios-trash-outline'
                                    }
                                }, '删除'),

                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-checkmark-circle-outline'
                                    }
                                }, '提交')
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

                ]
            };
        }
    }
</script>

<style lang="scss" scoped>
    .workUnitManage-container {


    }
</style>