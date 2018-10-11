<template>
    <div class="noticeModification-container">
        <Form ref="form"
              class="form"
              inline
              :model="formData"
              :rules="rules"
              :label-width="120">
            <FormItem label="姓名:" prop="name">
                <Input v-model="formData.name"/>
            </FormItem>
            <FormItem label="性别:">
                <Select v-model="formData.sex">
                    <Option value="0">女</Option>
                    <Option value="1">男</Option>
                </Select>
            </FormItem>

            <FormItem label="相关材料:">
                <Upload :action="uploadParams.actionUrl"
                        :showUploadList="uploadParams.showUploadList"
                        :multiple="uploadParams.multiple"
                        :accept="uploadParams.accept"
                        :maxSize="uploadParams.maxSize"
                        :before-upload="fileBeforeUpload"
                        :on-exceeded-size="exceededSize"
                        :on-error="fileUploadError"
                        :on-success="fileUploadSuccess">
                    <Button type="primary" icon="ios-cloud-upload-outline">上传图片</Button> 支持扩展名：.png .jpg .gif .jpeg
                </Upload>
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
    import Config from '../../../../config';
    export default {
        name: 'noticeModification',
        data() {
            return {
                formData: {
                    name: '',
                    uId: '',
                    sex: '0',
                    age: 0,
                    nation: '0',
                    nationStr: '汉族',
                    titleLevel: '职称级别',
                    titleName: '',
                    certificate: '',
                    certificateNo: '',
                    education: '',
                    graduateSchool: '',
                    profession: '',
                    graduateDate: '2018-01-01',
                    phone: '',
                    email: '',
                    IdNumber: '',
                    job: '',
                    fileIds: ''
                },
                rules: {
                    name: [{ required: true, message: '姓名不能为空！', trigger: 'blur' }],
                    uId: [{ required: true, message: 'UID不能为空！', trigger: 'blur' }],
                    age: [{ required: true, type: 'number', message: '年龄不能为空！', trigger: 'blur' }],
                    titleName: [{ required: true, message: '技术职称不能为空！', trigger: 'blur' }],
                    titleLevel: [{ required: true, message: '职称级别不能为空！', trigger: 'blur' }],
                    graduateSchool: [{ required: true, message: '毕业院校不能为空！', trigger: 'blur' }],
                    profession: [{ required: true, message: '专业名称不能为空！', trigger: 'blur' }],
                    graduateDate: [{ required: true, message: '毕业时间不能为空！', trigger: 'blur' }],
                    phone: [{ required: true, message: '联系电话不能为空！', trigger: 'blur' }],
                    email: [{ required: true, message: '电子邮箱不能为空！', trigger: 'blur' }],
                    IdNumber: [{ required: true, message: '身份证号不能为空！', trigger: 'blur' }]
                },

                uploadParams: {
                    actionUrl: Config[Config.env].origin + Config[Config.env].ajaxUrl + '',
                    showUploadList: false,  // 显示已上传列表
                    multiple: false,        // 是否支持多选
                    data: {},               // 上传附带参数
                    //name: '',               // 上传的文件字段名, 默认file
                    accept: '.png,.jpg,.gif,.jpeg',             // 接收上传的文件类型
                    maxSize: 4096,                // 文件大小限制，单位 kb
                }
            };
        },
        methods: {
            // 图片上传
            fileBeforeUpload() {
                this.$Loading.start();
            },
            exceededSize(file, fileList) {
                this.$Notice.warning({
                    title: '超过文件大小限制',
                    desc: `文件   ${file.name} 太大, 不能超过 ${this.maxSize / 1024}M.`
                });
            },
            fileUploadError(error, file, fileList) {
                this.$Loading.error();
                this.$Notice.error({
                    title: '文件上传失败',
                    desc: `${error.message}`
                });
            },
            fileUploadSuccess(response, file, fileList) {
                this.$Loading.finish();
            },
            // 添加从业人员
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
                                this.$emit('modal_addUser_callback');
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
    .noticeModification-container {
        .form {
            .ivu-form-item {
                .ivu-form-item-content > div{
                    width: 260px;
                }
            }
        }
    }
</style>