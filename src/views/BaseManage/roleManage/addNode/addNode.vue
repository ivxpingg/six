<template>
    <div class="addNode-container">
        <Form ref="form"
              class="user-form"
              inline
              :model="formData"
              :rules="rules"
              :label-width="120">
            <FormItem label="编号:" prop="roleNo">
                <Input v-model="formData.roleNo"/>
            </FormItem>
            <FormItem label="节点名称:" prop="name">
                <Input v-model="formData.name"/>
            </FormItem>
            <FormItem label="节点类型:">
                <Select :value="formData.nodeType" readonly disabled>
                    <Option v-for="item in dict_nodeType" :value="item.value" :key="item.id">{{item.label}}</Option>
                </Select>
            </FormItem>
            <FormItem label="顺序:" prop="sort">
                <Input v-model="formData.sort" number/>
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
        name: 'addNode',
        props: {
            parentId: {
                type: String
            },
            nodeType: {
                type: String,
                default: 'group'
            }
        },
        watch: {
            parentId: {
                immediate: true,
                handler(val) {
                    this.formData.parentId = val;
                }
            },
            nodeType: {
                immediate: true,
                handler(val) {
                    this.formData.nodeType = (val === '')? 'group' : val;
                }
            }
        },
        data() {
            return {
                formData: {
                    parentId: '',
                    roleNo: '',
                    name: '',
                    nodeType: '',
                    sort: 0,
                    remark: ''
                },
                rules: {
                    roleNo: [{ required: true, message: '编号不能为空！', trigger: 'blur' }],
                    name: [{ required: true, message: '姓名不能为空！', trigger: 'blur' }],
                    sort: [{ required: true, type: 'number', message: '顺序不能为空！', trigger: 'blur' }]
                },
                dict_nodeType: []
            };
        },
        mounted() {
            this.getDict();
        },
        methods: {
            getDict() {
                this.$http({
                    method: 'get',
                    url: '/dict/getListByType',
                    params: {
                        type: 'nodeType'
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.dict_nodeType = res.data;
                    }
                })
            },
            checkRoleNo() {
                return new Promise(((resolve, reject) => {
                    this.$http({
                        method: 'get',
                        url: '/role/checkRoleNo',
                        params: {
                            roleNo: this.formData.roleNo
                        }
                    }).then(res => {
                        if(res.code === 'SUCCESS') {
                            resolve();
                        }
                        else {
                            reject(res);
                        }
                    });
                }));
            },
            save() {
                this.checkRoleNo().then(() => {
                    this.$refs.form.validate((valid) => {
                        if (valid) {
                            this.$http({
                                method: 'post',
                                url: '/role/add',
                                data: JSON.stringify(this.formData)
                            }).then(res => {
                                if(res.code === 'SUCCESS') {
                                    this.$Message.success({
                                        content: '更新成功！'
                                    });
                                    this.$emit('modal_addNodeCallback');
                                }
                            })
                        } else {

                        }
                    })
                }).catch(() => {
                    this.$Message.error({
                        content: `编号<${this.formData.roleNo}>已经存在, 请重新输入。`
                    });
                });


            }
        }
    }
</script>

<style lang="scss" scoped>
    .addNode-container {
    }
</style>