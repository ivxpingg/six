<template>
    <div class="radarChart-container" ref="chart">
    </div>
</template>

<script>
    import Echarts from 'echarts';
    import baseOption from './baseOption';
    import { merge } from '@/lib/tools';
    import MOMENT from 'moment';
    export default {
        name: 'radarChart',
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
            '$store.state.app.htmlClientWidth'() {
                this.chart.resize();
            },
            year: {
                immediate: true,
                handler() {
                    this.getData();
                }
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
                        show: false
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
                                color: '#fff',
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
                        name: '项目质量指标分析',
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
                    url: '/projectShow/projectQualityCount',
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
                myOPtion.radar[0].indicator = [];

                data.qualityIndexList.forEach(val => {
                    myOPtion.radar[0].indicator.push({
                        name: val,
                        max: data.maxQualityIndex[val] ? data.maxQualityIndex[val] : 1
                    });


                });

                myOPtion.series = {
                    name: '项目质量指标分析',
                    type: 'radar',
                    data: []
                };
                for(let key in data.list) {
                    let da = {
                        value: [],
                        name: key
                    };

                    data.qualityIndexList.forEach(i => {
                        da.value.push(0);
                    });

                    data.list[key].forEach(v => {
                        let idx = data.qualityIndexList.indexOf(v.qualityIndex);
                        if (idx > -1) {
                            da.value[idx] = v.num;
                        }
                    });

                    myOPtion.series.data.push(da);
                }


                this.chart.setOption(myOPtion);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .radarChart-container {
        height: 100%;
    }
</style>