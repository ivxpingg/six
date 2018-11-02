<template>
    <div class="noticeModification-container">
        <Modal v-model="modalValue"
               title="整改通知"
               :width="800"
               @on-visible-change="onVisibleChange">
            <Form ref="form"
                  class="form"
                  inline
                  :model="formData"
                  :rules="rules"
                  :label-width="100">
                <FormItem label="项目名称:" prop="projectId">
                    <Select v-model="formData.projectId">
                        <Option v-for="item in projectList"
                                :key="item.projectId"
                                :value="item.projectId"
                                :label="item.projectName"></Option>
                    </Select>
                </FormItem>
                <FormItem label="开始整改时间:" prop="beginTime">
                    <DatePicker
                            :value="formData.beginTime"
                            type="date"
                            @on-change="onChange_beginTime"
                            placeholder="开始整改时间"></DatePicker>
                </FormItem>
                <FormItem label="最迟整改时间:" prop="endTime">
                    <DatePicker
                            :value="formData.endTime"
                            type="date"
                            @on-change="onChange_endTime"
                            placeholder="最迟整改时间"></DatePicker>
                </FormItem>
                <FormItem label="整改标题:" prop="changeTitle">
                    <Input v-model="formData.changeTitle"
                           placeholder="请输入整改标题"/>
                </FormItem>
                <FormItem label="整改内容:" prop="changeContent">
                    <Input v-model="formData.changeContent"
                           placeholder="请输入整改内容"/>
                </FormItem>
                <FormItem label="逾期未改:">
                    <Select v-model="formData.overdueHandle">
                        <Option v-for="item in dict_overdueHandle"
                                :key="item.id"
                                :value="item.value"
                                :label="item.label"></Option>
                    </Select>
                </FormItem>
                <FormItem label="相关材料:">
                    <Button type="primary">选择</Button>
                </FormItem>

                <template v-for="item in formData.projectUnitUsers">
                    <FormItem label="单位:" :key="item.projectUnitId">
                        <Input v-model="item.unitName" readonly />
                        接收人员: <Input v-model="item.userName" readonly  placeholder="请选择接收人员" />
                    </FormItem>
                </template>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    export default {
        name: 'noticeModification',   // 整改通知
        mixins: [modalMixin],
        props: {},
        data() {
            return {
                projectList: [],
                unitList: [],

                formData: {
                    // changeNoticeId: '',
                    // relationId: '',
                    moduleType: 'inform',   // 模块类别字典，固定值，  监督交底： inform
                    beginTime: '',      // 开始整改时间
                    endTime: '',        // 最迟整改时间
                    changeTitle: '',    // 整改标题
                    changeContent: '',  // 整改内容
                    overdueHandle: 'notice',  // 逾期未改

                    projectUnitUsers: [
                        // {
                        //     projectUnitId: '',
                        //     projectUserId: '',
                        //     unitName: ''
                        // }
                    ]
                },
                rules: {
                    beginTime: [{ required: true, message: '开始整改时间不能为空！', trigger: 'blur' }],
                    endTime: [{ required: true, message: '最迟整改时间不能为空！', trigger: 'blur' }],
                    changeTitle: [{ required: true, message: '整改标题不能为空！', trigger: 'blur' }],
                    changeContent: [{ required: true, message: '整改内容不能为空！', trigger: 'blur' }]
                },

                dict_overdueHandle: []
            };
        },
        watch: {
            'formData.projectId'() {
                this.getUnitList();
            },
            unitList(val) {
                this.formData.projectUnitUsers = [];
                val.forEach((v) => {
                    this.formData.projectUnitUsers.push({
                        projectUnitId: v.projectUnitId,
                        projectUserId: '',
                        unitName: v.unitName,
                        userName: ''
                    })
                });
            }
        },
        mounted() {
            this.getDict(['overdueHandle']);
            this.getProjectList();
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
            onChange_beginTime(val) {
                this.formData.beginTime = val;
            },
            onChange_endTime(val) {
                this.formData.endTime = val;
            },

            // 获取项目列表
            getProjectList() {
                this.$http({
                    method: 'post',
                    url: '/project/list'
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.projectList = res.data.records || [];
                    }
                })
            },
            // 获取项目参建单位
            getUnitList() {
                this.$http({
                    method: 'get',
                    url: '/project/projectUnitList',
                    params: {
                        projectId: this.formData.projectId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.unitList = res.data || [];
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .noticeModification-container {

    }

    .form {
        .ivu-form-item {
            .ivu-form-item-content > div{
                width: 240px;
            }
        }
    }
</style>