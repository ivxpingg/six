<template>
    <Dropdown @on-click="handleClick" transfer placement="right-start">
        <a class="drop-menu-a" type="text" :style="{textAlign: !hideTitle ? 'left' : ''}">
            <vCommonIcon :size="rootIconSize" :color="textColor" :type="parentItem.icon"/>
            <span class="menu-title" v-if="!hideTitle">{{ showTitle(parentItem) }}</span>
            <Icon v-if="!hideTitle" :size="10" :color="textColor" type="chevron-right" style="float: right;margin-top: 4px;"/></a>
        <DropdownMenu slot="list">
            <template v-for="child in children">
                <collapsed-menu v-if="showChildren(child)" :icon-size="iconSize" :parent-item="child" :key="`drop-${child.name}`"></collapsed-menu>
                <DropdownItem v-else :key="`drop-${child.name}`" :name="child.name">
                    <vCommonIcon :size="iconSize" :type="child.icon"/>
                    <span class="menu-title">{{ showTitle(child) }}</span>
                </DropdownItem>
            </template>
        </DropdownMenu>
    </Dropdown>
</template>

<script>
    import mixin from './mixin';
    import vCommonIcon from '@/components/commonIcon/commonIcon';
    export default {
        name: 'collapsed-menu',
        components: {vCommonIcon},
        mixins: [ mixin],
        props: {
            hideTitle: {
                type: Boolean,
                default: false
            },
            rootIconSize: {
                type: Number,
                default: 16
            },
            parentItem: {
                type: Object,
                default: () => {}
            },
            theme: String,
            iconSize: Number
        },
        computed: {
            parentName () {
                return this.parentItem.name
            },
            children () {
                return this.parentItem.children
            },
            textColor () {
                return this.theme === 'dark' ? '#fff' : '#495060'
            }
        },
        methods: {
            handleClick (name) {
                this.$emit('on-click', name)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .collapsed-menu-container {
    }
</style>