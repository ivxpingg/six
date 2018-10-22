<template>
    <div class="addProjectAuthenticate-container">
        <Modal v-model="modalValue"
               title="添加工程备案"
               :width="540">
            <Form ref="form"
                  class="form"
                  :model="formData"
                  :rules="rules"
                  :label-width="120">
                <FormItem label="项目名称:" prop="projectId">
                    <Select v-model="formData.projectId">
                        <Option v-for="item in projectList"
                                :key="item.projectId"
                                :value="item.projectId"
                                :label="`${item.projectName} (标段：${item.part})`"></Option>
                    </Select>
                </FormItem>

                <FormItem label="工程质量鉴定报告:">
                    <Upload :action="uploadParams.actionUrl"
                            :showUploadList="uploadParams.showUploadList"
                            :multiple="uploadParams.multiple"
                            :accept="uploadParams.accept"
                            :maxSize="uploadParams.maxSize"
                            :before-upload="fileBeforeUpload"
                            :on-exceeded-size="exceededSize"
                            :on-error="fileUploadError"
                            :on-success="fileUploadSuccess">
                        <Button type="primary" icon="ios-cloud-upload-outline">上传文件</Button>
                    </Upload>
                </FormItem>
                <FormItem label="监督管理工作报告:">
                    <Upload :action="uploadParams.actionUrl"
                            :showUploadList="uploadParams.showUploadList"
                            :multiple="uploadParams.multiple"
                            :accept="uploadParams.accept"
                            :maxSize="uploadParams.maxSize"
                            :before-upload="fileBeforeUpload"
                            :on-exceeded-size="exceededSize"
                            :on-error="fileUploadError"
                            :on-success="fileUploadSuccess">
                        <Button type="primary" icon="ios-cloud-upload-outline">上传文件</Button>
                    </Upload>
                </FormItem>
            </Form>

            <div slot="footer">
                <Button type="primary"
                        size="large"
                        @click="save">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    import uploadMixin from '../../../../lib/mixin/uploadMixin';
    export default {
        name: 'addProjectAuthenticate',
        mixins: [modalMixin, uploadMixin],
        data() {
            return {
                formData: {
                    projectId: ''
                },
                rules: {
                    projectId: [{ required: true, message: '项目不能为空！', trigger: 'blur' }]
                },

                // 项目列表
                projectList: []
            };
        },
        mounted() {
            this.getProjectList();
            this.getDict(['recordType']);
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
                    if (res.code === 'SUCCESS') {
                        list.forEach(val => {
                            this[`dict_${val}`] = res.data[val];
                        });

                    }
                })
            },
            // 获取项目列表
            getProjectList() {
                this.$http({
                    method: 'post',
                    url: '/project/list',
                    data: JSON.stringify({
                        current: 1,      // 当前第几页
                        size: 10000,      // 每页几行
                    })
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.projectList = res.data.records;
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
                                    content: '添加成功！'
                                });
                                this.$emit('modal_callback');
                            }
                        })

                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .addProjectAuthenticate-container {
    }
</style>