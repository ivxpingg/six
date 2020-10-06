<template>
    <div class="roleInfo-container">
        <Form ref="form"
              class="role-form"
              :model="formData"
              :rules="rules"
              :label-width="80">
            <FormItem label="编号:" prop="roleNo">
                <Input v-model="formData.roleNo"/>
            </FormItem>
            <FormItem label="名称:" prop="name">
                <Input v-model="formData.name"/>
            </FormItem>
            <FormItem label="节点类型:">
                <Select :value="formData.nodeType" readonly disabled>
                    <Option v-for="item in dict_nodeType" :value="item.value" :key="item.id">{{item.label}}</Option>
                </Select>
                <!--<Input value="formData" readonly disabled />-->
            </FormItem>
            <FormItem label="顺序:" prop="sort">
                <Input v-model="formData.sort" number/>
            </FormItem>
            <FormItem label="备注:">
                <Input type="textarea" />
            </FormItem>
        </Form>

        <div class="ivu-modal-footer">
            <!--<Button type="primary"-->
                    <!--size="large"-->
                    <!--@click="openEdit">编辑</Button>-->
            <Button type="primary"
                    size="large"
                    @click="save">保存</Button>
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
                        this.getData();
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
                    sort: 0
                },
                rules: {
                    roleNo: [{ required: true, message: '编号不能为空！', trigger: 'blur' }],
                    name: [{ required: true, message: '名称不能为空！', trigger: 'blur' }],
                    sort: [{ required: true, type: 'number', message: '顺序不能为空！', trigger: 'blur' }]
                },

                dict_nodeType: []
            };
        },
        mounted() {
            this.getDict();
        },
        methods: {
            openEdit() {

            },
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
            checkRoleNo() {
                return new Promise(((resolve, reject) => {
                    this.$http({
                        method: 'get',
                        url: '/role/checkRoleNo',
                        params: {
                            id: this.formData.roleId,
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
                                url: '/role/update',
                                data: JSON.stringify(this.formData)
                            }).then(res => {
                                if(res.code === 'SUCCESS') {
                                    this.$Message.success({
                                        content: '更新成功！'
                                    });
                                    this.$emit('updateNodeCallback');
                                }
                            })
                        } else {

                        }
                    })
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .roleInfo-container {
        position: relative;
        padding-bottom: 61px;
        .role-form{

        }
        .ivu-modal-footer {
            position: absolute;
            left: 0;
            right: 0;
            bottom: -16px;
        }
    }
</style>