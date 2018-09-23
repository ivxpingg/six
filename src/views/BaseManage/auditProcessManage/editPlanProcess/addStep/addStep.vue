<template>
    <div class="addStep-container">
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
                    @click="save">新增</Button>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'addStep',
        data() {
            return {
                formData: {
                    name: '',
                    remark: ''
                },
                rules: {
                    name: [{ required: true, message: '步骤名称不能为空！', trigger: 'blur' }]
                }
            }
        },
        method: {
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
                                    content: '新增成功！'
                                });
                                this.$emit('modal_addStep_callback');
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
    .addStep-container {
    }
</style>