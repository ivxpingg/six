<template>
    <div class="header-bar-container">
        <vSiderTrigger :collapsed="collapsed"
                       icon="md-menu"
                       @on-change="handleCollpasedChange">
        </vSiderTrigger>
        <vCustomBreadCrumb
                show-icon
                style="margin-left: 30px;"
                :list="breadCrumbList">
        </vCustomBreadCrumb>
    </div>
</template>

<script>
    import vSiderTrigger from './sider-trigger/sider-trigger';
    import vCustomBreadCrumb from './custom-bread-crumb/custom-bread-crumb';
    export default {
        name: 'header-bar',
        components: {vSiderTrigger, vCustomBreadCrumb},
        props: {
            collapsed: {
                type: Boolean
            }
        },
        computed: {
            breadCrumbList () {

                return this.$store.state.app.breadCrumbList;
            }
        },
        data() {
            return {

            };
        },
        methods: {
            handleCollpasedChange (state) {
                this.$emit('on-coll-change', state)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .header-bar-container {
    }
</style>