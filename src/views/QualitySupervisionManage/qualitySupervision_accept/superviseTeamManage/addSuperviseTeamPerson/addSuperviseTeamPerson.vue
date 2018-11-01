<template>
    <div class="addSuperviseTeamPerson">
        <Modal v-model="modalValue"
               title="添加人员">
            <Form ref="form"
                  :model="formData"
                  :rules="rules"
                  :label-width="75">
                <FormItem label="选择人员" prop="userId">
                    <Input v-model="formData.name" readonly @on-focus="onSelectPerson" />
                </FormItem>
                <FormItem label="人员类型">
                    <Select v-model="formData.monitorType">
                        <Option v-for="item in dict_monitorType"
                                :key="item.id" :label="item.label" :value="item.value"></Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary"
                        size="large"
                        @click="save">确定</Button>
            </div>
        </Modal>

        <vModalEmployeeSelect ref="modal_employeeSelect"
                              @modal-callback="modal_employeeSelected_callback"></vModalEmployeeSelect>
    </div>
</template>

<script>
    import modalMixin from '../../../../../lib/mixin/modalMixin';
    import vModalEmployeeSelect from '../../../../Common/employeeSelect/modalEmployeeSelect';
    export default {
        name: 'addSuperviseTeamPerson', // 添加监督管理人员
        mixins: [modalMixin],
        components: {vModalEmployeeSelect},
        props: {
            projectId: {
                type: String,
                required: true,
                default: ''
            }
        },
        watch: {
            projectId(val) {
                this.formData.projectId = val;
            }
        },
        data() {
            return {
                formData: {
                    projectId: '',
                    userId: '',
                    name: '',
                    monitorType: 'member'
                },
                rules: {
                    userId: [{ required: true, message: '请选择人员！', trigger: 'blur' }],
                },
                dict_monitorType: []

            };
        },
        mounted() {
            this.getDict('monitorType');
        },
        methods: {
            getDict(type) {
                this.$http({
                    method: 'get',
                    url: '/dict/getListByType',
                    params: {
                        type: type
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this[`dict_${type}`] = res.data;
                    }
                })
            },
            onSelectPerson() {
                this.$refs.modal_employeeSelect.modalValue = true;
            },
            modal_employeeSelected_callback(selectValue, selectItems) {
                this.formData.userId = selectItems.userId;
                this.formData.name = selectItems.name;
                this.$refs.form.validateField('userId');
            },
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/monitorGroup/add',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.onVisibleChange(false);
                                this.$Message.success({
                                    content: '添加成功！'
                                });
                                this.$emit('modal-callback');
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
    .addSuperviseTeamPerson-container {
    }
</style>