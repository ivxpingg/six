<template>
    <div class="modal-both-sides-container"
         :style="{
             height: height === 0 ? 'auto': height + 'px'
         }">
        <div class="left-right">
            <slot name="left"></slot>
        </div>
        <div class="right-panel">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'modal-both-sides',
        props: {
            height: {
                type: Number,
                default: 0
            }
        },
        computed: {

        },
        data() {
            return {};
        }
    }
</script>

<style lang="scss" scoped>
    .modal-both-sides-container {
        display: flex;
        .left-right {
            height: 100%;
            .ivu-menu {
                height: 100%;
            }
        }
        .right-panel {
            flex: 1;
            padding: 16px;
            height: 100%;
            overflow-y: auto;
        }
    }
</style>