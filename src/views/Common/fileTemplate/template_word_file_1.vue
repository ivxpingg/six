<template>
    <div class="template_word_file_1-container">
        <div :class="classNamePri">
            <div v-for="(item, idx) in temData.stamp"
                 class="signature-box"
                 :key="item.userId + idx"
                 :style="{
                     transform: `translate(${item.offsetX * scale - (50 * scale)}px, ${item.offsetY * scale - (50 * scale)}px)`}">
                <img :src="joinUrl(item.url)" alt=""/>
            </div>

            <!--盖章图层-->
            <div class="stamp-layer"  v-show="stampState">
                <img class="signature-img"
                     :src="joinUrl(eSignature.url)"
                     :alt="eSignature.name"
                     :style="{
                     transform: `translate(${offsetX * scale -(50 * scale)}px, ${offsetY * scale -(50 * scale)}px)`}">
            </div>
            <div class="stamp-layer-mouse"
                 v-show="stampState"
                 @mousemove="onMousemove($event)" @click="onClick_stamp"></div>

            <!--第一页-->
            <div class="page">
                <h1>六安市交通工程质量安全监督抽查意见通知书</h1>
                <div class="text-14 text-align-right line-height-28 m-t-10" >
                    编号：
                    <vInputSpan v-model="temData.page_1.value_1" :scale="scale"></vInputSpan>
                </div>
                <div class="box-bottom">
                    <div class="text-16 letter-spacing-2 m-b-30">工程名称：
                        <Input  v-model="temData.page_1.value_5" class="input-text-under-line width-320" />
                    </div>
                    <div class="text-16 letter-spacing-2 m-b-30">建设单位：
                        <Input  v-model="temData.page_1.value_6" class="input-text-under-line width-320"  />
                    </div>
                    <div class="text-16 letter-spacing-2 m-b-30">监理单位：
                        <Input  v-model="temData.page_1.value_7" class="input-text-under-line width-320"  />
                    </div>
                    <div class="text-16 letter-spacing-2 m-b-30">施工单位：
                        <Input  v-model="temData.page_1.value_8" class="input-text-under-line width-320"  />
                    </div>

                    <div class="text-14 line-height-28 text-align-center">
                        <vInputSpan v-model="temData.page_1.value_2" :scale="scale" :underLine="false"></vInputSpan>年
                        <vInputSpan v-model="temData.page_1.value_3" :scale="scale" :underLine="false"></vInputSpan>月
                        <vInputSpan v-model="temData.page_1.value_4" :scale="scale" :underLine="false"></vInputSpan>日
                    </div>
                </div>
            </div>

            <!--第二页-->
            <div class="page">
                <div class="page-inner-box" style="height: 100%;">
                    <div class="text-22 letter-spacing-2 p-t-30">存在问题及整改意见</div>

                    <div :class="classNameType.mainClass">
                        <vInputSpan v-model="temData.page_2.value_1" :scale="scale" :width="100"></vInputSpan>：
                    </div>
                    <div :class="classNameType.mainClass_list1">
                        <vInputSpan v-model="temData.page_2.value_2" :scale="scale" :width="400" :inputWidth="400"></vInputSpan>
                        ,检查情况如下:
                    </div>
                    <div :class="classNameType.mainClass_list1">
                        一、存在问题
                    </div>
                    <div :class="classNameType.mainClass">
                        <Input v-model="temData.page_2.value_3" class="input-boder-none" type="textarea" :rows="8" placeholder="请输入存在的问题"/>
                    </div>
                    <div :class="classNameType.mainClass_list1">
                        二、整改意见
                    </div>
                    <div :class="classNameType.mainClass">
                        <Input v-model="temData.page_2.value_4" class="input-boder-none" type="textarea"  :rows="8" placeholder="请输入整改意见"/>
                    </div>

                </div>
            </div>

            <!--第三页-->
            <div class="page">
                <div class="page-inner-box" style="height: 70%;">
                    <div :class="classNameType.mainClass_list1">
                        针对本次督查发现的问题，各相关责任单位应逐条整改落实到位，并将整改落实情况在
                        <vInputSpan v-model="temData.page_3.value_6" :scale="scale" ></vInputSpan>
                        个工作日内书面（附相关处理图片资料、记录等）反馈我局，我局将跟踪督查。
                    </div>
                    <div class="box-bottom">
                        <div class="text-14 line-height-28 text-align-left m-b-30">签发人：</div>
                        <div class="text-16 text-align-right letter-spacing-2 m-b-10" >六安市交通建设工程质量监督局</div>
                        <div class="text-14 line-height-28 text-align-right">
                            <vInputSpan v-model="temData.page_3.value_1" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>年
                            <vInputSpan v-model="temData.page_3.value_2" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>月
                            <vInputSpan v-model="temData.page_3.value_3" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>日
                        </div>
                    </div>
                </div>

                <div class="text-16 letter-spacing-2 m-t-60 m-b-30">抄报：
                    <Input  v-model="temData.page_3.value_4" class="input-text-under-line width-340" />
                </div>
                <div class="text-16 letter-spacing-2 m-b-30">抄送：
                    <Input  v-model="temData.page_3.value_5" class="input-text-under-line width-340"  />
                </div>

            </div>

            <!--第四页-->
            <div class="page">
                <h3 class="text-20">交通建设工程质量监督抽查意见反馈单</h3>
                <div class="text-16 letter-spacing-2 m-t-30">编 <span class="p-l-30"></span> 号：
                    <Input  v-model="temData.page_4.value_1"  class="input-text-under-none letter-spacing-2 width-320" />
                </div>
                <div class="text-16 letter-spacing-2 m-t-30">工程名称：
                    <Input  v-model="temData.page_4.value_2" class="input-text-under-none width-320" />
                </div>
                <div class="text-14 line-height-28 m-t-30 border-1">
                    <Input v-model="temData.page_4.value_3" class="input-boder-none" type="textarea" :rows="16"/>

                    <div class="text-align-left m-t-10 m-l-5 m-r-5" style="display: flex">
                        <div>业主负责人：（盖章）</div>
                        <div class="text-align-right" style="flex: 1">
                            <vInputSpan v-model="temData.page_3.value_1" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>年
                            <vInputSpan v-model="temData.page_3.value_2" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>月
                            <vInputSpan v-model="temData.page_3.value_3" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>日
                        </div>
                    </div>
                    <div class="text-align-left m-t-10 m-l-5 m-r-5" style="display: flex">
                        <div>施工负责人：（盖章）</div>
                        <div class="text-align-right" style="flex: 1">
                            <vInputSpan v-model="temData.page_3.value_1" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>年
                            <vInputSpan v-model="temData.page_3.value_2" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>月
                            <vInputSpan v-model="temData.page_3.value_3" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>日
                        </div>
                    </div>
                    <div class="text-align-left m-t-10 m-l-5 m-r-5" style="display: flex">
                        <div>监理负责人：（盖章）</div>
                        <div class="text-align-right" style="flex: 1">
                            <vInputSpan v-model="temData.page_3.value_1" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>年
                            <vInputSpan v-model="temData.page_3.value_2" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>月
                            <vInputSpan v-model="temData.page_3.value_3" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>日
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>

<script>
    import template_word_fileMixin from './mixin/template_word_fileMixin';
    import classMixin from './mixin/classMixin';
    export default {
        name: 'template_word_file_1',  // 六安市交通工程质量安全监督抽查意见通知书
        mixins: [classMixin, template_word_fileMixin],
        data() {
            return {
                temData: {
                    stamp: [],
                    page_1: {
                        value_1: '',
                        value_2: '',
                        value_3: '',
                        value_4: '',
                        value_5: '',
                        value_6: '',
                        value_7: '',
                        value_8: ''
                    },
                    page_2: {
                        value_1: '',
                        value_2: '',
                        value_3: '',
                        value_4: '',
                    },
                    page_3: {
                        value_1: '',
                        value_2: '',
                        value_3: '',
                        value_4: '',
                        value_5: '',
                        value_6: '',
                    },
                    page_4: {
                        value_1: '',
                        value_2: '',
                        value_3: '',
                        value_4: '',
                        value_5: '',
                        value_6: '',
                    }
                }
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
            }
        }
    }
</script>

<style lang="scss" src="./template.scss"></style>
<style lang="scss" src="./template2x.scss"></style>
<style lang="scss" src="./template2x_extra.scss"></style>
<style lang="scss" scoped>
    .template_word_file_1-container {
        display: inline-block;
    }
</style>