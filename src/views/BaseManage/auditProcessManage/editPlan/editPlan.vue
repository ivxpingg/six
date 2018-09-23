<template>
    <div class="editPlan-container">
        <Form ref="form"
              class="addPlan-form"
              :model="formData"
              :rules="rules"
              :label-width="80">
            <FormItem label="方案名称:" prop="name">
                <Input v-model="formData.name"/>
            </FormItem>
            <FormItem label="备注:">
                <Input v-model="formData.remark" type="textarea" />
            </FormItem>
        </Form>

        <div class="ivu-modal-footer">
            <Button type="primary"
                    size="large"
                    @click="save">保存</Button>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'editPlan',
        data() {
            return {
                formData: {
                    name: '',
                    remark: ''
                },
                rules: {
                    name: [{ required: true, message: '方案名称不能为空！', trigger: 'blur' }]
                }
            }
        },
        props: {
            auditProcessId: {
                userId: {
                    type: String,
                    required: true,
                    default: ''
                }
            }
        },
        watch: {
            auditProcessId: {
                immediate: true,
                handler(val) {
                    if (val !== '') {
                        this.getData();
                    }
                }
            }
        },
        method: {
            getData() {
                this.$http({
                    method: 'get',
                    url: '/',
                    params:{
                        auditProcessId: auditProcessId
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.format = Object.assign(this.format, res.data);
                    }
                })
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
                                    content: '更新成功！'
                                });
                                this.$emit('modal_editPanel_callback');
                            }
                        })
                    } else {

                    }
                })
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    .editPlan-container {
    }
</style>