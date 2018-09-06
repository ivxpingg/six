<template>
    <div class="baidu-map">
        <div class="map" id="baidu_map"></div>

        <Modal class="modal-list-info"
               v-model="modalInfo"
               :width= "260"
               title="项目情况" >
            <Form>
                <FormItem label="项目名称:">某某路改建工程</FormItem>
                <FormItem label="建设里程:">12km</FormItem>
                <FormItem label="建设地点:">六安市</FormItem>
                <FormItem label="开工时间:">2018-09-06</FormItem>
            </Form>
            <div slot="footer"></div>
        </Modal>
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
                modalInfo: false
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
                marker.addEventListener('click', function () {
                    that.modalInfo = true;
                });
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
        .ivu-form-item {
            margin-bottom: 0;
        }

        .ivu-modal-footer {
            display: none;
        }
    }
</style>