<template>
    <div class="projectBaseInfo-container ">
        <Form ref="form"
              class="form"
              inline
              :model="formData"
              :rules="rules"
              :label-width="140">
            <FormItem label="项目名称:" prop="projectName">
                <Input v-model="formData.projectName"/>
            </FormItem>
            <FormItem label="标段:" prop="part">
                <Input v-model="formData.part"/>
            </FormItem>
            <FormItem label="详细地址:" prop="address">
                <Input v-model="formData.address"/>
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

            <FormItem label="项目类型:" prop="projectType">
                <Select v-model="formData.projectType">
                    <Option v-for="item in dict_projectType"
                            :value="item.value"
                            :key="item.id"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="建设单位:" prop="buildUnit">
                <Input v-model="formData.buildUnitStr" readonly @on-focus="onFocus_unitSelect('construction_unit')" />
            </FormItem>
            <FormItem label="施工单位:" prop="constructUnit">
                <Input v-model="formData.constructUnitStr" readonly @on-focus="onFocus_unitSelect('work_unit')" />
            </FormItem>
            <FormItem label="监理单位:" prop="supervisorUnit">
                <Input v-model="formData.supervisorUnitStr" readonly @on-focus="onFocus_unitSelect('supervisor_unit')" />
            </FormItem>
            <FormItem label="技术等级:" prop="technicalLevel">
                <Select v-model="formData.technicalLevel">
                    <Option v-for="item in dict_technicalLevel"
                            :value="item.value"
                            :key="item.id"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="结构类型:" prop="structureType">
                <Select v-model="formData.structureType">
                    <Option v-for="item in dict_structureType"
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
                <Input v-model="formData.mileage" number>
                    <span slot="append">km</span>
                </Input>
            </FormItem>
            <FormItem label="设计时速(km/h):" prop="designSpeed">
                <Input v-model="formData.designSpeed" number>
                    <span slot="append">km/h</span>
                </Input>
            </FormItem>
            <FormItem label="路基宽度(米):" prop="subgradeWidth">
                <Input v-model="formData.subgradeWidth" number>
                     <span slot="append">米</span>
                </Input>
            </FormItem>
            <FormItem label="投资额(万元):" prop="amount">
                <Input v-model="formData.amount" number>
                    <span slot="append">万元</span>
                </Input>
            </FormItem>
            <FormItem label="施工合同金额(万元):" prop="constructAmount">
                <Input v-model="formData.constructAmount" number>
                    <span slot="append">万元</span>
                </Input>
            </FormItem>
            <FormItem label="监理合同金额(万元):" prop="supervisorAmount">
                <Input v-model="formData.supervisorAmount" number>
                    <span slot="append">万元</span>
                </Input>
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
                <Input v-model="formData.contacts" placeholder="请输入联系人姓名">
                </Input>
            </FormItem>
            <FormItem label="联系电话:" prop="contactPhone">
                <Input v-model="formData.contactPhone" placeholder="请输入联系电话">
                    <Icon type="md-call" slot="prefix"/>
                </Input>
            </FormItem>
        </Form>

        <div class="ivu-modal-footer" v-if="!isView">
            <Button type="primary"
                    size="large"
                    @click="save">保存</Button>
        </div>

        <vModalUnitSelect ref="modal_unitSelect"
                          :selectedValue="[]"
                          :zIndex="2000"
                          :unitType="unitType"
                          @modal-callback="modal_unitSelect_callback" ></vModalUnitSelect>
    </div>
</template>

<script>
    import vModalUnitSelect from '../../../../Common/unitSelect/modalUnitSelect';
    import MOMENT from 'moment';
    export default {
        name: 'projectBaseInfo',
        components: {vModalUnitSelect},
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
                    projectName: '',      // 项目名称
                    part: '',      // 标段
                    province: '',  // 省
                    city: '',      // 市
                    county: '',    // 区
                    address: '',
                    projectType: '',    // 项目类型
                    buildUnit: '',      // 建设单位
                    buildUnitStr: '',
                    technicalLevel: '',          // 技术等级
                    structureType: '',        // 结构类型
                    mileage: null,      // 项目里程(km)
                    projectProperty: '', // 工程性质
                    amount: null,       // 投资额(万元)
                    constructAmount: null,  // 施工合同金额(万元)
                    supervisorAmount: null, // 监理合同金额(万元)
                    designSpeed: null,           // 设计时速(km/h)
                    subgradeWidth: null,        // 路基宽度(米)
                    planBeginTime: '',      // 计划开工时间
                    planEndTime: '',        // 计划交工时间
                    constructUnit: '',       // 施工单位
                    constructUnitStr: '',
                    supervisorUnit: '',      // 监理单位
                    supervisorUnitStr: '',
                    contacts: '',            // 联系人
                    contactPhone: '',       // 联系电话/联系方式
                },
                rules: {
                    projectName: [{ required: true, message: '项目名称不能为空！', trigger: 'blur' }],
                    part: [{ required: true, message: '标段不能为空！', trigger: 'blur' }],
                    address: [{ required: true, message: '地址不能为空！', trigger: 'blur' }],
                    mileage: [{ required: true, type: 'number', message: '项目里程不能为空！', trigger: 'blur' }],
                    amount: [{ required: true, type: 'number', message: '投资额不能为空！', trigger: 'blur' }],
                    constructAmount: [{ required: true, type: 'number', message: '施工合同金额不能为空！', trigger: 'blur' }],
                    supervisorAmount: [{ required: true, type: 'number', message: '监理合同金额不能为空！', trigger: 'blur' }],
                    designSpeed: [{ required: true, type: 'number', message: '设计时速不能为空！', trigger: 'blur' }],
                    subgradeWidth: [{ required: true, type: 'number', message: '路基宽度不能为空！', trigger: 'blur' }],
                    planBeginTime: [{ required: true, message: '标段不能为空！', trigger: 'blur' }],
                    planEndTime: [{ required: true, message: '标段不能为空！', trigger: 'blur' }],

                },

                //
                unitType: '',

                // 字典
                dict_projectType: [],
                dict_technicalLevel: [],
                dict_projectProperty: [],
                dict_structureType: []
            };
        },
        watch: {
            projectId: {
                handler(val) {
                    this.formData.projectId = val;
                    if (val !== '') {
                        this.getData_detail();
                    }
                }
            }
        },
        mounted() {
            this.getDict(['projectType', 'technicalLevel', 'projectProperty', 'structureType']);
        },
        methods: {
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
            onChange_planBeginTime(time) {
                this.formData.planBeginTime = time;
            },
            onChange_planEndTime(time) {
                this.formData.planEndTime = time;
            },
            getData_detail() {
                this.$http({
                    method: 'get',
                    url: '/project/query',
                    params: {
                        projectId: this.projectId
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        Object.assign(this.formData, res.data, {
                            planBeginTime: res.data.planBeginTime ? MOMENT(res.data.planBeginTime).format('YYYY-MM-DD') : '',
                            planEndTime: res.data.planEndTime ? MOMENT(res.data.planEndTime).format('YYYY-MM-DD') : ''
                        });
                        console.dir(this.formData);
                    }
                })
            },

            // 单位选择
            onFocus_unitSelect(type) {
                this.unitType = type;
                this.$refs.modal_unitSelect.modalValue = true;
            },
            modal_unitSelect_callback(selectValue, selectItems) {
                switch (this.unitType) {
                    case 'construction_unit':  // 建设单位
                        this.formData.buildUnit = selectItems.unitId;
                        this.formData.buildUnitStr = selectItems.unitName;
                        break;
                    case 'work_unit':  // 施工单位
                        this.formData.constructUnit = selectItems.unitId;
                        this.formData.constructUnitStr = selectItems.unitName;
                        break;

                    case 'supervisor_unit':   // 监理单位
                        this.formData.supervisorUnit = selectItems.unitId;
                        this.formData.supervisorUnitStr = selectItems.unitName;
                        break;
                }
            },

            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {

                        if(this.projectId === '') {
                            this.$http({
                                method: 'post',
                                url: '/project/add',
                                data: JSON.stringify(this.formData)
                            }).then(res => {
                                if(res.code === 'SUCCESS') {
                                    this.$Message.success({
                                        content: '添加成功！'
                                    });
                                    this.$emit('modal_addProject_callback');
                                }
                            })
                        }

                        else {
                            this.$http({
                                method: 'post',
                                url: '/project/update',
                                data: JSON.stringify(this.formData)
                            }).then(res => {
                                if(res.code === 'SUCCESS') {
                                    this.$Message.success({
                                        content: '保存成功！'
                                    });
                                    this.$emit('modal_updateProject_callback');
                                }
                            })
                        }

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
                    width: 180px;
                }
            }
        }
    }
</style>