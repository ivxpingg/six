<template>
    <div class="ivxFilterBox-container"
         :style="{ borderBottomStyle: dashed ? 'dashed': 'solid'}">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        // 筛选框
        name: 'ivxFilterBox',
        props: {
            dashed: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style lang="scss" scoped>
    .ivxFilterBox-container {
        padding: 10px 0;
        border-bottom: 1px solid #e8eaec;
        .ivu-btn {
            margin-right: 10px;
        }
    }
</style>

<style lang="scss">
    .ivxFilterBox-container {
        // Form表单样式
        .ivu-form {
            margin-bottom: -10px;
            .ivu-form-item {
                margin-bottom: 10px;
            }
        }
    }
</style>