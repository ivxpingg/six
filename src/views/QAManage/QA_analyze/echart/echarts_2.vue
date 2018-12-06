<template>
    <div class="echarts_2-container" ref="chart">
    </div>
</template>

<script>
    import Echarts from 'echarts';
    import baseOption from './baseOption';
    import { merge } from '@/lib/tools';
    export default {
        name: 'echarts_2',  //  区域年度合格率变化趋势
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
                    legend: {
                        top: 0,
                        right: 0,
                        data: []
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        name: '',
                        type: 'category',
                        // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        data: []
                    },
                    yAxis: {
                        type: 'value',
                        name: '合格率',
                        max: 100
                    },
                    series: [
                        // {
                        //     data: [820, 932, 901, 934, 1290, 1330, 1320],
                        //     type: 'bar',
                        //     smooth: true
                        // },
                        // {
                        //     data: [890, 1100, 1020, 1000, 1500, 1652, 1741],
                        //     type: 'bar',
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
                    url: '/dataAnalysis/areaPassRate',
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
                myOPtion.legend[0].data = [];
                myOPtion.xAxis[0].data = [];
                myOPtion.series = [];

                let keys = [];

                for (let key in data) {
                    myOPtion.legend[0].data.push(key);
                    keys.push(key);
                    myOPtion.series.push({
                        data: [],
                        type: 'bar',
                        name: key
                    });

                    data[key].forEach(val => {

                        if (myOPtion.xAxis[0].data.indexOf(val.regionName) === -1) {
                            myOPtion.xAxis[0].data.push(val.regionName);
                        }

                    })
                }

                for (let key in data) {
                    let idx_series = keys.indexOf(key);


                    myOPtion.xAxis[0].data.forEach((v, i) => {
                        myOPtion.series[idx_series].data[i] = 0;
                    });

                    data[key].forEach(val => {
                        let idx_data = myOPtion.xAxis[0].data.indexOf(val.regionName);

                        myOPtion.series[idx_series].data[idx_data] = val.avgPassRate;
                    })
                }

                this.chart.setOption(myOPtion);
                this.chart.resize();

            }
        }
    }
</script>

<style lang="scss" scoped>
    .echarts_2-container {
    }
</style>