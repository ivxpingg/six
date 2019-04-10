<template>
    <div class="template_word_custom-container">
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
                        <vInputSpan v-model="temData.page_1.value_1"
                                    :scale='1'
                                    :inputWidth="400"
                                    :width="400"
                                    :underLine="false"></vInputSpan>
                    </div>
                </div>
                <div class="text-14 line-height-28 text-align-right m-t-10 m-b-56" >交工监函〔
                    <vInputSpan v-model="temData.page_1.value_2" :scale="scale" :inputWidth="80" :underLine="false">〕</vInputSpan>
                    <vInputSpan v-model="temData.page_1.value_3" :scale="scale" :inputWidth="80" :underLine="false"></vInputSpan>
                    号
                </div>

                <h1 class="text-align-center custom-h1 m-b-28">
                    <vInputSpan v-model="temData.page_1.value_4" :scale="scale" :underLine="false" :width="400" :inputWidth="400"></vInputSpan>
                </h1>

                <div class="custom-content" :class="classNameType.mainClass">
                    <Input v-model="temData.page_1.value_5"
                           class="input-boder-none"
                           type="textarea"
                           :autosize="{minRows: 18, maxRows: 18}"
                           @on-change="onChange_textarea($event, 18)"
                           placeholder="请输入"/>
                </div>
            </div>
            <!--第2页-->
            <div class="page" v-for="(item, idx) in temData.data" :key="item.key" v-show="!exportHide(item.value)">
                <div class="custom-content" :class="classNameType.mainClass">
                    <Input v-model="item.value"
                           class="input-boder-none"
                           type="textarea"
                           :autosize="{minRows: 26, maxRows: 26}"
                           @on-change="onChange_textarea($event, 26)"
                           placeholder="请输入"/>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import template_word_fileMixin from './mixin/template_word_fileMixin';
    import classMixin from './mixin/classMixin';
    const HIDDEN_TEXTAREA_STYLE = `
  min-height:0 !important;
  max-height:none !important;
  height:0 !important;
  visibility:hidden !important;
  overflow:hidden !important;
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important
`;

    const SIZING_STYLE = [
        'letter-spacing',
        'line-height',
        'padding-top',
        'padding-bottom',
        'font-family',
        'font-weight',
        'font-size',
        'text-rendering',
        'text-transform',
        'width',
        'text-indent',
        'padding-left',
        'padding-right',
        'border-width',
        'box-sizing',
    ];
    export default {
        name: 'template_word_custom',  // 自定义模板
        mixins: [classMixin, template_word_fileMixin],
        data() {
            return {
                temData: {
                    page_1: {
                        value_1: '六安市交通建设工程质量监督局',
                        value_2: '',
                        value_3: '',
                        value_4: '标题',
                        value_5: ''
                    },
                    data: [],  // [{value:'', key: '', }, {value: '', key: ''}]
                    stamp: []
                }
            };
        },
        watch: {
            'temData.page_1.value_5'(val) {
                if (val !== '' && this.temData.data.length === 0) {
                    this.temData.data.push({ value:'', key: Math.random() });
                }
                else if(val === '' && this.temData.data.length === 1) {
                    this.temData.data = [];
                }
            },
            'temData.data': {
                deep: true,
                handler(val) {

                    if (val.length > 0 && val[val.length - 1].value !== '') {
                        this.temData.data.push({ value:'', key: Math.random() });
                    }
                    else if(val.length > 1 && val[val.length - 2].value === '' && val[val.length - 1].value === '') {
                       this.temData.data.splice(val.length - 1, 1);
                    }
                }
            }
        },
        methods: {
            // 判断是否全部填写
            // @return Boolean
            validateContent() {
                for (let key in this.temData) {
                    if (key !== 'stamp' && key !== 'data') {

                        for (let k in this.temData[key]) {
                            if (this.temData[key][k] === '') {
                                return false;
                            }
                        }

                    }
                }
                return true;
            },
            exportHide(value) {
                return this.exportStatus && value === '';
            },
            calculateNodeStyling(node, useCache = false) {
                const nodeRef = (
                    node.getAttribute('id') ||
                    node.getAttribute('data-reactid') ||
                    node.getAttribute('name'));

                if (useCache && computedStyleCache[nodeRef]) {
                    return computedStyleCache[nodeRef];
                }

                const style = window.getComputedStyle(node);

                const boxSizing = (
                    style.getPropertyValue('box-sizing') ||
                    style.getPropertyValue('-moz-box-sizing') ||
                    style.getPropertyValue('-webkit-box-sizing')
                );

                const paddingSize = (
                    parseFloat(style.getPropertyValue('padding-bottom')) +
                    parseFloat(style.getPropertyValue('padding-top'))
                );

                const borderSize = (
                    parseFloat(style.getPropertyValue('border-bottom-width')) +
                    parseFloat(style.getPropertyValue('border-top-width'))
                );

                const sizingStyle = SIZING_STYLE
                    .map(name => `${name}:${style.getPropertyValue(name)}`)
                    .join(';');

                const nodeInfo = {
                    sizingStyle,
                    paddingSize,
                    borderSize,
                    boxSizing,
                };

                if (useCache && nodeRef) {
                    computedStyleCache[nodeRef] = nodeInfo;
                }

                return nodeInfo;
            },
            calcTextareaHeight(uiTextNode, minRows = null, maxRows = null, useCache = false) {
                let hiddenTextarea;
                if (!hiddenTextarea) {
                    hiddenTextarea = document.createElement('textarea');
                    document.body.appendChild(hiddenTextarea);
                }

                // Fix wrap="off" issue
                // https://github.com/ant-design/ant-design/issues/6577
                if (uiTextNode.getAttribute('wrap')) {
                    hiddenTextarea.setAttribute('wrap', uiTextNode.getAttribute('wrap'));
                } else {
                    hiddenTextarea.removeAttribute('wrap');
                }

                // Copy all CSS properties that have an impact on the height of the content in
                // the textbox
                let {
                    paddingSize, borderSize,
                    boxSizing, sizingStyle,
                } = this.calculateNodeStyling(uiTextNode, useCache);

                // Need to have the overflow attribute to hide the scrollbar otherwise
                // text-lines will not calculated properly as the shadow will technically be
                // narrower for content
                hiddenTextarea.setAttribute('style', `${sizingStyle};${HIDDEN_TEXTAREA_STYLE}`);
                hiddenTextarea.value = uiTextNode.value || uiTextNode.placeholder || '';

                let minHeight = Number.MIN_SAFE_INTEGER;
                let maxHeight = Number.MAX_SAFE_INTEGER;
                let height = hiddenTextarea.scrollHeight;
                let overflowY;

                if (boxSizing === 'border-box') {
                    // border-box: add border, since height = content + padding + border
                    height = height + borderSize;
                } else if (boxSizing === 'content-box') {
                    // remove padding, since height = content
                    height = height - paddingSize;
                }

                if (minRows !== null || maxRows !== null) {
                    // measure height of a textarea with a single row
                    hiddenTextarea.value = ' ';
                    let singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;
                    if (minRows !== null) {
                        minHeight = singleRowHeight * minRows;
                        if (boxSizing === 'border-box') {
                            minHeight = minHeight + paddingSize + borderSize;
                        }
                        height = Math.max(minHeight, height);
                    }
                    if (maxRows !== null) {
                        maxHeight = singleRowHeight * maxRows;
                        if (boxSizing === 'border-box') {
                            maxHeight = maxHeight + paddingSize + borderSize;
                        }
                        overflowY = height > maxHeight ? '' : 'hidden';
                        height = Math.min(maxHeight, height);
                    }
                }
                // Remove scroll bar flash when autosize without maxRows
                if (!maxRows) {
                    overflowY = 'hidden';
                }

                return {
                    height: `${height}px`,
                    minHeight: `${minHeight}px`,
                    maxHeight: `${maxHeight}px`,
                    overflowY
                };
            },
            onChange_textarea(dom, maxLine) {
                let Node = dom.currentTarget;
                // Copy all CSS properties that have an impact on the height of the content in
                // the textbox
                let res = this.calcTextareaHeight(Node, maxLine, maxLine);
                if (res.overflowY === '') {
                    this.$Message.error({
                        content: '超出文本框最大行数, 超出部分请在下个文本框输入！',
                        duration: 3
                    })
                    Node.style.borderColor = 'red';
                }
                else {
                    Node.style.borderColor = '';
                }
            }
        }
    }
</script>
<style lang="scss" src="./template.scss"></style>
<style lang="scss" src="./template2x.scss"></style>
<style lang="scss" src="./template2x_extra.scss"></style>
<style lang="scss" scoped>
    .template_word_custom-container {
        display: inline-block;

        .custom-h1 {
            font-weight: 500;
            font-size: 22px;
            font-family: '宋体';
            line-height: 1.2;
        }

        .custom-content {
            font-size: 16px;
            font-family: 'FangSong';
        }
    }
</style>