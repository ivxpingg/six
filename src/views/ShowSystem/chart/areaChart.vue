<template>
    <div class="areaChart-container" ref="chart">
    </div>
</template>

<script>
    import Echarts from 'echarts';
    import baseOption from './baseOption';
    import { merge } from '@/lib/tools';
    import MOMENT from 'moment';
    export default {
        name: 'areaChart',
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
        },
        methods: {
            initChart() {
                this.chart = Echarts.init(this.$refs.chart);
                let options = {
                    grid: {
                      bottom: 10
                    },
                    tooltip: {
                        trigger: 'axis',
                    },
                    xAxis: {
                        show: false,
                        type: 'category',
                        boundaryGap: false,
                        data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320],
                        type: 'line',
                        smooth: true,
                        areaStyle: {}
                    }]
                };

                options = merge(true, baseOption, options);
                this.chart.setOption(options);
            },
            getData() {
                this.$http({
                    method: 'get',
                    url: '/projectShow/supervisorWorkCount',
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

                myOPtion.series = [];

                for(let name in data.checkTypeList) {
                    
                }
                data.checkTypeList.forEach(name => {
                    myOPtion.series.push({
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        name: name,
                        type:'line',
                        areaStyle: {},
                        smooth: true
                    });
                });


                for(let key in data.list) {
                    let month = MOMENT(key).month();
                    data.list[key].forEach(val => {
                        let series_idx = data.checkTypeList.indexOf(val.checkType);

                        myOPtion.series[series_idx].data[month] = val.num;
                    })
                }
                //
                // data.list.forEach(val => {
                //     let month = MOMENT(val).month();
                //
                //
                //
                //     myOPtion.series[0].data.push({
                //         value: val.num,
                //         name: val.checkWay
                //     });
                // });
                
                this.chart.setOption(myOPtion);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .areaChart-container {
        height: 100%;
    }
</style>