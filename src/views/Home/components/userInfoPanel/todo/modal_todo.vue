<template>
    <div class="modal_todo-container">
        <Modal v-model="modalValue"
               title="待办事项处理"
               :width="1020"
               footer-hide>
            <div class="ivx-table-box">
                <Table border
                       height="360"
                       :columns="tableColumns"
                       :data="tableData"></Table>
                <Page prev-text="上一页"
                      next-text="下一页"
                      show-total
                      :current="searchParams.current"
                      :page-size="searchParams.size"
                      :total="searchParams.total"
                      @on-change="onPageChange"></Page>
            </div>
        </Modal>

        <vTodoReply ref="modal_todoReply"
                    :projectId="currentRow.projectId"
                    :projectName="currentRow.projectName"
                    :part="currentRow.part"
                    :changeNoticeId="currentRow.changeNoticeId"
                    @modal-callback="modal_todoReply_callback"></vTodoReply>

        <vComplaintReply ref="modal_complaintReply"
                         :projectId="complaint.projectId"
                         :projectName="complaint.projectName"
                         :part="complaint.part"
                         :complaintId="complaint.complaintId"
                         @modal-callback="modal_complaintReply_callback"></vComplaintReply>
    </div>
</template>

<script>
    import modalMixin from '../../../../../lib/mixin/modalMixin';
    import vTodoReply from './module/todoReply';
    import vComplaintReply from './module/complaintReply';
    import MOMENT from 'moment';
    export default {
        name: 'modal_todo',   // 代办
        mixins: [modalMixin],
        components: {vTodoReply, vComplaintReply},
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {}
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index' },
                    { title: '时间', width: 100, align: 'center', key: 'insTime',
                        render(h, params) {
                            return h('div', params.row.insTime ? MOMENT(params.row.insTime).format('YYYY-MM-DD  HH:mm:ss') : '');
                        }
                    },
                    { title: '事项名称', width: 160, align: 'center', key: 'waitHandleName' },
                    { title: '项目', minWidth: 160, align: 'center',
                        render(h, params) {
                             let param = eval(`[${params.row.param}]`);
                             return h('div', `${param[0].projectName}(${param[0].part})`);
                        }
                    },
                    { title: '来源', width: 160, align: 'center', key: 'source' },
                    { title: '截止处理时间', width: 120, align: 'center', key: 'stopHandleTime',
                        render(h, params) {
                            return h('div', params.row.stopHandleTime ? MOMENT(params.row.stopHandleTime).format('YYYY-MM-DD') : '');
                        }
                    },
                    { title: '状态', width: 100, align: 'center', key: 'waitHandleStatusLabel' },
                    { title: '操作', width: 100, align: 'center',
                        render:(h, params) => {
                            return params.row.waitHandleStatus === 'complete_handle' ? '' :
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.todoHandle(params.row);
                                        }
                                    }
                                }, '处理');
                        }
                    },
                ],
                tableData: [
                    // {
                    //     waitHandleId: '',
                    //     waitHandleName: '',    // 待办事项名称
                    //     waitHandleType: '',    // 待办事项类别
                    //     waitHandleTypeLabel: '',
                    //     param: '',             // 需要的参数
                    //     source: '',            // 来源
                    //     userId: '',            // 处理人
                    //     stopHandleTime: '',    // 截止处理时间
                    //     waitHandleStatus: '',  // 处理状态
                    //     waitHandleStatusLabel: '',
                    //     projectId: '',          // 项目ID
                    //     projectName: ''
                    // }
                ],

                // 整改通知回复参数
                currentRow: {
                    projectId: '',
                    projectName: '',
                    part: '',
                    changeNoticeId: '',
                },

                // 质量安全投诉处理参数
                complaint: {
                    projectId: '',
                    projectName: '',
                    part: '',
                    complaintId: ''
                }

            };
        },
        watch: {
            'searchParams.current'() {
                this.getData();
            },

            'searchParams.condition': {
                deep: true,
                handler() {
                    this.getData();
                }
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            /**
             * 分页控件-切换页面
             * @param current
             */
            onPageChange(current) {
                this.searchParams.current = current;
            },
            todoHandle(row) {
                let param;


                switch (row.waitHandleType) {
                    case 'disclose_reply':       // 监督交底整改
                        // break;
                    case 'examine_reply':        // 质量检查整改
                        // break;
                    case 'safety_reply':        // 安全检查整改
                        // break;
                    case 'credit_reply':        // 信用评价整改
                        param = eval(`[${row.param}]`);
                        Object.assign(this.currentRow, {
                            part: '',
                            changeNoticeId: '',
                            projectName: '',
                            projectId: ''
                        }, param[0]);
                        this.$refs.modal_todoReply.modalValue = true;
                        break;
                    case 'change_notice_reply':  // 材料核查意见书审核
                        this.$router.push({
                            name: 'qualitySupervision_register'
                        });
                        break;
                    case 'handle_label_audit':   // 受理处理标签审核
                        this.$router.push({
                            name: 'qualitySupervision_accept'
                        });
                        break;
                    case 'complaint_reply':      // 质量安全投诉处理
                        param = eval(`[${row.param}]`);
                        Object.assign(this.complaint, {
                            projectId: '',
                            projectName: '',
                            complaintId: ''
                        }, param[0]);
                        this.$refs.modal_complaintReply.modalValue = true;
                        break;
                    case 'project_record_audit': // 工程备案审核
                        this.$router.push({
                            name: 'projectRecords'
                        });
                        break;
                    case 'sign_off_reply':       // 交工检测核验审核
                        this.$router.push({
                            name: 'project_verification'
                        });
                        break;
                    case 'authenticate':         // 竣工文件下发
                        this.$router.push({
                            name: 'projectCompleteQuality_authenticate'
                        });
                        break;
                    case 'case':                 // 案件受理处理
                        this.$router.push({
                            name: 'projectFileManage'
                        });
                        break;
                }
            },

            modal_todoReply_callback() {
                this.getData();
            },
            modal_complaintReply_callback(){
                this.getData();
            },

            getData() {
                this.$http({
                    method: 'post',
                    url: '/waitHandle/list',
                    data: JSON.stringify(this.searchParams)
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.tableData = res.data.records || [];
                        this.searchParams.total = res.data.total;
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modal_todo-container {
    }
</style>