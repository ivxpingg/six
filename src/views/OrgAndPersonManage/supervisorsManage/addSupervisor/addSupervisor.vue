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
            <FormItem label="UID:" prop="uId">
                <Input v-model="formData.uId"/>
            </FormItem>
            <FormItem label="科室:">
                <Input v-model="formData.department"/>
            </FormItem>
            <FormItem label="现任职务:" prop="job">
                <Input v-model="formData.job"/>
            </FormItem>
            <FormItem label="职位级别:" prop="titleLevel">
                <Input v-model="formData.titleLevel"/>
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
                    <Option value="0">女</Option>
                    <Option value="1">男</Option>
                </Select>
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
            <FormItem label="籍贯:" prop="nativePlace">
                <Input v-model="formData.nativePlace"/>
            </FormItem>
            <FormItem label="身份证号码:" prop="IdNumber">
                <Input v-model="formData.IdNumber"/>
            </FormItem>
            <FormItem label="技术职称:" prop="titleName">
                <Input v-model="formData.titleName"/>
            </FormItem>
            <FormItem label="身份类别:">
                <Select v-model="formData.identityType">
                    <Option value="0">干部</Option>
                    <Option value="1">副干部</Option>
                </Select>
            </FormItem>
            <FormItem label="执法证类型:">
                <Select v-model="formData.lawType">
                    <Option value="0">类型一</Option>
                    <Option value="1">类型二</Option>
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
                <Input v-model="formData.education"/>
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
                }
            };
        },
        methods: {
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