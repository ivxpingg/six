<template>
    <div class="template_word_file_2-container">
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
                <div class="letter-header">
                    <div class="text-inner">
                        六安市交通建设工程质量监督局
                    </div>
                </div>
                <div class="text-14 line-height-28 text-align-right m-t-10 m-b-28" >交工监函[
                    <vInputSpan v-model="temData.page_1.value_1" :scale="scale" :inputWidth="80" :underLine="false">] </vInputSpan>
                    号
                </div>
                <h1 class="text-align-center ">
                    市交通质监局关于
                    <vInputSpan v-model="temData.page_1.value_2" :scale="scale" :width="180" :inputWidth="180"></vInputSpan>
                    工程综合督查情况的通报
                </h1>


                <div :class="classNameType.mainClass">
                    <vInputSpan v-model="temData.page_1.value_3" :scale="scale" :width="100"></vInputSpan>：
                </div>
                <div :class="classNameType.mainClass_list1">
                    根据六安市交通质监局
                    <vInputSpan v-model="temData.page_1.value_4" :scale="scale" ></vInputSpan>
                    年度质量监督工作计划，
                    <vInputSpan v-model="temData.page_1.value_5" :scale="scale" ></vInputSpan>
                    年
                    <vInputSpan v-model="temData.page_1.value_6" :scale="scale" ></vInputSpan>
                    月
                    <vInputSpan v-model="temData.page_1.value_7" :scale="scale" ></vInputSpan>
                    日，市交通质监局对
                    <vInputSpan v-model="temData.page_1.value_8" :scale="scale" ></vInputSpan>
                    工程进行了综合督查。督查组通过听取汇报、查阅资料、查看现场、检查实体等方式对该项目各参建单位的质量安全管理行为、实体工程质量及质量保证资料等进行了检查。现将综合督查情况通报如下:
                </div>

                <div :class="classNameType.mainClass">
                    一、实体检测内容及结果
                </div>
                <div :class="classNameType.mainClass">
                    （一）检测内容
                    <Input v-model="temData.page_1.value_9" type="textarea" :rows="8" placeholder="请输入检测内容"/>
                </div>
            </div>

            <!--第二页-->
            <div class="page">
                <div :class="classNameType.mainClass">
                    （二）检测结果
                </div>
                <div class="text-14 text-align-center line-height-28 letter-spacing-2">
                    <vInputSpan v-model="temData.page_2.value_1" :scale="scale" ></vInputSpan>
                    工程实体检测统计表
                </div>

                <Table class="custom-table"
                       :width="tableWidth"
                       :columns="columns"
                       :data="temData.tableData"
                       border size="small"></Table>

            </div>

            <!--第三页-->
            <div class="page">
                <div :class="classNameType.mainClass">
                    二、质量管理情况
                    <Input v-model="temData.page_3.value_1" type="textarea" :rows="20"/>
                </div>
            </div>

            <!--第四页-->
            <div class="page">
                <div :class="classNameType.mainClass">
                    三、安全管理情况
                </div>
                <div :class="classNameType.mainClass_list1">
                    详见我局
                    <vInputSpan v-model="temData.page_4.value_1" :scale="scale" ></vInputSpan>
                    月
                    <vInputSpan v-model="temData.page_4.value_2" :scale="scale" ></vInputSpan>
                    日现场下发的《安全生产
                    <vInputSpan v-model="temData.page_4.value_3" :scale="scale" ></vInputSpan>
                    》。
                </div>

                <div :class="classNameType.mainClass">
                    四、整改意见
                    <Input v-model="temData.page_4.value_4" type="textarea" :rows="8" placeholder="请输入整改意见"/>
                </div>
                <div :class="classNameType.mainClass_list1">
                    针对本次督查发现的问题，业主单位应督促相关单位及时逐条整改落实，并将整改落实情况在
                    <vInputSpan v-model="temData.page_4.value_5" :scale="scale" ></vInputSpan>
                    个工作日内书面（附相关处理图片资料、记录等）反馈我局，我局将跟踪督查。
                </div>

                <div class="box-bottom">
                    <div class="text-14 line-height-28 text-align-left m-b-30">签发人：</div>
                    <div class="text-16 text-align-right letter-spacing-2 m-b-10" >六安市交通建设工程质量监督局</div>
                    <div class="text-16 line-height-28 text-align-right"  style="border-bottom: 1px solid #333;">
                        <vInputSpan v-model="temData.page_4.value_6" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>年
                        <vInputSpan v-model="temData.page_4.value_7" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>月
                        <vInputSpan v-model="temData.page_4.value_8" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>日
                    </div>

                    <div class="text-14 line-height-28 letter-spacing-2"  style="border-bottom: 1px solid #333;">抄报：
                        <vInputSpan v-model="temData.page_4.value_9" :scale="scale" display="inline-block" :underLine="false" :width="360" :inputWidth="360"></vInputSpan>
                    </div>
                    <div class="text-14 line-height-28 letter-spacing-2 "  style="border-bottom: 1px solid #333;">抄送：
                        <vInputSpan v-model="temData.page_4.value_10" :scale="scale" display="inline-block" :underLine="false" :width="360" :inputWidth="360"></vInputSpan>
                    </div>
                    <div class="text-14 line-height-28 letter-spacing-2 m-t-10" style="border-bottom: 1px solid #333;">
                        六安市交通建设工程质量监督局
                        <span>
                            <vInputSpan v-model="temData.page_4.value_11" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>年
                            <vInputSpan v-model="temData.page_4.value_12" :scale="scale" :inputWidth="50" :underLine="false"></vInputSpan>月
                            <vInputSpan v-model="temData.page_4.value_13" :scale="scale" :inputWidth="50" :underLine="false"></vInputSpan>日
                        </span>
                        印发
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
        name: 'template_word_file_2',  // 综合督查通报
        mixins: [classMixin, template_word_fileMixin],
        computed: {
            tableWidth() {
                return 479 * this.scale
            },
            columns() {
                return [
                    { title: '检测项目',  align: 'center',
                        renderHeader: this.tableTitleRender,
                        children: [
                            { title: '单位工程', key: 'name1', align: 'center', width: 77 * this.scale, renderHeader: this.tableTitleRender, render: this.tableRender},
                            { title: '分部工程类别', key: 'name2', align: 'center', width: 85 * this.scale, renderHeader: this.tableTitleRender, render: this.tableRender},
                            { title: '抽查项目', key: 'name3', align: 'center', width: 85 * this.scale, renderHeader: this.tableTitleRender, render: this.tableRender},
                        ]
                    },
                    { title: '检测点数/测区/单元', key: 'val_1', align: 'center', width: 80 * this.scale, renderHeader: this.tableTitleRender, render: this.tableRender},
                    { title: '合格点数/测区', key: 'val_2', align: 'center', width: 75 * this.scale, renderHeader: this.tableTitleRender, render: this.tableRender},
                    { title: '合格率（%）', key: 'val_3', align: 'center', width: 75 * this.scale, renderHeader: this.tableTitleRender, render: this.tableRender}
                ]
            }
        },
        data() {
            return {

                // 模板输入数据
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
                    },
                    page_3: {
                        value_1: '（一）建设单位\n\n' +
                        '（二）监理单位\n\n' +
                        '（三）施工单位\n\n' +
                        '……',
                    },
                    page_4: {
                        value_1: '',
                        value_2: '',
                        value_3: '',
                        value_4: '',
                        value_5: '',
                        value_6: '',
                        value_7: '',
                        value_8: '',
                        value_9: '',
                        value_10: '',
                        value_11: '',
                        value_12: '',
                        value_13: ''
                    },
                    tableData: [
                        { name1: '', name2: '', name3: '',val_1: '', val_2: '', val_3: '', },
                        { name1: '', name2: '', name3: '',val_1: '', val_2: '', val_3: '', },
                        { name1: '', name2: '', name3: '',val_1: '', val_2: '', val_3: '', },
                        { name1: '', name2: '', name3: '',val_1: '', val_2: '', val_3: '', },
                        { name1: '', name2: '', name3: '',val_1: '', val_2: '', val_3: '', },
                        { name1: '', name2: '', name3: '',val_1: '', val_2: '', val_3: '', },
                        { name1: '', name2: '', name3: '',val_1: '', val_2: '', val_3: '', },
                        { name1: '', name2: '', name3: '',val_1: '', val_2: '', val_3: '', },
                        { name1: '', name2: '', name3: '',val_1: '', val_2: '', val_3: '', },
                        { name1: '', name2: '', name3: '',val_1: '', val_2: '', val_3: '', },
                        { name1: '', name2: '', name3: '',val_1: '', val_2: '', val_3: '', },
                        { name1: '', name2: '', name3: '',val_1: '', val_2: '', val_3: '', },
                        { name1: '', name2: '', name3: '',val_1: '', val_2: '', val_3: '', }
                    ]
                }
            };
        },
        methods: {
            tableTitleRender(h, params) {

               return h('span',{
                   style: {
                       fontSize: 12 * this.scale + 'px'
                   }
               }, params.column.title);
            },
            tableRender(h, params) {
                return h(vInputSpan, {
                    style: {
                        fontSize: 12 * this.scale + 'px'
                    },
                    props: {
                        value: params.row[params.column.key],
                        underLine: false,
                        updateBlur: true,
                        scale: this.scale
                    },
                    on: {
                        input: (value) => {
                            this.temData.tableData[params.index][params.column.key] = value;
                        }
                    }
                });
            },

            // 判断是否全部填写
            // @return Boolean
            validateContent() {
                console.dir(this.temData);
                for (let key in this.temData) {
                    if (key !== 'stamp' && key !== 'tableData') {

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
<style lang="scss">
    .template_word_file_2-container {
        display: inline-block;
    }
</style>