<template>
    <Card shadow>
        <p slot="title">
            <Icon type="ios-stats" />
            监督工作统计
        </p>
        <div class="card-content">
            <div class="echarts"
                 ref="echarts"></div>
        </div>
    </Card>
</template>
<script>
    import Echarts from 'echarts';
    import MOMENT from 'moment';
    export default {
        name: 'supervisionCountPanel',
        data() {
            return {
                echarts: null,
                options: {
                    xAxis: [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : []
                        }
                    ],
                    series : [
                        {
                            name:'监督工作情况',
                            type:'line',
                            smooth: true,
                            areaStyle: {normal: {}},
                            data:[]
                        }
                    ]
                },

            }
        },
        watch: {
            '$store.state.app.mianLayoutWidth' () {
                 setTimeout(() => {
                     this.echarts.resize();
                 },200);
            }
        },
        mounted() {
            setTimeout(() => {
                this.initEcharts();
            }, 200);
        },
        methods: {
            initEcharts() {
                this.echarts = Echarts.init(this.$refs.echarts);
                let options = {
                    title: {
                        text: '近一周监督工作情况'
                    },
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
                        show: false
                    },
                    toolbox: {},
                    grid: {
                        left: 40,
                        right: 20,
                        bottom: 30
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
                            name:'监督工作情况',
                            type:'line',
                            smooth: true,
                            areaStyle: {normal: {}},
                            data:[120, 132, 101, 134, 90, 230, 210]
                        }
                    ]
                };

                this.echarts.setOption(options);
                this.getData();
            },
            getData() {
                this.$http({
                    method: 'get',
                    url: '/index/lastWeekSupervision'
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.setOption(res.data);
                    }
                })
            },
            setOption(list) {
                this.options.xAxis[0].data = [];
                this.options.series[0].data = [];
                list.forEach(v => {
                    let week = '';
                    switch (MOMENT(v.date).day()) {
                        case 0: week = '周日'; break;
                        case 1: week = '周一'; break;
                        case 2: week = '周二'; break;
                        case 3: week = '周三'; break;
                        case 4: week = '周四'; break;
                        case 5: week = '周五'; break;
                        case 6: week = '周六'; break;
                    }
                    this.options.xAxis[0].data.push(week);
                    this.options.series[0].data.push(v.supervisionNum);
                });

                this.echarts.setOption(this.options);
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    .card-content {
        height: 100%;
        .echarts {
            height: 100%;
        }
    }
</style>