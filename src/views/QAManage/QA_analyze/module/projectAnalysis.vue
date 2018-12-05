<template>
    <div class="projectAnalysis-container">
        <Card dis-hover>
            <p slot="title">{{projectName}}项目合格率情况</p>
            <a href="#" slot="extra" @click.prevent="onClick_detail">
                查看详情
                <Icon type="ios-more"></Icon>
            </a>
            <vEchart_project class="echart" :projectName="projectName"></vEchart_project>
        </Card>
    </div>
</template>

<script>
    import vEchart_project from '../echart/echart_project';
    export default {
        name: 'projectAnalysis',
        components: {vEchart_project},
        props: {
            chart: null,
            projectName: {
                type: String,
                default: ''
            }
        },
        data() {
            return {};
        },
        methods: {
            onClick_detail() {
                this.$parent.showPanel = 'detail';
            }
        }
    }
</script>

<style lang="scss" scoped>
    .projectAnalysis-container {
    }
</style>