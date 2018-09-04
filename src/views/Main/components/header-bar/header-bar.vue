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
        <div class="custom-content-con">
            <slot></slot>
        </div>
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
        width: 100%;
        height: 100%;
        position: relative;
        .custom-content-con{
            float: right;
            height: auto;
            padding-right: 20px;
            line-height: 64px;
            & > *{
                float: right;
            }
        }
    }
</style>