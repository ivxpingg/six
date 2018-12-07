<template>
    <div class="supervisorDetail-container">
        <Form ref="form"
              class="form"
              inline
              :model="formData"
              :rules="rules"
              :label-width="120">
            <FormItem label="姓名:" prop="name">
                <Input v-model="formData.name" :readonly="!editable"/>
            </FormItem>
            <FormItem label="科室:">
                <Input v-model="formData.department" :readonly="!editable"/>
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
                    <img :src="userImgUrl" style="margin-left: 20px; width: 70px; height: 70px; cursor: pointer" />
                </Upload>
            </FormItem>
            <FormItem label="现任职务:">
                <Input v-model="formData.job" :readonly="!editable"/>
            </FormItem>
            <FormItem label="职位级别:">
                <Select v-model="formData.titleLevel" :disabled="!editable">
                    <Option v-for="item in dict_titleLevel"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="办公固话:">
                <Input v-model="formData.supervisor.telephone" :readonly="!editable"/>
            </FormItem>
            <FormItem label="移动小号:">
                <Input v-model="formData.supervisor.mobileShortNum" :readonly="!editable"/>
            </FormItem>
            <FormItem label="手机:">
                <Input v-model="formData.phone" :readonly="!editable"/>
            </FormItem>
            <FormItem label="性别:">
                <Select v-model="formData.sex" :disabled="!editable">
                    <Option v-for="item in dict_sex"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="年龄:">
                <Input v-model="formData.age" number :readonly="!editable"/>
            </FormItem>
            <FormItem label="民族:">
                <Input v-model="formData.nation" :readonly="!editable"/>
            </FormItem>
            <FormItem label="籍贯:">
                <Input v-model="formData.supervisor.nativePlace" :readonly="!editable"/>
            </FormItem>
            <!--<FormItem label="身份证号码:">-->
                <!--<Input v-model="formData.idNumber"/>-->
            <!--</FormItem>-->
            <FormItem label="技术职称:">
                <Select v-model="formData.titleName" :disabled="!editable">
                    <Option v-for="item in dict_titleName"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="身份类别:">
                <Input v-model="formData.supervisor.identityType" :disabled="!editable"/>
            </FormItem>
            <FormItem label="执法证类型:">
                <Select v-model="formData.supervisor.lawType" :disabled="!editable">
                    <Option v-for="item in dict_lawType"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="执法号码:">
                <Input v-model="formData.supervisor.lawNumber" :readonly="!editable"/>
            </FormItem>
            <FormItem label="分工:">
                <Input v-model="formData.supervisor.divideWork" :readonly="!editable"/>
            </FormItem>
            <FormItem label="任职时间:">
                <DatePicker
                        :value="formData.supervisor.tenureTime"
                        type="date"
                        transfer
                        @on-change="onChange_tenureTime"
                        placeholder="选择时间"
                        :readonly="!editable"></DatePicker>
            </FormItem>
            <FormItem label="工作时间:">
                <DatePicker
                        :value="formData.supervisor.workDate"
                        type="date"
                        transfer
                        @on-change="onChange_workDate"
                        placeholder="选择时间"
                        :readonly="!editable"></DatePicker>
            </FormItem>
            <FormItem label="入党时间:">
                <DatePicker
                        :value="formData.supervisor.joinPartyDate"
                        type="date"
                        transfer
                        @on-change="onChange_joinPartyDate"
                        placeholder="选择时间"
                        :readonly="!editable"></DatePicker>
            </FormItem>
            <FormItem label="学历:">
                <Select v-model="formData.education" :disabled="!editable">
                    <Option v-for="item in dict_education"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="毕业院校:">
                <Input v-model="formData.graduateSchool" :readonly="!editable"/>
            </FormItem>
            <FormItem label="专业:">
                <Input v-model="formData.profession" :readonly="!editable"/>
            </FormItem>
            <FormItem label="出生年月:" prop="birthday">
                <DatePicker
                        :value="formData.supervisor.birthday"
                        type="date"
                        transfer
                        @on-change="onChange_birthday"
                        placeholder="选择时间"
                        :readonly="!editable"></DatePicker>
            </FormItem>
            <!--<FormItem label="编制状态:">-->
                <!--<Input v-model="formData.belongStateLabel"/>-->
            <!--</FormItem>-->
            <FormItem label="备注:">
                <Input v-model="formData.supervisor.remark" :readonly="!editable"/>
            </FormItem>
        </Form>

        <div class="ivu-modal-footer" v-if="editable">
            <Button type="primary"
                    size="large"
                    @click="save">保存</Button>
        </div>
    </div>
</template>

<script>
    import uploadMixin from '../../../../lib/mixin/uploadMixin';
    import Config from '../../../../config';
    import MOMENT from 'moment';
    export default {
        name: 'supervisorDetail',
        mixins: [uploadMixin],
        props: {
            userId: {
                type: String,
                required: true
            },
            editable: {
                type: Boolean,
                default: true
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
                    name: '',
                    headPortrait: '',  // 头像，存放fileId
                    headPortraitUrl: '',
                    department: '',
                    job: '',
                    titleLevel: '',
                    phone: '',         // 手机
                    sex: '',
                    sexStr: '',
                    nation: '',
                    nationLabel: '',
                    age: 0,
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
                    // uId: [{ required: true, message: 'UID不能为空！', trigger: 'blur' }],
                    // titleLevel: [{ required: true, message: 'UID不能为空！', trigger: 'blur' }],
                    // age: [{ required: true, type: 'number', message: '年龄不能为空！', trigger: 'blur' }],
                    // titleName: [{ required: true, message: '技术职称不能为空！', trigger: 'blur' }],
                },

                dict_sex: [],         // 性别
                dict_education: [],  // 学历
                dict_titleName: [],  // 技术职称
                dict_titleLevel: [], // 职称级别
                dict_lawType: [],    // 执法证类型
                dict_identityType: [],  // 身份类别
            };
        },
        watch: {
            userId: {
                immediate: true,
                handler(val) {
                    if (val) {
                        this.formData.userId = val;
                        this.formData.supervisor.userId = val;
                        this.getUserInfo();
                    }
                }
            }
        },
        mounted() {
            this.getDicts(['sex', 'titleName', 'titleLevel', 'lawType', 'education', 'identityType']);
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
                        list.forEach((val) => {
                            this[`dict_${val}`] = res.data[val] || [];
                        });
                    }
                })
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

            getUserInfo() {
                this.$http({
                    method: 'get',
                    url: '/user/getDetail',
                    params: {
                        userId: this.userId
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.formData, res.data, {
                            graduateDate: res.data.graduateDate ?  MOMENT(res.data.graduateDate).format('YYYY-MM-DD') : '',
                        });

                        Object.assign(this.formData.supervisor,res.data.supervisor, {
                            tenureTime: res.data.supervisor.tenureTime ?  MOMENT(res.data.supervisor.tenureTime).format('YYYY-MM-DD') : '',
                            birthday: res.data.supervisor.birthday ?  MOMENT(res.data.supervisor.birthday).format('YYYY-MM-DD') : '',
                            workDate: res.data.supervisor.workDate ?  MOMENT(res.data.supervisor.workDate).format('YYYY-MM-DD') : '',
                            joinPartyDate: res.data.supervisor.joinPartyDate ?  MOMENT(res.data.supervisor.joinPartyDate).format('YYYY-MM-DD') : '',
                        })
                    }
                });
            },
            // 添加从业人员
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/user/update',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '更新成功！'
                                });
                                this.$emit('modal-callback');
                            }
                        })
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .supervisorDetail-container {
        padding-bottom: 61px;
        .form {
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