<template>
    <div class="templat_test-container">
        <Button type="success" @click="onPrint">打印</Button>
        <vTemplate_word_file_0 ref="print" v-if="templateType === '0'"></vTemplate_word_file_0>
        <vTemplate_word_file_1 v-if="templateType === '1'"></vTemplate_word_file_1>
        <vTemplate_word_file_2 v-if="templateType === '2'"></vTemplate_word_file_2>
        <vTemplate_word_file_3 v-if="templateType === '3'"></vTemplate_word_file_3>
        <div style="float: right;" ref="canvas"></div>
    </div>
</template>

<script>
    import vTemplate_word_file_0 from './template_word_file_0';
    import vTemplate_word_file_1 from './template_word_file_1';
    import vTemplate_word_file_2 from './template_word_file_2';
    import vTemplate_word_file_3 from './template_word_file_3';
    import html2canvas from 'html2canvas';
    import jspdf from 'jspdf/dist/jspdf.debug';
    export default {
        name: 'templat_test',
        components: {
            vTemplate_word_file_0,
            vTemplate_word_file_1,
            vTemplate_word_file_2,
            vTemplate_word_file_3
        },
        data() {
            return {
                templateType: '0'
            };
        },
        mounted() {

            this.templateType = this.$route.query.type || '0';
        },
        methods: {
            onPrint() {
                this.exportPDF(false);
            },
            // 导出PDF
            exportPDF(isUpload) {
                let that = this;
                this.$Spin.show();

                let page_a4 = [595.28, 841.89]; // 宽 / 高

                return new Promise(((resolve, reject) => {
                    try {
                        html2canvas(this.$refs.print.$el, {
                            scale: 2, // 添加的scale 参数
                            // canvas: canvas, //自定义 canvas
                            // logging: true, //日志开关，便于查看html2canvas的内部执行流程
                            width: page_a4[0], //dom 原始宽度
                            height: page_a4[1],
                            useCORS: true // 【重要】开启跨域配置
                        }).then((canvas) => {
                            let context = canvas.getContext('2d');
                            // 【重要】关闭抗锯齿
                            context.mozImageSmoothingEnabled = false;
                            context.webkitImageSmoothingEnabled = false;
                            context.msImageSmoothingEnabled = false;
                            context.imageSmoothingEnabled = false;
                            this.$refs.canvas.appendChild(canvas);


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
                                    pdf.addImage(pageData, 'png', 0, position, imgWidth, imgHeight);
                                    leftHeight -= pageHeight;
                                    position -= moveHight[idx++];
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
                                pdf.save('content.pdf');
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
        }
    }
</script>

<style lang="scss" scoped>
    .templat_test-container {
    }
</style>