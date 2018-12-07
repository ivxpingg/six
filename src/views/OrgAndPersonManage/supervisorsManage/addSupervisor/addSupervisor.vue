<template>
    <div class="addSupervisor-container">
        <Form ref="form"
              class="user-form"
              inline
              :model="formData"
              :rules="rules"
              :label-width="120">
            <FormItem label="姓名:" prop="name">
                <Input v-model="formData.name"/>
            </FormItem>
            <FormItem label="科室:" prop="department">
                <Input v-model="formData.department"/>
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
            <FormItem label="现任职务:" prop="job">
                <Input v-model="formData.job"/>
            </FormItem>
            <FormItem label="职位级别:" prop="titleLevel">
                <Select v-model="formData.titleLevel">
                    <Option v-for="item in dict_titleLevel"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="办公固话:" prop="supervisor.telephone">
                <Input v-model="formData.supervisor.telephone"/>
            </FormItem>
            <FormItem label="移动小号:" prop="supervisor.mobileShortNum">
                <Input v-model="formData.supervisor.mobileShortNum"/>
            </FormItem>
            <FormItem label="手机:" prop="phone">
                <Input v-model="formData.phone"/>
            </FormItem>
            <FormItem label="性别:" prop="sex">
                <Select v-model="formData.sex">
                    <Option v-for="item in dict_sex"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="年龄:">
                <Input v-model="formData.age" number/>
            </FormItem>
            <FormItem label="民族:" prop="nation">
                <Input v-model="formData.nation"/>
            </FormItem>
            <FormItem label="籍贯:"  prop="supervisor.nativePlace">
                <Input v-model="formData.supervisor.nativePlace"/>
            </FormItem>
            <FormItem label="技术职称:" prop="titleName">
                <Select v-model="formData.titleName">
                    <Option v-for="item in dict_titleName"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="身份类别:">
                <Select v-model="formData.supervisor.identityType">
                    <Option v-for="item in dict_identityType"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="执法证类型:">
                <Select v-model="formData.supervisor.lawType">
                    <Option v-for="item in dict_lawType"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="执法号码:">
                <Input v-model="formData.supervisor.lawNumber"/>
            </FormItem>
            <FormItem label="分工:">
                <Input v-model="formData.supervisor.divideWork"/>
            </FormItem>
            <FormItem label="任职时间:">
                <DatePicker
                        :value="formData.supervisor.tenureTime"
                        type="month"
                        transfer
                        @on-change="onChange_tenureTime"
                        placeholder="选择时间"></DatePicker>
            </FormItem>
            <FormItem label="工作时间:">
                <DatePicker
                        :value="formData.supervisor.workDate"
                        type="month"
                        transfer
                        @on-change="onChange_workDate"
                        placeholder="选择时间"></DatePicker>
            </FormItem>
            <FormItem label="入党时间:">
                <DatePicker
                        :value="formData.supervisor.joinPartyDate"
                        type="month"
                        transfer
                        @on-change="onChange_joinPartyDate"
                        placeholder="选择时间"></DatePicker>
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
            <FormItem label="专业:" prop="profession">
                <Input v-model="formData.profession"/>
            </FormItem>
            <FormItem label="出生年月:" prop="supervisor.birthday">
                <DatePicker
                        :value="formData.supervisor.birthday"
                        type="date"
                        transfer
                        @on-change="onChange_birthday"
                        placeholder="选择时间"></DatePicker>
            </FormItem>
            <!--<FormItem label="编制状态:">-->
                <!--<Select v-model="formData.belongState">-->
                    <!--<Option value="0">编制</Option>-->
                    <!--<Option value="1">外聘</Option>-->
                <!--</Select>-->
            <!--</FormItem>-->
            <FormItem label="备注:">
                <Input v-model="formData.supervisor.remark"/>
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
        name: 'addSupervisor',
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
                    department: '',
                    job: '',
                    titleLevel: '',
                    phone: '',         // 手机
                    sex: 'man',
                    sexStr: '',
                    nation: '',
                    nationLabel: '',
                    age: null,
                    idNumber: '',
                    education: '',
                    graduateSchool: '',
                    profession: '',
                    graduateDate: '',
                    titleName: '',
                    lawTypeLabel: '',
                    belongState: '',

                    supervisor: {
                        birthday: '',
                        divideWork: '',
                        identityType: '',
                        jobLevel: '',
                        lawType: '',
                        joinPartyDate: '',
                        lawNumber: '',
                        mobileShortNum: '', // 移动小号
                        nativePlace: '',
                        remark: '',
                        telephone: '',       // 固定电话
                        tenureTime: '',      // 任职时间
                        userId: '',
                        workDate: ''        // 工作年月
                    }
                },
                rules: {
                    name: [{ required: true, message: '姓名不能为空！', trigger: 'blur' }],
                    department: [{ required: true, message: '科室不能为空！', trigger: 'blur' }],
                    job: [{ required: true, message: '现任职务不能为空！', trigger: 'blur' }],
                    titleLevel: [{ required: true, message: '职位级别不能为空！', trigger: 'blur' }],
                    'supervisor.telephone': [{ required: true, message: '办公固话不能为空！', trigger: 'blur' }],
                    'supervisor.mobileShortNum': [{ required: true, message: '移动小号不能为空！', trigger: 'blur' }],
                    phone: [{ required: true, message: '手机不能为空！', trigger: 'blur' }],
                    nation: [{ required: true, message: '民族不能为空！', trigger: 'blur' }],
                    'supervisor.nativePlace': [{ required: true, message: '籍贯不能为空！', trigger: 'blur' }],
                    titleName: [{ required: true, message: '技术职称不能为空！', trigger: 'blur' }],
                    education: [{ required: true, message: '学历不能为空！', trigger: 'blur' }],
                    graduateSchool: [{ required: true, message: '毕业院校不能为空！', trigger: 'blur' }],
                    profession: [{ required: true, message: '专业不能为空！', trigger: 'blur' }],
                    'supervisor.birthday': [{ required: true, message: '出生年月不能为空！', trigger: 'blur' }],
                },

                // 字典
                dict_sex: [],
                dict_education: [],  // 学历
                dict_titleName: [],  // 技术职称
                dict_titleLevel: [], // 职称级别
                dict_lawType: [],    // 执法证类型
                dict_identityType: [],  // 身份类别
            };
        },
        mounted() {
            this.getDict(['sex', 'titleName', 'titleLevel', 'lawType', 'education', 'identityType']);
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
            onChange_tenureTime(time) {
                this.formData.supervisor.tenureTime = time;
            },
            onChange_workDate(time) {
                this.formData.supervisor.workDate = time;
            },
            onChange_joinPartyDate(time) {
                this.formData.supervisor.joinPartyDate = time;
            },
            onChange_birthday(time) {
                this.formData.supervisor.birthday = time;
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
    .addSupervisor-container {
        padding-bottom: 61px;
        .user-form {
            .ivu-form-item {
                .ivu-form-item-content > div{
                    width: 240px;
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