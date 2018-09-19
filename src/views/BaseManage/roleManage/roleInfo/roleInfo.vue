<template>
    <div class="roleInfo-container">
        <Form ref="form"
              class="role-form"
              inline
              :model="formData"
              :rules="rules"
              :label-width="120">
            <FormItem label="名称:" prop="name">
                <Input v-model="formData.name"/>
            </FormItem>
            <FormItem label="节点类型:">
                <Input value="formData" readonly />
            </FormItem>
            <FormItem label="顺序:" prop="sort">
                <Input v-model="formData.sort" number/>
            </FormItem>
            <FormItem label="备注:">
                <Input type="textarea" />
            </FormItem>
        </Form>

        <div class="ivu-modal-footer">
            <Button type="primary"
                    size="large"
                    @click="openEdit">编辑角色</Button>
            <Button type="primary"
                    size="large"
                    @click="save">保存角色</Button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'roleInfo',
        props: {
            roleId: {
                type: String,
                default: ''
            }
        },
        watch: {
            roleId: {
                immediate: true,
                handler(val) {
                    if (val !== '') {

                    }
                }
            }
        },
        data() {
            return {
                formData: {
                    roleId: '',
                    parentId: '',
                    roleNo: '',
                    name: '',
                    remark: '',
                    nodeType: '',
                    sort: 0,
                },
                rules: {
                    name: [{ required: true, message: '名称不能为空！', trigger: 'blur' }],
                    roleNo: [{ required: true, message: '编号不能为空！', trigger: 'blur' }],
                    sort: [{ required: true, type: 'number', message: '顺序不能为空！', trigger: 'blur' }]
                }
            };
        },
        methods: {
            openEdit() {

            },
            getData() {
                this.$http({
                    method: 'get',
                    url: '/role/query',
                    params: {
                        roleId: this.roleId
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.formData = Object.assign(this.formData, res.data);
                    }
                })
            },
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/addUserInfo',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '更新成功！'
                                });
                                // this.$emit('');
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
    .roleInfo-container {
    }
</style>