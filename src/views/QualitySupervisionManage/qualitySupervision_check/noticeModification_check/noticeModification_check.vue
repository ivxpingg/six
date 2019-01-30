<template>
    <div class="noticeModification_check-container">
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
                <FormItem label="项目名称:">
                    <Input v-model="projectName" readonly/>
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
                <FormItem label="逾期未改:">
                    <Select v-model="formData.overdueHandle">
                        <Option v-for="item in dict_overdueHandle"
                                :key="item.id"
                                :value="item.value"
                                :label="item.label"></Option>
                    </Select>
                </FormItem>
                <FormItem label="整改标题:" prop="changeTitle">
                    <Input v-model="formData.changeTitle"
                           placeholder="请输入整改标题"/>
                </FormItem>
                <FormItem label="整改内容:" prop="changeContent">
                    <Input v-model="formData.changeContent"
                           type="textarea"
                           :rows="5"
                           style="width: 500px;"
                           placeholder="请输入整改内容" />
                </FormItem>
                <FormItem :label-width="0">
                    <Button type="primary" size="small" icon="md-add" @click="onClick_addLaws">引用法律法规</Button>
                </FormItem>

                <FormItem label="整改通知文件:">
                    <div style="width: 600px;"><vFilesSelectButton @modal-callback="onSelect"
                                                                   fileType="monitor_procedure"
                                                                   :projectId="projectId"
                                                                   multiple></vFilesSelectButton></div>
                </FormItem>
                <FormItem label="现场违规照片:">
                    <div style="width: 600px;"><vFilesSelectButton @modal-callback="onSelect_img"
                                                                   fileType="monitor_procedure"
                                                                   :projectId="projectId"
                                                                   multiple></vFilesSelectButton></div>
                </FormItem>

                <template v-for="item in formData.projectUnitUsers">
                    <FormItem label="通知单位:" :key="item.projectUnitId">
                        <Input v-model="item.unitName" readonly />
                        <!--接收人员: <Input v-model="item.userName" readonly  placeholder="请选择接收人员" />-->
                    </FormItem>
                    <FormItem label="接收人员:" :key="item.projectUnitId + 'user'">
                        <!--<Input v-model="item.userName" readonly placeholder="请选择接收人员" />-->
                        <Select v-model="item.projectUserId" placeholder="请选择接收人员" clearable>
                            <Option v-for="(userItem, idx) in item.userList"
                                    :key="userItem.projectUserId + 'user' + idx"
                                    :value="userItem.projectUserId"
                                    :label="userItem.name"></Option>
                        </Select>
                    </FormItem>
                </template>
            </Form>
            <div slot="footer">
                <Button type="primary"
                        size="large"
                        :loading="saveBtnLoading"
                        @click="save">发送通知</Button>
            </div>
        </Modal>

        <vModalLawsSelect ref="modal_lawsSelect" @modal-callback="modal_lawsSelect_callback"></vModalLawsSelect>
    </div>
</template>
<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    import vFilesSelectButton from '../../../Common/filesSelect/filesSelectButton.vue';
    import vModalLawsSelect from '../../../Common/lawsSelect/modalLawsSelect';
    export default {
        name: 'noticeModification_check',
        mixins: [modalMixin],
        components: {vFilesSelectButton, vModalLawsSelect},
        props: {
            projectId: {
                type: String,
                default: ''
            },
            projectName: {
                type: String,
                default: ''
            },
            supervisionCheckId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                projectList: [],
                unitList: [],

                formData: {
                    projectId: '',
                    // changeNoticeId: '',
                    relationId: '',
                    moduleType: 'quality',   // 模块类别字典，固定值，  质量监督： quality
                    beginTime: '',      // 开始整改时间
                    endTime: '',        // 最迟整改时间
                    changeTitle: '',    // 整改标题
                    changeContent: '',  // 整改内容
                    overdueHandle: 'notice',  // 逾期未改
                    fileIds: [],
                    photoFileIds: [], // 现场违规图片

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

                dict_overdueHandle: [],
                // 保存按钮状态
                saveBtnLoading: false
            }
        },
        watch: {
            projectId(val) {
                this.formData.projectId = val;
            },
            supervisionCheckId(val) {
                if(val) {
                    this.formData.relationId = val;
                    this.formData.projectUnitUsers = [];
                    this.getUnitList();
                }
            },
            unitList(val) {
                this.formData.projectUnitUsers = [];
                val.forEach((v, idx) => {
                    this.formData.projectUnitUsers.push({
                        projectUnitId: v.projectUnitId,
                        projectUserId: '',
                        unitName: v.unitName,
                        userName: '',
                        userList: []
                    });

                    this.getUserList(v.projectUnitId, idx);
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
                    method: 'get',
                    url: '/supervisionCheck/monitorProjectList'
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.projectList = res.data || [];
                    }
                })
            },
            // 获取项目参建单位
            getUnitList() {
                this.$http({
                    method: 'get',
                    url: '/project/projectUnitList',
                    params: {
                        projectId: this.projectId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.unitList = res.data || [];
                    }
                })
            },
            // 获取参建单位人员列表
            getUserList(projectUnitId, idx) {
                this.$http({
                    method: 'get',
                    url: '/project/viewProjectUser',
                    params: {
                        projectUnitId: projectUnitId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {

                        this.formData.projectUnitUsers[idx].userList = res.data || [];
                    }
                })
            },

            // 获取上传文件
            onSelect(fileList) {
                this.formData.fileIds = fileList.map(v => v.fileId);
            },
            onSelect_img(fileList) {
                this.formData.photoFileIds = fileList.map(v => v.fileId);
            },

            // 引用法律法规
            onClick_addLaws() {
                this.$refs.modal_lawsSelect.modalValue = true;
            },
            modal_lawsSelect_callback(selectItems) {
                this.formData.changeContent += selectItems.lawContent;
            },

            // 保存整改通知
            save() {
                this.saveBtnLoading = true;
                this.$http({
                    method: 'post',
                    url: '/changeNotice/addChangeNotice',
                    data: JSON.stringify(this.formData)
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.$Message.success('添加整改通知成功!');
                        this.modalValue = false;
                        this.$emit('modal-callback');
                    }
                    this.saveBtnLoading = false;
                }).catch(e => {
                    this.saveBtnLoading = false;
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .noticeModification_check-container {
    }

    .form {
        .ivu-form-item {
            .ivu-form-item-content > div{
                width: 240px;
            }
        }
    }
</style>