<template>
    <div class="documentHandler-container">
        <vIvxFilterBox class="ivx-filter-box" :border="false">
            <Button type="primary"
                    v-if="documentHandle.handleStatus === 'submitted'"
                    icon="md-add" @click="submitAudit">提交审核</Button>

            <Button type="primary"
                    v-if="documentAudit.permission"
                    @click="uploadFile"
                    :loading="btnLoading_auditPass"
                    icon="md-add">审核通过</Button>

            <Button type="primary"
                    v-if="documentAudit.permission"
                    icon="md-add" @click="onClick_selectSignature">电子签名</Button>
            <Button type="primary"
                    v-if="documentHandle.handleStatus === 'submitted'"
                    icon="md-add" @click="saveContent">保存</Button>

            <Button type="primary"
                    icon="md-add" @click="onPrint">导出</Button>
        </vIvxFilterBox>

        <vPrcessSteps class="process-steps" direction="vertical" :processStepList="processStepList" :processData="documentAuditList"></vPrcessSteps>

        <div style="text-align: center;" @click="modal_eSignature">
            <div style="display: inline-block; border: 1px solid #dcdee2; margin: 10px 0;" ref="canvas">
                <img v-if="openTest" :src="imgSrc" alt="">
                <vTemplate_word_file_0 ref="accept_notice"
                                       class="set-bg-color"
                                       v-if="documentHandle.fileRecordType === 'accept_notice'"
                                       :print2x="print2x"
                                       :eSignature="eSignature"
                                       :data="temData"
                                       @callback="modal_eSignature"></vTemplate_word_file_0>

                <vTemplate_word_file_1 ref="spot_check"
                                       class="set-bg-color"
                                       v-if="documentHandle.fileRecordType === 'spot_check'"
                                       :print2x="print2x"
                                       :eSignature="eSignature"
                                       :data="temData"
                                       @callback="modal_eSignature"></vTemplate_word_file_1>

                <vTemplate_word_file_2 ref="com_check_notice"
                                       class="set-bg-color"
                                       v-if="documentHandle.fileRecordType === 'com_check_notice'"
                                       :print2x="print2x"
                                       :eSignature="eSignature"
                                       :data="temData"
                                       @callback="modal_eSignature"></vTemplate_word_file_2>

                <vTemplate_word_file_3 ref="apply_file_check"
                                       class="set-bg-color"
                                       v-if="documentHandle.fileRecordType === 'apply_file_check'"
                                       :print2x="print2x"
                                       :eSignature="eSignature"
                                       :data="temData"
                                       @callback="modal_eSignature"></vTemplate_word_file_3>

            </div>
        </div>

        <vModalUserSignatureSelect ref="modal_userSignatureSelect" @modal-callback="modal_signatureSelect_callback"></vModalUserSignatureSelect>

        <!--审核流程选择-->
        <vModalAuditProcessSelect ref="modal_auditProcessSelect" @modal-callback="modal_auditProcessSelect_callback"></vModalAuditProcessSelect>

    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vTemplate_word_file_0 from '../../Common/fileTemplate/template_word_file_0';
    import vTemplate_word_file_1 from '../../Common/fileTemplate/template_word_file_1';
    import vTemplate_word_file_2 from '../../Common/fileTemplate/template_word_file_2';
    import vTemplate_word_file_3 from '../../Common/fileTemplate/template_word_file_3';
    import vModalUserSignatureSelect from '../../Common/userSignatureSelect/modalUserSignatureSelect';
    import dataMixin from '../mixin/dataMixin';
    import vModalAuditProcessSelect from '../../Common/auditProcessSelect/modalAuditProcessSelect';
    import vPrcessSteps from '../processSteps/processSteps';
    import html2canvas from 'html2canvas';
    import jspdf from 'jspdf/dist/jspdf.debug';
    export default {
        name: 'documentHandler',
        mixins: [dataMixin],
        components: {
            vIvxFilterBox,
            vTemplate_word_file_0,
            vTemplate_word_file_1,
            vTemplate_word_file_2,
            vTemplate_word_file_3,
            vModalUserSignatureSelect,
            vModalAuditProcessSelect,
            vPrcessSteps
        },
        props: {
            documentHandleId: {
                type: String,
                default: ''
            }
        },
        computed: {

        },
        data() {
            return {
                print2x: false,
                eSignature: {
                    name: '',
                    url: '',
                    userId: '',
                    signatureId: ''
                },

                // 详情信息
                documentHandle: {
                    fileRecordType: '',
                    handleStatus: '',
                    fileName: ''
                },
                // 文档信息信息
                documentAudit: {
                    auditContent: '',
                    auditResult: '',
                    documentAuditId: '',
                    documentHandleId: '',
                    lastStep: false,
                    permission: false,
                    userId: ''
                },
                temData: {},

                // 提交审核对象
                auditForm: {
                    documentHandleId: '',
                    auditProcessId: '',
                    auditContent: ''
                },

                // 通过审核对象
                auditPassForm: {
                    documentHandleId: '',
                    auditProcessId: '',
                    processStepId: '',
                    auditContent: '',
                    fileId: ''
                },

                // 按钮加载状态
                btnLoading_auditPass: false, // 通过审核

                // 流程步骤
                processStepList: [],
                // 步骤审核内容
                documentAuditList: {},

                // 是否开启测试
                openTest: false,
                imgSrc: ''

            };
        },
        watch: {
            documentHandleId: {
                immediate: true,
                handler(val) {
                    this.auditForm.documentHandleId = val;
                    this.auditPassForm.documentHandleId = val;
                    if(val !== '') {
                        this.getDataDetail();
                    }
                }
            }
        },
        methods: {
            // 调起盖章签名选择
            onClick_selectSignature() {
                this.$refs.modal_userSignatureSelect.getSignature();
            },
            // 选择签名的图片
            modal_signatureSelect_callback(obj) {
                Object.assign(this.eSignature, obj);
            },
            // 盖章后
            modal_eSignature() {
                Object.assign(this.eSignature, {
                    name: '',
                    url: '',
                    userId: '',
                    signatureId: '',
                    fileId: ''
                });
            },

            onPrint() {
                this.print2x = true;
                this.$Spin.show();
                setTimeout(() => {
                    this.exportPDF(false);
                },1500);

            },
            exportPDF(isUpload) {
                let scale = 2;

                // let page_a4 = [595.28, 841.89]; // 宽 / 高

                return new Promise(((resolve, reject) => {
                    try {
                        html2canvas(this.$refs[this.documentHandle.fileRecordType].$el, {
                            scale: scale, // 添加的scale 参数
                            // canvas: canvas, //自定义 canvas
                            // logging: true, //日志开关，便于查看html2canvas的内部执行流程
                            // width: page_a4[0] * scale, //dom 原始宽度
                            // height: page_a4[1] * scale,
                            useCORS: true // 【重要】开启跨域配置
                        }).then((canvas) => {
                            let context = canvas.getContext('2d');
                            // 【重要】关闭抗锯齿
                            context.mozImageSmoothingEnabled = false;
                            context.webkitImageSmoothingEnabled = false;
                            context.msImageSmoothingEnabled = false;
                            context.imageSmoothingEnabled = false;

                           // this.$refs.canvas.appendChild(canvas);

                            let moveHight = [841, 841, 841];
                            // let idx = 0;

                            let pageData = canvas.toDataURL('image/JPEG', 1);
                            if (this.openTest) {
                                this.imgSrc = pageData;
                                this.print2x = false;
                                this.$Spin.hide();
                                // return;
                            }


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
                                    pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight, 'mybgimg' );
                                    leftHeight -= pageHeight;
                                    position -= moveHight[0];
                                    //避免添加空白页
                                    if(leftHeight > 0) {
                                        pdf.addPage();
                                    }
                                }
                            }
                            this.print2x = false;
                            this.$Spin.hide();
                            if (isUpload) {
                                resolve(pdf.output('datauristring').substr(28));
                            }
                            else {
                                pdf.save(`${this.documentHandle.fileName}.pdf`);
                                resolve();
                            }
                        });
                    }
                    catch (e) {
                        this.print2x = false;
                        reject();
                        this.$Spin.hide();
                        this.$Notice.warning('生成PDF失败！');
                    }
                }));
            },

            // 获取文档详情(内容、进度)
            getDataDetail() {
                this.$http({
                    method: 'get',
                    url: '/documentHandle/detail',
                    params: {
                        documentHandleId: this.documentHandleId
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {

                        this.processStepList = res.data.processStepList || [];
                        this.documentAuditList = res.data.documentAuditList || {};

                        Object.assign(this.documentHandle, res.data.documentHandle);
                        if (res.data.documentAudit) {
                            Object.assign(this.documentAudit, res.data.documentAudit);
                        }

                        if (res.data.documentHandle.auditContent) {
                            this.temData = eval(`[${res.data.documentHandle.auditContent}]`)[0];
                        }

                        this.auditPassForm.auditProcessId = res.data.documentHandle.auditProcessId || '';
                        this.auditPassForm.processStepId = res.data.documentHandle.processStepId || '';

                    }
                })
            },

            // 保存内容
            saveContent() {
                let temData = JSON.stringify(this.$refs[this.documentHandle.fileRecordType].temData);
                this.$http({
                    method: 'post',
                    url: '/documentHandle/save',
                    data: JSON.stringify({
                        auditContent: temData,
                        documentHandleId: this.documentHandleId
                    })
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.$Message.success('保存成功！');
                        this.getDataDetail();
                    }
                });
            },

            // 提交审核
            submitAudit() {
                if (this.$refs[this.documentHandle.fileRecordType].validateContent()) {
                    this.auditForm.auditContent = JSON.stringify(this.$refs[this.documentHandle.fileRecordType].temData);
                    this.$refs.modal_auditProcessSelect.modalValue = true;
                }
                else {
                    this.$Modal.confirm({
                        title: '提示',
                        content: `您所填写文件内容不完整,是否继续`,
                        onOk: () => {
                            this.auditForm.auditContent = JSON.stringify(this.$refs[this.documentHandle.fileRecordType].temData);
                            this.$refs.modal_auditProcessSelect.modalValue = true;
                        }
                    })
                }

            },
            // 选择审核流程回调
            modal_auditProcessSelect_callback(selectValue, selectItems) {
                this.auditForm.auditProcessId = selectItems.auditProcessId;
                this.$Modal.confirm({
                    title: '提示',
                    content: `确定要提交审核？`,
                    onOk: () => {
                        this.$http({
                            method: 'post',
                            url: '/documentHandle/submitAudit',
                            data: JSON.stringify(this.auditForm)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success('提交审核成功！');
                                this.$emit('callback');
                            }
                        })
                    }
                })
            },

            // 审核通过
            auditPass(fileId) {
                this.auditPassForm.fileId = fileId || '';
                this.auditPassForm.auditContent = JSON.stringify(this.$refs[this.documentHandle.fileRecordType].temData);
                this.$http({
                    method: 'post',
                    url: '/documentHandle/audit',
                    data: JSON.stringify(this.auditPassForm)
                }).then(res => {
                    this.btnLoading_auditPass = false;
                    if(res.code === 'SUCCESS') {
                        this.$Message.success('审核通过');
                        this.$emit('callback');
                    }
                }).catch(e => {
                    this.btnLoading_auditPass = false;
                })
            },
            uploadFile() {
                if (!this.ifESignature()) {
                    this.$Message.error('您尚未电子签名，请确认签名后通过！');
                    return;
                }

                this.btnLoading_auditPass = true;
                if (this.documentAudit.lastStep) {
                    this.print2x = true;
                    this.$Spin.show();
                    setTimeout(() => {
                        this.exportPDF(true).then(data => {
                            this.$http({
                                method: 'post',
                                url: '/file/uploadAuditFile',
                                data: JSON.stringify({
                                    base64Content: data,
                                    fileRecordType: this.documentHandle.fileRecordType,
                                })
                            }).then(res => {
                                if (res.code === 'SUCCESS') {
                                    this.auditPass(res.data.fileId);
                                }
                            })
                        });
                    },1500);

                }
                else {
                    this.auditPass();
                }

            },
            // 判断当前用户通过审核的时候是否已经盖章
            ifESignature() {
                let eSignatureList = this.$refs[this.documentHandle.fileRecordType].temData.stamp;

                for (let i = 0; i < eSignatureList.length; i++) {
                    if (eSignatureList[i].userId === this.$store.state.user.userId) {
                        return true;
                    }
                }
                return false;
            }
        }
    }
</script>

<style lang="scss">
    .documentHandler-container {
        position: relative;
        .ivx-filter-box {
            position: fixed;
            top: 240px;
        }

        .process-steps {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 300px;

            .ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner {
                border-color: #19be6b;
            }
            .ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner span, .ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner>.ivu-steps-icon {
                color: #19be6b;
            }
            .ivu-steps-item.ivu-steps-status-finish .ivu-steps-tail>i:after {
                background: #19be6b;
            }
        }

        .set-bg-color {
            background-color: #FFF;
        }
    }
</style>