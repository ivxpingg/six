<template>
    <div class="echart_project-container"  ref="chart">

    </div>
</template>

<script>
    import Echarts from 'echarts';
    import baseOption from './baseOption';
    import { merge } from '@/lib/tools';
    export default {
        name: 'echart_project',
        props: {
            projectName: {
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
            projectName: {
                immediate: true,
                handler(val) {
                    if (val !== '') {
                        this.getData();
                    }
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
                    legend: {
                        top: 0,
                        right: 0,
                        data: []
                    },
                    tooltip: {},
                    grid: {
                        bottom: 140
                    },
                    xAxis: {
                        name: '',
                        type: 'category',
                        data: [],
                        axisLabel: {
                            rotate: 45
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: '合格率',
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
                    method: 'post',
                    url: '/dataAnalysis/projectItemTypePassRate',
                    data: JSON.stringify({
                        projectName: this.projectName,
                        year: this.year
                    })
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

                        if (myOPtion.xAxis[0].data.indexOf(val.itemType) === -1) {
                            myOPtion.xAxis[0].data.push(val.itemType);
                        }

                    })
                }

                for (let key in data) {
                    let idx_series = keys.indexOf(key);


                    myOPtion.xAxis[0].data.forEach((v, i) => {
                        myOPtion.series[idx_series].data[i] = 0;
                    });

                    data[key].forEach(val => {
                        let idx_data = myOPtion.xAxis[0].data.indexOf(val.itemType);

                        myOPtion.series[idx_series].data[idx_data] = val.passRate;
                    })
                }

                this.chart.setOption(myOPtion, true);
                this.chart.resize();
            }
        }
    }
</script>

<style lang="scss">
    .echart_project-container {
        height: 450px;
    }
</style>