<template>
    <div class="addUnit-container">
        <Form ref="form"
              class="unit-form"
              inline
              :model="formData"
              :rules="rules"
              :label-width="180">
            <FormItem label="单位名称:" prop="unitName">
                <Input v-model="formData.unitName"/>
            </FormItem>
            <FormItem label="工程技术初级职称人数:" prop="primaryTechnology">
                <Input v-model="formData.primaryTechnology" number />
            </FormItem>
            <FormItem label="机构代码:" prop="orgCode">
                <Input v-model="formData.orgCode" />
            </FormItem>
            <FormItem label="工程技术中级职称人数:" prop="mediumTechnology">
                <Input v-model="formData.mediumTechnology" number />
            </FormItem>
            <FormItem label="注册地址:" prop="registerAddress">
                <Input v-model="formData.registerAddress" />
            </FormItem>
            <FormItem label="工程技术高级职称人数:" prop="highTechnology">
                <Input v-model="formData.highTechnology" number />
            </FormItem>
            <FormItem label="单位类型:" prop="unitType">
                <Select v-model="formData.unitType">
                    <Option value="1">施工单位</Option>
                    <Option value="2">建设单位</Option>
                </Select>
            </FormItem>
            <FormItem label="技术总人数:" prop="totalTechnology">
                <Input v-model="formData.totalTechnology" number />
            </FormItem>
            <FormItem label="单位负责人:" prop="leader">
                <Input v-model="formData.leader" />
            </FormItem>
            <FormItem label="经济管理初级职称人数:" prop="primaryManage">
                <Input v-model="formData.primaryManage" number />
            </FormItem>
            <FormItem label="联系电话:" prop="telephone">
                <Input v-model="formData.telephone" />
            </FormItem>
            <FormItem label="经济管理中级职称人数:" prop="mediumManage">
                <Input v-model="formData.mediumManage" number />
            </FormItem>
            <FormItem label="电子邮箱:" prop="email">
                <Input v-model="formData.email" />
            </FormItem>
            <FormItem label="经济管理高级职称人数:" prop="highManage">
                <Input v-model="formData.highManage" number />
            </FormItem>
            <FormItem label="公司地址:" prop="companyAddress">
                <Input v-model="formData.companyAddress" />
            </FormItem>
            <FormItem label="经济管理总人数:" prop="totalManage">
                <Input v-model="formData.totalManage" number />
            </FormItem>
            <FormItem label="单位网站:" prop="website">
                <Input v-model="formData.website" />
            </FormItem>
            <FormItem label="统计时间:" prop="countTime">
                <Input v-model="formData.countTime" />
            </FormItem>
            <FormItem label="资质类别:" prop="qualificationType">
                <Input v-model="formData.qualificationTypeLabel"/>
            </FormItem>
            <FormItem label="资质许可证等级:" prop="qualification">
                <Input v-model="formData.qualification" />
            </FormItem>
            <FormItem label="母体机构单位名称:" prop="parentUnitName">
                <Input v-model="formData.parentUnitName" />
            </FormItem>
            <FormItem label="母体机构负责人:" prop="parentUnitLeader">
                <Input v-model="formData.parentUnitLeader" />
            </FormItem>
            <FormItem label="负责人联系方式:" prop="parentUnitTelephone">
                <Input v-model="formData.parentUnitTelephone" />
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
        name: 'addUnit',
        data() {
            return {
                formData: {
                    unitName: '',  // 单位名称
                    orgCode: '',                   // 机构代码
                    registerAddress: '',
                    unitType: '',
                    leader: '',
                    telephone: '',
                    email: '',
                    companyAddress: '',
                    website: '',
                    qualificationType: '',
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
                    countTime: '',                    // 统计时间
                    qualification: ''                 // 许可证等级
                },
                rules: {
                    unitName: [{ required: true, message: '单位名称不能为空！', trigger: 'blur' }],
                    orgCode: [{ required: true, message: '单位机构代码不能为空！', trigger: 'blur' }],
                    registerAddress: [{ required: true, message: '注册地址不能为空！', trigger: 'blur' }],
                    telephone: [{ required: true, message: '联系电话不能为空！', trigger: 'blur' }],
                    email: [{ required: true, message: '电子邮箱不能为空！', trigger: 'blur' }],
                    companyAddress: [{ required: true, message: '公司地址不能为空！', trigger: 'blur' }],
                    qualification: [{ required: true, message: '资质许可证等级不能为空！', trigger: 'blur' }]
                }
            };
        },
        methods: {
            // 添加单位基础信息
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/addUnitInfo',
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
    .addUnit-container {
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