<template>
    <div class="showSystem-container">
        <vMap class="v-map"> </vMap>
        
    </div>
</template>
<script>
    import vMap from './map/map.vue';
    export default {
        name: 'showSystem',
        components: {vMap},
        data() {
            return {}
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    .showSystem-container {
        position: relative;
        height: 100%;

    }
</style>