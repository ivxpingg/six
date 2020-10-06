<template>
    <div class="pieChart-container" ref="chart">
    </div>
</template>

<script>
    import Echarts from 'echarts';
    import baseOption from './baseOption';
    import { merge } from '@/lib/tools';
    import MOMENT from 'moment';
    export default {
        name: 'pieChart',
        props: {
            year: {
                type: String,
                default: MOMENT().format('YYYY')
            }
        },
        data() {
            return {
                chart: null
            };
        },
        mounted() {
            this.initChart();
        },
        watch: {
            year: {
                immediate: true,
                handler() {
                    this.getData();
                }
            }
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
                            name:'督察类型分析',
                            type:'pie',
                            avoidLabelOverlap: false,
                            radius : ['45%', '65%'],

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
                    url: '/projectShow/checkWayCount',
                    params: {
                        year: this.year
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.resetOption(res.data);
                    }
                })
            },
            resetOption(list) {
                let myOPtion = this.chart.getOption();

                myOPtion.series[0].data = [];

                list.forEach(val => {
                    myOPtion.series[0].data.push({
                        value: val.num,
                        name: val.checkWay
                    });
                });

                this.chart.setOption(myOPtion);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .pieChart-container {
        height: 100%;
    }
</style>