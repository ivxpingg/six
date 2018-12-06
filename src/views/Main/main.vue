<template>
    <Layout class="mhome"  style="height: 100%">
        <Sider class="left-sider"
               v-model="collapsed"
               hide-trigger
               collapsible
               :width="256"
               :collapsed-width="64">

            <vSideMenu
                    ref="sideMenu"
                    accordion
                    :active-name="$route.name"
                    :collapsed="collapsed"
                    :menu-list="menuList"
                    @on-select="turnToPage">
                <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
                <div class="logo-con">
                    <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
                    <img v-show="collapsed" :src="minLogo" key="min-logo" />
                </div>

            </vSideMenu>
        </Sider>
        <Layout id="mian_layout" ref="mian_layout">
            <Header class="header-con">
                <vHeaderBar :collapsed="collapsed"
                            @on-coll-change="handleCollapsedChange">
                    <vUser :user-avator="userAvator"></vUser>
                    <vFullscreen  v-model="isFullscreen" style="margin-right: 10px;"></vFullscreen>
                </vHeaderBar>
                <!--<Icon @on-coll-change="handleCollapsedChange"-->
                      <!--:style="{margin: '0 20px'}"-->
                      <!--type="md-menu"-->
                      <!--size="24"></Icon>-->
            </Header>
            <Content>
                <Layout>
                    <div class="tag-nav-wrapper">
                        <vTagsNav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
                    </div>
                    <Content class="content-wrapper" ref="tabsContent">
                        <router-view/>
                        <!--<keep-alive>-->
                            <!---->
                        <!--</keep-alive>-->
                    </Content>
                </Layout>
            </Content>
            <!--<Footer></Footer>-->
        </Layout>
    </Layout>
</template>

<script>
    import vSideMenu from './components/side-menu/side-menu';
    import minLogo from '@/assets/images/logo.png';
    import maxLogo from '@/assets/images/logo-max.png';
    import vHeaderBar from './components/header-bar/header-bar';
    import vTagsNav from './components/tags-nav/tags-nav';
    import vUser from './components/user/user';
    import vFullscreen from './components/fullscreen/fullscreen';
    import { mapMutations, mapActions } from 'vuex'
    import { getNewTagList, getNextRoute, routeEqual } from '@/lib/util'
    export default {
        name: 'mhome',
        components: {
            vSideMenu,
            vHeaderBar,
            vTagsNav,
            vUser,
            vFullscreen
        },
        data() {
            return {
                collapsed: false,
                minLogo,
                maxLogo,
                isFullscreen: false,
                userAvator: '/user.jpg'
            };
        },
        computed: {
            menuList () {
                return  this.$store.state.app.menuList;
            },
            tagNavList () {
                return this.$store.state.app.tagNavList;
            }
        },
        methods: {
            ...mapMutations([
                'setBreadCrumb',
                'setTagNavList',
                'addTag',
                'setMianLayoutWidth'
            ]),
            ...mapActions([
                'getMenuList'
            ]),
            turnToPage (route) {
                let { name, params, query } = {}
                if (typeof route === 'string') name = route;
                else {
                    name = route.name
                    params = route.params
                    query = route.query
                }
                if (name.indexOf('isTurnByHref_') > -1) {
                    window.open(name.split('_')[1])
                    return
                }
                this.$router.push({
                    name,
                    params,
                    query
                })
            },
            handleCollapsedChange (state) {
                this.collapsed = state;

                this.setMianLayoutWidth(this.$refs.mian_layout.$el.clientWidth);
            },
            handleCloseTag (res, type, route) {
                let openName = ''
                if (type === 'all') {
                    this.turnToPage('home')
                    openName = 'home'
                } else if (routeEqual(this.$route, route)) {
                    if (type === 'others') {
                        openName = route.name
                    } else {
                        const nextRoute = getNextRoute(this.tagNavList, route)
                        this.$router.push(nextRoute)
                        openName = nextRoute.name
                    }
                }
                this.setTagNavList(res)
                this.$refs.sideMenu.updateOpenName(openName)
            },
            handleClick (item) {
                this.turnToPage(item.name)
            }
        },
        watch: {
            '$route' (newRoute) {
                this.setBreadCrumb(newRoute.matched);
                this.setTagNavList(getNewTagList(this.tagNavList, newRoute, this.menuList));
            }
        },
        mounted() {
            this.getMenuList().then(() => {
                /**
                 * @description 初始化设置面包屑导航和标签导航
                 */
                this.setTagNavList();
                this.addTag(this.$store.state.app.homeRoute);
                this.setBreadCrumb(this.$route.matched);
            });

        }
    }
</script>

<style lang="scss" scoped>
    .mhome {
        .logo-con {
            height: 64px;
            padding: 10px 5px;
            img {
                height: 44px;
                width: auto;
                display: block;
                margin: 0 auto;
            }
        }
        .header-con {
            padding: 0 20px;
            background-color: #FFF;
        }

        .tag-nav-wrapper {
            padding: 0;
            height: 40px;
            background: #F0F0F0;
        }

        .content-wrapper {
            padding: 18px;
            height: calc(100% - 80px);
            overflow: auto;
        }

        .left-sider {
            overflow: auto;
            .ivu-layout-sider-children {
                overflow-y: scroll;
                margin-right: -18px;
            }
        }
    }

</style>

<style lang="scss">
    .left-sider {
        background: #001529;
    }

    .ivu-menu-dark {
        background: #001529;
    }

    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title:hover {
        color: #fff;
        background: none;
    }
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title {
        background: none;
    }
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened {
        background: #000c17;
    }
</style>