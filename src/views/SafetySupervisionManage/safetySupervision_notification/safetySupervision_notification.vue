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
                    <Input v-model="searchParams.condition.searchKey"
                           style="width: 220px;"
                           placeholder="名称"/>
                </FormItem>
            </Form>
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

        <vAdd ref="add" @modal-callback="modal_add_callback"></vAdd>

        <vViewFiles ref="viewFile" :data="viewFilesData"></vViewFiles>

    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import authMixin from '../../../lib/mixin/authMixin';
    import vAdd from './add/add';
    import MOMENT from 'moment';
    import viewFilesMixin from '../../Common/viewFiles/mixin';
    export default {
        name: 'safetySupervision_notification',  // 安全通知
        mixins: [authMixin, viewFilesMixin],
        components: {vIvxFilterBox, vAdd},
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
                    { title: '名称', minWidth: 120, align: 'center', key: 'fileName' },
                    { title: '文件编号', width: 100, align: 'center', key: 'fileNo' },
                    { title: '主编单位', width: 120, align: 'center', key: 'editUnit' },
                    { title: '操作单位', width: 180, align: 'center', key: 'unitName' },
                    { title: '操作人', width: 100, align: 'center', key: 'userName' },
                    { title: '发布日期', width: 120, align: 'center', key: 'publishTime',
                        render(h, params) {
                            return h('div', params.row.publishTime ? MOMENT(params.row.publishTime).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '附件', width: 80, align: 'center', key: 'fileNum',
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    'textDecoration': 'underline',
                                    'cursor': 'pointer'
                                },
                                on: {
                                    click: () => {
                                        this.getData_vViewFile(params.row.safeNoticeId, 'notice_file', 'viewFilesData');
                                        this.$refs.viewFile.modalValue = true;
                                    }
                                }
                            }, params.row.fileNum);
                        }
                    },
                    { title: '实施日期', width: 120, align: 'center', key: 'beginTime',
                        render(h, params) {
                            return h('div', params.row.beginTime ? MOMENT(params.row.beginTime).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '作废日期', width: 120, align: 'center', key: 'cancelTime',
                        render(h, params) {
                            return h('div', params.row.cancelTime ? MOMENT(params.row.cancelTime).format('YYYY-MM-DD') : '');
                        }
                    },
                    {
                        title: '操作',
                        width: 200,
                        align: 'center',
                        fixed: 'right',
                        render: (h, params) => {
                            let list = [];

                            if (params.row.safeNoticeStatus === 'wait_publish'){
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
                                }, '发布'));
                            }


                            if (params.row.safeNoticeStatus === 'publish'){
                                list.push(h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'md-remove-circle'
                                    },
                                    on: {
                                        click: () => {
                                            this.cancelNotice(params.row);
                                        }
                                    }
                                }, '作废'));
                            }


                            list.push(h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    icon: 'ios-trash-outline'
                                },
                                on: {
                                    click: () => {
                                        this.delNotice(params.row);
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
                    // {
                    //     safeNoticeId: '001',
                    //     fileName: '文件名',  // 文件名称
                    //     fileNo: 'NO.12545',    // 文件编号
                    //     editUnit: '',  // 主编单位
                    //     editUnitStr: '合肥华德交通工程咨询有限公司',
                    //     beginTime: '2018-01-01',  // 施行时间
                    //     intro: '介绍',  // 简介
                    //     fileNum: null,  // 附件数量
                    //     insTime: '2018-01-01',  // 创建时间
                    //     operateUnit: '',  // 操作单位
                    //     operateUnitStr: '合肥华德交通工程咨询有限公司',
                    //     operator: 'admin',  //  操作人
                    //     publishTime: '2018-01-01',  // 发布时间
                    //     cancelTime: '2018-01-01'  // 作废时间
                    // }
                ],
                tableLoading: false,

                viewFilesData: []
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
            // 发布
            publicNotice(row) {
                this.$Modal.confirm({
                    title: '发布',
                    content: `确认要发布<${row.fileName}>?`,
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/safeNotice/publish',
                            params: {
                                safeNoticeId: row.safeNoticeId
                            }
                        }).then((res) => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('发布成功!');
                                this.getData();
                            }
                        });
                    }
                })
            },
            // 作废
            cancelNotice(row) {
                this.$Modal.confirm({
                    title: '作废',
                    content: `确认要作废<${row.fileName}>?`,
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/safeNotice/cancel',
                            params: {
                                safeNoticeId: row.safeNoticeId
                            }
                        }).then((res) => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('作废成功!');
                                this.getData();
                            }
                        });
                    }
                })
            },
            // 删除
            delNotice(row) {
                this.$Modal.confirm({
                    title: '删除',
                    content: `确认要删除<${row.fileName}>?`,
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/safeNotice/delete',
                            params: {
                                safeNoticeId: row.safeNoticeId
                            }
                        }).then((res) => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('删除成功!');
                                this.getData();
                            }
                        });
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .safetySupervision_notification-container {

    }
</style>