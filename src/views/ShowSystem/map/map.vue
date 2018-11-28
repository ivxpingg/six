<template>
    <div class="baidu-map">
        <div class="map-header">

            <img class="title-logo" src="../../../assets/images/logo.png" alt="logo">
            <div class="title"> 综合展示系统</div>
            <ul class="map-btn">
                <li> <Button size="large" type="text" ghost custom-icon="iconfont icon-bianji"> 编辑 </Button></li>
                <li> <Button size="large" type="text" ghost custom-icon="iconfont icon-tianjia"> 添加 </Button> </li>
                <li> <Button size="large" type="text" ghost custom-icon="iconfont icon-wancheng"> 完成 </Button></li>
                <li> <Button size="large" type="text" ghost to="/home" custom-icon="iconfont icon-bianji"> 返回 </Button> </li>
            </ul>
        </div>
        <div class="map" id="baidu_map"></div>

        <div @mouseleave="onmouseleave"
             class="modal-list-info ivu-card ivu-card-bordered"
             v-show="cardInfo"
              :style="{top: `${cardTop}px`, left: `${cardLeft}px`}">
            <!--<div class="ivu-card-head"><p><span>项目情况</span></p></div>-->
            <div class="ivu-card-body">
                <Form >
                    <FormItem label="项目名称:">某某路改建工程</FormItem>
                    <FormItem label="建设里程:">12km</FormItem>
                    <FormItem label="建设地点:">六安市</FormItem>
                    <FormItem label="开工时间:">2018-09-06</FormItem>
                </Form>
                <div class="ivu-poptip-arrow"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import initBMap from './initBMap';
    import vCommonIcon from '@/components/commonIcon/commonIcon';
    export default {
        name: 'baiduMap',
        components: {vCommonIcon},
        data() {
            return {
                map: null,
                points: [
                    [116.440175, 31.753489],
                    [116.477544, 31.594179]
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
            });
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
                    that.cardTop = e.clientY - 170;
                    that.cardLeft = e.clientX - 125;
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
        position: relative;
        height: 100%;

        .map-header {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 70px;
            background-color: rgba(17,48,124,0.9);
            z-index: 111;

            .title-logo {
                float: left;
                margin-top: 12px;
                margin-left: 20px;
                width: 45px;
            }
            .title {
                float: left;
                padding-left: 20px;
                font-size: 30px;
                color: #01b0ff;
                font-weight: 700;
                line-height: 70px;
                letter-spacing: 8px;

            }

            .map-btn {
                float: right;
                padding-top: 18px;
                padding-right: 60px;
                li {
                    float: left;
                    margin-left: 18px;
                    .ivu-btn {
                        color: #01b0ff;
                        font-weight: 700;
                        border: none;
                        box-shadow: none;
                        &:hover, &:active {
                            color: #FFF;
                            border: none;
                        }
                    }
                }
            }
        }
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
        .ivu-form-item {
            margin-bottom: 0;
        }

        .ivu-modal-footer {
            display: none;
        }
    }

    .modal-list-info {
        .ivu-poptip-arrow {
            left: 50%;
            margin-left: -7px;
            bottom: -7px;
            border-width: 7px 7px 0;
            border-top-color: rgba(255,255,255,1);
        }
    }
</style>