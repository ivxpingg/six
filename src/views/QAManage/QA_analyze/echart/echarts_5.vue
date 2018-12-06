<template>
    <div class="echarts_5-container">
        <Row :gutter="16">
            <i-col span="14">
                <div class="chart" ref="chart" :style="{height: `${eheight}px`}"></div>
            </i-col>
            <i-col span="10">
                <Table border
                       size="small"
                       :loading="tableLoading"
                       :columns="tableColumns"
                       :data="tableData"></Table>
            </i-col>
        </Row>
    </div>
</template>

<script>
    import Echarts from 'echarts';
    import baseOption from './baseOption';
    import { merge } from '@/lib/tools';
    export default {
        name: 'echarts_5', //  抽查项目合格率同期对比情况分析
        props: {
            year: {
                type: String,
                default: ''
            }
        },
        computed: {},
        data() {
            return {
                chart: null,

                tableColumns: [
                    { title: '分部工程类别', minWidth: 110, align: 'center', key: 'secondItemClassify' },
                    { title: '抽查项目', minWidth: 100, align: 'center', key: 'itemType' },
                    { title: '上年度', width: 75, align: 'center', key: 'lastPassRate' },
                    { title: '本年度', width: 75, align: 'center', key: 'passRate' },
                    { title: '-', width: 80, align: 'center', key: 'yearOnYear',
                        render: (h, params) => {

                            if (params.row.yearOnYear) {
                                let value = params.row.yearOnYear;
                                if (value > 0) {
                                    return h('div',{
                                        style: {
                                            color: 'rgb(25, 190, 107)'
                                        }
                                    }, [
                                        h('Icon', {
                                            props: {
                                                type: 'md-arrow-up'
                                            }
                                        }),
                                        h('span', value)
                                    ])
                                }
                                else if (value === 0) {
                                    return h('div', '-');
                                }
                                else {
                                    return h('div',{
                                        style: {
                                            color: 'red'
                                        }
                                    }, [
                                        h('Icon', {
                                            props: {
                                                type: 'md-arrow-down'
                                            }
                                        }),
                                        h('span', Math.abs(value))
                                    ])
                                }
                            }
                        }
                    },
                ],
                tableData: [],
                tableLoading: false,

                eheight: 300
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
                    grid: {
                        top: 20,
                        left: 180,
                        bottom: 40,
                        right: 60,
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'value',
                        name: '合格率',
                        max: 100
                    },
                    yAxis: {
                        name: '',
                        type: 'category',
                        // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        data: [],
                        interval: 0,
                        axisLabel:{

                            interval:0

                        }
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
                    url: '/dataAnalysis/itemTypePassRate',
                    params: {
                        year: this.year
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.resetOption(res.data.yearList);
                        this.resetTableData(res.data.detailList);
                    }
                })
            },
            resetOption(data) {
                let myOPtion = this.chart.getOption();
                myOPtion.legend[0].data = [];
                myOPtion.yAxis[0].data = [];
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

                        if (myOPtion.yAxis[0].data.indexOf(val.itemType) === -1) {
                            myOPtion.yAxis[0].data.push(val.itemType);
                        }

                    })
                }


                this.eheight = (myOPtion.yAxis[0].data.length * 50) < this.eheight ? 300 : myOPtion.yAxis[0].data.length * 50;

                for (let key in data) {
                    let idx_series = keys.indexOf(key);


                    myOPtion.yAxis[0].data.forEach((v, i) => {
                        myOPtion.series[idx_series].data[i] = 0;
                    });

                    data[key].forEach(val => {
                        let idx_data = myOPtion.yAxis[0].data.indexOf(val.itemType);

                        myOPtion.series[idx_series].data[idx_data] = val.passRate;
                    })
                }

                setTimeout(() => {
                    this.chart.setOption(myOPtion);
                    this.chart.resize();
                }, 100);

            },

            resetTableData(data) {
                this.tableData = data || [];
            }
        }
    }
</script>

<style lang="scss" scoped>
    .echarts_5-container {

        .chart {
            height: 600px;
            border-right: 1px solid #dcdee2;
        }
    }
</style>