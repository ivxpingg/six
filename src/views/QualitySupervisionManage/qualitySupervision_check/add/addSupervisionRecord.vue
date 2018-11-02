<template>
    <div class="addSupervisionRecord-container">
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
                    <Input v-model="formData.content" type="textarea" placeholder="请输入"/>
                </FormItem>
                <FormItem label="督查类型:">
                    <Select v-model="formData.projectId" style="width: 200px;">
                        <Option v-for="item in dict_supervisionType"
                                :key="item.id"
                                :value="item.value"
                                :label="item.label"></Option>
                    </Select>
                    <Upload style="display: inline-block; margin-left: 20px;" :action="uploadParams.actionUrl"
                            :showUploadList="uploadParams.showUploadList"
                            :multiple="uploadParams.multiple"
                            :accept="uploadParams.accept"
                            :maxSize="uploadParams.maxSize"
                            :before-upload="fileBeforeUpload"
                            :on-exceeded-size="exceededSize"
                            :on-error="fileUploadError"
                            :on-success="fileUploadSuccess">
                        <Button type="primary" icon="ios-cloud-upload-outline">上传督查文件</Button>
                    </Upload>
                </FormItem>
                <FormItem label="现场记录:">
                    <Upload :action="uploadParams.actionUrl"
                            :showUploadList="uploadParams.showUploadList"
                            :multiple="uploadParams.multiple"
                            :accept="uploadParams.accept"
                            :maxSize="uploadParams.maxSize"
                            :before-upload="fileBeforeUpload"
                            :on-exceeded-size="exceededSize"
                            :on-error="fileUploadError"
                            :on-success="fileUploadSuccess">
                        <Button type="primary" icon="ios-cloud-upload-outline">上传图片</Button> 支持扩展名：.png .jpg .gif .jpeg .pdf
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
        name: 'addSupervisionRecord',   // 添加监督记录
        mixins: [modalMixin, uploadMixin],
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
                    fileIds: ''
                },
                rules: {
                    projectId: [{ required: true, message: '项目不能为空！', trigger: 'blur' }],
                    content: [{ required: true, message: '督查内容不能为空！', trigger: 'blur' }],
                    checkTime: [{ required: true, message: '督察时间不能为空！', trigger: 'blur' }]
                },

                dict_checkWay: [],  // 督查方式
                dict_supervisionType: [] // 质量督查文件类别

            };
        },
        watch: {
            dict_checkWay(val) {
                this.formData.checkWay = val[0] ? val[0].value || '' : '';
            }
        },
        mounted() {
            this.getDict(['checkWay', 'supervisionType']);
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
                    } else {

                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .addSupervisionRecord-container {
    }
</style>