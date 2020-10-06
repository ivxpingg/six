<template>
    <div class="unitEvaluate-container">
        <vIvxFilterBox v-if="auth_update">
            <Button type="primary" @click="modal_add_open">新增评价</Button>
        </vIvxFilterBox>

        <div class="ivx-table-box">
            <Table border
                   height="405"
                   :columns="_tableColumns"
                   :data="tableData"></Table>
        </div>

        <Modal v-model="modal_add" title="添加信用评价">
            <Form ref="form"
                  :label-width="80"
                  :model="formData"
                  :rules="rules">
                <FormItem label="年份:" prop="year">
                    <DatePicker type="year"
                                v-model="formData.year"
                                placeholder="选择年份"
                                @on-change="onChange_time"></DatePicker>
                </FormItem>
                <FormItem label="得分:" prop="score">
                    <Input v-model="formData.score" number />
                </FormItem>
                <FormItem label="信用等级:" prop="creditGrade">
                    <Input v-model="formData.creditGrade" />
                </FormItem>
                <FormItem label="评价单位:" prop="evaluateUnit">
                    <Input v-model="formData.evaluateUnit" />
                </FormItem>
            </Form>

            <div slot="footer">
                <Button type="primary"
                        size="large"
                        @click="save">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import vIvxFilterBox from '@/components/ivxFilterBox/ivxFilterBox';
    import AuthMixin from '../../../../../lib/mixin/authMixin';
    import MOMENT from 'moment';
    export default {
        name: 'unitEvaluate',  // 单位信用评价
        mixins: [AuthMixin],
        components: {vIvxFilterBox},
        props: {
            unitId: {
                type: String,
                required: true
            },
            editable: {
                type: Boolean,
                required: false,
                default: true
            }
        },
        computed: {
            _tableColumns() {
               return this.editable && this.auth_del ? this.tableColumns.concat([{ title: '操作',  align: 'center',
                   render: (h, params) => {
                       return h('Button', {
                           props:{
                               type: 'error',
                               icon: 'ios-trash'
                           },
                           on: {
                               click: () => {
                                   this.del(params.row);
                               }
                           }
                       }, '删除');
                   }
               }]) : this.tableColumns;
            }
        },
        data() {
            return {
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '年份', align: 'center', key: 'year' },
                    { title: '得分', align: 'center', key: 'score' },
                    { title: '信用等级',  align: 'center', key: 'creditGrade' },
                    { title: '评价单位', align: 'center', key: 'evaluateUnit' },
                    { title: '评价日期',  align: 'center', key: 'evaluateTime',
                        render(h, params) {
                            return h('div', params.row.evaluateTime ? MOMENT(params.row.evaluateTime).format('YYYY-MM-DD') : '');
                        }
                    }
                ],
                tableData: [],

                modal_add: false,
                formData: {
                    relationId: '',
                    year: '',
                    score: null,
                    creditGrade: '',
                    evaluateUnit: '',
                    evaluateTime: MOMENT().format('YYYY-MM-DD')
                },
                rules: {
                    year: [{ required: true, message: '年份不能为空！', trigger: 'blur' }],
                    score: [{ required: true, type: 'number', message: '得分不能为空！', trigger: 'blur' }],
                    creditGrade: [{ required: true, message: '信用等级不能为空！', trigger: 'blur' }],
                    evaluateUnit: [{ required: true, message: '评价单位不能为空！', trigger: 'blur' }],
                }
            };
        },
        watch: {
            unitId(val) {
                this.formData.relationId = val;
                this.getData();
            }
        },
        mounted() {
            this.formData.relationId = this.unitId;
            this.getData();
        },
        methods: {
            onChange_time(val) {
                this.formData.year = val;
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
                this.$http({
                    method: 'get',
                    url: '/unit/unitCreditList',
                    params: {
                        unitId: this.unitId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data || [];
                    }
                })
            },
            modal_add_open() {
                this.modal_add = true;
            },
            del(row) {
                this.$Modal.confirm({
                    title: '删除',
                    content: `确认要删除<${row.year}>年份的评价?`,
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/unit/deleteUnitCredit',
                            params: {
                                creditId: row.creditId
                            }
                        }).then((res) => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('删除成功!');
                                this.getData();
                            }
                        });
                    }
                })
            },
            // 添加信用评价
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/unit/addUnitCredit',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '添加成功！'
                                });
                                this.getData();
                                this.modal_add = false;
                            }
                        })
                    } else {

                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .unitEvaluate-container {
    }
</style>