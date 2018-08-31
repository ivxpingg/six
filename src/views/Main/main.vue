<template>
    <Layout class="mhome"  style="height: 100%">
        <Sider class="sider"
               v-model="collapsed"
               hide-trigger
               collapsible
               :width="256"
               :collapsed-width="64">
            <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
            <div class="logo-con">
                <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
                <img v-show="collapsed" :src="minLogo" key="min-logo" />
            </div>

            <vSideMenu accordion
                       :active-name="$route.name"
                       :collapsed="collapsed"
                       :menu-list="menuList"
                       @on-select="turnToPage">

            </vSideMenu>
        </Sider>
        <Layout>
            <Header class="header-con">
                <vHeaderBar :collapsed="collapsed"
                            @on-coll-change="handleCollapsedChange"></vHeaderBar>
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
                </Layout>
                <Content>
                    <keep-alive>
                        <router-view/>
                    </keep-alive>
                </Content>
            </Content>
            <!--<Footer></Footer>-->
        </Layout>
    </Layout>
</template>

<script>
    import vSideMenu from './components/side-menu/side-menu';
    import minLogo from '@/assets/images/logo-min.jpg';
    import maxLogo from '@/assets/images/logo.jpg';
    import vHeaderBar from './components/header-bar/header-bar';
    import vTagsNav from './components/tags-nav/tags-nav';
    import { mapMutations, mapActions } from 'vuex'
    import { getNewTagList, getNextName } from '@/lib/util'
    export default {
        name: 'mhome',
        components: {
            vSideMenu,
            vHeaderBar,
            vTagsNav
        },
        data() {
            return {
                collapsed: false,
                minLogo,
                maxLogo
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
                'addTag'
            ]),
            ...mapActions([
                'getMenuList'
            ]),
            turnToPage (name) {
                if (name.indexOf('isTurnByHref_') > -1) {
                    window.open(name.split('_')[1]);
                    return;
                }
                this.$router.push({
                    name: name
                })
            },
            handleCollapsedChange (state) {
                this.collapsed = state
            },
            handleCloseTag (res, type, name) {
                const nextName = getNextName(this.tagNavList, name)
                this.setTagNavList(res)
                if (type === 'all') this.turnToPage('home')
                else if (this.$route.name === name) this.$router.push({ name: nextName })
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
                // this.addTag(this.$store.state.app.homeRoute);
                this.setBreadCrumb(this.$route.matched);
            });

        }
    }
</script>

<style lang="scss" scoped>
    .mhome {
        .logo-con{
            height: 64px;
            padding: 10px;
            img{
                height: 44px;
                width: auto;
                display: block;
                margin: 0 auto;
            }
        }

        .sider {
            // background: #001529;
        }
        .header-con {
            padding: 0 20px;
            background-color: #FFF;
        }

        .tag-nav-wrapper{
            padding: 0;
            height:40px;
            background:#F0F0F0;
            overflow: hidden;
        }
    }

</style>