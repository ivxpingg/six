<template>
    <div class="handleAudit-container">
        <Modal v-model="modalValue"
               title="质量监督申请处理标签"
               :width="800"
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
                <Button type="info" size="large" @click="exportPDF">打印</Button>
                <Button type="primary" size="large" @click="onClick_selectAuditProcess_open" v-show="!auditProcessId"> 提交审核</Button>
                <Button type="primary" size="large" @click="onClick_selectSignature" v-show="auditProcessId">盖章</Button>
                <Button type="success" size="large" v-show="auditProcessId" @click="auditPass">审核通过</Button>
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

                auditInfo: {}
            };
        },
        methods: {
            // 导出PDF
            exportPDF() {
                let that = this;
                this.$Spin.show();
                try {
                    html2canvas(this.$refs.qualitySupervision.$el).then((canvas) => {
                        let moveHight = [841.89, 841.89, 841.89];
                        let idx = 0;

                        let pageData = canvas.toDataURL('image/jpeg', 1.0);
                        let pdf = new jspdf("", "pt", 'a4');

                        let contentWidth = canvas.width;
                        let contentHeight = canvas.height;

                        //一页pdf显示html页面生成的canvas高度;
                        let pageHeight = contentWidth / 592.28 * 841.89;
                        //未生成pdf的html页面高度
                        let leftHeight = contentHeight;
                        //页面偏移
                        let position = 0;
                        //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                        let imgWidth = 595.28;
                        let imgHeight = (592.28/contentWidth * contentHeight) - 84;

                        //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                        //当内容未超过pdf一页显示的范围，无需分页
                        if (leftHeight < pageHeight) {
                            pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight );
                        } else {
                            while(leftHeight > 0) {
                                pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
                                leftHeight -= pageHeight;
                                position -= moveHight[idx++];
                                //避免添加空白页
                                if(leftHeight > 0) {
                                    pdf.addPage();
                                }
                            }
                        }
                        // console.dir(doc.output('datauristring'));
                        this.$Spin.hide();
                        pdf.save('content.pdf');
                    });
                }
                catch (e) {
                    this.$Spin.hide();
                    this.$Notice.warning('导出失败！');
                }
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
                            url: '/projectAudit/submitAccept',
                            data: JSON.stringify({
                                projectId: this.projectId,
                                auditProcessId: selectItems.auditProcessId
                            })
                        }).then((res) => {
                            this.tableLoading = false;
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('提交审核成功！');
                                this.modalValue = false;
                            }
                        })
                    }
                })
            },
            // 选择签名
            onClick_selectSignature() {
                this.$refs.modal_userSignatureSelect.getSignature();
            },
            modal_signatureSelect_callback(obj) {
                Object.assign(this.eSignature, obj);
            },

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
            modal_eSignature(auditInfo) {
                Object.assign(this.eSignature, {
                    name: '',
                    url: '',
                    userId: '',
                    signatureId: ''
                });

                this.auditInfo = auditInfo;

            },

            // 通过审核
            auditPass() {
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
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .handleAudit-container {
    }
</style>