<template>
    <div class="baidu-map">
        <div class="map" id="baidu_map"></div>

        <div @mouseleave="onmouseleave"
             class="modal-list-info ivu-card ivu-card-bordered"
             v-show="cardInfo"
              :style="{top: `${cardTop}px`, left: `${cardLeft}px`}">
            <div class="ivu-card-head"><p><span>项目情况</span></p></div>
            <div class="ivu-card-body">
                <Form >
                    <FormItem label="项目名称:">某某路改建工程</FormItem>
                    <FormItem label="建设里程:">12km</FormItem>
                    <FormItem label="建设地点:">六安市</FormItem>
                    <FormItem label="开工时间:">2018-09-06</FormItem>
                </Form>
            </div>
        </div>
    </div>
</template>
<script>
    import initBMap from './initBMap';
    export default {
        name: 'baiduMap',
        data() {
            return {
                map: null,
                points: [
                    [116.440175,31.753489],
                    [116.477544,31.594179]
                ],
                cardInfo: false,
                cardLeft: 0,
                cardTop: 0
            }
        },
        mounted() {
            initBMap('baidu_map').then((m) => {
                this.map = m;
                this.setPoint();
            })
        },
        methods: {
            setPoint() {
                this.points.forEach((v) => {
                    let point = new BMap.Point(v[0], v[1]);
                    let marker = new BMap.Marker(point);  // 创建标注
                    this.map.addOverlay(marker);               // 将标注添加到地图中
                    this.setPointEvent(marker);
                });
            },
            setPointEvent(marker) {
                let that = this;
                marker.addEventListener('mouseover', function (e) {
                    that.cardTop = e.clientY-5;
                    that.cardLeft = e.clientX-5;
                    that.cardInfo = true;
                });
            },
            onmouseleave() {
                this.cardInfo = false;
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    .baidu-map {
        height: 100%;
        .map {
            height: 100%;
        }
    }
</style>
<style lang="scss">
    // 去掉百度地图Logo
    .anchorBL {
        display: none;
    }

    .modal-list-info {
        position: absolute;
        top: 0;
        left: 0;
        min-width: 250px;
        background-color: #FFF;
        z-index: 10;
        overflow: hidden;
        .ivu-form-item {
            margin-bottom: 0;
        }

        .ivu-modal-footer {
            display: none;
        }
    }
</style>