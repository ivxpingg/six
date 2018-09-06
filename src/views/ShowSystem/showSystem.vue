<template>
    <div class="showSystem-container">
        <div class="showSystem-container-innner">
            <div class="title">综合展示系统</div>
            <vMap class="v-map"> </vMap>

            <div class="card-box left-panel">
                <Card class="chart-card lines-chart-card">
                    <p slot="title">监督工作统计</p>
                    <vLineCharts class="line-chart"></vLineCharts>
                </Card>
                <Card class="chart-card lines-chart-card">
                    <p slot="title">监督工作统计</p>
                    <vDoughnutChart class="line-chart"></vDoughnutChart>
                </Card>
            </div>

            <div class="card-box right-panel">
                <Card class="chart-card lines-chart-card">
                    <p slot="title">监督工作统计</p>
                    <vBarCharts class="line-chart"></vBarCharts>
                </Card>
                <Card class="chart-card lines-chart-card">
                    <p slot="title">监督工作统计</p>
                    <vRadarChart class="line-chart"></vRadarChart>
                </Card>
            </div>

            <div class="card-box bottom-panel">
                <div class="bt-left">
                    <Card class="chart-card line-chart-card">
                        <p slot="title">用户活跃度统计</p>
                        <vAreaChart class="line-chart"></vAreaChart>
                    </Card>
                </div>
                <div class="bt-right">
                    <Card class="chart-card line-chart-card">
                        <p slot="title">用户活跃度统计</p>
                        <vPieChart class="line-chart"></vPieChart>
                    </Card>
                </div>
            </div>

        </div>

    </div>
</template>
<script>
    import vMap from './map/map.vue';
    import vLineCharts from './chart/lineChart';
    import vBarCharts from './chart/barChart';
    import vRadarChart from  './chart/radarChart';
    import vDoughnutChart from  './chart/doughnutChart';
    import vPieChart from './chart/pieChart';
    import vAreaChart from './chart/areaChart';
    export default {
        name: 'showSystem',
        components: {
            vMap,
            vLineCharts,
            vBarCharts,
            vRadarChart,
            vDoughnutChart,
            vPieChart,
            vAreaChart
        },
        data() {
            return {}
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss">
    $height: 60px;
    .showSystem-container {
        position: relative;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        user-select: none;
        .showSystem-container-innner {
            position: relative;
            height: 100%;
            min-height: 850px;

            >.title {
                position: absolute;
                top: 0;
                left: 50%;
                margin-left: -130px;
                width: 260px;
                height: $height;
                color: #FFF;
                font-size: 26px;
                line-height: $height;
                text-align: center;
                background-color: rgba(255,255,255,0.2);
                z-index: 2;

                &:before {
                    position: absolute;
                    display: block;
                    top: 0;
                    left: -$height * 2;
                    content: " ";
                    width: 0;
                    height: 0;
                    border-width: $height / 2 $height;
                    border-style: solid;
                    border-color: rgba(255,255,255,0.2) rgba(255,255,255,0.2) transparent transparent;
                }
                &:after {
                    position: absolute;
                    display: block;
                    top: 0;
                    right: -$height * 2;
                    content: " ";
                    width: 0;
                    height: 0;
                    border-width: $height / 2 $height;
                    border-style: solid;
                    border-color: rgba(255,255,255,0.2) transparent transparent rgba(255,255,255,0.2);
                }
            }
        }

        .card-box {
            position: absolute;
            &.left-panel {
                left: 10px;
                bottom: 270px;
                .ivu-card {
                    margin-top: 10px;
                }
            }

            &.right-panel {
                right: 10px;
                bottom: 270px;
                .ivu-card {
                    margin-top: 10px;
                }
            }

            &.bottom-panel {
                left: 10px;
                right: 10px;
                bottom: 10px;
                display: flex;
                .bt-left {
                    flex: 1;
                    height: 100%;
                }
                .bt-right {
                    margin-left: 10px;
                    width: 314px;
                    height: 100%;
                }
            }


        }

        .chart-card {
            background-color: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.4);

            .ivu-card-head {
                padding: 6px;
                background-color: rgba(255,255,255,0.1);
                border-bottom: 1px solid rgba(255,255,255,0.4);
                p {
                    color: #FFCC33;
                }
            }

            .ivu-card-body {
                padding: 6px;
            }
        }

        .lines-chart-card {
            .line-chart {
                width: 300px;
                height: 200px;
            }
        }

        .line-chart-card {
            .line-chart {
                width: 100%;
                height: 200px;
            }
        }
    }
</style>