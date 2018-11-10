<template>
    <div class="file-container"
         :class="{active}"
         @click="onSelect"
         @mouseover="onMouseOver"
         @mouseleave="onMouseLeave">
        <Icon :type="iconType"
              class="folder-icon"
              :size="size"/>
        <p class="title"
           :style="{width: `${size}px`, fontSize: `${fontSize}px`, height: `${rows * 20 + 1}px`}"
           v-show="title!== ''">{{omitTitle}}</p>
        <p class="title hover-title"
           v-show="hover"
           :style="{width: `${size}px`, fontSize: `${fontSize}px`, top: `${size}px`}">{{title}}</p>

        <div class="cover" :class="{'cover-show': hover}">
            <Icon type="ios-eye" size="20" color="#FFF" title="预览" @click.stop="onClick_view"/>
            <Icon type="md-download" size="20" color="#FFF" title="下载" @click.stop="onClick_download" />
        </div>

        <vViewFile ref="viewFile" :title="data.fileName" :src="data.url" :format="data.fileFormat"></vViewFile>
    </div>
</template>
<script>
    import Config from '../../config';
    import vViewFile from '../viewFile/viewFile';
    export default {
        name: 'ivx-file',
        components: {vViewFile},
        props: {
            active: {
                type: Boolean,
                default: false
            },
            size: {
                type: Number,
                default: 64,
            },
            title: {
                type: String,
                default: ''
            },
            data: {
                type: [Object, Array],
                default: () => {
                    return {};
                }
            },
            fontSize: {
                type: Number,
                default: 14
            },
            // 行数
            rows: {
                type: Number,
                default: null
            }
        },
        computed: {
            omitTitle() {
                let length = this.getStringLength(this.title);
                let row_words = parseInt(this.size / this.fontSize);

                if (this.rows && length > (this.rows * row_words * 2) ) {
                    return this.title.substr(0, (this.rows * row_words - 2)) + '...';
                }
                else {
                    return this.title;
                }

            }
        },
        data() {
            return {
                iconType: 'md-document',
                hover: false
            };
        },
        methods: {
            // 获取字符长度，中文长度为2
            getStringLength(str) {
                return str.replace(/[\u0391-\uFFE5]/g,"aa").length; //先把中文替换成两个字节的英文，在计算长度
            },
            onSelect() {

                this.$emit('on-select', this.data, !this.active);
            },
            onMouseOver() {
                this.hover = true;
            },
            onMouseLeave() {
                this.hover = false;
            },

            onClick_view() {
                this.$refs.viewFile.refresh();
            },

            onClick_download() {
                window.open( Config[Config.env].filePath +  this.data.url);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .file-container {
        position: relative;
        text-align: center;
        cursor: pointer;
        overflow: hidden;

        &.active {
            background-color: #cdcdce;
            box-shadow: 1px 2px 2px #dcdee2;

            .title {
                &.hover-title{
                    background-color: #cdcdce;
                }
            }
        }
        .folder-icon {
            color: rgba(244, 158, 34, 0.7);
            &:hover {
                color: rgba(244, 158, 34, 1);
            }
        }
        .title {
            line-height: 20px;

            &.hover-title{
                position: absolute;
                z-index: 99;
                background-color: #f8f8f9;
            }
        }

        .cover {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            opacity: 0;
            transform: translate(0, -56px);
            transition: all 0.2s;
            background: rgba(0, 0, 0, .6);

            .ivu-icon {
                cursor: pointer;
                margin: 4px 10px;
            }

            &.cover-show {
                opacity: 1;
                transform: translate(0, 0);
            }
        }
    }
</style>