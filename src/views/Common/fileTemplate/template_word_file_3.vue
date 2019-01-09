<template>
    <div class="template_word_file_3-container">
        <div :class="classNamePri">

            <div v-for="(item, idx) in temData.stamp"
                 class="signature-box"
                 :key="item.userId + idx"
                 :style="{
                 transform: `translate(${item.offsetX * scale - 50}px, ${item.offsetY * scale -50}px)`}">
                <img :src="joinUrl(item.url)" alt=""/>
            </div>

            <!--盖章图层-->
            <div class="stamp-layer"  v-show="stampState">
                <img class="signature-img"
                     :src="joinUrl(eSignature.url)"
                     :alt="eSignature.name"
                     :style="{
                 transform: `translate(${offsetX * scale -50}px, ${offsetY * scale -50}px)`}">
            </div>
            <div class="stamp-layer-mouse"
                 v-show="stampState"
                 @mousemove="onMousemove($event)" @click="onClick_stamp"></div>

            <!--第一页-->
            <div class="page">
                <h1>质量监督申请材料核查意见书</h1>
                <div class="text-14 text-align-right line-height-28 m-t-10" >
                    编号：
                    <vInputSpan v-model="temData.page_1.value_1" :scale="scale"></vInputSpan>
                </div>
                <div class="box-bottom">
                    <div class="text-16 letter-spacing-2 m-b-30">工程名称：
                        <vInputSpan v-model="temData.page_1.value_2" :scale="scale" display="inline-block" :width="320" :inputWidth="320"></vInputSpan>
                    </div>
                    <div class="text-16 letter-spacing-2 m-b-30">监督单位：
                        <vInputSpan v-model="temData.page_1.value_3" :scale="scale" display="inline-block" :width="320" :inputWidth="320"></vInputSpan>
                    </div>

                    <div class="text-14 line-height-28 text-align-center">
                        <vInputSpan v-model="temData.page_1.value_4" :scale="scale" :underLine="false"></vInputSpan>年
                        <vInputSpan v-model="temData.page_1.value_5" :scale="scale" :underLine="false"></vInputSpan>月
                        <vInputSpan v-model="temData.page_1.value_6" :scale="scale" :underLine="false"></vInputSpan>日
                    </div>
                </div>
            </div>


            <!--第二页-->
            <div class="page">
                <h1 class="m-b-32">质量监督申请材料核查意见书</h1>

                <div class="text-14 text-align-left line-height-28 m-b-10">
                    <vInputSpan v-model="temData.page_2.value_1" :scale="scale" :underLine="prindUnderLine"></vInputSpan>：
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    你单位于
                    <vInputSpan v-model="temData.page_2.value_2" :scale="scale" :underLine="prindUnderLine"></vInputSpan>
                    月
                    <vInputSpan v-model="temData.page_2.value_3" :scale="scale" :underLine="prindUnderLine"></vInputSpan>
                    日报
                    <vInputSpan v-model="temData.page_2.value_4" :scale="scale" :underLine="prindUnderLine"></vInputSpan>
                    质量监督申请及相关资料收悉，我局已审核，根据交通部《公路水运工程质量监督管理规定》、
                    省交通运输厅《安徽省公路水运工程质量监督实施细则》及质量监督备案制相关规定，
                    请你单位尽快督促各参建单位在
                    <vInputSpan v-model="temData.page_2.value_8" :scale="scale" :underLine="prindUnderLine" ></vInputSpan>
                    个工作日内补充完善下列资料，以便及时办理监督手续。

                </div>
                <div :class="classNameType.mainClass">
                    <Input v-model="temData.page_2.value_9.value_9_1" type="textarea" :rows="temData.page_2.value_9.pageIndex === 1 ? 9 : 17" placeholder="请输入"/>
                </div>

                <div class="box-bottom" v-if="temData.page_2.value_9.pageIndex === 1">
                    <div class="text-14 line-height-28 text-align-left m-b-30">签发人：</div>
                    <div class="text-16 text-align-right letter-spacing-2 m-b-10" >六安市交通建设工程质量监督局</div>
                    <div class="text-14 line-height-28 text-align-right">
                        <vInputSpan v-model="temData.page_2.value_5" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>年
                        <vInputSpan v-model="temData.page_2.value_6" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>月
                        <vInputSpan v-model="temData.page_2.value_7" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>日
                    </div>
                </div>

                <ButtonGroup class="btn-group-list top-320" v-if="!print2x" size="small" vertical>
                    <Button icon="ios-add" type="success" title="新增页" @click="addPage" v-show="temData.page_2.value_9.pageIndex < 6"></Button>
                    <Button icon="ios-close" type="error" title="删除最后一页" @click="delPage" v-show="temData.page_2.value_9.pageIndex > 1"></Button>
                </ButtonGroup>
            </div>

            <!--第三页-->
            <div class="page" v-if="temData.page_2.value_9.pageIndex > 2">
                <div :class="classNameType.mainClass">
                    <Input v-model="temData.page_2.value_9.value_9_3" type="textarea" :rows="26" placeholder="请输入"/>
                </div>
            </div>
            <!--第四页-->
            <div class="page" v-if="temData.page_2.value_9.pageIndex > 3">
                <div :class="classNameType.mainClass">
                    <Input v-model="temData.page_2.value_9.value_9_4" type="textarea" :rows="26" placeholder="请输入"/>
                </div>
            </div>
            <!--第五页-->
            <div class="page" v-if="temData.page_2.value_9.pageIndex > 4">
                <div :class="classNameType.mainClass">
                    <Input v-model="temData.page_2.value_9.value_9_5" type="textarea" :rows="26" placeholder="请输入"/>
                </div>
            </div>
            <!--第六页-->
            <div class="page" v-if="temData.page_2.value_9.pageIndex > 5">
                <div :class="classNameType.mainClass">
                    <Input v-model="temData.page_2.value_9.value_9_6" type="textarea" :rows="26" placeholder="请输入"/>
                </div>
            </div>
            <!--第七页-->
            <div class="page" v-if="temData.page_2.value_9.pageIndex > 1">
                <div :class="classNameType.mainClass">
                    <Input v-model="temData.page_2.value_9.value_9_2" type="textarea" :rows="20" placeholder="请输入"/>
                </div>
                <div class="box-bottom">
                    <div class="text-14 line-height-28 text-align-left m-b-30">签发人：</div>
                    <div class="text-16 text-align-right letter-spacing-2 m-b-10" >六安市交通建设工程质量监督局</div>
                    <div class="text-14 line-height-28 text-align-right">
                        <vInputSpan v-model="temData.page_2.value_5" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>年
                        <vInputSpan v-model="temData.page_2.value_6" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>月
                        <vInputSpan v-model="temData.page_2.value_7" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>日
                    </div>
                </div>
            </div>


        </div>


    </div>
</template>

<script>
    import template_word_fileMixin from './mixin/template_word_fileMixin';
    import classMixin from './mixin/classMixin';
    import vInputSpan from './inputSpan/inputSpan';
    export default {
        name: 'template_word_file_3',  // 质量监督申请材料核查意见书
        mixins: [classMixin, template_word_fileMixin],
        components: {vInputSpan},
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
                        value_7: '',
                        value_8: '',
                        value_9: {
                            pageIndex: 1,  // 1 到 6
                            value_9_1: '',
                            value_9_2: '',
                            value_9_3: '',
                            value_9_4: '',
                            value_9_5: '',
                            value_9_6: ''
                        }
                    },
                    stamp: []
                },
            };
        },
        methods: {
            // 判断是否全部填写
            // @return Boolean
            validateContent() {
                for (let key in this.temData) {
                    if (key !== 'stamp') {

                        for (let k in this.temData[key]) {
                            if (this.temData[key][k] === '') {
                                return false;
                            }
                        }

                    }
                }
                return true;
            },

            // 新增页面
            addPage() {
                if (this.temData.page_2.value_9.pageIndex < 6 ) {
                    this.temData.page_2.value_9.pageIndex++;
                }
            },
            // 移除页面
            delPage() {
                if (this.temData.page_2.value_9.pageIndex > 1) {
                    this.temData.page_2.value_9.pageIndex--;
                }
            }
        }
    }
</script>
<style lang="scss" src="./template.scss"></style>
<style lang="scss" src="./template2x.scss"></style>
<style lang="scss" src="./template2x_extra.scss"></style>
<style lang="scss" scoped>
    .template_word_file_3-container {
        display: inline-block;
    }
</style>