<template>
    <div class="supervisorDetail-container">
        <Form ref="form"
              class="user-form"
              inline
              :model="formData"
              :label-width="120">
            <FormItem label="姓名:">
                <Input v-model="formData.name"/>
            </FormItem>
            <FormItem label="UID:">
                <Input v-model="formData.uId"/>
            </FormItem>
            <FormItem label="科室:">
                <Input v-model="formData.department"/>
            </FormItem>
            <FormItem label="现任职务:">
                <Input v-model="formData.job"/>
            </FormItem>
            <FormItem label="职位级别:">
                <Input v-model="formData.titleLevel"/>
            </FormItem>
            <FormItem label="办公固话:">
                <Input v-model="formData.telephone"/>
            </FormItem>
            <FormItem label="移动小号:">
                <Input v-model="formData.mobileShortNum"/>
            </FormItem>
            <FormItem label="手机:">
                <Input v-model="formData.phone"/>
            </FormItem>
            <FormItem label="性别:">
                <Input v-model="formData.sexStr"/>
            </FormItem>
            <FormItem label="年龄:">
                <Input v-model="formData.age" number/>
            </FormItem>
            <FormItem label="民族:">
                <Input v-model="formData.nationLabel"/>
            </FormItem>
            <FormItem label="籍贯:">
                <Input v-model="formData.nativePlace"/>
            </FormItem>
            <FormItem label="身份证号码:">
                <Input v-model="formData.IdNumber"/>
            </FormItem>
            <FormItem label="技术职称:">
                <Input v-model="formData.titleName"/>
            </FormItem>
            <FormItem label="身份类别:">
                <Input v-model="formData.identityTypeLabel"/>
            </FormItem>
            <FormItem label="执法证类型:">
                <Input v-model="formData.lawTypeLabel"/>
            </FormItem>
            <FormItem label="执法号码:">
                <Input v-model="formData.lawNumber"/>
            </FormItem>
            <FormItem label="分工:">
                <Input v-model="formData.divideWork"/>
            </FormItem>
            <FormItem label="任职时间:">
                <Input v-model="formData.tenureTime"/>
            </FormItem>
            <FormItem label="工作时间:">
                <Input v-model="formData.workDate"/>
            </FormItem>
            <FormItem label="入党时间:">
                <Input v-model="formData.joinPartyDate"/>
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
            <FormItem label="出生年月:">
                <Input v-model="formData.birthday"/>
            </FormItem>
            <FormItem label="编制状态:">
                <Input v-model="formData.belongStateLabel"/>
            </FormItem>
            <FormItem label="备注:">
                <Input v-model="formData.remark"/>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    export default {
        name: 'supervisorDetail',
        props: {
            userId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                formData: {
                    name: '',
                    uId: '',
                    department: '',
                    job: '',
                    titleLevel: '',
                    telephone: '',         // 固定电话
                    mobileShortNum: '',   // 移动小号
                    phone: '',         // 手机
                    tenureTime: '',        // 任职时间
                    sex: '',
                    sexStr: '',
                    nation: '',
                    nationLabel: '',
                    nativePlace: '',
                    age: 0,
                    IdNumber: '',
                    birthday: '',  //
                    workDate: '',    // 工作年月
                    joinPartyDate: '',
                    education: '',
                    graduateSchool: '',
                    profession: '',
                    graduateDate: '',
                    identityType: '',
                    identityTypeLabel: '',
                    titleName: '',
                    lawNumber: '',
                    lawType: '',
                    lawTypeLabel: '',
                    divideWork: '',
                    belongState: '',
                    remark: ''
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
            getUserInfo() {
                this.$http({
                    method: 'get',
                    url: '/supervisorsManage/getSupervisorList',
                    params: {
                        userId: this.userId
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.formData, res.data.records[0]);
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .supervisorDetail-container {
        .user-form {
            .ivu-form-item {
                .ivu-form-item-content > div{
                    width: 240px;
                }
            }
        }
    }
</style>