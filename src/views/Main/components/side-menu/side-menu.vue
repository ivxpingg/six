<template>
    <div class="side-menu-container">
        <slot></slot>
        <Menu ref="menu"
              v-show="!collapsed"
              :active-name="activeName"
              :open-names="openedNames"
              :accordion="accordion"
              :theme="theme"
              width="auto"
              @on-select="handleSelect">
            <template v-for="item in menuList">
                <template v-if="item.children && item.children.length === 1">
                    <vSideMenuItem v-if="showChildren(item)"
                                   :key="`menu-${item.name}`"
                                   :parent-item="item"></vSideMenuItem>
                    <menu-item v-else
                               :name="getNameOrHref(item, true)"
                               :key="`menu-${item.children[0].name}`">
                        <!--<Icon :type="item.icon || ''" />-->
                        <vCommonIcon :type="item.icon || ''"/>
                        <span>{{ showTitle(item.children[0]) }}</span>
                    </menu-item>
                </template>

                <template v-else>
                    <vSideMenuItem
                            v-if="showChildren(item)"
                            :key="`menu-${item.name}`"
                            :parent-item="item"></vSideMenuItem>
                    <menu-item
                            v-else
                            :name="getNameOrHref(item)"
                            :key="`menu-${item.name}`">
                        <Icon :type="item.icon || ''" />
                        <span>{{ showTitle(item) }}</span>
                    </menu-item>
                </template>
            </template>
        </Menu>

        <div class="menu-collapsed" v-show="collapsed" :list="menuList">
            <template v-for="item in menuList">
                <vCollapsedMenu v-if="item.children && item.children.length > 1"
                                @on-click="handleSelect"
                                hide-title
                                :root-icon-size="rootIconSize"
                                :icon-size="iconSize"
                                :theme="theme"
                                :parent-item="item"
                                :key="`drop-menu-${item.name}`"></vCollapsedMenu>
                <Tooltip v-else
                         :content="(item.meta && item.meta.title) || (item.children && item.children[0] && item.children[0].meta.title)"
                         placement="right"
                         :key="`drop-menu-${item.name}`">
                    <a @click="handleSelect(getNameOrHref(item, false))"
                       class="drop-menu-a"
                       :style="{textAlign: 'center'}">
                        <!--<Icon :type="item.icon || ''" :style="{fontSize: rootIconSize + 'px', color: textColor}" />-->
                        <vCommonIcon :size="rootIconSize" :color="textColor" :type="item.icon || (item.children && item.children[0].icon)"/>
                    </a>
                </Tooltip>
            </template>
        </div>

    </div>
</template>

<script>
    import mixin from './mixin';
    import vSideMenuItem from './side-menu-item';
    import vCollapsedMenu from './collapsed-menu';
    import vCommonIcon from '@/components/commonIcon/commonIcon';
    import { getUnion } from '@/lib/tools'
    export default {
        name: 'side-menu',
        mixins: [mixin],
        components: {
            vSideMenuItem,
            vCollapsedMenu,
            vCommonIcon
        },
        props: {
            menuList: {
                type: Array,
                default() {
                    return [];
                }
            },
            collapsed: {
                type: Boolean
            },
            theme: {
                type: String,
                default: 'dark'
            },
            rootIconSize: {
                type: Number,
                default: 20
            },
            iconSize: {
                type: Number,
                default: 16
            },
            accordion: Boolean,
            activeName: {
                type: String,
                default: ''
            },
            openNames: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                openedNames: []
            };
        },
        computed: {
            textColor () {
                return this.theme === 'dark' ? '#fff' : '#495060'
            }
        },
        methods: {
            handleSelect (name) {
                this.$emit('on-select', name)
            },
            getOpenedNamesByActiveName (name) {
                return this.$route.matched.map(item => item.name).filter(item => item !== name)
            },
            updateOpenName (name) {
                if (name === 'home') this.openedNames = []
                else this.openedNames = this.getOpenedNamesByActiveName(name)
            }
        },
        watch: {
            activeName (name) {
                if (this.accordion) this.openedNames = this.getOpenedNamesByActiveName(name)
                else this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
            },
            openNames (newNames) {
                this.openedNames = newNames
            },
            openedNames () {
                this.$nextTick(() => {
                    this.$refs.menu.updateOpened();
                    this.$refs.menu.updateActiveName();
                })
            },
            menuList: {
                immediate: true,
                handler() {
                    this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name));
                }
            }
        },
        mounted () {
            // this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
        }
    }
</script>

<style lang="scss" >
    .side-menu-container{
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        .menu-collapsed{
            padding-top: 10px;

            .ivu-dropdown{
                width: 100%;
                .ivu-dropdown-rel a{
                    width: 100%;
                }
            }
            .ivu-tooltip{
                width: 100%;
                .ivu-tooltip-rel{
                    width: 100%;
                }
                .ivu-tooltip-popper .ivu-tooltip-content{
                    .ivu-tooltip-arrow{
                        border-right-color: #fff;
                    }
                    .ivu-tooltip-inner{
                        background: #fff;
                        color: #495060;
                    }
                }
            }
            .menu-title{
                margin-left: 6px;
            }
            .ivu-select-dropdown{
                width: 160px;
                margin-left: 4px;
            }
        }
        a.drop-menu-a{
            display: inline-block;
            padding: 6px 15px;
            width: 100%;
            text-align: center;
            color: #495060;
        }
    }
</style>