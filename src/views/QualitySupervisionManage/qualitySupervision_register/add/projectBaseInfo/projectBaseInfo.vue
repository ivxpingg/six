<template>
    <div class="projectBaseInfo-container ">
        <Form ref="form"
              class="form"
              inline
              :model="formData"
              :rules="rules"
              :label-width="180">
            <FormItem label="项目名称:" prop="name">
                <Input v-model="formData.name"/>
            </FormItem>
            <FormItem label="标段:" prop="part">
                <Input v-model="formData.part"/>
            </FormItem>
            <FormItem label="地区:" prop="province">
                <Select v-model="formData.province"
                        style="min-width: 100px; width: auto; margin-right: 12px;">
                    <Option value="1">安徽省</Option>
                    <Option value="2">福建省</Option>
                </Select>
                <Select v-model="formData.city"
                        style="min-width: 100px; width: auto; margin-right: 12px;">
                    <Option value="1">厦门市</Option>
                    <Option value="2">福州市福州市福州市福州市</Option>
                </Select>
                <Select v-model="formData.county"
                        style="min-width: 100px; width: auto; margin-right: 20px;">
                    <Option value="1">同安区</Option>
                    <Option value="2">思明区</Option>
                </Select>
            </FormItem>
            <FormItem label="详细地址:" prop="address">
                <Input v-model="formData.address"/>
            </FormItem>
            <FormItem label="项目类型:" prop="projectType">
                <Select v-model="formData.projectType">
                    <Option v-for="item in dict_projectType"
                            :value="item.value"
                            :key="item.id"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="建设单位:" prop="buildUnit">
                <Input v-model="formData.buildUnit" readonly />
            </FormItem>
            <FormItem label="施工单位:" prop="constructUnit">
                <Input v-model="formData.constructUnit" readonly />
            </FormItem>
            <FormItem label="监理单位:" prop="supervisorUnit">
                <Input v-model="formData.supervisorUnit" readonly />
            </FormItem>
            <FormItem label="技术等级:" prop="level">
                <Select v-model="formData.level">
                    <Option v-for="item in dict_level"
                            :value="item.value"
                            :key="item.id"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="工程性质:" prop="level">
                <Select v-model="formData.projectProperty">
                    <Option v-for="item in dict_projectProperty"
                            :value="item.value"
                            :key="item.id"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="项目里程(km):" prop="mileage">
                <Input v-model="formData.mileage" number/>
            </FormItem>
            <FormItem label="设计时速(km/h):" prop="designSpeed">
                <Input v-model="formData.designSpeed" number/>
            </FormItem>
            <FormItem label="投资额(万元):" prop="amount">
                <Input v-model="formData.amount" number/>
            </FormItem>
            <FormItem label="施工合同金额(万元):" prop="constructAmount">
                <Input v-model="formData.constructAmount" number/>
            </FormItem>
            <FormItem label="监理合同金额(万元):" prop="supervisorAmount">
                <Input v-model="formData.supervisorAmount" number/>
            </FormItem>
            <FormItem label="计划开工时间:" prop="planBeginTime">
                <DatePicker
                        :value="formData.planBeginTime"
                        type="date"
                        transfer
                        @on-change="onChange_planBeginTime"
                        placeholder="选择时间"></DatePicker>
            </FormItem>
            <FormItem label="计划交工时间:" prop="planEndTime">
                <DatePicker
                        :value="formData.planEndTime"
                        type="date"
                        transfer
                        @on-change="onChange_planEndTime"
                        placeholder="选择时间"></DatePicker>
            </FormItem>
            <FormItem label="联系人:" prop="contacts">
                <Input v-model="formData.contacts"/>
            </FormItem>
            <FormItem label="联系电话:" prop="contactPhone">
                <Input v-model="formData.contactPhone"/>
            </FormItem>
        </Form>

        <div class="ivu-modal-footer" v-if="!isView">
            <Button type="primary"
                    size="large"
                    @click="save">保存</Button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'projectBaseInfo',
        props: {
            isView: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            projectId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                formData: {
                    projectId: '',
                    name: '',      // 项目名称
                    part: '',      // 标段
                    province: '',  // 省
                    city: '',      // 市
                    county: '',    // 区
                    address: '',
                    projectType: '',    // 项目类型
                    buildUnit: '六安市公路管理局',      // 建设单位
                    level: '',          // 技术等级
                    mileage: 10.2,      // 项目里程(km)
                    projectProperty: 'new', // 工程性质
                    amount: 1.251,       // 投资额(万元)
                    constructAmount: 1256.1,  // 施工合同金额(万元)
                    supervisorAmount: 14686.25, // 监理合同金额(万元)
                    designSpeed: 20,           // 设计时速(km/h)
                    planBeginTime: '2018-10-01',      // 计划开工时间
                    planEndTime: '2019-05-05',        // 计划交工时间
                    constructUnit: '0125',       // 施工单位
                    supervisorUnit: '01',      // 监理单位
                    contacts: '陈总经理',            // 联系人
                    contactPhone: '13959260199',       // 联系电话/联系方式
                },
                rules: {
                    name: [{ required: true, message: '项目名称不能为空！', trigger: 'blur' }],
                    part: [{ required: true, message: '标段不能为空！', trigger: 'blur' }],
                    address: [{ required: true, message: '地址不能为空！', trigger: 'blur' }],
                    mileage: [{ required: true, type: 'number', message: '项目里程不能为空！', trigger: 'blur' }],
                    amount: [{ required: true, type: 'number', message: '投资额不能为空！', trigger: 'blur' }],
                    constructAmount: [{ required: true, type: 'number', message: '施工合同金额不能为空！', trigger: 'blur' }],
                    supervisorAmount: [{ required: true, type: 'number', message: '监理合同金额不能为空！', trigger: 'blur' }],
                    designSpeed: [{ required: true, type: 'number', message: '设计时速不能为空！', trigger: 'blur' }],
                    planBeginTime: [{ required: true, message: '标段不能为空！', trigger: 'blur' }],
                    planEndTime: [{ required: true, message: '标段不能为空！', trigger: 'blur' }],

                },

                // 字典
                dict_projectType: [],
                dict_level: [],
                dict_projectProperty: []
            };
        },
        watch: {
            projectId: {
                immediate: true,
                handler(val) {
                    this.formData.projectId = val;

                    if (val !== '') {
                        this.getData_detail();
                    }
                }
            }
        },
        mounted() {
            this.getDict();
        },
        methods: {
            getDict() {
                this.$http({
                    method: 'get',
                    url: '/dict/getListByTypes',
                    params: {
                        types: 'projectType,level,projectProperty'
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.dict_projectType = res.data['projectType'];
                        this.dict_level = res.data['level'];
                        this.dict_projectProperty = res.data['projectProperty'];
                    }
                });
            },
            onChange_planBeginTime(time) {
                this.formData.planBeginTime = time;
            },
            onChange_planEndTime(time) {
                this.formData.planEndTime = time;
            },
            getData_detail() {
                this.$http({
                    method: 'get',
                    url: '/',
                    params: {
                        projectId: this.projectId
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.formData = Object.assign(this.formData, res.data);
                    }
                })
            },
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '更新成功！'
                                });
                                this.$emit('modal_addUser_callback');
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
    .projectBaseInfo-container {
        .form {
            .ivu-form-item {
                .ivu-form-item-content > div{
                    width: 260px;
                }
            }
        }
    }
</style>