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
                               :isView="isView"
                               :key="'contentAudit'"
                               class="six-modal-body-inner"></vProjectBaseInfo>

            <vFileDetailLists v-show="activeName === '2' && projectId !== ''"
                              :projectId="projectId"
                              :isView="isView"
                              templateType="quality_supervision"
                              class="six-modal-body-inner"></vFileDetailLists>

            <vUnitAndPerson v-show="activeName === '3' && projectId !== ''"
                            :projectId="projectId"
                            :isView="isView"
                            class="six-modal-body-inner"></vUnitAndPerson>

            <div class="ivu-modal-footer content-audit-modal-footer">
                <Button type="error"
                        size="large"
                        @click="onClick_decline_open">不予受理</Button>
                <Button type="warning"
                        size="large"
                        @click="onClick_back">退回补充</Button>
                <Button type="primary"
                        size="large"
                        @click="onClick_accept">材料受理</Button>

                <Modal v-model="modal_declineReason"
                       title="不予受理"
                       :width="450">
                    <Form ref="form"
                          :model="formData"
                          :rules="rules"
                          :label-width="75">
                        <FormItem label="填写原因:" prop="noAcceptRemark">
                            <Input type="textarea"
                                   :rows="6"
                                   v-model="formData.noAcceptRemark" />
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button type="primary"
                                size="large"
                                @click="reason_save">确定</Button>
                    </div>
                </Modal>
            </div>

        </template>

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
    import vProjectBaseInfo from '../add/projectBaseInfo/projectBaseInfo';
    import vFileDetailLists from '../../../Common/fileDetailLists/fileDetailLists';
    import vUnitAndPerson from '../add/unitAndPerson/unitAndPerson';
    import vModalAuditProcessSelect from '../../../Common/auditProcessSelect/modalAuditProcessSelect';
    export default {
        name: 'content-audit',  // 材料完整性审核
        components: {vModalBothSides, vProjectBaseInfo, vFileDetailLists, vUnitAndPerson, vModalAuditProcessSelect},
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
            },
            processStepId: {
                type: String,
                required: true
            },
            auditProcessId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                activeName: '1',

                modal_declineReason: false,
                formData: {
                    noAcceptRemark: ''
                },
                rules: {
                    noAcceptRemark: [{ required: true, message: '原因不能为空！', trigger: 'blur' }]
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
            reason_save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'get',
                            url: '/projectAudit/projectFileNoAccept',
                            params: {
                                projectId: this.projectId,
                                noAcceptRemark: this.formData.noAcceptRemark
                            }
                        }).then(res => {
                            if (res.code === 'SUCCESS') {
                                this.modal_declineReason = false;
                                this.$Message.success('不予受理成功！');
                            }
                        })
                    }
                })

            },
            onClick_back() {
                this.$Modal.confirm({
                   title: '退回补充',
                    content: '确定退回补充？退回补充后您需要在登记填写整改通知下发《质量监督申请材料核查意见通知书》',
                    onOk:() => {
                        this.$http({
                            method: 'get',
                            url: '/projectAudit/backToSupplement',
                            params: {
                                projectId: this.projectId
                            }
                        }).then(res => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('退回补充成功！');
                                this.$emit('modal_callback');
                            }
                        })
                    }
                });
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
                this.$refs.form_accept.validateField('auditProcessId');
            },
            // 保存受理
            saveAccept() {
                this.$refs.form_accept.validate(valid => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/projectAudit/projectFileAccept',
                            data: JSON.stringify({
                                projectId: this.projectId,
                                auditProcessId: this.acceptData.auditProcessId
                            })
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