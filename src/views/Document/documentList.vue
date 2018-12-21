<template>
    <div class="documentList-container">
        <vIvxFilterBox dashed>
            <Button type="primary"
                    icon="md-add"
                    @click="modal_add_open">添加公文</Button>
        </vIvxFilterBox>
        <vIvxFilterBox dashed>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.condition.fileName"
                           style="width: 220px;"
                           placeholder="文件名称"/>
                </FormItem>
            </Form>
        </vIvxFilterBox>
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="筛选条件:" :label-width="65">
                    <RadioGroup v-model="searchParams.condition.handleStatus" type="button">
                        <Radio label="">全部</Radio>
                        <Radio v-for="item in dict_handleStatus"
                               :label="item.value" :key="'handleStatus_' + item.id">{{item.label}}</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </vIvxFilterBox>

        <div class="ivx-table-box">
            <Table border
                   :height="540"
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

        <!--添加公文-->
        <vAddDocument ref="modal_addDocument"
                      @modal-callback="modal_add_callback"></vAddDocument>

        <!--查看公文-->
        <Modal v-model="modal_handler"
               :width="1300"
               title="公文处理"
               footer-hide>
            <div style="min-height: 800px;">
                <vDocumentHandler v-if="modal_handler"
                                  :documentHandleId="currentRow.documentHandleId"
                                  @callback="callback_submitAudit"></vDocumentHandler>
            </div>
        </Modal>

    </div>
</template>

<script>
    import vIvxFilterBox from '../../components/ivxFilterBox/ivxFilterBox';
    import vAddDocument from './add/addDocument';
    import vDocumentHandler from './documentHandler/documentHandler';
    export default {
        name: 'documentList',  // 公文办理
        components: {vIvxFilterBox, vAddDocument, vDocumentHandler},
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        fileName: '',
                        handleStatus: ''
                    }
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '文件名称', minWidth: 180, align: 'center', key: 'fileName' },
                    { title: '文件类型', width: 180, align: 'center', key: 'fileRecordTypeLabel' },
                    { title: '项目名称', width: 180, align: 'center', key: 'projectName' },
                    { title: '标段', width: 100, align: 'center', key: 'part' },
                    { title: '创建时间', width: 140, align: 'center', key: 'insTime',
                        render: (h, params) => {
                            return h('span', params.row.insTime ? this.$moment(params.row.insTime).format('YYYY-MM-DD HH:mm') : '');
                        }
                    },
                    { title: '状态', width: 80, align: 'center', key: 'handleStatusLabel' },
                    {
                        title: '操作',
                        width: 180,
                        align: 'center',
                        render: (h, params) => {
                            let list = [];

                            list.push(h('Button', {
                                props: {
                                    type: 'info',
                                    size: 'small',
                                    icon: 'ios-eye-outline'
                                },
                                on: {
                                    click: () => {
                                        this.currentRow.documentHandleId = params.row.documentHandleId || '';
                                        this.currentRow.fileRecordType = params.row.fileRecordType || '';
                                        this.currentRow.handleStatus = params.row.handleStatus || '';
                                        this.modal_handler = true;
                                    }
                                }
                            }, '查看'));

                            if (params.row.handleStatus === 'submitted') {
                                list.push(h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'ios-trash-outline'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: `确定要删除《${params.row.fileName}》？`,
                                                onOk: () => {
                                                    this.$http({
                                                        method: 'get',
                                                        url: '/documentHandle/delete',
                                                        params: {
                                                            documentHandleId: params.row.documentHandleId
                                                        }
                                                    }).then(res => {
                                                        if (res.code === 'SUCCESS') {
                                                            this.$Message.success('删除成功!');
                                                            this.getData();
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    }
                                }, '删除'));
                            }

                            // 设置列宽度
                            return h('div',{
                                style: {

                                },
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [
                    // {
                    //     documentHandleId: "1",
                    //     fileName: "文件名称",
                    //     fileRecordType: 'com_check_notice',
                    //     fileRecordTypeLabel: "综合督查通报",
                    //     handleStatus: "submitted",
                    //     handleStatusLabel: "待提交",
                    //     insTime: 1545242491000,
                    //     part: "111",
                    //     projectId: "7455ad3c6e104261888e169dc098a49c",
                    //     projectName: "我是名字很长的项目名长到你看不见只是为了测试名字太长会怎么样",
                    //     userName: "超级管理员"
                    // }
                ],
                tableLoading: false,

                // 办理状态
                dict_handleStatus: [],

                //公文处理
                modal_handler: false,
                currentRow: {
                    documentHandleId: '',
                    fileRecordType: '',
                    handleStatus: ''
                }
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
            this.getDict_handleStatus();
        },
        methods: {
            // 获取单位类别的数据字典
            getDict_handleStatus() {
                this.$http({
                    method: 'get',
                    url: '/dict/getListByType',
                    params: {
                        type: 'handleStatus'
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.dict_handleStatus = res.data || [];
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
                    url: '/documentHandle/list',
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
            modal_add_open() {
                this.$refs.modal_addDocument.modalValue = true;
            },
            modal_add_callback() {
                this.getData();
            },

            // 提交审核回调
            callback_submitAudit() {
                this.getData();
                this.modal_handler = false;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .documentList-container {
    }
</style>