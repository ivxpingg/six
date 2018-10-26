<template>
    <div class="projectRecords-container">
        <vIvxFilterBox>
            <Button type="primary"
                    icon="md-add"
                    @click="modal_add_open">添加工程备案</Button>
        </vIvxFilterBox>

        <vIvxFilterBox dashed>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.condition.searchKey"
                           style="width: 220px;"
                           placeholder="请输入"/>
                </FormItem>
            </Form>
        </vIvxFilterBox>

        <vIvxFilterBox>
            <Form inline>
                <FormItem label="筛选条件:" :label-width="65">
                    <RadioGroup v-model="searchParams.condition.handleStatus" type="button">
                        <Radio label="">全部</Radio>
                        <Radio v-for="(item, idx) in dict_handleStatus"
                               :label="item.value" :key="'handleStatus_' + idx">{{item.label}}</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </vIvxFilterBox>

        <div class="ivx-table-box">
            <Table border
                   :loading="tableLoading"
                   :columns="tableColumns"
                   :data="tableData"></Table>
            <Page prev-text="上一页"
                  next-text="下一页"
                  show-total
                  :current="searchParams.current"
                  :page-size="searchParams.size"
                  :total="searchParams.total"
                  @on-change="onPageChange"></Page>
        </div>

        <vAddProjectRecord ref="add"
                           @modal_callback="modal_add_callback"></vAddProjectRecord>

    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vAddProjectRecord from './add/addProjectRecord';
    export default {
        name: 'projectRecords',  // 工程备案
        components: {vIvxFilterBox, vAddProjectRecord},
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,        // 每页几行
                    total: 0,        // 总行数
                    condition: {
                        searchKey: '',      // 模糊查询参数
                        handleStatus: ''
                    }

                },
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '项目名称', width: 180, align: 'center', key: 'projectName' },
                    { title: '标段', width: 180, align: 'center', key: 'part' },
                    { title: '备案单位', width: 180, align: 'center', key: '' },
                    { title: '单位类型', width: 180, align: 'center', key: '' },
                    { title: '备案内容', width: 180, align: 'center', key: '' },
                    { title: '项目状态', width: 180, align: 'center', key: '' },
                    { title: '流程状态', width: 180, align: 'center', key: '' },
                    { title: '办理状态', width: 180, align: 'center', key: '' },
                    { title: '附件', width: 180, align: 'center', key: '' },
                    { title: '负责人', width: 180, align: 'center', key: '' },
                    { title: '联系方式', width: 180, align: 'center', key: '' },
                    {
                        title: '操作',
                        width: 200,
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
                                        this.check(params.row);
                                    }
                                }
                            }, '备案审核'));

                            list.push(h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    icon: 'ios-trash-outline'
                                },
                                on: {
                                    click: () => {
                                        this.del(params.row);
                                    }
                                }
                            }, '删除'));

                            return h('div', {
                                class: 'ivx-table-cell-handle'
                            }, list);

                        }
                    }
                ],
                tableData: [],
                tableLoading: true,

                dict_handleStatus: []
            };
        },
        watch: {
            'searchParams.current'() {
                this.getData();
            },
            'searchParams.condition': {
                deep: true,
                handler() {
                    this.getData();
                }
            }
        },
        mounted() {
            this.getData();
            this.getDict();
        },
        methods: {
            getDict() {
                this.$http({
                    method: 'get',
                    url: '/dict/getListByType',
                    params: {
                        type: 'handleStatus'
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.dict_handleStatus = res.data;
                    }
                })
            },

            /**
             * 分页控件-切换页面
             * @param current
             */
            onPageChange(current) {
                this.searchParams.current = current;
            },
            // 获取表格数据
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/project/list',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records;
                        this.searchParams.total = res.data.total;
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            },

            // 添加工程备案
            modal_add_open() {
                this.$refs.add.modalValue = true;
            },
            modal_add_callback() {

            },
            // 备案删除
            del(row) {
                this.$Modal.confirm({
                    title: '删除',
                    content: `确认要删除<${row.name}>备案?`,
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/',
                            params: {
                                // safeNoticeId: row.safeNoticeId
                            }
                        }).then((res) => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('删除成功!');
                            }
                        });
                    }
                })
            },
            // 备案审核
            check(row) {
                this.$Modal.confirm({
                    title: '删除',
                    content: `确认要<${row.name}>备案通过审核?`,
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/',
                            params: {
                                // safeNoticeId: row.safeNoticeId
                            }
                        }).then((res) => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('审核成功!');
                            }
                        });
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .projectRecords-container {
    }
</style>