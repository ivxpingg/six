<template>
    <div class="comAnalysis-container">
        <Row :gutter="20">
            <i-col span="4"
                   v-for="(infor, i) in inforCardData"
                   :key="`infor-${i}`"
                   style="height: 120px;">
                <vInfoCard shadow
                           :color="infor.color"
                           :style="{ background: infor.bgColor || '#FFF' }"
                           :left="0"
                           :icon="infor.icon"
                           :icon-size="36">
                    <vCountTo :end="infor.count" class="six-count-style" count-class="count-style"/>
                    <p style="color: #FFF;">{{ infor.title }}</p>
                </vInfoCard>
                <div class="click-dom"
                     :style="{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        cursor: 'pointer',
                        'z-index': 11
                     }"
                     @click="onClick_vInfoCard" v-if="i === 0" ></div>
            </i-col>
        </Row>

        <Row class="row-box" :gutter="20">
            <i-col span="8">
                <Card dis-hover>
                    <p slot="title">质量检测样本分布分析</p>
                    <vEcharts_1 class="echart" :year="year"></vEcharts_1>
                </Card>
            </i-col>
            <i-col span="16">
                <Card dis-hover>
                    <p slot="title">区域年度合格率变化趋势</p>
                    <vEcharts_2 class="echart" :year="year"></vEcharts_2>
                </Card>
            </i-col>
            <i-col span="16">
                <Card dis-hover>
                    <p slot="title">项目整体合格率同比分析</p>
                    <vEcharts_3 class="echart" :year="year"></vEcharts_3>
                </Card>
            </i-col>
            <i-col span="8">
                <Card dis-hover>
                    <p slot="title">分部工程合格率对比分析</p>
                    <vEcharts_4 class="echart" :year="year"></vEcharts_4>
                </Card>
            </i-col>
            <i-col span="24">
                <Card dis-hover>
                    <p slot="title">抽查项目合格率同期对比情况分析</p>
                    <vEcharts_5 :year="year"></vEcharts_5>
                </Card>
            </i-col>
        </Row>
    </div>
</template>

<script>
    import vInfoCard from '../../../../components/info-card';
    import vCountTo from '../../../../components/count-to';
    import vEcharts_1 from '../echart/echarts_1';
    import vEcharts_2 from '../echart/echarts_2';
    import vEcharts_3 from '../echart/echarts_3';
    import vEcharts_4 from '../echart/echarts_4';
    import vEcharts_5 from '../echart/echarts_5';
    export default {
        name: 'comAnalysis',  // 综合分析
        props: {
            year: {
                type: String,
                default: ''
            },
        },
        components: {
            vInfoCard,
            vCountTo,
            vEcharts_1,
            vEcharts_2,
            vEcharts_3,
            vEcharts_4,
            vEcharts_5
        },
        data() {
            return {
                inforCardData: [
                    {
                        color: 'red',
                        icon: '',
                        count: 10,
                        title: '质量检测项目数量',
                        bgColor: 'rgb(45, 140, 240)'
                    },
                    {
                        color: 'red',
                        icon: '',
                        count: 10,
                        title: '平均质量合格率',
                        bgColor: 'rgb(45, 140, 240)'
                    },
                    {
                        color: 'red',
                        icon: '',
                        count: 10,
                        title: '抽检数据组',
                        bgColor: 'rgb(25, 190, 107)'
                    },
                    {
                        color: 'red',
                        icon: '',
                        count: 10,
                        title: '质量检测公里数',
                        bgColor: 'rgb(25, 190, 107)'
                    },
                    {
                        color: 'red',
                        icon: '',
                        count: 10,
                        title: '合格率上期同比',
                        bgColor: 'rgb(154, 102, 228)'
                    },
                    {
                        color: 'red',
                        icon: '',
                        count: 10,
                        title: '数据组样本同比',
                        bgColor: 'rgb(154, 102, 228)'
                    },
                ]
            };
        },
        watch: {
            year(val) {
                this.getBaseInfo();
            }
        },
        mounted() {
            this.getBaseInfo();
        },
        methods: {
            onClick_vInfoCard(){
                this.$parent.showPanel = 'project';
            },

            getBaseInfo() {
                this.$http({
                    method: 'get',
                    url: '/dataAnalysis/baseDataCount',
                    params: {
                        year: this.year
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.inforCardData[0].count = res.data.projectNum || 0;
                        this.inforCardData[1].count = res.data.averagePassRate || 0;
                        this.inforCardData[2].count = res.data.spotCheckNum || 0;

                        this.inforCardData[4].count = res.data.passRateYearOnYear || 0;
                        this.inforCardData[5].count = res.data.numYearOnYear || 0;
                    }
                });


                // 基础信息统计（从业单位数量、从业人员数量、在建项目个数、交竣工项目个数、建设里程、监督工作人次）
                this.$http({
                    method: 'get',
                    url: '/index/baseInfoCount'
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.inforCardData[3].count = res.data.mileageCount || 0;
                    }
                });
            }
        }
    }
</script>

<style lang="scss" >
    .comAnalysis-container {
        .count-style {
            font-size: 36px;
            color: #FFF;
        }
    }

    .row-box {
        .ivu-col {
            position: relative;
            margin-top: 20px;

            .ivu-card-head {
                padding: 8px 16px;
            }

            .echart {
                height: 300px;
            }
        }

        .click-dom {

        }
    }
</style>