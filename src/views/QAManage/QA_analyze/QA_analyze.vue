<template>
    <div class="QA_analyze-container">
        <Row :gutter="10">
            <i-col :span="8">
                <Card style="height:300px; margin-bottom: 10px;">
                    <div class="echart" ref="echart1"></div>
                </Card>
            </i-col>
            <i-col :span="8">
                <Card style="height:300px; margin-bottom: 10px;">
                    <div class="echart" ref="echart2"></div>
                </Card>
            </i-col>
            <i-col :span="8">
                <Card style="height:300px; margin-bottom: 10px;">
                    <div class="echart" ref="echart3"></div>
                </Card>
            </i-col>
            <i-col :span="12">
                <Card style="height:300px">
                    <div class="echart" ref="echart4"></div>
                </Card>
            </i-col>
            <i-col :span="12">
                <Card style="height:300px">
                    <div class="echart" ref="echart5"></div>
                </Card>
            </i-col>
        </Row>
    </div>
</template>

<script>
    import Echarts from 'echarts';
    export default {
        name: 'QA_analyze',  // 质量安全检测数据分析
        data() {
            return {};
        },
        mounted() {
            this.test1();
            this.test2();
            this.test3();
            this.test4();
            this.test5();
        },
        methods: {
            test1() {
                let myChart = Echarts.init(this.$refs.echart1);
                let option = {
                    title: {
                      //  text: '基础雷达图'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '25'
                    },
                    tooltip: {},
                    legend: {
                        data: ['预算分配', '实际开销']
                    },
                    radar: {
                        // shape: 'circle',
                        radius: '60%',
                        indicator: [
                            { name: '销售', max: 6500},
                            { name: '管理', max: 16000},
                            { name: '信息技术', max: 30000},
                            { name: '客服', max: 38000},
                            { name: '研发', max: 52000},
                            { name: '市场', max: 25000}
                        ]
                    },
                    series: [{
                        name: '预算 vs 开销（Budget vs spending）',
                        type: 'radar',

                        // areaStyle: {normal: {}},
                        data : [
                            {
                                value : [4300, 10000, 28000, 35000, 50000, 19000],
                                name : '预算分配'
                            },
                            {
                                value : [5000, 14000, 28000, 31000, 42000, 21000],
                                name : '实际开销'
                            }
                        ]
                    }]
                };
                myChart.setOption(option);
            },
            test2() {
                let myChart = Echarts.init(this.$refs.echart2);
                let option = option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    // legend: {
                    //     orient: 'vertical',
                    //     x: 'left',
                    //     data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                    // },
                    series: [
                        {
                            name:'访问来源',
                            type:'pie',
                            // radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            // label: {
                            //     normal: {
                            //         show: false,
                            //         position: 'center'
                            //     },
                            //     emphasis: {
                            //         show: true,
                            //         textStyle: {
                            //             fontSize: '30',
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

                myChart.setOption(option);
            },
            test3() {
                let myChart = Echarts.init(this.$refs.echart3);
                let option = {
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '25',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : ['周一','周二','周三','周四','周五','周六','周日']
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'邮件营销',
                            type:'line',
                            stack: '总量',
                            areaStyle: {},
                            data:[120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name:'联盟广告',
                            type:'line',
                            stack: '总量',
                            areaStyle: {},
                            data:[220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name:'视频广告',
                            type:'line',
                            stack: '总量',
                            areaStyle: {},
                            data:[150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                            name:'直接访问',
                            type:'line',
                            stack: '总量',
                            areaStyle: {normal: {}},
                            data:[320, 332, 301, 334, 390, 330, 320]
                        },
                        {
                            name:'搜索引擎',
                            type:'line',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            areaStyle: {normal: {}},
                            data:[820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                };
                myChart.setOption(option);
            },
            test4() {
                let myChart = Echarts.init(this.$refs.echart4);
                let colors = ['#5793f3', '#d14a61', '#675bba'];
                let option = {
                    color: colors,

                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
                    grid: {
                        right: '20%'
                    },
                    legend: {
                        data:['蒸发量','降水量','平均温度']
                    },
                    xAxis: [
                        {
                            type: 'category',
                            axisTick: {
                                alignWithLabel: true
                            },
                            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '蒸发量',
                            min: 0,
                            max: 250,
                            position: 'right',
                            axisLine: {
                                lineStyle: {
                                    color: colors[0]
                                }
                            },
                            axisLabel: {
                                formatter: '{value} ml'
                            }
                        },
                        {
                            type: 'value',
                            name: '降水量',
                            min: 0,
                            max: 250,
                            position: 'right',
                            offset: 80,
                            axisLine: {
                                lineStyle: {
                                    color: colors[1]
                                }
                            },
                            axisLabel: {
                                formatter: '{value} ml'
                            }
                        },
                        {
                            type: 'value',
                            name: '温度',
                            min: 0,
                            max: 25,
                            position: 'left',
                            axisLine: {
                                lineStyle: {
                                    color: colors[2]
                                }
                            },
                            axisLabel: {
                                formatter: '{value} °C'
                            }
                        }
                    ],
                    series: [
                        {
                            name:'蒸发量',
                            type:'bar',
                            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                        },
                        {
                            name:'降水量',
                            type:'bar',
                            yAxisIndex: 1,
                            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                        },
                        {
                            name:'平均温度',
                            type:'line',
                            yAxisIndex: 2,
                            data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                        }
                    ]
                };
                myChart.setOption(option);
            },
            test5() {
                let myChart = Echarts.init(this.$refs.echart5);
                let option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['2011年', '2012年']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '25',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    },
                    yAxis: {
                        type: 'category',
                        data: ['巴西','印尼','美国','印度','中国','世界人口(万)']
                    },
                    series: [
                        {
                            name: '2011年',
                            type: 'bar',
                            data: [18203, 23489, 29034, 104970, 131744, 630230]
                        },
                        {
                            name: '2012年',
                            type: 'bar',
                            data: [19325, 23438, 31000, 121594, 134141, 681807]
                        }
                    ]
                };

                myChart.setOption(option);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .QA_analyze-container {
        .echart {
            height: 300px;
        }
    }
</style>