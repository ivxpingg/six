<template>
    <div class="noticeReply-container">
        <Modal v-model="modalValue"
               title="整改回复"
               :width="800"
               @on-visible-change="onVisibleChange">

            <Form ref="form"
                  class="form"
                  inline
                  :model="formData"
                  :rules="rules"
                  :label-width="100">
                <FormItem label="项目名称:" prop="projectId">
                    <Select v-model="formData.relationId">
                        <Option v-for="item in projectList"
                                :key="item.projectId+'project1'"
                                :value="item.projectId"
                                :label="`${item.projectName}(${item.part})`"></Option>
                    </Select>
                </FormItem>
                <FormItem label="整改标题:" prop="changeTitle">
                    <Input v-model="formData.changeTitle"
                           placeholder="请输入整改标题"/>
                </FormItem>
                <FormItem label="整改内容:" prop="changeContent">
                    <Input v-model="formData.changeContent"
                           placeholder="请输入整改内容"/>
                </FormItem>



            </Form>
            <div slot="footer">
                <Button type="primary" size="large" @click="savePass">整改通过</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    export default {
        name: 'noticeReply',   // 整改回复
        mixins: [modalMixin],
        data() {
            return {
                projectList: [],
                formData: {
                    relationId: '',
                    beginTime: '',      // 开始整改时间
                    endTime: '',        // 最迟整改时间
                    changeTitle: '',    // 整改标题
                    changeContent: '',  // 整改内容
                    overdueHandle: 'notice',  // 逾期未改
                    fileIds: ''
                },
                rules: {}
            }
        },
        watch: {
            'formData.relationId'() {
                this.getReply();
            }
        },
        mounted() {
            this.getProjectList();
        },
        methods: {
            // 获取项目列表
            getProjectList() {
                this.$http({
                    method: 'get',
                    url: '/supervisionCheck/monitorProjectList'
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.projectList = res.data || [];
                    }
                })
            },

            getReply() {
                this.$http({
                    method: 'get',
                    url: '/changeNotice/viewChangeReply'
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.projectList = res.data || [];
                    }
                })
            },

            // 整改通过
            savePass() {}
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    .noticeReply-container {
    }
</style>