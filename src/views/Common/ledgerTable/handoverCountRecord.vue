<template>
    <div class="handoverCountRecord-container">
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.searchKey"
                           style="width: 220px;"
                           placeholder="项目名称"/>
                </FormItem>
                <FormItem label="选择时间:" :label-width="65">
                    <DatePicker type="year"
                                @on-change="onChage_daterange"
                                placeholder="选择时间"
                                style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem>
                    <Button icon="ios-download-outline" type="primary" :to="downloadUrl" target="_blank">导出</Button>
                </FormItem>
            </Form>
        </vIvxFilterBox>
        <div class="ivx-table-box">
            <Table border
                   :height="540"
                   :loading="tableLoading"
                   :columns="_tableColumns"
                   :data="tableData"></Table>
        </div>

        <!--编辑-->
        <Modal v-model="modal_edit" title="修改">
            <Form :label-width="130"
                  ref="form"
                  :rules="rules"
                  :model="formData">
                <FormItem label="信用综合评价得分：" prop="compositeScore">
                    <Input v-model="formData.compositeScore" number placeholder="请输入得分" />
                </FormItem>
                <FormItem label="备注：">
                    <Input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button size="large" type="primary" @click="onClick_edit">保存</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import MOMENT from 'moment';
    import Config from '../../../config';
    export default {
        name: 'handoverCountRecord',  // 交工项目综合评价台账
        components: {vIvxFilterBox},
        computed: {
            downloadUrl() {
                return Config[Config.env].origin
                    + Config[Config.env].ajaxUrl + '/record/exportHandoverCountRecord'
                    + `?searchKey=${encodeURIComponent(this.searchParams.searchKey)}&year=${this.searchParams.year}`;
            },
            _tableColumns() {

                let beforeCol = [];
                let afterCols = [
                    { title: '项目建设期间信用综合评价得分', width: 180, align: 'center', key: 'compositeScore' },
                    { title: '主要失信行为代码', width: 180, align: 'center', key: 'discreditCode' },
                    { title: '备注', width: 180, align: 'center', key: 'remark' },
                    {
                        title: '操作',
                        align: 'center',
                        fixed: 'right',
                        width: 100,
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                },
                                on: {
                                    click: () => {
                                        this.formData.handoverCountId = params.row.handoverCountId || '';
                                        this.formData.compositeScore = params.row.compositeScore || null;
                                        this.formData.remark = params.row.remark || '';
                                        this.modal_edit = true;
                                    }
                                }
                            }, '编辑');
                        }
                    }
                ];

                let yearList = [];
                this.tableData.forEach(val => {
                    if (val.scoreList && val.scoreList.length > 0) {
                        val.scoreList.forEach(v => {
                            if (yearList.indexOf(v.year) === -1) {
                                yearList.push(v.year);
                                val[v.year] = v.score || '';

                                beforeCol.push({
                                    title: v.year,
                                    width: 120,
                                    align: 'center',
                                    key: v.year
                                });
                            }
                        });
                    }
                });

                return this.tableColumns.concat(beforeCol).concat(afterCols);
            }
        },
        data() {
            return {
                searchParams: {
                    searchKey: '',      // 模糊查询参数
                    year: ''
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '评价省名称', width: 180, align: 'center', key: 'province' },
                    { title: '企业名称', width: 180, align: 'center', key: 'unitName' },
                    { title: '企业注册地', width: 180, align: 'center', key: 'registerAddress' },
                    { title: '工程项目名称', width: 180, align: 'center', key: 'projectName' },
                    { title: '合同段名称', width: 180, align: 'center', key: 'part' },
                    { title: '资质类别', width: 180, align: 'center', key: 'qualificationType' },
                    { title: '资质许可等级', width: 180, align: 'center', key: 'qualificationLevel' },
                    { title: '合同金额（万元）', width: 180, align: 'center', key: 'amount' },
                    { title: '项目开工时间', align: 'center', width: 120,
                        render(h, params) {
                            return h('div', params.row.planBeginTime ? MOMENT(params.row.planBeginTime).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '项目交工时间', width: 180, align: 'center',
                        render(h, params) {
                            return h('div', params.row.handoverTime ? MOMENT(params.row.handoverTime).format('YYYY-MM-DD') : '');
                        }
                    },

                ],
                tableData: [],
                tableLoading: false,


                // 编辑
                modal_edit: false,
                formData: {
                    handoverCountId: '',
                    compositeScore: '',
                    remark: ''
                },
                rules: {
                    compositeScore: [
                        { type: 'number', message: '输入格式不正确, 请重新输入', trigger: 'blur'},
                        { required: true, type: 'number', message: '得分不能为空', trigger: 'blur'}
                    ]
                }
            };
        },
        watch: {
            searchParams: {
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
            onChage_daterange(value) {
                this.searchParams.year = value;
            },
            // 获取表格数据
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/record/handoverCountRecord',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data || [];
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            },

            // 保存修改
            onClick_edit() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/record/updateHandoverCountRecord',
                            data: JSON.stringify(this.formData)
                        }).then((res) => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('更新成功!');
                                this.getData();
                                this.modal_edit = false;
                            }
                        })
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .handoverCountRecord-container {
        padding-top: 10px;
    }
</style>