<template>
    <div class="ivxFilterBox-container"
         :style="{
         borderBottomStyle: dashed ? 'dashed': 'solid',
         borderWidth: border ? '1px': '0'}">
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
            },
            border: {
                type: Boolean,
                default: true
            }
        }
    }
</script>

<style lang="scss" scoped>
    .ivxFilterBox-container {
        padding: 10px 0;
        border-bottom: 1px solid #e8eaec;
        overflow: hidden;

        &:first-child {
            padding-top: 0;
        }
        .ivu-btn {
            float: left;
            margin-right: 10px;
        }
    }
</style>

<style lang="scss">
    .ivxFilterBox-container {
        // Form表单样式
        > .ivu-form {
            margin-bottom: -10px;
            .ivu-form-item {
                margin-bottom: 10px;
            }
        }

        > .ivu-upload {
            display: inline-block;
            float: left;
            margin-right: 10px;
            .ivu-upload-list {
                margin-top: 0;
            }
        }


    }
</style>