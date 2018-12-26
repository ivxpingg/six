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
            <FormItem label="头像：" style="margin-bottom: 0px;">
                <div style="width: 250px;">
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
                        <img :src="userImgUrl" style="margin-left: 20px; width: 70px; height: 70px; cursor: pointer" />
                    </Upload>
                </div>
            </FormItem>
            <FormItem label="登录名:" prop="loginName">
                <Input v-model="formData.loginName" readonly/>
            </FormItem>
            <FormItem label="性别:">
                <Select v-model="formData.sex">
                    <Option v-for="item in dict_sex"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <!--<FormItem label="UID:" prop="employee.userNo">-->
                <!--<Input v-model="formData.employee.userNo"/>-->
            <!--</FormItem>-->
            <FormItem label="现任职务:" prop="job">
                <Input v-model="formData.job"/>
            </FormItem>
            <!--<FormItem label="年龄:" prop="age">-->
                <!--<Input v-model="formData.age" number/>-->
            <!--</FormItem>-->
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
            <FormItem label="学历:" prop="education">
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
                <Input v-model="formData.employee.certificateNo"/>
            </FormItem>
            <FormItem label="身份证号:" prop="idNumber">
                <Input v-model="formData.idNumber"/>
            </FormItem>
        </Form>

        <div class="ivu-modal-footer" v-if="editable">
            <Button type="primary"
                    size="large"
                    :loading="saveBtnLoading"
                    @click="save">保存</Button>
        </div>
    </div>
</template>

<script>
    import uploadMixin from '../../.././../../lib/mixin/uploadMixin';
    import Config from '../../../../../config';
    import MOMENT from 'moment';
    export default {
        name: 'userBaseInfo',
        mixins: [uploadMixin],
        props: {
            userId: {
                type: String,
                required: true
            },
            editable: {
                type: Boolean,
                required: false,
                default: false
            }
        },
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
                    userId: '',
                    headPortrait: '',  // 头像，存放fileId
                    headPortraitUrl: '',
                    name: '',
                    loginName:'',
                    sex: '',
                    age: null,
                    nation: '',
                    nationStr: '',
                    titleLevel: '',
                    titleName: '',
                    education: '',
                    graduateSchool: '',
                    profession: '',
                    phone: '',
                    email: '',
                    unitName: '',
                    unitType: '',
                    unitTypeLabel: '',
                    job: '',
                    idNumber: '',
                    employee: {
                        certificate: '',
                        certificateNo: '',
                        graduateDate: '',
                        idNumber: '',
                        recordStatus: '',
                        userId: '',
                        // userNo: ''
                    }
                },
                rules: {
                    name: [{ required: true, message: '姓名不能为空！', trigger: 'blur' }],
                    // age: [{ required: true, type: 'number', message: '年龄不能为空！', trigger: 'blur' }],
                    // nation: [{ required: true,  message: '民族不能为空！', trigger: 'blur' }],
                    titleName: [{ required: true, message: '技术职称不能为空！', trigger: 'blur' }],
                    // titleLevel: [{ required: true, message: '职称级别不能为空！', trigger: 'blur' }],
                    education: [{ required: true, message: '学历不能为空！', trigger: 'blur' }],
                    // graduateSchool: [{ required: true, message: '毕业院校不能为空！', trigger: 'blur' }],
                    // profession: [{ required: true, message: '专业名称不能为空！', trigger: 'blur' }],
                    // 'employee.graduateDate': [{ required: true, message: '毕业时间不能为空！', trigger: 'blur' }],
                    phone: [{ required: true, message: '联系电话不能为空！', trigger: 'blur' }],
                    // email: [{ required: true, message: '电子邮箱不能为空！', trigger: 'blur' }],
                    idNumber: [{ required: true, message: '身份证号不能为空！', trigger: 'blur' }]
                },

                dict_sex: [],         // 性别
                dict_titleName: [],   // 技术职称
                dict_titleLevel: [],  // 职称级别
                dict_education: [],   // 学历
                // 保存按钮状态
                saveBtnLoading: false
            };
        },
        watch: {
            userId: {
                immediate: true,
                handler(val) {
                    if (val) {
                        Object.assign(this.formData, {
                            headPortrait: '',  // 头像，存放fileId
                            headPortraitUrl: '',
                            name: '',
                            sex: '',
                            age: null,
                            nation: '',
                            nationStr: '',
                            titleLevel: '',
                            titleName: '',
                            education: '',
                            graduateSchool: '',
                            profession: '',
                            phone: '',
                            email: '',
                            unitName: '',
                            unitType: '',
                            unitTypeLabel: '',
                            job: '',
                            fileIds: '',
                            idNumber: '',
                            employee: {
                                certificate: '',
                                certificateNo: '',
                                graduateDate: '',
                                idNumber: '',
                                recordStatus: '',
                                userId: '',
                                userNo: ''
                            }
                        });
                        this.getUserInfo();
                    }
                }
            }
        },
        mounted() {
            this.getDicts(['sex','titleName','titleLevel', 'education']);
        },
        methods: {
            getDicts(list) {
                this.$http({
                    method: 'get',
                    url: '/dict/getListByTypes',
                    params: {
                        types: list.join(',')
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        list.forEach((val, idx) => {
                            this[`dict_${val}`] = res.data[val] || [];
                        });
                    }
                })
            },
            onChange_graduateDate(time) {
                this.formData.employee.graduateDate = time;
            },

            getUserInfo() {
                this.$http({
                    method: 'get',
                    url: '/user/getDetail',
                    params: {
                        userId: this.userId
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.formData, res.data);

                        Object.assign(this.formData.employee, {
                            headPortrait: '',  // 头像，存放fileId
                            headPortraitUrl: '',
                            name: '',
                            sex: '',
                            age: null,
                            nation: '',
                            nationStr: '',
                            titleLevel: '',
                            titleName: '',
                            education: '',
                            graduateSchool: '',
                            profession: '',
                            phone: '',
                            email: '',
                            unitName: '',
                            unitType: '',
                            unitTypeLabel: '',
                            job: '',
                            fileIds: '',
                            idNumber: '',
                        }, res.data.employee, {
                            graduateDate: res.data.employee.graduateDate ? MOMENT(res.data.employee.graduateDate).format('YYYY-MM-DD') : ''
                        });
                    }
                });
            },
            // 头像
            fileUploadSuccess(response, file, fileList) {
                if (response.code === 'SUCCESS') {
                    this.formData.headPortrait = response.data.fileId;
                    this.formData.headPortraitUrl = response.data.url;
                }
                this.$Loading.finish();
            },
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.saveBtnLoading = true;
                        this.$http({
                            method: 'post',
                            url: '/user/update',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            this.saveBtnLoading = false;
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '更新成功！'
                                });
                                this.$emit('callback');
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