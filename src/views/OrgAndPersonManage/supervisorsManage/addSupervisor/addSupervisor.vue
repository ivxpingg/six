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
            <!--<FormItem label="UID:" prop="uId">-->
                <!--<Input v-model="formData.uId"/>-->
            <!--</FormItem>-->
            <FormItem label="科室:">
                <Input v-model="formData.department"/>
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
            <FormItem label="办公固话:" prop="telephone">
                <Input v-model="formData.telephone"/>
            </FormItem>
            <FormItem label="移动小号:" prop="mobileShortNum">
                <Input v-model="formData.mobileShortNum"/>
            </FormItem>
            <FormItem label="手机:" prop="phone">
                <Input v-model="formData.phone"/>
            </FormItem>
            <FormItem label="性别:">
                <Select v-model="formData.sex">
                    <Option v-for="item in dict_sex"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="年龄:" prop="age">
                <Input v-model="formData.age" number/>
            </FormItem>
            <FormItem label="民族:">
                <Input v-model="formData.nation"/>
            </FormItem>
            <FormItem label="籍贯:" prop="nativePlace">
                <Input v-model="formData.nativePlace"/>
            </FormItem>
            <!--<FormItem label="身份证号码:" prop="IdNumber">-->
                <!--<Input v-model="formData.IdNumber"/>-->
            <!--</FormItem>-->
            <FormItem label="技术职称:" prop="titleName">
                <Select v-model="formData.titleName">
                    <Option v-for="item in dict_titleName"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="身份类别:">
                <Select v-model="formData.identityType">
                    <Option v-for="item in dict_identityType"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="执法证类型:">
                <Select v-model="formData.lawType">
                    <Option v-for="item in dict_lawType"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="执法号码:">
                <Input v-model="formData.lawNumber"/>
            </FormItem>
            <FormItem label="分工:">
                <Input v-model="formData.divideWork"/>
            </FormItem>
            <FormItem label="任职时间:">
                <DatePicker
                        :value="formData.tenureTime"
                        type="month"
                        transfer
                        @on-change="onChange_tenureTime"
                        placeholder="选择时间"></DatePicker>
            </FormItem>
            <FormItem label="工作时间:">
                <DatePicker
                        :value="formData.workDate"
                        type="month"
                        transfer
                        @on-change="onChange_workDate"
                        placeholder="选择时间"></DatePicker>
            </FormItem>
            <FormItem label="入党时间:">
                <DatePicker
                        :value="formData.joinPartyDate"
                        type="month"
                        transfer
                        @on-change="onChange_joinPartyDate"
                        placeholder="选择时间"></DatePicker>
            </FormItem>
            <FormItem label="学历:">
                <Select v-model="formData.education">
                    <Option v-for="item in dict_education"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="毕业院校:">
                <Input v-model="formData.graduateSchool"/>
            </FormItem>
            <FormItem label="专业:">
                <Input v-model="formData.profession"/>
            </FormItem>
            <FormItem label="出生年月:" prop="birthday">
                <DatePicker
                        :value="formData.birthday"
                        type="date"
                        transfer
                        @on-change="onChange_birthday"
                        placeholder="选择时间"></DatePicker>
            </FormItem>
            <FormItem label="编制状态:">
                <Select v-model="formData.belongState">
                    <Option value="0">编制</Option>
                    <Option value="1">外聘</Option>
                </Select>
            </FormItem>
            <FormItem label="备注:">
                <Input v-model="formData.remark"/>
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
    export default {
        name: 'addSupervisor',
        data() {
            return {
                formData: {
                    name: '姓名',
                    uId: 'uid',
                    department: '科室',
                    job: '职务',
                    titleLevel: '职称级别',
                    telephone: '3952581',         // 固定电话
                    mobileShortNum: '25811111',   // 移动小号
                    phone: '15332112141',         // 手机
                    tenureTime: '2006-06',        // 任职时间
                    sex: '1',
                    nation: '0',
                    nativePlace: '祖籍六安',
                    age: 26,
                    IdNumber: '362521236521233632',
                    birthday: '1992-06-06',  //
                    workDate: '2010-09',    // 工作年月
                    joinPartyDate: '2006-01',
                    education: '学历',
                    graduateSchool: '毕业院校',
                    profession: '专业',
                    graduateDate: '2018-01-01',
                    identityType: '',
                    titleName: '技术职称',
                    lawNumber: '3450008',
                    lawType: '0',
                    divideWork: '领导分工及科室人员',
                    belongState: '0',
                    remark: ''
                },
                rules: {
                    name: [{ required: true, message: '姓名不能为空！', trigger: 'blur' }],
                    uId: [{ required: true, message: 'UID不能为空！', trigger: 'blur' }],
                    titleLevel: [{ required: true, message: 'UID不能为空！', trigger: 'blur' }],
                    age: [{ required: true, type: 'number', message: '年龄不能为空！', trigger: 'blur' }],
                    titleName: [{ required: true, message: '技术职称不能为空！', trigger: 'blur' }],
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
                this.formData.tenureTime = time;
            },
            onChange_workDate(time) {
                this.formData.workDate = time;
            },
            onChange_joinPartyDate(time) {
                this.formData.joinPartyDate = time;
            },
            onChange_birthday(time) {
                this.formData.birthday = time;
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
                                this.$emit('modal_addSupervisor_callback');
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