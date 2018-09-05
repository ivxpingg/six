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
    export default {
        name: 'supervisionCountPanel',
        data() {
            return {
                echarts: null,
                options: {}
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
                        left: '3%',
                        right: '3%',
                        bottom: '3%'
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