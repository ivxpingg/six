<template>
    <div class="addDocument-container">
        <Modal v-model="modalValue"
               title="创建公文"
               :width="600"
               @on-visible-change="onVisibleChange">
            <Form ref="form"
                  class="user-form"
                  :model="formData"
                  :rules="rules"
                  :label-width="80">
                <FormItem label="文件类型:" prop="fileRecordType">
                    <Select v-model="formData.fileRecordType" >
                        <Option v-for="(item, index) in dict_fileRecordType"
                                :value="item.fileRecordType"
                                :key="item.fileRecordType"
                                :label="`${item.templateName}`"></Option>
                    </Select>
                </FormItem>
                <FormItem label="项目名称:" prop="projectId">
                    <Select v-model="formData.projectId" filterable >
                        <Option v-for="(item, index) in projectList"
                                :value="item.projectId"
                                :key="item.projectId"
                                :label="`${item.projectName} (${item.part})`"></Option>
                    </Select>
                </FormItem>
                <FormItem label="文件名称:" prop="fileName">
                    <Input v-model="formData.fileName" placeholder="请输入文件名称" style="font-size: 12px;"/>
                </FormItem>
            </Form>

            <div slot="footer">
                <Button type="primary"
                        size="large"
                        :loading="btn_loading"
                        @click="save">
                    <span v-if="!btn_loading">保存</span>
                    <span v-else>保存</span>
                </Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import modalMixin from '../../../lib/mixin/modalMixin';
    export default {
        name: 'addDocument',  // 添加公文
        mixins: [modalMixin],
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 400,      // 每页几行
                    total: 0,     // 总行数
                    loading: false,
                    condition: {
                        projectName: '',      // 模糊查询参数
                    }
                },
                projectList: [],
                formData: {
                    projectId: '',
                    fileRecordType: '',
                    fileName: ''
                },
                rules: {
                    fileRecordType: [{ required: true, message: '文件类型不能为空！', trigger: 'blur' }],
                    projectId: [{ required: true, message: '项目不能为空！', trigger: 'blur' }],
                    fileName: [{ required: true, message: '文件名称不能为空！', trigger: 'blur' }]
                },

                // 固定几种文件类型选择，与 fileRecordType字典 数据对应
                dict_fileRecordType: [
                    { fileRecordType: 'accept_notice', templateName: '质量监督管理受理通知书' },
                    { fileRecordType: 'apply_file_check', templateName: '质量监督申请材料核查意见书'},
                    { fileRecordType: 'com_check_notice', templateName: '综合督查通报' },
                    { fileRecordType: 'spot_check', templateName: '质量安全监督抽查意见通知书' }
                ],

                btn_loading: false
            };
        },
        mounted() {
            this.getProjectData();
        },
        methods: {
            // 获取项目列表
            getProjectData() {
                this.$http({
                    method: 'post',
                    url: '/project/list',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.projectList = res.data.records || [];
                    }
                }).catch(() => {
                })
            },
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid && !this.btn_loading) {
                        this.btn_loading = true;
                        this.$http({
                            method: 'post',
                            url: '/',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '添加成功！'
                                });
                                this.modalValue = false;
                                this.btn_loading = false;
                                this.$emit('modal-callback');
                            }
                        }).catch(error => {
                            console.dir(error);
                            this.$Message.error(error.message);
                            this.btn_loading = false;
                        })
                    } else {

                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .addDocument-container {
    }
</style>