<template>
    <Layout class="login-container">
        <header class="header">
            <div class="header-inner">
                <img class="logo" src="./images/logo.png" alt="">
                <!--<img class="logo-text" src="./images/logo-text.png" alt="">-->
                <span class="logo-text">交通工程质量监督管理系统</span>
                <div class="menu-panel">

                </div>
            </div>
        </header>
        <Content class="content">
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide slide-1"></div>
                    <div class="swiper-slide slide-2"></div>
                    <div class="swiper-slide slide-3"></div>
                </div>
            </div>
            <div class="mask-img"></div>

            <div class="login-con">
                <Card icon="log-in" title="欢迎登录" :bordered="false">
                    <div class="form-con">
                        <vLoginForm @on-success-valid="handleSubmit"></vLoginForm>
                        <!--<p class="login-tip">输入任意用户名和密码即可</p>-->
                    </div>
                </Card>
            </div>
        </Content>
        <Footer class="footer">
            <!--<p>管理单位：六安市交通质监局</p>-->
            <p>技术支持：厦门怡奇信息科技有限公司</p>
        </Footer>
    </Layout>
</template>

<script>
    import Swiper from 'swiper';
    import 'swiper/dist/css/swiper.min.css';
    import vLoginForm from './login-form';
    import { mapActions } from 'vuex';
    import {setMenuListInLocalstorage} from '../../lib/util';
    export default {
        name: 'user',
        components: {vLoginForm},
        data() {
            return {};
        },
        mounted() {
            this.initSwiper();
        },
        methods: {
            ...mapActions([
                'handleLogin',
                'getUserInfo',
                'getMenuList'
            ]),
            initSwiper() {
                let mySwiper = new Swiper ('.swiper-container', {
                    direction: 'horizontal',
                    autoplay: true,
                    loop: true,
                    speed:1000,
                    effect : 'fade',
                    fadeEffect: {
                        crossFade: true,
                    }
                })
            },
            handleSubmit({ loginName, password }) {

                this.handleLogin({ loginName, password }).then(res => {
                    this.$http({
                        method: 'get',
                        url: '/menu/userMenus'
                    }).then(res => {
                        if (res.code === 'SUCCESS') {
                            setMenuListInLocalstorage(res.data || []);
                            this.$router.push({
                                name: 'home'
                            });
                        }
                    });

                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .login-container {
        height: 100%;
        background-color: #FFF;
        .header {
            height: 70px;
            border-bottom: 1px solid #e6f3fd;
            .header-inner {
                margin: 0 auto;
                max-width: 1600px;
                .logo {
                    height: 50px;
                    display: inline-block;
                    margin: 9px 10px;
                    float: left;
                }
                .logo-text {
                    font-size: 26px;
                    color: #2d8cf0;
                    height: 40px;
                    display: inline-block;
                    margin: 16px 10px auto;
                    float: left;
                }
            }
        }

        .content {
            flex: 1;
            position: relative;
            overflow: hidden;
            .mask-img {
                display: block;
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                z-index: 11;
                background-image: url("./images/login-mask.png");
                background-repeat: no-repeat;
                background-size: auto 100%;
                background-position: center;
            }
            .swiper-container {
                height: 100%;

                .swiper-slide {
                    background-repeat: no-repeat;
                    background-size: auto 100%;
                    background-position: center;
                    &.slide-1 {
                        background-image: url("./images/login-bg-1.png");
                    }
                    &.slide-2 {
                        background-image: url("./images/login-bg-2.png");
                    }
                    &.slide-3 {
                        background-image: url("./images/login-bg-3.png");
                    }
                }

            }

            .login-con{
                position: absolute;
                right: 160px;
                top: 50%;
                transform: translateY(-60%);
                width: 300px;
                z-index: 12;
                login-header{
                    font-size: 16px;
                    font-weight: 300;
                    text-align: center;
                    padding: 30px 0;
                }
                .form-con{
                    padding: 10px 0 0;
                }
                .login-tip{
                    font-size: 10px;
                    text-align: center;
                    color: #c3c3c3;
                }
            }
        }

        .footer {
            height: 102px;
            border-top: 1px solid #e6f3fd;
            > p {
                text-align: center;
                font-size: 12px;
                color: #5d5d5d;
                line-height: 26px;
            }
        }
    }
</style>