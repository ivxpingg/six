<template>
    <div class="template_word_file_0-container">
        <div :class="classNamePri">

            <!--第一页-->
            <div class="page">
                <div class="text-14 text-align-right m-b-10" >编号：<Input v-model="temData.page_1.value_1" class="input-text-under-line"  style="width: 120px;" /></div>
                <h1>公路工程质量监督管理受理通知书</h1>
                <div class="box-bottom">
                    <div class="text-16 letter-spacing-2 m-b-30">工程名称：<Input  v-model="temData.page_1.value_2" class="input-text-under-line width-320" /></div>
                    <div class="text-16 letter-spacing-2 m-b-30">监督单位：<Input  v-model="temData.page_1.value_3" class="input-text-under-line width-320"  /></div>

                    <div class="text-14 line-height-28 text-align-center">
                        <vInputSpan v-model="temData.page_1.value_4" :underLine="false"></vInputSpan>年
                        <vInputSpan v-model="temData.page_1.value_5" :underLine="false"></vInputSpan>月
                        <vInputSpan v-model="temData.page_1.value_6" :underLine="false"></vInputSpan>日
                    </div>
                </div>
            </div>

            <!--第二页-->
            <div class="page">
                <div class="text-14 text-align-left line-height-28   m-b-10">
                    <vInputSpan v-model="temData.page_2.value_1"></vInputSpan>：
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    根据《建设工程质量管理条例》、《建设工程安全生产管理条
                    例》、《公路水运工程安全生产监督管理办法》、《公路水运工程质量监督管理规定》和《六安市公路水运工程质量监督实施细则》等规定，我局受理
                    <vInputSpan v-model="temData.page_2.value_2"></vInputSpan>
                    的质量监督，并将按下述计划由
                    <vInputSpan v-model="temData.page_2.value_3"></vInputSpan>
                    等组成监督小组对该工程进行质量监督。本项目的监督负责人为
                    <vInputSpan v-model="temData.page_2.value_4"></vInputSpan>
                </div>

                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    一、项目概况
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    二、监督依据
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    三、监督范围、期限、内容和方式
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    四、监督主要工作
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    五、监督计划
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    （一）工程准备阶段
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    （二）工程实施阶段
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    （三）交工、竣工验收阶段
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    六、问题处理方式
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    七、其他内容
                </div>

            </div>

            <!--第三页-->
            <div class="page">
                <div class="text-14 text-align-left line-height-28 letter-spacing-2">
                    一、项目概况
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    1、项目地点、里程、工程建设内容；
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    2、设计标准、路面结构层（结构物结构形式）布置；
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    3、计划开竣工日期、项目造价；
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    4、从业单位名称。
                </div>


                <div class="text-14 text-align-left line-height-28 letter-spacing-2">
                    二、监督依据
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    1．建设工程质量管理条例（2017年687号修订）；
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    2．建设工程安全生产管理条例（国务院2003年第393号）；
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    4.公路水运工程安全生产监督管理办法（交通运输部2017年第25号）；
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    5. 公路水运工程质量监督管理规定（交通运输部2017年第28号）；
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    6.公路工程竣（交）工验收办法实施细则（交公路发[2010]65号）；
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    7.六安市公路水运工程质量监督实施细则（六交工监〔2014〕5号）；
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    8．公路工程质量检验评定标准（JTG F80/1-2017）；
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    9. 交通运输部办公厅关于加强公路水运工程质量安全监督管理工作的指导意见（交办安监〔2017〕162号）；
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    10. 经批复的工程设计文件、变更设计文件，以及合同文件；
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    11.项目内容涉及的国家标准或行业标准和安徽省颁布现行法规、标准、规范等。
                </div>

                <div class="text-14 text-align-left line-height-28 letter-spacing-2">
                    三、监督范围、期限、内容和方式
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    （一）监督范围
                    <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                        ××路××段××级公路新建（改建）工程（除机电工程和绿化工程）。
                    </div>
                </div>
            </div>
            <div class="page">
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    （二）监督期限
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    本项目自建设单位办理完成施工许可或者开工备案手续之日起至工程竣工验收完成之日止为工程质量监督期。
                </div>
            </div>



        </div>
    </div>
</template>

<script>
    import template_word_fileMixin from './mixin/template_word_fileMixin';
    export default {
        name: 'template_word_file_0', // 公路工程质量监督受理通知书版本（附件三）
        mixins: [template_word_fileMixin],
        data() {
            return {
                // 模板输入数据
                temData: {
                    page_1: {
                        value_1: '',
                        value_2: '',
                        value_3: '',
                        value_4: '',
                        value_5: '',
                        value_6: '',
                    },
                    page_2: {
                        value_1: '',
                        value_2: '',
                        value_3: '',
                        value_4: '',
                        value_5: '',
                        value_6: '',
                        value_7: ''
                    },
                    stamp: []
                }
            };
        }
    }
</script>

<style lang="scss" src="./template.scss"></style>
<style lang="scss" src="./template2x.scss"></style>
<style lang="scss" scoped>
    .template_word_file_0-container {
        display: inline-block;
    }
</style>