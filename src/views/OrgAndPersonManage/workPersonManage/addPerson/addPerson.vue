<template>
    <div class="addPerson-container">
        <Form ref="form"
              class="user-form"
              inline
              :model="formData"
              :rules="rules"
              :label-width="120">
            <FormItem label="姓名:" prop="name">
                <Input v-model="formData.name"/>
            </FormItem>
            <FormItem label="头像：" style="margin-bottom: 0px;">
                <Upload ref="upload"
                        :action="uploadAtion"
                        :showUploadList="uploadParams.showUploadList"
                        :multiple="uploadParams.multiple"
                        :accept="uploadParams.accept"
                        :maxSize="uploadParams.maxSize"
                        :before-upload="fileBeforeUpload"
                        :on-exceeded-size="exceededSize"
                        :on-error="fileUploadError"
                        :on-success="fileUploadSuccess">
                    <!--<Button type="primary" icon="ios-cloud-upload-outline">上传文件</Button>-->
                    <img :src="userImgUrl"
                         style="margin-left: 20px; width: 70px; height: 70px; cursor: pointer" />
                </Upload>
            </FormItem>
            <FormItem label="性别:">
                <Select v-model="formData.sex">
                    <Option v-for="item in dict_sex"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="UID:" prop="employee.userNo">
                <Input v-model="formData.employee.userNo"/>
            </FormItem>
            <FormItem label="现任职务:" prop="job">
                <Input v-model="formData.job"/>
            </FormItem>
            <FormItem label="年龄:" prop="age">
                <Input v-model="formData.age" number/>
            </FormItem>
            <FormItem label="民族:" prop="nation">
                <Input v-model="formData.nation" placeholder="请输入民族，如：汉族"/>
            </FormItem>
            <FormItem label="技术职称:" prop="titleName">
                <Select v-model="formData.titleName">
                    <Option v-for="item in dict_titleName"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="职称级别:" prop="titleLevel">
                <Select v-model="formData.titleLevel">
                    <Option v-for="item in dict_titleLevel"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="学历:">
                <Select v-model="formData.education">
                    <Option v-for="item in dict_education"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="毕业院校:" prop="graduateSchool">
                <Input v-model="formData.graduateSchool"/>
            </FormItem>
            <FormItem label="专业名称:" prop="profession">
                <Input v-model="formData.profession"/>
            </FormItem>
            <FormItem label="毕业时间:" prop="employee.graduateDate">
                <DatePicker
                        :value="formData.employee.graduateDate"
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
                <Input v-model="formData.employee.certificate"/>
            </FormItem>
            <FormItem label="证书编号:">
                <Input v-model="formData.employee.certificateNo" />
            </FormItem>
            <FormItem label="身份证号:" prop="employee.idNumber">
                <Input v-model="formData.employee.idNumber" />
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
    import uploadMixin from '../../../../lib/mixin/uploadMixin';
    import Config from '../../../../config';
    export default {
        name: 'addPerson',
        mixins: [uploadMixin],
        computed: {
            uploadAtion() {
                return this.uploadParams.actionUrl + '/head_portrait';  // 个人附件
            },
            userImgUrl() {
                let default_img = this.formData.sex === 'woman' ? './user-woman.png' : './user-man.png';
                return this.formData.headPortraitUrl ? Config[Config.env].filePath + this.formData.headPortraitUrl : default_img;
            }
        },
        data() {
            return {
                uploadParams: {
                    accept: '.jpg,.png,.jpeg,.gif',
                    format: ['.jpg', '.png', '.jpeg', '.gif']
                },
                formData: {
                    name: '',
                    headPortrait: '',  // 头像，存放fileId
                    headPortraitUrl: '',
                    uId: '',
                    sex: 'man',
                    age: null,
                    nation: '汉族',
                    titleLevel: '',
                    titleName: '',
                    education: '',
                    graduateSchool: '',
                    profession: '',
                    phone: '',
                    email: '',
                    job: '',
                    employee: {
                        certificate: '',
                        certificateNo: '',
                        graduateDate: '',
                        idNumber: '',
                        recordStatus: '',
                        userId: '',
                        userNo: ''
                    }
                },
                rules: {
                    name: [{ required: true, message: '姓名不能为空！', trigger: 'blur' }],
                    'employee.userNo': [{ required: true, message: 'UID不能为空！', trigger: 'blur' }],
                    age: [{ required: true, type: 'number', message: '年龄不能为空！', trigger: 'blur' }],
                    nation: [{ required: true,  message: '民族不能为空！', trigger: 'blur' }],
                    titleName: [{ required: true, message: '技术职称不能为空！', trigger: 'blur' }],
                    titleLevel: [{ required: true, message: '职称级别不能为空！', trigger: 'blur' }],
                    graduateSchool: [{ required: true, message: '毕业院校不能为空！', trigger: 'blur' }],
                    profession: [{ required: true, message: '专业名称不能为空！', trigger: 'blur' }],
                    'employee.graduateDate': [{ required: true, message: '毕业时间不能为空！', trigger: 'blur' }],
                    phone: [{ required: true, message: '联系电话不能为空！', trigger: 'blur' }],
                    email: [{ required: true, message: '电子邮箱不能为空！', trigger: 'blur' }],
                    'employee.idNumber': [{ required: true, message: '身份证号不能为空！', trigger: 'blur' }]
                },

                // 字典
                dict_sex: [],
                dict_education: [],  // 学历
                dict_titleName: [],  // 技术职称
                dict_titleLevel: [], // 职称级别
            };
        },
        mounted() {
            this.getDict(['sex', 'education', 'titleName', 'titleLevel']);
        },
        methods: {
            // 获取字典
            getDict(list) {
                this.$http({
                    method: 'get',
                    url: '/dict/getListByTypes',
                    params: {
                        types: list.join(',')
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        list.forEach(v => {
                            this[`dict_${v}`] = res.data[v] || [];
                        });
                    }
                });
            },
            onChange_graduateDate(time) {
                this.formData.employee.graduateDate = time;
            },
            // 头像
            fileUploadSuccess(response, file, fileList) {
                if (response.code === 'SUCCESS') {
                    this.formData.headPortrait = response.data.fileId;
                    this.formData.headPortraitUrl = response.data.url;
                }
                this.$Loading.finish();
            },
            // 添加从业人员
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/user/add',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '添加成功！'
                                });
                                this.$emit('modal-callback');
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
    .addPerson-container {
        margin-bottom: 61px;
        .user-form {
            .ivu-form-item {
                .ivu-form-item-content > div{
                    width: 260px;
                }
            }
        }

        .ivu-modal-footer {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }
</style>