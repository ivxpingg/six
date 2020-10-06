<template>
    <component :is="iconType" :type="iconName" :color="iconColor" :size="iconSize"/>
</template>

<script>
    import vIcons from '../icons/icons';
    export default {
        name: 'commonIcon',
        components: {vIcons},
        props: {
            type: {
                type: String,
                required: true
            },
            color: String,
            size: Number
        },
        computed: {
            iconType () {
                return this.type.indexOf('_') === 0 ? 'vIcons' : 'Icon'
            },
            iconName () {
                return this.iconType === 'vIcons' ? this.getCustomIconName(this.type) : this.type
            },
            iconSize () {
                return this.size || (this.iconType === 'vIcons' ? 12 : undefined)
            },
            iconColor () {
                return this.color || ''
            }
        },
        methods: {
            getCustomIconName (iconName) {

                return iconName.slice(1);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .commonIcon-container {
    }
</style>