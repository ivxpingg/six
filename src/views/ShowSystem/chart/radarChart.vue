<template>
    <div class="radarChart-container" ref="chart">
    </div>
</template>

<script>
    import Echarts from 'echarts';
    import baseOption from './baseOption';
    import { merge } from '@/lib/tools';
    export default {
        name: 'radarChart',
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
                    legend: {
                        show: false
                        // data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
                    },
                    xAxis: {
                        axisLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        axisLine: {
                            show: false
                        }
                    },
                    radar: {
                        // shape: 'circle',
                        radius: '70%',
                        name: {
                            textStyle: {
                                color: '#fff',
                                // borderRadius: 3,
                                // backgroundColor: '#999',
                                // padding: [3, 5]
                            }
                        },
                        indicator: [
                            { name: '指标一', max: 6500},
                            { name: '指标二', max: 16000},
                            { name: '指标三', max: 30000},
                            { name: '指标四', max: 38000},
                            { name: '指标五', max: 52000},
                            { name: '指标六', max: 25000}
                        ]
                    },
                    series: [{
                        name: '预算 vs 开销（Budget vs spending）',
                        type: 'radar',
                        data : [
                            {
                                value : [4300, 10000, 28000, 35000, 50000, 19000],
                                name : '预算分配（Allocated Budget）'
                            },
                            {
                                value : [5000, 14000, 28000, 31000, 42000, 21000],
                                name : '实际开销（Actual Spending）'
                            }
                        ]
                    }]
                };

                options = merge(true, baseOption, options);
                this.chart.setOption(options);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .radarChart-container {
        height: 100%;
    }
</style>