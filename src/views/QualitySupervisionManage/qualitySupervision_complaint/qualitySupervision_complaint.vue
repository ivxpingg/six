<template>
    <div class="qualitySupervision_complaint-container">
        <vIvxFilterBox dashed>
            <Button v-if="auth_add"
                    type="primary"
                    icon="md-add"
                    @click="modal_add_open">登记投述</Button>
        </vIvxFilterBox>

        <div class="ivx-table-box">
            <Table border
                   :loading="tableLoading"
                   :columns="tableColumns"
                   :height="540"
                   :data="tableData"></Table>
            <Page prev-text="上一页"
                  next-text="下一页"
                  show-total
                  :current="searchParams.current"
                  :page-size="searchParams.size"
                  :total="searchParams.total"
                  @on-change="onPageChange"></Page>
        </div>

    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import authMixin from '../../../lib/mixin/authMixin';
    import viewFilesMixin from '../../Common/viewFiles/mixin';
    import MOMENT from 'moment';
    export default {
        name: 'qualitySupervision_complaint',
        mixins: [authMixin, viewFilesMixin],
        components: {vIvxFilterBox},
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        searchKey: '',      // 模糊查询参数
                    }
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '编号', minWidth: 120, align: 'center', key: 'fileName' },
                    { title: '投诉人', width: 100, align: 'center', key: 'fileNo' },
                    { title: '投诉日期', width: 120, align: 'center', key: 'publishTime',
                        render(h, params) {
                            return h('div', params.row.publishTime ? MOMENT(params.row.publishTime).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '投诉人联系方式', width: 130, align: 'center', key: 'editUnit' },
                    { title: '投诉人邮箱', width: 180, align: 'center', key: 'unitName' },
                    { title: '投诉事项', width: 100, align: 'center', key: 'userName' },
                    { title: '回复日期', width: 120, align: 'center', key: 'publishTime',
                        render(h, params) {
                            return h('div', params.row.publishTime ? MOMENT(params.row.publishTime).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '处理回复', width: 100, align: 'center', key: '' },
                    {
                        title: '操作',
                        width: 220,
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
                                        this.publicNotice(params.row);
                                    }
                                }
                            }, '上报审核'));

                            list.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'md-remove-circle'
                                },
                                on: {
                                    click: () => {
                                        this.cancelNotice(params.row);
                                    }
                                }
                            }, '处理回复'));

                            // 设置列宽度
                            return h('div',{
                                style: {},
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [],
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
                    url: '/safeNotice/list',
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
            },
            modal_add_callback() {
                this.getData();
                this.$refs.add.modalValue = false;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .qualitySupervision_complaint-container {
    }
</style>