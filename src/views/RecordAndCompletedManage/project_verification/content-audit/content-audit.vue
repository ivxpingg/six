<template>
    <vModalBothSides class="content-audit-container" :height="650">
        <template slot="left">
            <Menu theme="light"
                  :width="`200px`"
                  :activeName="activeName"
                  @on-select="onSelect">
                <MenuItem name="1">
                    <Icon type="md-document" />
                    项目基本信息
                </MenuItem>
                <MenuItem name="2" v-show="projectId !== ''">
                    <Icon type="md-chatbubbles" />
                    材料明细一览表
                </MenuItem>
                <MenuItem name="3" v-show="projectId !== ''">
                    <Icon type="md-heart" />
                    参建单位与人员情况
                </MenuItem>
            </Menu>
        </template>

        <template slot="right">
            <vProjectBaseInfo  v-show="activeName === '1'"
                               :projectId="projectId"
                               :isView="true"
                               :key="'contentAudit'"
                               class="six-modal-body-inner"></vProjectBaseInfo>

            <vFileDetailLists v-show="activeName === '2' && projectId !== ''"
                              :projectId="projectId"
                              :isView="true"
                              class="six-modal-body-inner"></vFileDetailLists>

            <vUnitAndPerson v-show="activeName === '3' && projectId !== ''"
                            :projectId="projectId"
                            :isView="true"
                            class="six-modal-body-inner"></vUnitAndPerson>

            <div class="ivu-modal-footer content-audit-modal-footer">
                <Button type="warning"
                        size="large"
                        @click="onClick_back">退回补充</Button>
                <Button type="primary"
                        size="large"
                        @click="onClick_accept">材料受理</Button>

            </div>

        </template>

        <!--退回补充,选择流程-->
        <Modal v-model="modal_back"
               title="退回补充">
            <h3 style="margin-bottom: 10px;">确定退回补充？退回补充后需要填写下发交工申请核查意见书。</h3>

            <Form :label-width="88"
                  ref="form_back"
                  :model="backData"
                  :rules="rules_accept">
                <FormItem label="请选择流程:" prop="auditProcessId">
                    <Input :value="backData.auditProcessName" readonly @on-focus="modal_selectProcess_open" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary"
                        size="large"
                        @click="saveBack">确定</Button>
            </div>
        </Modal>

        <!--材料受理,选择流程-->
        <Modal v-model="modal_accept"
               title="材料受理">
            <h3 style="margin-bottom: 10px;">确定材料完整无遗漏？材料受理通过后会生成处理标签至后续流程人员处理。</h3>

            <Form :label-width="88"
                  ref="form_accept"
                  :model="acceptData"
                  :rules="rules_accept">
                <FormItem label="请选择流程:" prop="auditProcessId">
                    <Input :value="acceptData.auditProcessName" readonly @on-focus="modal_selectProcess_open" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary"
                        size="large"
                        @click="saveAccept">确定</Button>
            </div>
        </Modal>

        <vModalAuditProcessSelect ref="modal_auditProcessSelect" @modal-callback="modal_selectProcess_callback"></vModalAuditProcessSelect>
    </vModalBothSides>

</template>

<script>
    import vModalBothSides from '../../../../components/modal-body/modal-both-sides';
    import vProjectBaseInfo from '../../../QualitySupervisionManage/qualitySupervision_register/add/projectBaseInfo/projectBaseInfo';
    import vFileDetailLists from '../../../Common/fileDetailLists/fileDetailLists';
    import vUnitAndPerson from '../../../QualitySupervisionManage/qualitySupervision_register/add/unitAndPerson/unitAndPerson';
    import vModalAuditProcessSelect from '../../../Common/auditProcessSelect/modalAuditProcessSelect';
    export default {
        name: 'content-audit-hand',  //交工 材料完整性审核
        components: {
            vModalBothSides,
            vProjectBaseInfo,
            vFileDetailLists,
            vUnitAndPerson,
            vModalAuditProcessSelect
        },
        props: {
            isView: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            projectId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                activeName: '1',

                // 退回补充
                modal_back: false,
                backData: {
                    auditProcessId: '',
                    auditProcessName: ''
                },

                // 材料受理
                modal_accept: false,
                acceptData: {
                    auditProcessId: '',
                    auditProcessName: ''
                },
                rules_accept: {
                    auditProcessId: [{ required: true, message: '流程不能为空！', trigger: 'blur' }]
                }
            };
        },
        methods: {
            onSelect(name) {
                this.activeName = name;
            },
            onClick_decline_open() {
                this.modal_declineReason = true;
            },
            onClick_back() {
                this.modal_back = true;
                // this.$Modal.confirm({
                //     title: '退回补充',
                //     content: '确定退回补充？退回补充后您需要在登记填写整改通知下发《质量监督申请材料核查意见通知书》',
                //     onOk:() => {
                //         this.$http({
                //             method: 'get',
                //             url: '/projectAudit/handoverBack',
                //             params: {
                //                 projectId: this.projectId,
                //                 auditProcessId: ''
                //             }
                //         }).then(res => {
                //             if (res.code === 'SUCCESS') {
                //                 this.$Message.success('退回补充成功！');
                //                 this.$emit('modal_callback');
                //             }
                //         })
                //     }
                // });
            },
            // 保存退回补充
            saveBack() {
                this.$refs.form_accept.validate(valid => {
                    if (valid) {
                        this.$http({
                            method: 'get',
                            url: '/projectAudit/handoverStartAudit',
                            params: {
                                projectId: this.projectId,
                                auditProcessId: this.backData.auditProcessId
                            }
                        }).then(res => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('退回补充成功！');
                                this.$emit('modal_callback');
                                this.modal_back = false;
                            }
                        })
                    }
                })
            },

            onClick_accept() {
                this.modal_accept = true;
                // this.$Modal.confirm({
                //     title: '材料受理',
                //     content: '确定材料完整无遗漏？材料受理通过后会生成处理标签至后续流程人员处理。',
                //     onOk:() => {
                //         this.$http({
                //             method: 'get',
                //             url: '/projectAudit/projectFileAccept',
                //             params: {
                //                 projectId: this.projectId
                //             }
                //         }).then(res => {
                //             if (res.code === 'SUCCESS') {
                //                 this.$Message.success('材料受理成功！');
                //                 this.$emit('modal_callback');
                //             }
                //         })
                //     }
                // });
            },
            // 选择流程
            modal_selectProcess_open() {
                this.$refs.modal_auditProcessSelect.modalValue = true;
            },
            // 流程选择返回
            modal_selectProcess_callback(selectValue, selectItems) {
                this.acceptData.auditProcessId = selectItems.auditProcessId;
                this.acceptData.auditProcessName = selectItems.name;

                this.backData.auditProcessId = selectItems.auditProcessId;
                this.backData.auditProcessName = selectItems.name;
            },
            // 保存受理
            saveAccept() {
                this.$refs.form_accept.validate(valid => {
                    if (valid) {
                        this.$http({
                            method: 'get',
                            url: '/projectAudit/handoverStartAudit',
                            params: {
                                projectId: this.projectId,
                                auditProcessId: this.acceptData.auditProcessId
                            }
                        }).then(res => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('材料受理成功！');
                                this.$emit('modal_callback');
                                this.modal_accept = false;
                            }
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .content-audit-container {
    }

    .content-audit-modal-footer {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #FFF;
        border-radius: 0 0 6px 6px;
    }
</style>