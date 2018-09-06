<template>
    <div class="pieChart-container" ref="chart">
    </div>
</template>

<script>
    import Echarts from 'echarts';
    import baseOption from './baseOption';
    import { merge } from '@/lib/tools';
    export default {
        name: 'pieChart',
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
                        // trigger: 'item',
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
                    series: [
                        {
                            name:'访问来源',
                            type:'pie',
                            avoidLabelOverlap: false,
                            radius : '55%',
                            // label: {
                            //     normal: {
                            //         show: false,
                            //         position: 'center'
                            //     },
                            //     emphasis: {
                            //         show: true,
                            //         textStyle: {
                            //             fontWeight: 'bold'
                            //         }
                            //     }
                            // },
                            // labelLine: {
                            //     normal: {
                            //         show: false
                            //     }
                            // },
                            data:[
                                {value:335, name:'直接访问'},
                                {value:310, name:'邮件营销'},
                                {value:234, name:'联盟广告'},
                                {value:135, name:'视频广告'},
                                {value:1548, name:'搜索引擎'}
                            ]
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
    .pieChart-container {
        height: 100%;
    }
</style>