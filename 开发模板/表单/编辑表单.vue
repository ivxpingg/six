<template>
    <div class="编辑表单-container">

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
                    <Option value="0">女</Option>
                    <Option value="1">男</Option>
                </Select>
            </FormItem>
            <FormItem label="UID:" prop="uId">
                <Input v-model="formData.uId"/>
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
            <FormItem label="技术职称:" prop="titleName">
                <Input v-model="formData.titleName"/>
            </FormItem>
            <FormItem label="职称级别:" prop="titleLevel">
                <Input v-model="formData.titleLevel"/>
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
            <FormItem label="身份证号:" prop="IdNumber">
                <Input v-model="formData.IdNumber"/>
            </FormItem>
            <FormItem label="相关材料:">
                <Upload :action="uploadParams.actionUrl"
                        :showUploadList="uploadParams.showUploadList"
                        :multiple="uploadParams.multiple"
                        :accept="uploadParams.accept"
                        :maxSize="uploadParams.maxSize"
                        :before-upload="fileBeforeUpload"
                        :on-exceeded-size="exceededSize"
                        :on-error="fileUploadError"
                        :on-success="fileUploadSuccess">
                    <Button type="primary" icon="ios-cloud-upload-outline">上传图片</Button> 支持扩展名：.png .jpg .gif .jpeg
                </Upload>
            </FormItem>
        </Form>

        <div class="ivu-modal-footer">
            <Button type="primary"
                    size="large"
                    @click="save">保存</Button>
        </div>


        <Modal v-model="modal_addSignature"
               title="上传电子签名"
               :width="360"
               footer-hide>
            <!--<vUploadSignature @addSignaturCallback="modal_addSignaturCallback"></vUploadSignature>-->
        </Modal>

    </div>
</template>

<script>
    export default {
        name: '编辑表单',
        data() {
            return {
                formData: {
                    name: '',
                    uId: '',
                    sex: '0',
                    age: 0,
                    nation: '0',
                    nationStr: '汉族',
                    titleLevel: '职称级别',
                    titleName: '',
                    certificate: '',
                    certificateNo: '',
                    education: '',
                    graduateSchool: '',
                    profession: '',
                    graduateDate: '2018-01-01',
                    phone: '',
                    email: '',
                    IdNumber: '',
                    job: '',
                    fileIds: ''
                },
                rules: {
                    name: [{ required: true, message: '姓名不能为空！', trigger: 'blur' }],
                    uId: [{ required: true, message: 'UID不能为空！', trigger: 'blur' }],
                    age: [{ required: true, type: 'number', message: '年龄不能为空！', trigger: 'blur' }],
                    titleName: [{ required: true, message: '技术职称不能为空！', trigger: 'blur' }],
                    titleLevel: [{ required: true, message: '职称级别不能为空！', trigger: 'blur' }],
                    graduateSchool: [{ required: true, message: '毕业院校不能为空！', trigger: 'blur' }],
                    profession: [{ required: true, message: '专业名称不能为空！', trigger: 'blur' }],
                    graduateDate: [{ required: true, message: '毕业时间不能为空！', trigger: 'blur' }],
                    phone: [{ required: true, message: '联系电话不能为空！', trigger: 'blur' }],
                    email: [{ required: true, message: '电子邮箱不能为空！', trigger: 'blur' }],
                    IdNumber: [{ required: true, message: '身份证号不能为空！', trigger: 'blur' }]
                }
            };
        },
        methods: {
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
    .编辑表单-container {
    }
</style>