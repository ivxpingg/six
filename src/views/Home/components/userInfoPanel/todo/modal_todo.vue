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

        <vProjectRecordReply ref="modal_projectRecord"
                             :projectRecordId="projectRecord.projectRecordId"
                             :projectName="projectRecord.projectName"
                             :part="projectRecord.part"
                             @modal-callback="modal_projectRecord_callback"></vProjectRecordReply>


        <!--交工审核处理  - 材料完整性审核-->
        <Modal v-model="modal_contentAudit_verification"
               class-name="modal-body-padding0"
               title="材料完整性审核"
               :width="1200"
               footer-hide>
            <vContentAudit :projectId="project_verification.projectId"
                           @modal_callback="modal_common_callback"></vContentAudit>
        </Modal>

        <Modal v-model="modal_document_handle"
               :width="1300"
               title="公文处理"
               footer-hide>
            <vDocumentHandler :documentHandleId="param_document_handle.documentHandleId"
                              @callback="modal_document_handle_callback"></vDocumentHandler>
        </Modal>

    </div>
</template>

<script>
    import modalMixin from '../../../../../lib/mixin/modalMixin';
    import vTodoReply from './module/todoReply';
    import vComplaintReply from './module/complaintReply';
    import vProjectRecordReply from './module/projectRecordReply';
    import MOMENT from 'moment';

    import vContentAudit from '../../../../RecordAndCompletedManage/project_verification/content-audit/content-audit';
    import vDocumentHandler from '../../../../Document/documentHandler/documentHandler';

    export default {
        name: 'modal_todo',   // 代办
        mixins: [modalMixin],
        components: {
            vTodoReply,
            vComplaintReply,
            vProjectRecordReply,
            vContentAudit,
            vDocumentHandler},
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


                            // todo 暂时隐藏交工审核处理按钮
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
                tableData: [],

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
                },

                // 工程备案回复
                projectRecord: {
                    projectRecordId: '',
                    projectName: '',
                    part: ''
                },

                // 交工检测核验审核
                modal_contentAudit_verification: false,
                project_verification: {
                    projectId: '',
                    projectName: '',
                    part: ''
                },

                // 公文办理
                modal_document_handle: false,
                param_document_handle: {
                    documentHandleId: ''
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
                        param = eval(`[${row.param}]`);
                        Object.assign(this.projectRecord, {
                            projectRecordId: '',
                            projectName: '',
                            part: ''
                        }, param[0]);
                        this.$refs.modal_projectRecord.modalValue = true;
                        //
                        // this.$router.push({
                        //     name: 'projectRecords'
                        // });
                        break;
                    case 'sign_off_reply':       // 交工检测核验审核

                        // param = eval(`[${row.param}]`);
                        // Object.assign(this.projectRecord, {
                        //     projectRecordId: '',
                        //     projectName: '',
                        //     part: ''
                        // }, param[0]);

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
                    case 'handover_reply_audit':   // 交工检测核验审核
                        param = eval(`[${row.param}]`);
                        Object.assign(this.project_verification, {
                            projectId: '',
                            projectName: '',
                            part: ''
                        }, param[0]);

                        this.modal_contentAudit_verification = true;

                        break;
                    case 'document_handle':    // 公文办理
                        param = eval(`[${row.param}]`);
                        Object.assign(this.param_document_handle, {
                            documentHandleId: ''
                        }, param[0]);
                        this.modal_document_handle = true;
                        break;
                    case 'handover_handle_audit':
                        this.$router.push({
                            name: 'project_verification'
                        });
                        break;
                }
            },

            modal_todoReply_callback() {
                this.getData();
                this.$emit('modal-callback');
            },
            modal_complaintReply_callback(){
                this.getData();
                this.$emit('modal-callback');
            },
            modal_projectRecord_callback() {
                this.getData();
                this.$emit('modal-callback');
            },
            modal_document_handle_callback() {
                this.modal_document_handle = false;
                this.getData();
                this.$emit('modal-callback');
            },

            // 公共关闭弹出框后重新获取待办事项表格
            modal_common_callback() {
                this.modal_contentAudit_verification = false;
                this.getData();
                this.$emit('modal-callback');
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