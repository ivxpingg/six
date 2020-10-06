<template>
    <div class="processSteps-container">
        <Steps :current="current" :direction="direction">
            <Step v-for="item in dataSet" :key="item.processStepId" :title="item.name">
                <div class="ivu-steps-content" v-show="item.list">
                    <div v-for="list in item.list" :key="`${list.insTime}`">
                        <span class="content">{{list.name}}</span>
                        <span class="content">{{transformTime(list.insTime)}}</span>
                        <span class="content" :class="list.auditResult">{{transformResult(list.auditResult)}}</span>
                    </div>
                </div>
            </Step>


            <!--<Step title="已完成">-->
                <!--<div class="ivu-steps-content">wer3rregtegdfsfe4w</div>-->
            <!--</Step>-->
            <!--<Step title="进行中" content="这里是该步骤的描述信息">-->
                <!--<div>wer3rregtegdfsfe4w</div>-->
            <!--</Step>-->
            <!--<Step title="待进行" content="这里是该步骤的描述信息"></Step>-->
            <!--<Step title="待进行" content="这里是该步骤的描述信息"></Step>-->
        </Steps>
    </div>
</template>

<script>
    export default {
        name: 'processSteps',
        props: {
            // 流程步骤
            processStepList: {
                type: Array,
                default () {
                    return [];
                }
            },
            // 流程审核内容
            processData: {
                type: Object,
                default () {
                    return {};
                }
            },
            direction: {
                type: String
            }
        },
        computed: {
            dataSet() {
                return this.processStepList.map(val => {
                    val.list = this.processData[val.processStepId] || [];
                    return val;
                });
            },
            current() {
                let count = 0;
                for(let key in this.processData) {
                    count++;
                }
                return count;
            }
        },
        data() {
            return {
            };
        },
        methods: {
            transformResult(auditResult) {
                let res = '';
                switch (auditResult) {
                    case 'success': res = '通过'; break;
                    default: res = '不通过'; break;
                }
                return res;
            },
            transformTime(time) {
                return this.$moment(time).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .processSteps-container {
        .ivu-steps-content {
            min-height: 80px;
            .content {
                padding-right: 10px;

                &.success {
                    color: #19be6b;
                }

                &.error {
                    color: #ed4014;
                }
            }
        }
    }
</style>