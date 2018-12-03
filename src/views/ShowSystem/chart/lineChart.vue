<template>
    <div class="lineChart-container" ref="chart"></div>
</template>

<script>
    import Echarts from 'echarts';
    import baseOption from './baseOption';
    import { merge } from '@/lib/tools';
    import MOMENT from 'moment';
    export default {
        name: 'lineChart',     // 项目地区分布情况
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
        watch: {
            year: {
                immediate: true,
                handler() {
                    this.getData();
                }
            }
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
                    grid: {
                        bottom: 45
                    },
                    xAxis: {
                        axisLine: {
                            show: false
                        },
                        name: '',
                        boundaryGap: true,
                        type: 'category',
                        data: [],
                        axisLabel: {
                            rotate: 45
                        }
                        // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        axisLine: {
                            show: false
                        },
                        type: 'value',
                    },
                    series: [
                        // {
                        //     data: [820, 932, 901, 934, 1290, 1330, 1320],
                        //     type: 'line',
                        //     smooth: true
                        // }
                    ]
                };

                options = merge(true, baseOption, options);
                this.chart.setOption(options);
            },
            getData() {
                this.$http({
                    method: 'get',
                    url: '/projectShow/projectAreaCount',
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

                // myOPtion.xAxis[0].data = [];
                myOPtion.series = [{
                    data: [],
                    type: 'pie',
                    smooth: true
                }];

                list.forEach(val => {
                    // myOPtion.xAxis[0].data.push(val.county);
                    // myOPtion.series[0].data.push(val.num);

                    myOPtion.series[0].data.push({
                        value: val.num,
                        name: val.county
                    });
                });

                this.chart.setOption(myOPtion);
            }

        }
    }
</script>

<style lang="scss" scoped>
    .lineChart-container {
        width: 100%;
    }
</style>