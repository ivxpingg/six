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
        <vAddDocument ref="modal_addDocument" @modal-callback="modal_add_callback"></vAddDocument>

        <!--查看公文-->
        <Modal v-model="modal_handler"
               :width="1300"
               title="公文处理"
               footer-hide>
            <vDocumentHandler v-if="modal_handler"></vDocumentHandler>
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
                    { title: '文件名称', minWidth: 180, align: 'center', key: '1' },
                    { title: '文件类型', width: 180, align: 'center', key: '1' },
                    { title: '项目名称', width: 180, align: 'center', key: '1' },
                    { title: '标段', width: 100, align: 'center', key: '1' },
                    { title: '创建时间', width: 120, align: 'center', key: '1' },
                    { title: '状态', width: 80, align: 'center', key: '1' },
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
                                    click: () => {}
                                }
                            }, '查看'));

                            list.push(h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    icon: 'ios-trash-outline'
                                },
                                on: {
                                    click: () => {}
                                }
                            }, '删除'));

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
                    {
                        '1': 't二四'
                    }
                ],
                tableLoading: false,

                // 办理状态
                dict_handleStatus: [],

                //公文处理
                modal_handler: true
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
            // this.getData();
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
                    url: '/',
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    .documentList-container {
    }
</style>