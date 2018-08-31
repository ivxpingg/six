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
                        <Icon :type="item.icon || ''" />
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
    </div>
</template>

<script>
    import mixin from './mixin';
    import vSideMenuItem from './side-menu-item';
    import vCollapsedMenu from './collapsed-menu';
    export default {
        name: 'side-menu',
        mixins: [mixin],
        components: {vSideMenuItem, vCollapsedMenu},
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
        methods: {
            handleSelect (name) {
                this.$emit('on-select', name)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .side-menu-container {
    }
</style>