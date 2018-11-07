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
                    <Option v-for="item in dict_sex"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="UID:" prop="userNo">
                <Input v-model="formData.userNo"/>
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
            <FormItem label="身份证号:" prop="idNumber">
                <Input v-model="formData.idNumber"/>
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
    import Config from '../../../../../config';
    import MOMENT from 'moment';
    export default {
        name: 'userBaseInfo',
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
        data() {
            return {
                formData: {
                    userId: '',
                    name: '',
                    userNo: '',
                    sex: '',
                    age: null,
                    nation: '',
                    nationStr: '',
                    titleLevel: '',
                    titleName: '',
                    certificate: '',
                    certificateNo: '',
                    education: '',
                    graduateSchool: '',
                    profession: '',
                    graduateDate: '',
                    phone: '',
                    email: '',
                    idNumber: '',
                    unitName: '',
                    unitType: '',
                    unitTypeLabel: '',
                    job: ''
                },
                rules: {
                    name: [{ required: true, message: '姓名不能为空！', trigger: 'blur' }],
                    userNo: [{ required: true, message: 'UID不能为空！', trigger: 'blur' }],
                    age: [{ required: true, type: 'number', message: '年龄不能为空！', trigger: 'blur' }],
                    nation: [{ required: true,  message: '民族不能为空！', trigger: 'blur' }],
                    titleName: [{ required: true, message: '技术职称不能为空！', trigger: 'blur' }],
                    titleLevel: [{ required: true, message: '职称级别不能为空！', trigger: 'blur' }],
                    graduateSchool: [{ required: true, message: '毕业院校不能为空！', trigger: 'blur' }],
                    profession: [{ required: true, message: '专业名称不能为空！', trigger: 'blur' }],
                    graduateDate: [{ required: true, message: '毕业时间不能为空！', trigger: 'blur' }],
                    phone: [{ required: true, message: '联系电话不能为空！', trigger: 'blur' }],
                    email: [{ required: true, message: '电子邮箱不能为空！', trigger: 'blur' }],
                    idNumber: [{ required: true, message: '身份证号不能为空！', trigger: 'blur' }]
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

                        Object.assign(this.formData, {
                            userId: '',
                            name: '',
                            userNo: '',
                            sex: '',
                            age: null,
                            nation: '',
                            nationStr: '',
                            titleLevel: '',
                            titleName: '',
                            certificate: '',
                            certificateNo: '',
                            education: '',
                            graduateSchool: '',
                            profession: '',
                            graduateDate: '',
                            phone: '',
                            email: '',
                            idNumber: '',
                            unitName: '',
                            unitType: '',
                            unitTypeLabel: '',
                            job: '',
                            fileIds: ''
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
                this.formData.graduateDate = time;
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
                            graduateDate: res.data.graduateDate ? MOMENT(res.data.graduateDate).format('YYYY-MM-DD') : ''
                        });
                    }
                });
            },
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