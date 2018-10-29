<template>
    <div class="project_audit-container">
        <Form ref="form"
              class="user-form"
              :model="formData"
              :rules="rules"
              :label-width="75">
            <FormItem label="报送单位:" prop="unitId">
                <Input v-model="formData.unitName" readonly @on-focus="onClick_unitSelect_open"/>
            </FormItem>
            <!--<FormItem label="审核流程:" prop="auditProcessId">-->
                <!--<Input v-model="formData.name" readonly @on-focus="onClick_auditProcessSelect_open"/>-->
            <!--</FormItem>-->
        </Form>

        <div class="ivu-modal-footer six-modal-footer-padding-bottom-0">
            <Button type="primary"
                    size="large"
                    @click="save">保存</Button>
        </div>

        <Modal v-model="modal_unitSelect"
               title="选择单位"
               :width="1000"
               footer-hide>
            <vUnitSelect @handleSelect="handleSelect_unitSelect"></vUnitSelect>
        </Modal>

        <!--<Modal v-model="modal_auditProcessSelect"-->
               <!--title="选择流程"-->
               <!--:width="1000"-->
               <!--footer-hide>-->
            <!--<vAuditProcessSelect @handleSelect="handleSelect_auditProcessSelect"></vAuditProcessSelect>-->
        <!--</Modal>-->
    </div>
</template>

<script>
    import vUnitSelect from '../../../Common/unitSelect/unitSelect';
    import vAuditProcessSelect from '../../../Common/auditProcessSelect/auditProcessSelect';
    export default {
        name: 'project_audit', // 项目提交审核
        components: {vUnitSelect, vAuditProcessSelect},
        props: {
            projectId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                formData: {
                    unitId: '',
                    unitName: ''
                },
                rules: {
                    unitId: [{ required: true, message: '报送单位不能为空！', trigger: 'blur' }]
                },

                // 单位选择
                modal_unitSelect: false,
                // 流程选择
                modal_auditProcessSelect: false
            };
        },
        methods: {
            onClick_unitSelect_open() {
                this.modal_unitSelect = true;
            },
            onClick_auditProcessSelect_open() {
                this.modal_auditProcessSelect = true;
            },
            /**
             * 添加新增选择的单位
             * @param selectValue 单位数组
             */
            handleSelect_unitSelect(selectValue, selectedItems) {
                this.modal_unitSelect = false;
                this.formData.unitId = selectedItems.unitId;
                this.formData.unitName = selectedItems.unitName;
            },
            // handleSelect_auditProcessSelect(selectValue, selectedItems) {
            //     this.modal_auditProcessSelect = false;
            //     this.formData.auditProcessId = selectedItems.auditProcessId;
            //     this.formData.name = selectedItems.name;
            // },
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'get',
                            url: '/project/submitAudit',
                            params: {
                                projectId: this.projectId,
                                unitId: this.formData.unitId
                            }
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '提交审核成功！'
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
    .project_audit-container {
    }
</style>