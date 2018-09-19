<template>
    <Form class="editDict-container"
          ref="formEdit"
          :model="format"
          :rules="rules"
          :label-width="55">
        <FormItem label="类型:" prop="type">
            <Input v-model="format.type" placeholder="字典类型" />
        </FormItem>
        <FormItem label="描述:" prop="description">
            <Input v-model="format.description" placeholder="描述" />
        </FormItem>
        <FormItem label="键值:" prop="label">
            <Input v-model="format.label" placeholder="键值" />
        </FormItem>
        <FormItem label="值:" prop="value">
            <Input v-model="format.value" placeholder="值" />
        </FormItem>
        <FormItem label="排序:" prop="sort">
            <Input v-model="format.sort" number placeholder="排序，如：1，2，3" />
        </FormItem>
        <FormItem label="">
            <Button type="primary" @click="save">保存</Button>
        </FormItem>
    </Form>
</template>

<script>
    export default {
        name: 'editDict',
        props: {
            did: {
                type: String,
                required: true,
                defult: ''
            }
        },
        watch: {
            did: {
                immediate: true,
                handler(val) {
                    if (val !== '') {
                        this.getDict();
                    }
                }
            }
        },
        data() {
            return {
                format: {
                    id: '',
                    type: '',
                    description: '',
                    label: '',
                    value: '',
                    sort: 0
                },
                rules: {
                    description: [{ required: true, message: '描述不能为空！', trigger: 'blur' }],
                    type: [{ required: true, message: '类型不能为空！', trigger: 'blur' }],
                    label: [{ required: true, message: '键值不能为空！', trigger: 'blur' }],
                    value: [{ required: true, message: '值不能为空！', trigger: 'blur' }],
                    sort: [{ required: true, type: 'number', message: '排序不能为空！', trigger: 'blur' }],
                }
            };
        },
        methods: {
            getDict() {
                this.$http({
                    method: 'get',
                    url: '/dict/query',
                    params: {
                        id: this.did
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        Object.assign(this.format, res.data);
                    }
                })
            },
            save() {
                this.$refs.formEdit.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/dict/update',
                            data: JSON.stringify(this.format)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '更新成功！'
                                });
                                this.$emit('editDict_callback');
                            }
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .editDict-container {
    }
</style>