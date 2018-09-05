<template>
    <div class="baidu-map" id="baidu_map">
        百度地图
    </div>
</template>
<script>
    export default {
        name: 'baiduMap',
        data() {
            return {
                map: null
            }
        },
        mounted() {
            this.map = new BMap.Map("baidu_map");    // 创建Map实例
            this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    .baidu-map {
        height: 100%;
    }

</style>