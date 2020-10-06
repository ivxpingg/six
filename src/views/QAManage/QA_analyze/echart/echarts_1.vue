<template>
    <div class="echarts_1-container" ref="chart">
    </div>
</template>

<script>
    import Echarts from 'echarts';
    import baseOption from './baseOption';
    import { merge } from '@/lib/tools';
    export default {
        name: 'echarts_1', // 质量检测样本分布分析
        props: {
            year: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                chart: null
            };
        },
        watch: {
            '$store.state.app.htmlClientWidth'() {
                this.chart.resize();
            },
            '$store.state.app.mianLayoutWidth'() {
                this.chart.resize();
            },
            year(val) {
                this.getData();
            }
        },
        mounted() {
            this.initChart();
            this.getData();
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
                            name: '质量检测样本分布',
                            type: 'pie',
                            avoidLabelOverlap: false,
                            radius: ['45%', '65%'],

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
                            data: [
                                // {value:335, name:'直接访问'},
                                // {value:310, name:'邮件营销'},
                                // {value:234, name:'联盟广告'},
                                // {value:135, name:'视频广告'},
                                // {value:1548, name:'搜索引擎'}
                            ]
                        }
                    ]
                };

                options = merge(true, baseOption, options);
                this.chart.setOption(options);
            },
            getData() {
                this.$http({
                    method: 'get',
                    url: '/dataAnalysis/areaDistribution',
                    params: {
                        year: this.year
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.resetOption(res.data);
                    }
                })
            },
            resetOption(data) {
                let myOPtion = this.chart.getOption();

                myOPtion.series[0].data = [];

                data.forEach(val => {
                    myOPtion.series[0].data.push({
                        value: val.num,
                        name: val.regionName
                    })
                });


                this.chart.setOption(myOPtion);
                this.chart.resize();

            }
        }
    }
</script>

<style lang="scss" scoped>
    .echarts_1-container {
        width: 100%;
    }
</style>