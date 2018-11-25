<template>
    <Badge :count="count" :type="type" :offset="offset">
        <div class="folder-container"
             @click.stop="onSelect"
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
        </div>
    </Badge>
</template>

<script>
    export default {
        name: 'ivx-folder',
        props: {
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
            count: {
                type: [Number, String],
                default: 0
            },
            type: {
                type: String,
                default: 'primary'
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

                if (this.rows && length >= (this.rows * row_words * 2) ) {
                    return this.title.substr(0, (this.rows * row_words - 2)) + '...';
                }
                else {
                    return this.title;
                }

            }
        },
        watch: {},
        data() {
            return {
                iconType: 'ios-folder',
                offset: [10,5],   // 设置状态点的位置偏移，格式为 [x, y]
                hover: false
            };
        },
        methods: {
            // 获取字符长度，中文长度为2
            getStringLength(str) {
                return str.replace(/[\u0391-\uFFE5]/g,"aa").length; //先把中文替换成两个字节的英文，在计算长度
            },
            onSelect() {

                this.$emit('on-select', this.data);
            },
            onMouseOver() {
                this.iconType = 'ios-folder-open';
                this.hover = true;
            },
            onMouseLeave() {
                this.iconType = 'ios-folder';
                this.hover = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .folder-container {
        position: relative;
        text-align: center;
        cursor: pointer;
        .folder-icon {
            color: rgba(244, 158, 34, 0.7);
            &:hover {
                color: rgba(244, 158, 34, 1);
            }
        }
        .title {
            line-height: 20px;
            word-break: break-all;

            &.hover-title{
                position: absolute;
                z-index: 99;
                background-color: #f8f8f9;
            }
        }
    }
</style>