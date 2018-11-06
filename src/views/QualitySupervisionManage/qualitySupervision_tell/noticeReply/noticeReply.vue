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
                  :label-width="100">
                <!--<FormItem label="项目名称:" prop="projectId">-->
                    <!--<Select v-model="formData.relationId">-->
                        <!--<Option v-for="item in projectList"-->
                                <!--:key="item.projectId+'project1'"-->
                                <!--:value="item.projectId"-->
                                <!--:label="`${item.projectName}(${item.part})`"></Option>-->
                    <!--</Select>-->
                <!--</FormItem>-->
                <FormItem label="项目名称:">
                    <Input v-model="projectName" readonly/>
                </FormItem>
                <FormItem label="开始整改时间:">
                    <DatePicker
                            :value="formData.beginTime"
                            type="date"
                            placeholder="开始整改时间" readonly></DatePicker>
                </FormItem>
                <FormItem label="最迟整改时间:">
                    <DatePicker
                            :value="formData.endTime"
                            type="date"
                            placeholder="最迟整改时间" readonly></DatePicker>
                </FormItem>
                <FormItem label="整改标题:">
                    <Input v-model="formData.changeTitle"
                           placeholder="请输入整改标题" readonly/>
                </FormItem>
                <FormItem label="整改内容:">
                    <Input v-model="formData.changeContent"
                           placeholder="请输入整改内容" readonly/>
                </FormItem>
                <FormItem label="逾期未改:">
                    <Select v-model="formData.overdueHandle" readonly disabled>
                        <Option v-for="item in dict_overdueHandle"
                                :key="item.id"
                                :value="item.value"
                                :label="item.label"></Option>
                    </Select>
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
    import MOMENT from 'moment';
    export default {
        name: 'noticeReply',   // 整改回复
        mixins: [modalMixin],
        props: {
            projectId: {
                type: String,
                default: ''
            },
            projectName: {
                type: String,
                default: ''
            },
            changeNoticeId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                projectList: [],
                formData: {
                    changeNoticeId: '',
                    relationId: '',
                    moduleType: '',
                    beginTime: '',      // 开始整改时间
                    endTime: '',        // 最迟整改时间
                    changeTitle: '',    // 整改标题
                    changeContent: '',  // 整改内容
                    overdueHandle: 'notice',  // 逾期未改
                    changeStatus: '',
                    fileIds: '',
                    createId: ''
                },
                dict_overdueHandle: []
            }
        },
        watch: {
            'formData.relationId'() {
                this.getReply();
            },
            changeNoticeId(val) {
                if(val) {
                    this.getReply();
                }
            }
        },
        mounted() {
            this.getDict(['overdueHandle']);
        },
        methods: {
            getDict(list) {
                this.$http({
                    method: 'get',
                    url: '/dict/getListByTypes',
                    params: {
                        types: list.join(',')
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        list.forEach(val => {
                            this[`dict_${val}`] = res.data[val];
                        });

                    }
                })
            },
            // 获取整改回复的信息
            getReply() {
                this.$http({
                    method: 'get',
                    url: '/changeNotice/viewChangeReply',
                    params: {
                        projectId: this.projectId,
                        changeNoticeId: this.changeNoticeId
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        Object.assign(this.formData, res.data, {
                            beginTime: res.data.beginTime ? MOMENT(res.data.beginTime).format('YYYY-MM-DD') : '',
                            endTime: res.data.endTime ? MOMENT(res.data.endTime).format('YYYY-MM-DD') : ''
                        });
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
    .form {
        .ivu-form-item {
            .ivu-form-item-content > div{
                width: 240px;
            }
        }
    }
</style>