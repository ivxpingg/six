<template>
    <div class="dataDict-container">
        <div class="left-panel"></div>
        <div class="right-panel"></div>
    </div>
</template>

<script>
    export default {
        name: 'dataDict',
        data() {
            return {};
        }
    }
</script>

<style lang="scss" scoped>
    .dataDict-container {
        display: flex;

        .left-panel {
            width: 250px;
        }
        .right-panel {
            flex: 1;
        }
    }
</style>