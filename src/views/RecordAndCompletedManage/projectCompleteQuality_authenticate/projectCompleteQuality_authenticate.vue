<template>
    <div class="projectCompleteQuality_authenticate-container">
        <vIvxFilterBox>
            <Button type="primary"
                    icon="md-add"
                    @click="modal_add_open">竣工质量鉴定</Button>
            <Button type="primary"
                    icon="md-document"
                    @click="modalLogView('complete')">查看日志</Button>
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


        <vAddProjectAuthenticate ref="addProjectAuthenticate"
                                 @modal_callback="modal_add_callback"></vAddProjectAuthenticate>

        <!--查看附件-->
        <vViewFiles ref="modal_viewFiles" :data="filesData"></vViewFiles>

        <!--查看日志-->
        <vModalLogView ref="modalLogView" :logType="six_logType" ></vModalLogView>

    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vAddProjectAuthenticate from './add/addProjectAuthenticate';
    import viewFilesMixin from '../../Common/viewFiles/mixin';
    import MOMENT from 'moment';
    import logViewMixin from '../../Common/logView/mixin';
    export default {
        name: 'projectCompleteQuality_authenticate',  // 竣工质量鉴定
        mixins: [viewFilesMixin, logViewMixin],
        components: {vIvxFilterBox, vAddProjectAuthenticate},
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        searchKey: '',      // 模糊查询参数
                        handleStatus: ''
                    }

                },
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '项目名称', width: 180, align: 'center', key: 'projectName' },
                    { title: '标段', width: 180, align: 'center', key: 'part' },
                    { title: '地市', width: 180, align: 'center',
                        render: (h, params) => {
                            let str = '';
                            str += params.row.provinceStr || '';
                            str += params.row.cityStr || '';
                            str += params.row.countyStr || '';

                            return h('div', str);
                        }
                    },
                    { title: '项目类型', width: 180, align: 'center', key: 'projectTypeLabel' },
                    { title: '开工时间', width: 180, align: 'center',
                        render(h, params) {
                            return h('div', params.row.planBeginTime ? MOMENT(params.row.planBeginTime).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '交工时间', width: 180, align: 'center',
                        render(h, params) {
                            return h('div', params.row.planEndTime ? MOMENT(params.row.planEndTime).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '竣工时间', width: 180, align: 'center',
                        render(h, params) {
                            return h('div', params.row.completeTime ? MOMENT(params.row.completeTime).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '项目状态', width: 180, align: 'center', key: 'projectStatusLabel' },
                    { title: '流程状态', width: 180, align: 'center', key: '' },
                    { title: '办理状态', width: 180, align: 'center', key: 'handleStatusLabel' },
                    { title: '工程质量鉴定报告、工程质量监督管理工作报告', width: 180, align: 'center',
                        render: (h, params) => {
                            h('div', params.completeReport === '1' ? '已发送':'未发送');
                        }
                    },
                    { title: '编制单位', width: 180, align: 'center', key: 'unitName' },
                    { title: '日期', width: 180, align: 'center',
                        render(h, params) {
                            return h('div', params.row.completeTime ? MOMENT(params.row.completeTime).format('YYYY-MM-DD') : '');
                        }
                    },
                    {
                        title: '操作',
                        width: 120,
                        align: 'center',
                        fixed: 'right',
                        render:(h, params) => {
                            let list = [];
                            list.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'ios-eye-outline'
                                },
                                on: {
                                    click: () => {
                                        this.getFilesData(params.row);
                                    }
                                }
                            }, '查看附件'));

                            // 设置列宽度
                            return h('div',{
                                style: {

                                },
                                class: 'ivx-table-cell-handle'
                            },list);

                        }
                    },
                ],
                tableData: [],
                tableLoading: true,

                dict_handleStatus: [],

                // 附件
                filesData: []
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
                    if (res.code === 'SUCCESS') {
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
                    url: '/projectAudit/listForCompleted',
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

            // 竣工质量鉴定
            modal_add_open() {
                this.$refs.addProjectAuthenticate.modalValue = true;
            },
            modal_add_callback() {
                this.getData();
            },
            // 查看附件
            getFilesData(row) {
                this.$http({
                    method: 'get',
                    url: '/file/attachList',
                    params: {
                        relationId: row.projectId,
                        fileType: 'complete'
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.filesData = res.data || [];
                        this.$refs.modal_viewFiles.modalValue = true;
                    }
                })

            }
        }
    }
</script>

<style lang="scss" scoped>
    .projectCompleteQuality_authenticate-container {
    }
</style>