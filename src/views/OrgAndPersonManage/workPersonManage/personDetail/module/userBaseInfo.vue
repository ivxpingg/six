<template>
    <div class="userBaseInfo-container">
        <Form ref="form"
              class="user-form"
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
            <FormItem label="UID:" prop="uId">
                <Input v-model="formData.uId"/>
            </FormItem>
            <FormItem label="年龄:" prop="age">
                <Input v-model="formData.age" number/>
            </FormItem>
            <FormItem label="民族:">
                <Select v-model="formData.nation">
                    <Option value="0">汉族</Option>
                    <Option value="1">满族</Option>
                </Select>
            </FormItem>
            <FormItem label="技术职称:" prop="titleName">
                <Input v-model="formData.titleName"/>
            </FormItem>
            <FormItem label="职称级别:" prop="titleLevel">
                <Input v-model="formData.titleLevel"/>
            </FormItem>
            <FormItem label="毕业院校:" prop="graduateSchool">
                <Input v-model="formData.graduateSchool"/>
            </FormItem>
            <FormItem label="专业名称:" prop="profession">
                <Input v-model="formData.profession"/>
            </FormItem>
            <FormItem label="毕业时间:" prop="graduateDate">
                <DatePicker
                        :value="formData.graduateDate"
                        type="date"
                        transfer
                        @on-change="onChange_graduateDate"
                        placeholder="选择时间"></DatePicker>
            </FormItem>
            <FormItem label="联系电话:" prop="phone">
                <Input v-model="formData.phone"/>
            </FormItem>
            <FormItem label="电子邮箱:" prop="email">
                <Input v-model="formData.email"/>
            </FormItem>
            <FormItem label="资格证书:">
                <Input v-model="formData.certificate"/>
            </FormItem>
            <FormItem label="证书编号:">
                <Input v-model="formData.certificateNo"/>
            </FormItem>
            <FormItem label="身份证号:" prop="IdNumber">
                <Input v-model="formData.IdNumber"/>
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
    import Config from '../../../../../config';
    export default {
        name: 'userBaseInfo',
        props: {
            userId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                formData: {
                    userId: '001',
                    name: '',
                    uId: 'uid',
                    sex: '0',
                    sexStr: '女',
                    age: 26,
                    nation: '0',
                    nationStr: '汉族',
                    titleLevel: '职称级别',
                    titleName: '',
                    certificate: '资格证书',
                    certificateNo: '资格证书编号',
                    education: '学历',
                    graduateSchool: '毕业院校',
                    profession: '计算机与技术',
                    graduateDate: '2018-01-01',
                    phone: '15332112141',
                    email: '123@qq.com',
                    IdNumber: '362521236521233632',
                    unitName: '厦门卫星定位',
                    unitType: '0',
                    unitTypeLabel: '建设单位',
                    job: '岗位',
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
        watch: {
            userId: {
                immediate: true,
                handler(val) {
                    if (val) {
                        this.getUserInfo();
                    }
                }
            }
        },
        methods: {
            onChange_graduateDate(time) {
                this.formData.graduateDate = time;
            },

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
                    title: '超过文件大小限制',
                    desc: `${error.message}`
                });
            },
            fileUploadSuccess(response, file, fileList) {
                this.$Loading.finish();
            },

            getUserInfo() {
                this.$http({
                    method: 'get',
                    url: '/getUserById',
                    params: {
                        userId: this.userId
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.formData, res.data);
                    }
                });
            },
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/updateUnitInfo',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '更新成功！'
                                });
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
    .userBaseInfo-container {
        padding-bottom: 61px;
        .user-form {
            .ivu-form-item {
                .ivu-input-wrapper,
                .ivu-select,
                .ivu-date-picker{
                    width: 260px;
                }
            }
        }

        .ivu-modal-footer {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #FFF;
        }
    }
</style>