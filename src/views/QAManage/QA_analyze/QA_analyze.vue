<template>
    <div class="QA_analyze-container">
        <vIvxFilterBox class="filter-box" v-if="showPanel === 'all'">
            <div class="panel" v-if="auth_add">
                <Button type="primary"
                        icon="md-add"
                        @click="modal_add_open">上传报表</Button>

                <Button type="primary"
                        to="/数据检测上传表格.xlsx"
                        icon="md-arrow-down"
                        download="数据检测上传表格.xlsx"
                        target="_blank">下载模板</Button>
            </div>
            <div class="panel title">工程质量状况分析报告</div>
            <div class="panel">
                <Form>
                    <FormItem>
                        <DatePicker :value="searchParams.dataYear"
                                    type="year"
                                    placeholder="选择时间"
                                    @on-change="onChange_dataYear"></DatePicker>
                    </FormItem>
                </Form>
            </div>
        </vIvxFilterBox>

        <vIvxFilterBox v-if="showPanel === 'project'">
            <Button type="text"
                    icon="ios-arrow-back" @click="onClick_back('all')">返回</Button>
            <Form inline>
                <FormItem>
                    <Select v-model="params_project.projectName">
                        <Option v-for="(item, idx) in projectNameList"
                                :key="idx"
                                :value="item"
                                :label="item"></Option>
                    </Select>
                </FormItem>
            </Form>
        </vIvxFilterBox>

        <vIvxFilterBox v-if="showPanel === 'detail'">
            <Button type="text"
                    icon="ios-arrow-back" @click="onClick_back('project')">返回</Button>
            <Form inline>
                <FormItem>
                    <DatePicker :value="searchParams_detail.dataYear"
                                type="year"
                                placeholder="选择时间"
                                @on-change="onChange_dataYear_detail"></DatePicker>
                </FormItem>
            </Form>
        </vIvxFilterBox>

        <vComAnalysis class="vComAnalysis"
                      v-if="showPanel === 'all'"
                      :year="searchParams.dataYear"></vComAnalysis>


        <vAddReportAnalyze ref="modal_add" @modal-callback="modal_add_callback"></vAddReportAnalyze>

        <!--项目图表详情-->
        <vProjectAnalysis v-if="showPanel === 'project'"
                          :year="searchParams.dataYear"
                          :projectName="params_project.projectName"></vProjectAnalysis>


        <!--项目表格详情-->
        <vDetailAnalysis v-if="showPanel === 'detail'"
                         :year="searchParams_detail.dataYear"
                         :projectName="params_project.projectName"></vDetailAnalysis>
    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vComAnalysis from './module/comAnalysis';
    import vAddReportAnalyze from './add/addReportAnalyze';
    import vProjectAnalysis from './module/projectAnalysis';
    import vDetailAnalysis from './module/detailAnalysis';
    import authMixin from '../../../lib/mixin/authMixin';
    export default {
        name: 'QA_analyze',
        mixins: [authMixin],
        components: {
            vIvxFilterBox,
            vComAnalysis,
            vAddReportAnalyze,
            vProjectAnalysis,
            vDetailAnalysis},
        data() {
            return {
                showPanel: 'all', // 显示的内容  all, project, detail
                searchParams: {
                    dataYear: ''
                },

                // 项目详情变量 project
                projectNameList: [],
                params_project: {
                    projectName: ''
                },

                searchParams_detail: {
                    dataYear: ''
                },
            };
        },
        created() {
            this.searchParams.dataYear = this.$moment().format('YYYY');
            this.searchParams_detail.dataYear = this.$moment().format('YYYY');
        },
        mounted() {
            this.getProjectList();
        },
        methods: {
            onClick_back(value) {
                this.showPanel = value;
            },
            onChange_dataYear(value) {
                this.searchParams.dataYear = value;
            },
            onChange_dataYear_detail(value) {
                this.searchParams_detail.dataYear = value;
            },
            modal_add_open() {
                this.$refs.modal_add.modalValue = true;
            },
            modal_add_callback() {
                this.searchParams.dataYear = '';
            },
            // 获取项目详情
            getProjectList() {
                this.$http({
                    method: 'get',
                    url: '/dataAnalysis/projectNameList'
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.projectNameList = res.data || [];
                        if (res.data && res.data.length > 0) {
                            this.params_project.projectName = res.data[0];
                        }
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .QA_analyze-container {

        .vComAnalysis {
            margin-top: 10px;
        }

    }

    .filter-box {
        display: flex;

        .panel {

            .ivu-form-item {
                margin-bottom: 0;
            }
        }

        .title {
            flex: 1;
            font-size: 24px;
            text-align: center;
            line-height: 32px;

        }
    }
</style>