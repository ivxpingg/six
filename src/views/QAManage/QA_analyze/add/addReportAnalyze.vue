<template>
    <div class="addReportAnalyze-container">
        <Modal v-model="modalValue" title="上传年度报表">
            <Form ref="form"
                  :model="formData"
                  :rules="rules"
                  :label-width="95">
                <FormItem label="项目名称：" prop="projectName">
                    <Input v-model="formData.projectName" placeholder="请输入" />
                </FormItem>
                <FormItem label="数据年度：" prop="dataYear">
                    <DatePicker :value="formData.dataYear" type="year" placeholder="请选择年份" style="width: 200px" @on-change="onChange_year"></DatePicker>
                </FormItem>
                <FormItem label="地区：" prop="county">
                    <Select v-model="formData.county">
                        <Option v-for="item in areaList"
                                :key="item.regionId"
                                :value="item.regionId"
                                :label="item.regionName"></Option>
                    </Select>
                </FormItem>
                <FormItem label="报表：" prop="fileId">
                    <Upload ref="upload"
                            :action="uploadActive"
                            :showUploadList="uploadParams.showUploadList"
                            :multiple="uploadParams.multiple"
                            :accept="uploadParams.accept"
                            :maxSize="uploadParams.maxSize"
                            :on-remove="onRemoveFile"
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
        name: 'addReportAnalyze',
        mixins: [modalMixin, uploadMixin],
        computed: {
            uploadActive() {
                return this.uploadParams.actionUrl + '/report';
            }
        },
        data() {
            return {
                areaList: [],

                uploadParams: {
                    showUploadList: true
                },
                formData: {
                    projectName: '',
                    dataYear: '',
                    county: '',
                    fileId: ''
                },
                rules: {
                    projectName: [{ required: true, message: '项目名称不能为空！', trigger: 'blur' }],
                    county: [{ required: true, message: '地区不能为空！', trigger: 'blur' }],
                    dataYear: [{ required: true, message: '数据年度不能为空！', trigger: 'blur' }],
                    fileId: [{ required: true, message: '请上传报表！', trigger: 'blur' }]
                }
            };
        },
        mounted() {
            this.getAreaInfo();
        },
        methods: {
            onChange_year(value) {
                this.formData.dataYear = value;
            },
            // 文件移除
            onRemoveFile(file, fileList) {
                this.formData.fileId = '';
                this.$refs.form.validateField('fileId');
            },
            fileBeforeUpload() {
                this.$Loading.start();
                this.$refs.upload.clearFiles();
            },

            fileUploadSuccess(response, file, fileList) {
                this.formData.fileId = response.data.fileId;
                if (this.formData.reportName.trim() === '') {
                    this.formData.reportName = response.data.fileName;
                }
                this.$refs.form.validateField('fileId');
            },
            //获取六安所有区
            getAreaInfo() {
                this.$http({
                    method: 'get',
                    url: '/region/regionList',
                    params: {
                        parentId: '146'
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.areaList = res.data || [];
                    }
                })
            },

            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/dataAnalysis/add',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '上传成功！'
                                });
                                this.modalValue = false;
                                this.$emit('modal-callback');
                            }
                        })

                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .addReportAnalyze-container {
    }
</style>