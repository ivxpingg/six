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
                        <Option v-for="item in projectList"
                                :key="item.projectId"
                                :value="item.projectId"
                                :label="item.projectName"></Option>
                    </Select>
                </FormItem>
                <FormItem label="标段:">
                    <Input v-model="formData.part" disabled/>
                </FormItem>
                <FormItem label="单位名称:" prop="unitId">
                    <Input v-model="formData.unitName" readonly @on-focus="modal_unitSelect_open"/>
                </FormItem>
                <FormItem label="单位类型:">
                    <Select v-model="formData.unitType"  placeholder="">
                        <Option v-for="item in dict_unitType"
                                :key="item.id"
                                :value="item.value"
                                :label="item.label"></Option>
                    </Select>
                </FormItem>
                <FormItem label="扣分代码:" prop="creditNo">
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
            </Form>

            <div slot="footer">
                <Button type="primary"
                        size="large"
                        @click="save">保存</Button>
            </div>
        </Modal>

        <vModalUnitSelect
                ref="unitSelect"
                @modal-callback="modal_unitSelect_callback" ></vModalUnitSelect>

        <vModalCreditCodeSelect
                ref="creditCodeSelect"
                @modal-callback="modal_creditCodeSelect_callback"></vModalCreditCodeSelect>

    </div>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    import vModalUnitSelect from '../../../Common/unitSelect/modalUnitSelect';
    import vModalCreditCodeSelect from '../../../Common/creditCodeSelect/modalCreditCodeSelect';
    export default {
        name: 'addCreditRatingRecord',
        mixins: [modalMixin],
        components: {vModalUnitSelect, vModalCreditCodeSelect},
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
                    unitId: '12',
                    unitName: '',
                    unitType: '',
                    creditNo: 'N.123',
                    scoreStandard: '',  // 评分标准
                    deduct: null,      // 扣分
                    deductDetail: '',   // 扣分项
                    content: ''
                },
                rules: {
                    projectId: [{ required: true, message: '项目不能为空！', trigger: 'blur' }],
                    unitId: [{ required: true, message: '单位不能为空！', trigger: 'blur' }],
                    creditNo: [{ required: true, message: '扣分代码不能为空！', trigger: 'blur' }],
                    deduct: [{ required: true, message: '扣分不能为空！', trigger: 'blur' }],
                    deductDetail: [{ required: true, message: '扣分项不能为空！', trigger: 'blur' }],
                },

                dict_unitType: []
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
            modal_unitSelect_open() {
                this.$refs.unitSelect.modalValue = true;
            },
            modal_unitSelect_callback(selectValue, selectItems) {
                this.formData.unitId = selectItems.unitId;
                this.formData.unitName = selectItems.unitName;

                this.formData.unitType = selectItems.unitType;
                this.$refs.form.validateField('unitId');
            },
            // 扣分代码选择
            modal_creditCodeSelect_open() {
                this.$refs.creditCodeSelect.modalValue = true;
            },
            modal_creditCodeSelect_callback(selectValue, selectItems) {

                this.formData.creditNo = selectItems.creditNo;
                this.formData.scoreStandard = selectItems.scoreStandard;
                this.formData.content = selectItems.content;
                this.$refs.form.validateField('creditNo');
            },
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/',
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