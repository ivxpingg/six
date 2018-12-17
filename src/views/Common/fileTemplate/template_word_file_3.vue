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
                <div class="text-14 text-align-right m-b-10" >编号：<Input v-model="temData.page_1.value_1" class="input-text-under-line"  style="width: 120px;" /></div>
                <h1>质量监督申请材料核查意见书</h1>
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
                <h1 class="m-b-32">质量监督申请材料核查意见书</h1>

                <div class="text-14 text-align-left line-height-28   m-b-10">
                    <vInputSpan v-model="temData.page_2.value_1"></vInputSpan>：
                </div>
                <div class="text-14 text-align-left line-height-28 letter-spacing-2 text-indent-28">
                    你单位于
                    <vInputSpan v-model="temData.page_2.value_2"></vInputSpan>
                    月
                    <vInputSpan v-model="temData.page_2.value_3"></vInputSpan>
                    日报
                    <vInputSpan v-model="temData.page_2.value_4"></vInputSpan>
                    质量监督申请及相关资料收悉，我局已审核，根据交通部《公路工程质量监督规定》、
                    省交通运输厅《安徽省公路水运工程质量监督实施细则》及质量监督备案制相关规定，
                    请你单位尽快督促各参建单位在7个工作日内补充完善下列资料，以便及时办理监督手续。
                </div>

                <div class="box-bottom">
                    <div class="text-16 text-align-right m-b-10" >六安市交通建设工程质量监督局</div>
                    <div class="text-14 line-height-28 text-align-right">
                        <vInputSpan v-model="temData.page_2.value_5" :inputWidth="60" :underLine="false"></vInputSpan>年
                        <vInputSpan v-model="temData.page_2.value_6" :inputWidth="60" :underLine="false"></vInputSpan>月
                        <vInputSpan v-model="temData.page_2.value_7" :inputWidth="60" :underLine="false"></vInputSpan>日
                    </div>
                </div>

            </div>

        </div>


    </div>
</template>

<script>
    import Config from '../../../config';
    import vInputSpan from './inputSpan/inputSpan';
    export default {
        name: 'template_word_file_3',  // 质量监督申请材料核查意见书
        components: {vInputSpan},
        props: {
            print2x: {
                type: Boolean,
                default: false
            },
            eSignature: {
                type: Object,
                default() {
                    return {
                        name: '',
                        url: '',
                        userId: '',
                        signatureId: ''
                    }
                }
            }
        },
        computed: {
            scale() {
                return this.print2x ? 2 : 1;
            },
            classNamePri() {
                return this.print2x ? 'six-template-content-2x' : 'six-template-content-1x'
            }
        },
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
                },

                // 盖章计算
                stampState: false,
                offsetX: 0,
                offsetY: 0
            };
        },
        watch:{
            eSignature: {
                deep: true,
                handler(val) {
                    this.stampState = val.url !== '';
                }
            }
        },
        methods: {
            // 拼接图片地址
            joinUrl(url) {

                return Config[Config.env].filePath + url;
            },
            onMousemove(e){
                if (this.stampState) {
                    this.offsetX = e.offsetX;
                    this.offsetY = e.offsetY;
                }
            },
            onClick_stamp() {
                this.stampState = false;

                let stamp_current = {
                    name: this.eSignature.name || '',
                    url: this.eSignature.url || '',
                    userId: this.eSignature.userId || '',
                    signatureId: this.eSignature.signatureId || '',
                    offsetX: this.offsetX,
                    offsetY: this.offsetY
                };

                this.temData.stamp = this.temData.stamp.filter(v => v.userId !== this.eSignature.userId);

                this.temData.stamp.push(stamp_current);

                console.dir(this.temData);

                this.$emit('callback');
            }
        }
    }
</script>
<style lang="scss" src="./template.scss"></style>
<style lang="scss" src="./template2x.scss"></style>
<style lang="scss" scoped>
    .template_word_file_3-container {
        display: inline-block;
    }
</style>