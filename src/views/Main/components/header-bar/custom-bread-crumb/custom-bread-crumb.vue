<template>
    <div class="custom-bread-crumb-container">
        <Breadcrumb :style="{fontSize: `${fontSize}px`}">
            <BreadcrumbItem v-for="item in list" :to="item.to" :key="`bread-crumb-${item.name}`">
                <!--<Icon :type="item.icon || ''" style="margin-right: 4px;"></Icon>-->
                <vCommonIcon :type="item.icon || ''" style="margin-right: 4px;"></vCommonIcon>
                {{ showTitle(item) }}
            </BreadcrumbItem>
        </Breadcrumb>
    </div>
</template>

<script>
    import vCommonIcon from '@/components/commonIcon/commonIcon';
    export default {
        name: 'custom-bread-crumb',
        components: {vCommonIcon},
        props: {
            list: {
                type: Array,
                default: () => []
            },
            fontSize: {
                type: Number,
                default: 14
            },
            showIcon: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            showTitle (item) {
                return item.meta.title;
            },
            isCustomIcon (iconName) {
                return iconName.indexOf('_') === 0;
            },
            getCustomIconName (iconName) {
                return iconName.slice(1)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .custom-bread-crumb-container {
        display: inline-block;
        vertical-align: top;
    }
</style>