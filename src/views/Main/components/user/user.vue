<template>
    <div class="user-container">
        <Dropdown @on-click="handleClick">
            <Avatar :src="userAvator"/>
            <Icon :size="18" type="md-arrow-dropdown"></Icon>
            <DropdownMenu slot="list">
                <DropdownItem name="password">修改密码</DropdownItem>
                <DropdownItem name="logout">退出登录</DropdownItem>
            </DropdownMenu>
        </Dropdown>

        <Modal title="修改密码" v-model="modal_password" :width="350">
            <Form ref="form"
                  :label-width="110"
                  :rules="rules"
                  :model="formData">
                <FormItem label="旧密码：" prop="oldPassword">
                    <Input v-model="formData.oldPassword" type="password" />
                </FormItem>
                <FormItem label="新密码：" prop="newPassword">
                    <Input v-model="formData.newPassword" type="password" />
                </FormItem>
                <FormItem label="再次确认密码：" prop="newPassword2">
                    <Input v-model="formData.newPassword2" type="password" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button size="large" type="primary" @click="save">修改</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    export default {
        name: 'user',
        computed: {
            userAvator() {
                let default_img = this.$store.state.user.sex === 'woman' ? './user-woman.png' : './user-man.png';
                return this.$store.state.user.avatorImgPath ? this.$store.state.user.avatorImgPath : default_img;
            }
        },
        data() {
            return {
                // 修改密码
                modal_password: false,
                formData: {
                    oldPassword: '',
                    newPassword: '',
                    newPassword2: ''
                },
                rules: {
                    oldPassword: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
                    newPassword: [
                        { required: true, message: '新密码不能为空', trigger: 'blur' },
                        {validator: this.validate_newPassword, trigger: 'blur'}],
                    newPassword2: [{ required: true, message: '不能为空', trigger: 'blur' }]
                }
            }
        },
        methods: {
            validate_newPassword(rule, value, callback) {
                if (value !== this.formData.newPassword2) {
                    callback(new Error('两次密码不相同！'));
                }
                else{
                    callback();
                }
            },
            ...mapActions([
                'handleLogOut'
            ]),
            handleClick (name) {
                switch (name) {
                    case 'logout':
                        this.handleLogOut().then(() => {
                            this.$router.push({
                                name: 'login'
                            })
                        });
                        break;
                    case 'password':
                        this.modal_password = true;
                        break;
                }
            },

            // 修改密码
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/user/updatePassword',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '修改成功！'
                                });
                                this.handleLogOut().then(() => {
                                    this.$router.push({
                                        name: 'login'
                                    })
                                });
                            }
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .user-container {
        cursor: pointer;
        display: inline-block;
        // height: 64px;
        vertical-align: middle;
        // line-height: 64px;
    }
</style>