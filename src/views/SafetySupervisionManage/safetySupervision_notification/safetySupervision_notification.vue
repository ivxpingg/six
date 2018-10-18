<template>
    <div class="safetySupervision_notification-container">
        <vIvxFilterBox dashed>
            <Button v-if="auth_add"
                    type="primary"
                    icon="md-add"
                    @click="modal_add_open">新增</Button>
        </vIvxFilterBox>
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.condition.fileName"
                           style="width: 220px;"
                           placeholder="名称"/>
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

        <vAdd ref="add"></vAdd>

    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import authMixin from '../../../lib/mixin/authMixin';
    import vAdd from './add/add';
    export default {
        name: 'safetySupervision_notification',  // 安全通知
        mixins: [authMixin],
        components: {vIvxFilterBox, vAdd},
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        fileName: '',      // 模糊查询参数
                    }
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '名称', width: 120, align: 'center', key: 'fileName' },
                    { title: '文件编号', width: 100, align: 'center', key: 'fileNo' },
                    { title: '主编单位', width: 120, align: 'center', key: 'editUnitStr' },
                    { title: '操作单位', width: 120, align: 'center', key: 'operateUnitStr' },
                    { title: '操作人', width: 100, align: 'center', key: 'operator' },
                    { title: '发布日期', width: 120, align: 'center', key: 'publishTime' },
                    { title: '附件', width: 80, align: 'center', key: 'fileNum' },
                    { title: '实施日期', width: 120, align: 'center', key: 'beginTime' },
                    { title: '作废日期', width: 120, align: 'center', key: 'cancelTime' },
                    {
                        title: '操作',
                        width: 250,
                        align: 'center',
                        fixed: 'right',
                        render: (h, params) => {
                            let list = [];

                            list.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'md-megaphone'
                                },
                                on: {
                                    click: () => {
                                    }
                                }
                            }, '发布'));

                            list.push(h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    icon: 'md-remove-circle'
                                },
                                on: {
                                    click: () => {
                                    }
                                }
                            }, '作废'));

                            list.push(h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    icon: 'ios-trash-outline'
                                },
                                on: {
                                    click: () => {
                                    }
                                }
                            }, '删除'));

                            // 设置列宽度
                            return h('div',{
                                style: {},
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [
                    {
                        fileName: '',  // 文件名称
                        fileNo: '',    // 文件编号
                        editUnit: '',  // 主编单位
                        editUnitStr: '',
                        beginTime: '',  // 施行时间
                        intro: '',  // 简介
                        fileNum: null,  // 附件数量
                        insTime: '',  // 创建时间
                        operateUnit: '',  // 操作单位
                        operateUnitStr: '',
                        operator: '',  //  操作人
                        publishTime: '',  // 发布时间
                        cancelTime: ''  // 作废时间
                    }
                ],
                tableLoading: false,
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

            // 新增
            modal_add_open() {
                this.$refs.add.modalValue = true;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .safetySupervision_notification-container {
    }
</style>