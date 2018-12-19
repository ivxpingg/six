<template>
    <div class="addSafeSupervisionRecord-container">
        <Modal v-model="modalValue"
               title="添加监督记录"
               @on-visible-change="onVisibleChange">
            <Form ref="form"
                  class="user-form"
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
                <FormItem label="督察时间:" prop="checkTime">
                    <DatePicker
                            :value="formData.checkTime"
                            type="date"
                            transfer
                            @on-change="onChange_checkTimeTime"
                            placeholder="选择时间"></DatePicker>
                </FormItem>
                <FormItem label="督查方式:">
                    <Select v-model="formData.checkWay">
                        <Option v-for="item in dict_checkWay"
                                :key="item.id"
                                :value="item.value"
                                :label="item.label"></Option>
                    </Select>
                </FormItem>
                <FormItem label="督查内容:" prop="content">
                    <Input v-model="formData.content" type="textarea" :rows="5" placeholder="请输入" />
                </FormItem>
                <FormItem label="督查类型:">
                    <Select v-model="formData.checkType">
                        <Option v-for="item in dict_checkType"
                                :key="item.id"
                                :value="item.value"
                                :label="item.label"></Option>
                    </Select>
                </FormItem>
            </Form>

            <div slot="footer">
                <Button type="primary"
                        size="large"
                        :loading="saveBtnLoading"
                        @click="save">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    export default {
        name: 'addSafeSupervisionRecord',
        mixins: [modalMixin],
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
                    checkTime: '',
                    checkWay: '',
                    content: '',
                    checkType: '',
                    moduleType: 'security'  // 安全监督
                },
                rules: {
                    projectId: [{ required: true, message: '项目不能为空！', trigger: 'blur' }],
                    content: [{ required: true, message: '督查内容不能为空！', trigger: 'blur' }],
                    checkTime: [{ required: true, message: '督察时间不能为空！', trigger: 'blur' }],
                    checkType: [{ required: true, message: '督察类型不能为空！', trigger: 'blur' }]
                },

                dict_checkWay: [],  // 督查方式
                dict_checkType: [], // 督查类型
                // 保存按钮状态
                saveBtnLoading: false
            };
        },
        watch: {
            dict_checkWay(val) {
                this.formData.checkWay = val[0] ? val[0].value || '' : '';
            }
        },
        mounted() {
            this.getDict(['checkWay', 'checkType']);
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
            onChange_checkTimeTime(val) {
                this.formData.checkTime = val;
            },
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.saveBtnLoading = true;
                        this.$http({
                            method: 'post',
                            url: '/supervisionCheck/add',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '添加监督成功！'
                                });
                                this.$emit('modal-callback');
                                this.saveBtnLoading = false;
                            }
                        }).catch(e => {
                            this.saveBtnLoading = false;
                        })
                    } else {

                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .addSafeSupervisionRecord-container {
    }
</style>