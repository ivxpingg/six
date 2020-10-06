<template>
    <div class="unitBaseInfo-container">
        <Form ref="form"
              class="unit-form"
              inline
              :model="formData"
              :rules="rules"
              :label-width="180">
            <FormItem label="单位名称:" prop="unitName">
                <Input v-model="formData.unitName"/>
            </FormItem>
            <FormItem label="工程技术初级职称人数:">
                <Input v-model="formData.primaryTechnology" number />
            </FormItem>
            <FormItem label="机构代码:" prop="orgCode">
                <Input v-model="formData.orgCode" />
            </FormItem>
            <FormItem label="工程技术中级职称人数:">
                <Input v-model="formData.mediumTechnology" number />
            </FormItem>
            <FormItem label="注册地址:" >
                <Input v-model="formData.registerAddress" />
            </FormItem>
            <FormItem label="工程技术高级职称人数:">
                <Input v-model="formData.highTechnology" number />
            </FormItem>
            <FormItem label="单位类型:" prop="unitType">
                <Select v-model="formData.unitType">
                    <Option v-for="item in dict_unitType"
                            :key="item.id"
                            :value="item.value"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="技术总人数:">
                <Input v-model="formData.totalTechnology" number />
            </FormItem>
            <FormItem label="项目/业主负责人:" prop="leader">
                <Input v-model="formData.leader" />
            </FormItem>
            <FormItem label="经济管理初级职称人数:">
                <Input v-model="formData.primaryManage" number />
            </FormItem>
            <FormItem label="联系电话:" prop="telephone">
                <Input v-model="formData.telephone" />
            </FormItem>
            <FormItem label="经济管理中级职称人数:">
                <Input v-model="formData.mediumManage" number />
            </FormItem>
            <FormItem label="电子邮箱:">
                <Input v-model="formData.email" />
            </FormItem>
            <FormItem label="经济管理高级职称人数:">
                <Input v-model="formData.highManage" number />
            </FormItem>
            <FormItem label="公司地址:">
                <Input v-model="formData.companyAddress" />
            </FormItem>
            <FormItem label="经济管理总人数:">
                <Input v-model="formData.totalManage" number />
            </FormItem>
            <FormItem label="单位网站:">
                <Input v-model="formData.website" />
            </FormItem>
            <FormItem label="统计时间:">
                <Input v-model="formData.countTime" />
            </FormItem>
            <FormItem label="资质类别:">
                <Select v-model="formData.qualificationTypeList" multiple>
                    <Option v-for="item in dict_qualificationType"
                            :key="item.id"
                            :value="item.label"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="资质许可证等级:">
                <Select v-model="formData.qualificationLevelList" multiple>
                    <Option v-for="item in dict_qualification"
                            :key="item.id"
                            :value="item.label"
                            :label="item.label"></Option>
                </Select>
            </FormItem>
            <FormItem label="母体机构单位名称:">
                <Input v-model="formData.parentUnitName" />
            </FormItem>
            <FormItem label="母体机构负责人:">
                <Input v-model="formData.parentUnitLeader" />
            </FormItem>
            <FormItem label="负责人联系方式:">
                <Input v-model="formData.parentUnitTelephone" />
            </FormItem>
        </Form>
        <div class="ivu-modal-footer" v-if="auth_update">
            <Button type="primary"
                    size="large"
                    :loading="saveBtnLoading"
                    @click="save">保存</Button>
        </div>
    </div>
</template>

<script>
    import AuthMixin from '../../../../../lib/mixin/authMixin';
    export default {
        name: 'unitBaseInfo',  // 单位基本信息
        mixins: [AuthMixin],
        props: {
            unitId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                formData: {
                    unitId: '',
                    unitName: '',  // 单位名称
                    orgCode: '',                   // 机构代码
                    registerAddress: '',
                    unitType: '',
                    unitTypeLabel: '',
                    leader: '',
                    telephone: '',
                    email: '',
                    companyAddress: '',
                    website: '',
                    qualificationType: '',
                    qualificationTypeList: [],
                    qualificationTypeLabel: '',
                    parentUnitName: '',
                    parentUnitLeader: '',
                    parentUnitTelephone: '',
                    primaryTechnology: 0,              //'工程技术初级职称人数',
                    mediumTechnology: 0,               //'工程技术中级职称人数',
                    highTechnology: 0,                 //'工程技术高级职称人数',
                    totalTechnology: 0,                // 技术总人数
                    primaryManage: 0,                 //经济管理初级职称人数
                    mediumManage: 0,                  //经济管理中级职称人数
                    highManage: 0,                    //经济管理高级职称人数
                    totalManage: 0,                   //'经济管理总人数'
                    countTime: '',            // 统计时间
                    qualificationLevel: '',                 // 许可证等级
                    qualificationLevelList: []
                },
                rules: {
                    unitName: [{ required: true, message: '单位名称不能为空！', trigger: 'blur' }],
                    leader: [{ required: true, message: '项目/业主负责人不能为空！', trigger: 'blur' }],
                    unitType: [{ required: true, message: '单位类型不能为空！', trigger: 'blur' }],
                    // orgCode: [{ required: true, message: '单位机构代码不能为空！', trigger: 'blur' }],
                    // registerAddress: [{ required: true, message: '注册地址不能为空！', trigger: 'blur' }],
                    telephone: [{ required: true, message: '联系电话不能为空！', trigger: 'blur' }],
                    // email: [{ required: true, message: '电子邮箱不能为空！', trigger: 'blur' }],
                    // companyAddress: [{ required: true, message: '公司地址不能为空！', trigger: 'blur' }],
                    // qualificationLevel: [{ required: true, message: '资质许可证等级不能为空！', trigger: 'blur' }]
                },

                dict_unitType: [],
                dict_qualificationType: [],
                dict_qualification: [],
                // 保存按钮状态
                saveBtnLoading: false
             };
        },
        watch: {
            unitId: {
                immediate: true,
                handler(val) {
                    if (val) {
                        this.getUntiBaseInfo();
                    }
                }
            }
        },
        mounted() {
            this.getDicts(['unitType','qualificationType','qualification']);
        },
        methods: {
             // 获取单位类别的数据字典
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
            // 获取详细信息
            getUntiBaseInfo() {
                this.$http({
                    method: 'get',
                    url: '/unit/query',
                    params: {
                        unitId: this.unitId
                    }
                }).then(res => {
                   if (res.code === 'SUCCESS') {
                       Object.assign(this.formData, res.data, {
                           qualificationTypeList: res.data.qualificationType ? res.data.qualificationType.split(',') : [],
                           qualificationLevelList: res.data.qualificationLevel ? res.data.qualificationLevel.split(',') : []
                       });
                   }
                });
            },
            // 保存单位基础信息
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.saveBtnLoading = true;
                        this.formData.qualificationType = this.formData.qualificationTypeList.join(',');
                        this.formData.qualificationLevel = this.formData.qualificationLevelList.join(',');

                        this.$http({
                            method: 'post',
                            url: '/unit/update',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '更新成功！'
                                });
                                this.$emit('modal-callback');
                                this.saveBtnLoading = false;
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
    .unitBaseInfo-container {
        padding-bottom: 61px;
        .unit-form {
            .ivu-form-item {
                .ivu-input-wrapper,
                .ivu-select{
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