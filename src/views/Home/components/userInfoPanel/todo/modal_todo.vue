<template>
    <div class="modal_todo-container">
        <Modal v-model="modalValue"
               title="待办事项处理"
               footer-hide>
            <div class="ivx-table-box">
                <Table border
                       height="360"
                       :columns="tableColumns"
                       :data="tableData"></Table>
            </div>
        </Modal>
    </div>
</template>

<script>
    import modalMixin from '../../../../../lib/mixin/modalMixin';
    export default {
        name: 'modal_todo',   // 代办
        mixins: [modalMixin],
        data() {
            return {
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index' },
                    { title: '事项名称', width: 160, align: 'center', key: 'waitHandleName' },
                    { title: '项目', width: 160, align: 'center', key: 'projectName' },
                    { title: '来源', width: 160, align: 'center', key: 'source' },
                    { title: '截止处理时间', width: 120, align: 'center', key: 'stopHandleTime' },
                    { title: '状态', width: 120, align: 'center', key: 'waitHandleStatusLabel' },
                    { title: '操作', width: 200, align: 'center',
                        render(h, params) {
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
                    {
                        waitHandleId: '',
                        waitHandleName: '',    // 待办事项名称
                        waitHandleType: '',    // 待办事项类别
                        waitHandleTypeLabel: '',
                        param: '',             // 需要的参数
                        source: '',            // 来源
                        userId: '',            // 处理人
                        stopHandleTime: '',    // 截止处理时间
                        waitHandleStatus: '',  // 处理状态
                        waitHandleStatusLabel: '',
                        projectId: '',          // 项目ID
                        projectName: ''
                    }
                ]
            };
        },
        methods: {
            todoHandle(row) {
                switch (row.waitHandleType) {
                    case 'disclose_reply':       // 监督交底整改
                        // break;
                    case 'examine_reply':        // 质量检查整改
                        // break;
                    case 'safety _reply':        // 安全检查整改
                        // break;
                    case 'credit _reply':        // 信用评价整改


                        break;
                    case 'change_notice_reply':  // 材料核查意见书审核
                        break;
                    case 'handle_label_audit':   // 受理处理标签审核
                        break;
                    case 'complaint_reply':      // 质量安全投诉处理
                        break;
                    case 'project_record_audit': // 工程备案审核
                        break;
                    case 'sign_off_reply':       // 交工检测核验审核
                        break;
                    case 'authenticate':         // 竣工文件下发
                        break;
                    case 'case':                 // 案件受理处理
                        break;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modal_todo-container {
    }
</style>