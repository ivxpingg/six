<template>
    <div class="lineChart-container" ref="chart"></div>
</template>

<script>
    import Echarts from 'echarts';
    import baseOption from './baseOption';
    import { merge } from '@/lib/tools';
    export default {
        name: 'lineChart',
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
                    tooltip: {
                        trigger: 'item',
                    },
                    xAxis: {
                        name: '',
                        boundaryGap: false,
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
                            type: 'line',
                            smooth: true
                        },
                        {
                            data: [890, 1100, 1020, 1000, 1500, 1652, 1741],
                            type: 'line',
                            smooth: true
                        }
                    ]
                };

                options = merge(true, baseOption, options);
                this.chart.setOption(options);
            },
            getData() {
                this.$http({
                    method: 'get',
                    url: ''
                }).then(res => {
                    if (res.code === 'SUCCESS') {

                    }
                })
            },

        }
    }
</script>

<style lang="scss" scoped>
    .lineChart-container {
        width: 100%;
    }
</style>