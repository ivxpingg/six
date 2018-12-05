<template>
    <div class="echarts_4-container" ref="chart">
    </div>
</template>

<script>
    import Echarts from 'echarts';
    import baseOption from './baseOption';
    import { merge } from '@/lib/tools';
    export default {
        name: 'echarts_4', // 分部工程合格率对比分析
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
                    tooltip: {},
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
                                // color: '#fff',
                                // borderRadius: 3,
                                // backgroundColor: '#999',
                                // padding: [3, 5]
                            }
                        },
                        indicator: [
                            // { name: '指标一', max: 6500},
                            // { name: '指标二', max: 16000},
                            // { name: '指标三', max: 30000},
                            // { name: '指标四', max: 38000},
                            // { name: '指标五', max: 52000},
                            // { name: '指标六', max: 25000}
                        ]
                    },
                    series: [{
                        name: '分部工程合格率对比分析',
                        type: 'radar',
                        data : [
                            // {
                            //     value : [4300, 10000, 28000, 35000, 50000, 19000],
                            //     name : '项目质量指标分析'
                            // }
                        ]
                    }]
                };

                options = merge(true, baseOption, options);
                this.chart.setOption(options);
            },
            getData() {
                this.$http({
                    method: 'get',
                    url: '/dataAnalysis/secondItemClassifyPassRate',
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
                myOPtion.radar[0].indicator = [];
                myOPtion.series[0].data = [];
                data.secondItemClassify.forEach(key => {
                    myOPtion.radar[0].indicator.push({
                        name: key,
                        max: 100
                    });
                });

                for(let k in data) {
                    if (k !== 'secondItemClassify') {

                        myOPtion.legend[0].data.push(k);

                        let series_da = {
                            value: [],
                            name: k
                        };

                        data.secondItemClassify.forEach((item, i) => {
                            series_da.value[i] = 0;
                        });


                        data[k].forEach(v => {
                            let idx_data = data.secondItemClassify.indexOf(v.secondItemClassify);

                            series_da.value[idx_data] = v.passRate;
                        });
                        myOPtion.series[0].data.push(series_da);

                    }

                }

                this.chart.setOption(myOPtion);
                this.chart.resize();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .echarts_4-container {
    }
</style>