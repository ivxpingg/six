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
            <FormItem label="科室:">
                <Input v-model="formData.department"/>
            </FormItem>
            <FormItem label="现任职务:">
                <Input v-model="formData.job"/>
            </FormItem>
            <FormItem label="职位级别:">
                <Select v-model="formData.titleLevel">
                    <Option v-for="item in dict_titleLevel"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
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
            <FormItem label="民族:">
                <Input v-model="formData.nation"/>
            </FormItem>
            <FormItem label="籍贯:">
                <Input v-model="formData.nativePlace"/>
            </FormItem>
            <!--<FormItem label="身份证号码:">-->
                <!--<Input v-model="formData.idNumber"/>-->
            <!--</FormItem>-->
            <FormItem label="技术职称:">
                <Select v-model="formData.titleName">
                    <Option v-for="item in dict_titleName"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="身份类别:">
                <Input v-model="formData.identityType"/>
            </FormItem>
            <FormItem label="执法证类型:">
                <Input v-model="formData.lawType"/>
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
            <FormItem label="出生年月:">
                <Input v-model="formData.birthday"/>
            </FormItem>
            <!--<FormItem label="编制状态:">-->
                <!--<Input v-model="formData.belongStateLabel"/>-->
            <!--</FormItem>-->
            <FormItem label="备注:">
                <Input v-model="formData.remark"/>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import MOMENT from 'moment';
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
                    idNumber: '',
                    birthday: '',  //
                    workDate: '',    // 工作年月
                    joinPartyDate: '',
                    education: '',
                    graduateSchool: '',
                    profession: '',
                    graduateDate: '',
                    identityType: '',
                    titleName: '',
                    lawNumber: '',
                    lawType: '',
                    lawTypeLabel: '',
                    divideWork: '',
                    belongState: '',
                    remark: ''
                },

                dict_sex: [],         // 性别
                dict_titleName: [],   // 技术职称
                dict_titleLevel: [],  // 职称级别
                dict_education: []    // 学历
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
                        list.forEach((val) => {
                            this[`dict_${val}`] = res.data[val] || [];
                        });
                    }
                })
            },
            getUserInfo() {
                this.$http({
                    method: 'get',
                    url: '/user/detail',
                    params: {
                        userId: this.userId
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.formData, res.data, {
                            birthday: res.data.birthday ?  MOMENT(res.data.birthday).format('YYYY-MM-DD') : '',
                            workDate: res.data.workDate ?  MOMENT(res.data.workDate).format('YYYY-MM-DD') : '',
                            joinPartyDate: res.data.joinPartyDate ?  MOMENT(res.data.joinPartyDate).format('YYYY-MM-DD') : '',
                            graduateDate: res.data.graduateDate ?  MOMENT(res.data.graduateDate).format('YYYY-MM-DD') : '',
                        });
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