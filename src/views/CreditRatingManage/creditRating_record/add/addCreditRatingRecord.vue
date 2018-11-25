<template>
    <div class="addCreditRatingRecord-container">
        <Modal v-model="modalValue"
               title="添加信用评价"
               :width="700"
               @on-visible-change="onVisibleChange">
            <Form ref="form"
                  class="form"
                  inline
                  :model="formData"
                  :rules="rules"
                  :label-width="80">
                <FormItem label="项目名称:" prop="projectId">
                    <Select v-model="formData.projectId">
                        <Option v-for="(item, idx) in projectList"
                                :key="item.projectId + idx"
                                :value="item.projectId"
                                :label="`${item.projectName}(${item.part})`"></Option>
                    </Select>
                </FormItem>
                <FormItem label="单位名称:" prop="projectUnitId">
                    <Select v-model="formData.projectUnitId" clearable>
                        <Option v-for="item in projectUnitList"
                                :key="item.projectUnitId"
                                :value="item.projectUnitId"
                                :label="item.unitName"></Option>
                    </Select>
                </FormItem>
                <FormItem label="用户:" v-show="formData.projectUnitId">
                    <Select v-model="formData.projectUserId">
                        <Option v-for="item in projectUserList"
                                :key="item.projectUserId"
                                :value="item.projectUserId"
                                :label="item.name"></Option>
                    </Select>
                </FormItem>
                <FormItem label="扣分代码:" prop="creditCodeId">
                    <Input v-model="formData.creditNo"
                           readonly
                           @on-focus="modal_creditCodeSelect_open"/>
                </FormItem>
                <FormItem label="扣分:" prop="deduct">
                    <Poptip trigger="focus"
                            width="240"
                            word-wrap
                            placement="top-start">
                        <Input v-model="formData.deduct"
                               number
                               style="width: 240px;"
                               placeholder="请输入如:5"/>
                        <div slot="content">{{formData.scoreStandard}}</div>
                    </Poptip>
                </FormItem>
                <FormItem  v-show="formData.projectUnitId"></FormItem>
                <FormItem label="扣分项:" prop="content">
                    <Poptip trigger="focus"
                            width="570"
                            word-wrap
                            placement="top-start">
                        <Input v-model="formData.deductDetail"
                               style="width: 570px;"
                               type="textarea"
                               :rows="5"
                               placeholder="请输入"/>
                        <div slot="content">{{formData.content}}</div>
                    </Poptip>

                </FormItem>
                <FormItem label="采信依据:" prop="content">
                    <Input v-model="formData.creditAccording"
                           style="width: 570px;"
                           type="textarea"
                           :rows="5"
                           placeholder="请输入"/>
                </FormItem>
            </Form>

            <div slot="footer">
                <Button type="primary"
                        size="large"
                        @click="save">保存</Button>
            </div>
        </Modal>


        <vModalCreditCodeSelect
                ref="creditCodeSelect"
                @modal-callback="modal_creditCodeSelect_callback"></vModalCreditCodeSelect>

    </div>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    import vModalCreditCodeSelect from '../../../Common/creditCodeSelect/modalCreditCodeSelect';
    export default {
        name: 'addCreditRatingRecord',
        mixins: [modalMixin],
        components: {vModalCreditCodeSelect},
        props: {
            projectList: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                formData: {
                    projectId: '',
                    part: '',
                    projectUnitId: '',
                    projectUserId: '',
                    unitName: '',
                    // unitType: '',
                    creditCodeId: '',
                    creditNo: '',
                    scoreStandard: '',  // 评分标准
                    deduct: null,      // 扣分
                    deductDetail: '',   // 扣分项
                    content: '',
                    creditAccording: ''
                },
                rules: {
                    projectId: [{ required: true, message: '项目不能为空！', trigger: 'blur' }],
                    projectUnitId: [{ required: true, message: '单位不能为空！', trigger: 'blur' }],
                    creditCodeId: [{ required: true, message: '扣分代码不能为空！', trigger: 'blur' }],
                    deduct: [{ required: true, type:'number', message: '扣分不能为空！', trigger: 'blur' }],
                    deductDetail: [{ required: true, message: '扣分项不能为空！', trigger: 'blur' }],
                },

                dict_unitType: [],

                // 参建单位列表
                projectUnitList: [],
                // 参建单位中的参建人员
                projectUserList: []
            };
        },
        watch: {
            'formData.projectId'(val) {
                for(let i = 0; i < this.projectList.length; i++) {
                    if (this.projectList[i] === val) {
                        this.formData.part = this.projectList[i].part;
                        break;
                    }
                }

                this.get_projectUnitList();
            },
            'formData.projectUnitId'(val) {
                if (val) {
                    this.getProjectUserList_projectUnitId();
                }
                else{
                    this.projectUserList = [];
                    this.formData.projectUserId = '';
                }
            }
        },
        mounted() {
            this.getDict(['unitType']);
        },
        methods: {
            getDict(list) {
                this.$http({
                    method: 'get',
                    url: '/dict/getListByTypes',
                    params: {
                        types: list.join(',')
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        list.forEach(val => {
                            this[`dict_${val}`] = res.data[val];
                        });

                    }
                })
            },
            // 获取参建单位列表
            get_projectUnitList() {
                this.$http({
                    method: 'get',
                    url: '/project/projectUnitList',
                    params: {
                        projectId: this.formData.projectId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.projectUnitList = res.data || [];
                    }
                })
            },

            // 获取参建单位人员
            getProjectUserList_projectUnitId() {
                this.$http({
                    method: 'get',
                    url: '/project/viewProjectUser',
                    params: {
                        projectUnitId: this.formData.projectUnitId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.formData.projectUserId = '';
                        this.projectUserList = res.data || [];
                    }
                })
            },
            // 扣分代码选择
            modal_creditCodeSelect_open() {
                this.$refs.creditCodeSelect.modalValue = true;
            },
            modal_creditCodeSelect_callback(selectValue, selectItems) {

                this.formData.creditCodeId = selectItems.creditCodeId;
                this.formData.creditNo = selectItems.creditNo;
                this.formData.scoreStandard = selectItems.scoreStandard;
                this.formData.content = selectItems.content;
                this.$refs.form.validateField('creditCodeId');
            },
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/creditEvaluate/add',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '添加成功！'
                                });
                                this.$emit('modal_callback');
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
    .addCreditRatingRecord-container {

    }

    .form {
        .ivu-form-item {
            .ivu-form-item-content > div{
                width: 240px;
            }
        }
    }
</style>