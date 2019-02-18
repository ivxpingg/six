<template>
    <div class="handleAudit-container">
        <Modal v-model="modalValue"
               title="质量监督申请处理标签"
               :width="630"
               @on-visible-change="onVisibleChange">
            <vQualitySupervision ref="qualitySupervision"
                                 :eSignatureUrl="eSignature.url"
                                 :eSignatureName="eSignature.name"
                                 :userId="eSignature.userId"
                                 :signatureId="eSignature.signatureId"
                                 :auditProcessId="auditProcessId"
                                 :processStepId="processStepId"
                                 :projectId="projectId" @modal-eSignature="modal_eSignature"></vQualitySupervision>
            <div slot="footer">
                <Button type="info" size="large" @click="exportPDF(false)">打印</Button>
                <Button type="primary" size="large" @click="onClick_selectAuditProcess_open" v-show="!auditProcessId">提交审核</Button>
                <Button type="primary" size="large" @click="onClick_selectSignature" v-show="auditProcessId && auditContent_obj.permission">盖章</Button>
                <Button type="success" size="large" v-show="auditProcessId && auditContent_obj.permission" @click="uploadFile">审核通过</Button>
            </div>
        </Modal>

        <vModalAuditProcessSelect ref="modal_auditProcessSelect" @modal-callback="submitAudit"></vModalAuditProcessSelect>

        <vModalUserSignatureSelect ref="modal_userSignatureSelect" @modal-callback="modal_signatureSelect_callback"></vModalUserSignatureSelect>
    </div>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    import vQualitySupervision from '../../../Common/templateType/quality_supervision';
    import vModalAuditProcessSelect from '../../../Common/auditProcessSelect/modalAuditProcessSelect';
    import vModalUserSignatureSelect from '../../../Common/userSignatureSelect/modalUserSignatureSelect';
    import html2canvas from 'html2canvas';
    import jspdf from 'jspdf/dist/jspdf.debug';
    export default {
        name: 'handleAudit',   // 处理审核标签
        mixins: [modalMixin],
        components: {vQualitySupervision, vModalAuditProcessSelect, vModalUserSignatureSelect},
        props: {
            projectId: {
                type: String,
                default: ''
            },
            auditProcessId: {
                type: String,
                default: ''
            },
            processStepId: {
                type: String,
                default: ''
            }
        },
        watch: {
            projectId(val) {
                if (val && this.processStepId !== '') {
                    this.getAuditContent();
                }
            }
        },
        data() {
            return {
                // 提交审核

                // 电子签名信息
                eSignature: {
                    name: '',
                    url: '',
                    userId: '',
                    signatureId: ''
                },

                auditInfo: {
                    fileId: '',
                    fileRecordType: 'apply_handle_record',
                    waitHandleType: 'handle_label_audit'      //  待办事项类型  - 受理处理标签审核
                },

                // 审核内容
                auditContent_obj: {
                    auditContent: '',
                    auditProcessId: '',
                    auditRecordId: '',
                    auditResult: '',
                    insTime: null,
                    lastStep: false,   // 是否是审核最后一步
                    permission: false,  // 是否有通过审核权限
                    processStepId: '',
                    projectId: '',
                    userId: ''
                }
            };
        },
        methods: {
            // 导出PDF
            exportPDF(isUpload) {
                let that = this;
                this.$Spin.show();
                return new Promise(((resolve, reject) => {
                    try {
                        html2canvas(this.$refs.qualitySupervision.$el, {
                            scale: 2, // 添加的scale 参数
                        }).then((canvas) => {
                            let moveHight = [841, 841, 841];
                            let idx = 0;

                            let pageData = canvas.toDataURL('image/jpeg', 1.0);
                            let pdf = new jspdf("", "pt", 'a4');

                            let contentWidth = canvas.width;
                            let contentHeight = canvas.height;

                            //一页pdf显示html页面生成的canvas高度;
                            let pageHeight = contentWidth / 595.28 * 841.89;
                            //未生成pdf的html页面高度
                            let leftHeight = contentHeight;
                            //页面偏移
                            let position = 0;
                            //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                            let imgWidth = 595.28;
                            let imgHeight = (595.28/contentWidth * contentHeight);

                            //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                            //当内容未超过pdf一页显示的范围，无需分页
                            if (leftHeight < pageHeight) {
                                pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight );
                            } else {
                                while(leftHeight > 0) {
                                    pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
                                    leftHeight -= pageHeight;
                                    position -= moveHight[0];
                                    //避免添加空白页
                                    if(leftHeight > 0) {
                                        pdf.addPage();
                                    }
                                }
                            }
                            this.$Spin.hide();
                            if (isUpload) {
                                resolve(pdf.output('datauristring').substr(28));
                            }
                            else {
                                pdf.save('质量监督申请处理标签.pdf');
                                resolve();
                            }
                        });
                    }
                    catch (e) {
                        resolve();
                        this.$Spin.hide();
                        this.$Notice.warning('生成PDF失败！');
                    }
                }));
            },

            // 打开提交审核选流程
            onClick_selectAuditProcess_open() {
                this.$refs.modal_auditProcessSelect.modalValue = true;
            },
            // 提交审核
            submitAudit(selectValue, selectItems) {
                this.$Modal.confirm({
                    title: '提交审核',
                    content: `确定要选择<${selectItems.name}>作为审核流程?`,
                    onOk: () => {
                        this.$http({
                            method: 'post',
                            url: '/projectAudit/submit',
                            data: JSON.stringify({
                                projectId: this.projectId,
                                auditProcessId: selectItems.auditProcessId
                            })
                        }).then((res) => {
                            this.tableLoading = false;
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('提交审核成功！');
                                this.modalValue = false;
                                this.$emit('modal-submitAudit-callback');
                            }
                        })
                    }
                })
            },
            // 选择签名
            onClick_selectSignature() {
                this.$refs.modal_userSignatureSelect.getSignature();
            },

            // 选择签名的图片
            modal_signatureSelect_callback(obj) {
                Object.assign(this.eSignature, obj);
            },

            // 当前弹窗关闭后
            onVisibleChange(value) {
                if (!value) {
                    Object.assign(this.eSignature, {
                        name: '',
                        url: '',
                        userId: '',
                        signatureId: ''
                    })
                }
            },

            // 盖章后
            modal_eSignature(auditInfo) {
                Object.assign(this.eSignature, {
                    name: '',
                    url: '',
                    userId: '',
                    signatureId: '',
                    fileId: ''
                });

                this.auditInfo = auditInfo;

            },

            // 获取审核内容信息
            getAuditContent() {
                this.$http({
                    method: 'get',
                    url: '/projectAudit/getAuditContent',
                    params: {
                        projectId: this.projectId,
                        relationId: this.projectId,
                        processStepId: this.processStepId
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.auditContent_obj.auditContent = '';

                        Object.assign(this.auditContent_obj, res.data);
                        // if (res.data.auditContent) {
                        //     try {
                        //         this.auditContent_obj.auditContent = eval(res.data.auditContent);
                        //
                        //     }
                        //     catch (e) {
                        //
                        //     }
                        // }
                    }
                })
            },

            // 通过审核
            auditPass(fileId) {
                this.auditInfo.fileId = fileId || '';
                this.auditInfo.relationId = this.projectId;
                this.auditInfo.fileRecordType = 'apply_handle_record';
                this.auditInfo.waitHandleType = 'handle_label_audit';      //  待办事项类型  - 受理处理标签审核
                this.$http({
                    method: 'post',
                    url: '/projectAudit/audit',
                    data: JSON.stringify(this.auditInfo)
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.$Message.success('审核通过');
                        Object.assign(this.eSignature, {
                            name: '',
                            url: '',
                            userId: '',
                            signatureId: ''
                        });
                        this.modalValue = false;
                        this.$emit('modal-auditPass-callback');
                    }
                })
            },
            uploadFile() {
                if (!this.ifESignature()) {
                    this.$Message.error('您尚未电子签名，请确认签名后通过！');
                    return;
                }

                if (this.auditContent_obj.lastStep) {

                    this.exportPDF(true).then(data => {
                        this.$http({
                            method: 'post',
                            url: '/file/uploadAuditFile',
                            data: JSON.stringify({
                                base64Content: data,
                                fileRecordType: 'apply_handle_record',
                            })
                        }).then(res => {
                            if (res.code === 'SUCCESS') {
                                this.auditPass(res.data.fileId);
                            }
                        })
                    });
                }
                else{
                    this.auditPass();
                }
            },
            // 判断当前用户通过审核的时候是否已经盖章
            ifESignature() {
                if (this.auditInfo.auditContent && this.auditInfo.auditContent !== '') {
                    let eSignatureList = eval(this.auditInfo.auditContent)[0].eSignature || [];

                    for (let i = 0; i < eSignatureList.length; i++) {
                        if (eSignatureList[i].userId === this.$store.state.user.userId) {
                            return true;
                        }
                    }
                    return false;
                }
                else {
                    return false;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .handleAudit-container {

    }
</style>