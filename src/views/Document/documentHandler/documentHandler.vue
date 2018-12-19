<template>
    <div class="documentHandler-container">
        <vIvxFilterBox>
            <Button type="primary"
                    icon="md-add">提交审核</Button>
            <Button type="primary"
                    icon="md-add">审核通过</Button>
            <Button type="primary"
                    icon="md-add" @click="onClick_selectSignature">电子签名</Button>
            <Button type="primary"
                    icon="md-add">保存</Button>
            <Button type="primary"
                    icon="md-add" @click="onPrint">打印</Button>
        </vIvxFilterBox>

        <div style="text-align: center;">
            <div style="display: inline-block; border: 1px solid #dcdee2; margin: 10px 0;" ref="canvas">

                <!--<vTemplate_word_file_0 ref="template_word_file_0"-->
                                       <!--:print2x="print2x"-->
                                       <!--:eSignature="eSignature"-->
                                       <!--@callback="modal_eSignature"></vTemplate_word_file_0>-->

                <!--<vTemplate_word_file_1 ref="template_word_file_0"-->
                                       <!--:print2x="print2x"-->
                                       <!--:eSignature="eSignature"-->
                                       <!--@callback="modal_eSignature"></vTemplate_word_file_1>-->

                <vTemplate_word_file_2 ref="template_word_file_0"
                                       :print2x="print2x"
                                       :eSignature="eSignature"
                                       @callback="modal_eSignature"></vTemplate_word_file_2>

                <!--<vTemplate_word_file_3 ref="template_word_file_0"-->
                                       <!--:print2x="print2x"-->
                                       <!--:eSignature="eSignature"-->
                                       <!--@callback="modal_eSignature"></vTemplate_word_file_3>-->
            </div>
        </div>

        <vModalUserSignatureSelect ref="modal_userSignatureSelect" @modal-callback="modal_signatureSelect_callback"></vModalUserSignatureSelect>
    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vTemplate_word_file_0 from '../../Common/fileTemplate/template_word_file_0';
    import vTemplate_word_file_1 from '../../Common/fileTemplate/template_word_file_1';
    import vTemplate_word_file_2 from '../../Common/fileTemplate/template_word_file_2';
    import vTemplate_word_file_3 from '../../Common/fileTemplate/template_word_file_3';
    import vModalUserSignatureSelect from '../../Common/userSignatureSelect/modalUserSignatureSelect';
    import html2canvas from 'html2canvas';
    import jspdf from 'jspdf/dist/jspdf.debug';
    export default {
        name: 'documentHandler',
        components: {
            vIvxFilterBox,
            vTemplate_word_file_0,
            vTemplate_word_file_1,
            vTemplate_word_file_2,
            vTemplate_word_file_3,
            vModalUserSignatureSelect
        },
        props: {

        },
        data() {
            return {
                print2x: false,
                eSignature: {
                    name: '',
                    url: '',
                    userId: '',
                    signatureId: ''
                }
            };
        },
        methods: {
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
                let that = this;

                let scale = 2;

                // let page_a4 = [595.28, 841.89]; // 宽 / 高

                return new Promise(((resolve, reject) => {
                    try {
                        html2canvas(this.$refs.template_word_file_0.$el, {
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
                            let idx = 0;

                            let pageData = canvas.toDataURL('image/png', 1.0);
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
                                pdf.addImage(pageData, 'png', 0, 0, imgWidth, imgHeight );
                            } else {
                                while(leftHeight > 0) {
                                    pdf.addImage(pageData, 'png', 0, position, imgWidth, imgHeight, '', 'FAST');
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
                                pdf.save('content.pdf');
                                resolve();
                            }
                        });
                    }
                    catch (e) {
                        this.print2x = false;
                        resolve();
                        this.$Spin.hide();
                        this.$Notice.warning('生成PDF失败！');
                    }
                }));
            },
        }
    }
</script>

<style lang="scss" scoped>
    .documentHandler-container {
    }
</style>