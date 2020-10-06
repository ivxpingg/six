<template>
    <div class="unitCreditRecord-container"><vIvxFilterBox>
        <Form inline>
            <FormItem label="搜索条件:" :label-width="65">
                <Input v-model="searchParams.projectName"
                       style="width: 220px;"
                       placeholder="请输入项目名称"/>
            </FormItem>
            <FormItem label="" :label-width="0">
                <Input v-model="searchParams.searchKey"
                       style="width: 220px;"
                       placeholder="请输入单位"/>
            </FormItem>
            <FormItem label="所属单位类型:" :label-width="90">
                <Select v-model="searchParams.unitType" clearable
                        placeholder="全选"
                        style="width: 220px;">
                    <Option v-for="item in dict_unitType"
                            :value="item.value"
                            :key="`unitType_${item.id}`">{{item.label}}</Option>
                </Select>
            </FormItem>
            <FormItem label="选择时间:" :label-width="65">
                <DatePicker type="year"
                            @on-change="onChage_daterange"
                            placeholder="请输入单位名称"
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

        <Modal v-model="modal_edit" title="修改">
            <Form :label-width="200"
                  ref="form"
                  :rules="rules"
                  :model="formData">
                <FormItem label="项目建设期间信用综合评价得分：" prop="projectCreditScore">
                    <Input v-model="formData.projectCreditScore" number placeholder="请输入得分" />
                </FormItem>
                <FormItem label="企业在该合同(段)的信用评分(分)：" prop="partCreditScore">
                    <Input v-model="formData.partCreditScore" number placeholder="请输入得分" />
                </FormItem>
                <FormItem label="其他失信行为及扣分：">
                    <Input v-model="formData.otherDeduct" type="textarea" :rows="3" placeholder="请输入" />
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
    import AuthMixin from '../../../lib/mixin/authMixin';
    export default {
        name: 'unitCreditRecord',  // 企业信用台账
        mixins: [AuthMixin],
        components: {vIvxFilterBox},
        computed: {
            downloadUrl() {
                return Config[Config.env].origin
                    + Config[Config.env].ajaxUrl + '/record/exportUnitCreditRecord'
                    + `?searchKey=${encodeURIComponent(this.searchParams.searchKey)}&unitType=${this.searchParams.unitType}&year=${this.searchParams.year}`;
            },
            _tableColumns() {
                return this.auth_update ? this.tableColumns.concat([{
                    title: '操作',
                    align: 'center',
                    fixed: 'right',
                    width: 120,
                    render: (h, params) => {
                        return h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small',
                            },
                            on: {
                                click: () => {
                                    this.formData.unitCreditRecordId = params.row.unitCreditRecordId || '';
                                    this.formData.projectCreditScore = params.row.projectCreditScore || null;
                                    this.formData.partCreditScore = params.row.partCreditScore || null;
                                    this.formData.otherDeduct = params.row.otherDeduct || null;
                                    this.modal_edit = true;
                                }
                            }
                        }, '编辑');
                    }
                }]) : this.tableColumns;
            }
        },
        data() {
            return {
                searchParams: {
                    projectName: '',
                    searchKey: '',      // 模糊查询参数
                    unitType: '',
                    year: ''
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '日期', align: 'center', width: 120, key: 'recordDate',
                        render: (h, params) => {
                            return h('div', params.row.recordDate ? MOMENT(params.row.recordDate).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '企业名称', align: 'center', width: 180, key: 'unitName'},
                    { title: '注册地址', align: 'center', width: 180, key: 'registerAddress'},
                    { title: '资质类别', align: 'center', width: 120, key: 'qualificationType'},
                    { title: '资质许可等级', align: 'center', width: 120, key: 'qualificationLevel'},
                    { title: '项目名称', align: 'center', width: 120, key: 'projectName'},
                    { title: '标段', align: 'center', width: 100, key: 'part'},
                    { title: '项目进度', align: 'center', width: 120, key: 'projectProgress'},
                    { title: '投资额（万元）', align: 'center', width: 140, key: 'amount'},
                    { title: '失信代码', align: 'center', width: 120, key: 'creditNo'},
                    { title: '失信行为', align: 'center', width: 160, key: 'content'},
                    { title: '扣分标准', align: 'center', width: 120, key: 'scoreStandard'},
                    { title: '实际扣分', align: 'center', width: 120, key: 'deduct'},
                    { title: '情况说明（扣分项）', align: 'center', width: 160, key: 'deductDetail'},
                    { title: '项目建设期间信用综合评价得分', align: 'center', width: 210, key: 'projectCreditScore'},
                    { title: '企业在该合同(段)的信用评分(分)', align: 'center', width: 210, key: 'partCreditScore'},
                    // { title: '采信依据', align: 'center', width: 120, key: 'creditAccording'},
                    { title: '其他失信行为及扣分', align: 'center', width: 180, key: 'otherDeduct'},

                ],
                tableData: [],
                tableLoading: false,

                // 编辑
                modal_edit: false,
                formData: {
                    unitCreditRecordId: '',
                    projectCreditScore: '',
                    partCreditScore: '',
                    otherDeduct: ''
                },
                rules: {
                    projectCreditScore: [{ type: 'number', message: '输入格式不正确, 请重新输入', trigger: 'blur' }],
                    partCreditScore: [{ type: 'number', message: '输入格式不正确, 请重新输入', trigger: 'blur' }]
                },

                // 字典
                dict_unitType: []
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
            this.getDict_unitType();
        },
        methods: {
            onChage_daterange(value) {
                this.searchParams.year = value;
            },
            getDict_unitType() {
                this.$http({
                    method: 'get',
                    url: '/dict/getListByType',
                    params: {
                        type: 'unitType'
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.dict_unitType = res.data;
                    }
                })
            },
            // 保存修改
            onClick_edit() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/record/updateUnitCreditRecord',
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
            // 获取表格数据
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/record/unitCreditRecord',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data || [];
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .unitCreditRecord-container {
        padding-top: 10px;
    }
</style>