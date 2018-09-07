<template>
    <div class="areaChart-container" ref="chart">
    </div>
</template>

<script>
    import Echarts from 'echarts';
    import baseOption from './baseOption';
    import { merge } from '@/lib/tools';
    export default {
        name: 'areaChart',
        data() {
            return {
                chart: null
            };
        },
        watch: {
            '$store.state.app.htmlClientWidth'() {
                this.chart.resize();
            }
        },
        mounted() {
            this.initChart();
        },
        methods: {
            initChart() {
                this.chart = Echarts.init(this.$refs.chart);
                let options = {
                    grid: {
                      bottom: 10
                    },
                    xAxis: {
                        show: false,
                        type: 'category',
                        boundaryGap: false,
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320],
                        type: 'line',
                        smooth: true,
                        areaStyle: {}
                    }]
                };

                options = merge(true, baseOption, options);
                this.chart.setOption(options);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .areaChart-container {
        height: 100%;
    }
</style>