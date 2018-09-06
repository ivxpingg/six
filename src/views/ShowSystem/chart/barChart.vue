<template>
    <div class="barChart-container" ref="chart">
    </div>
</template>

<script>
    import Echarts from 'echarts';
    import baseOption from './baseOption';
    import { merge } from '@/lib/tools';
    export default {
        name: 'barChart',
        data() {
                return {
                    chart: null
                };
            },
            mounted() {
                this.initChart();
            },
            methods: {
                initChart() {
                    this.chart = Echarts.init(this.$refs.chart);
                    let options = {
                        xAxis: {
                            name: '',
                            type: 'category',
                            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        },
                        yAxis: {
                            type: 'value',
                            name: '蒸发量',
                        },
                        series: [
                            {
                                data: [820, 932, 901, 934, 1290, 1330, 1320],
                                type: 'bar',
                                smooth: true
                            },
                            {
                                data: [890, 1100, 1020, 1000, 1500, 1652, 1741],
                                type: 'bar',
                                smooth: true
                            }
                        ]
                    };

                    options = merge(true, baseOption, options);
                    this.chart.setOption(options);
                }
        }
    }
</script>

<style lang="scss" scoped>
    .barChart-container {
        width: 100%;
    }
</style>