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
            <vProjectBaseInfo  v-if="activeName === '1'"
                               :projectId="projectId"
                               :isView="isView"
                               class="six-modal-body-inner"></vProjectBaseInfo>

            <vFileDetailLists v-if="activeName === '2' && projectId !== ''"
                              :projectId="projectId"
                              :isView="isView"
                              class="six-modal-body-inner"></vFileDetailLists>

            <vUnitAndPerson v-if="activeName === '3' && projectId !== ''"
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
    </vModalBothSides>

</template>

<script>
    import vModalBothSides from '../../../../components/modal-body/modal-both-sides';
    import vProjectBaseInfo from '../add/projectBaseInfo/projectBaseInfo';
    import vFileDetailLists from '../../../Common/fileDetailLists/fileDetailLists';
    import vUnitAndPerson from '../add/unitAndPerson/unitAndPerson';
    export default {
        name: 'content-audit',  // 材料完整性审核
        components: {vModalBothSides, vProjectBaseInfo, vFileDetailLists, vUnitAndPerson},
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
                            method: 'post',
                            url: '/',
                            data: JSON.stringify(this.formData)
                        }).then(res => {
                            this.$http({
                                method: 'post',
                                url: '/',
                                data: JSON.stringify({
                                    projectId: this.projectId,
                                    processStepId: this.processStepId,
                                    auditProcessId: this.auditProcessId,
                                    noAcceptRemark: this.formData.noAcceptRemark
                                })
                            }).then((res) => {
                                this.modal_declineReason = false;
                                if (res.code === 'SUCCESS') {}
                            })
                        })
                    } else {

                    }
                })

            },
            onClick_back() {
                this.$Modal.confirm({
                   title: '退回补充',
                    content: '确定退回补充？退回补充后您需要在登记填写整改通知下发《质量监督申请材料核查意见通知书》',
                    onOk:() => {

                    }
                });
            },
            onClick_accept() {
                this.$Modal.confirm({
                    title: '材料受理',
                    content: '确定材料完整无遗漏？材料受理通过后会生成处理标签至后续流程人员处理。',
                    onOk:() => {

                    }
                });
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