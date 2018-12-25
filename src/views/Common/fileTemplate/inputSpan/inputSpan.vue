<template>
    <span class="inputSpan-container"
          :style="inputSpanStyle"
          @click="onClick_span">
        {{currentValue}}
      <input class="input ivu-input ivu-input-default"
             ref="input"
             v-show="showInput"
             :autocomplete="false"
             :style="inputStyle"
             @blur="onBlur"
             v-model="currentValue" />
        <slot></slot>
    </span>
</template>

<script>
    export default {
        name: 'inputSpan',
        computed:{
            inputSpanStyle() {
                return {
                    'padding-left': this.currentValue.trim() === ''? this.width * this.scale + 'px': '0',
                    'border-bottom': this.underLine ? `${this.scale}px solid #000` : 'none',
                    'border-left': this.marginLeft * this.scale + 'px solid transparent' ,
                    'border-right': this.marginRight * this.scale + 'px solid transparent',
                }
            },
            inputStyle() {
                return {
                    width: this.inputWidth * this.scale + 'px',
                    top: this.inputTop * this.scale + 'px'
                }
            }
        },
        props: {
            scale: {
                type: Number,
                default: 1
            },
            value: {
                type: [String, Number],
                default: ''
            },
            inputClass: {
                type: String,
                default: ''
            },
            // 是否有下划线
            underLine: {
                type: Boolean,
                default: true
            },
            width: {
                type: Number,
                default: 40
            },
            inputWidth: {
                type: Number,
                default: 200
            },
            inputTop: {
                type: Number,
                default: -32
            },
            // 是否失去焦点触发更新数据
            updateBlur: {
                type: Boolean,
                default: false
            },
            marginLeft: {
                type: Number,
                default: 0
            },
            marginRight: {
                type: Number,
                default: 0
            }
        },
        watch: {
            currentValue(val) {
                if (!this.updateBlur) {
                    if (val === this.value) return;
                    this.$emit('input', this.currentValue);
                }
            }
        },
        mounted() {

        },
        data() {
            return {
                currentValue: this.value,
                showInput: false
            };
        },
        methods: {
            onClick_span() {
                if (this.showInput) return;
                this.showInput = true;
                this.$refs.input.focus();
                // 设置光标在开始位置
                if (this.$refs.input.setSelectionRange) {
                    setTimeout(() => {
                        this.$refs.input.setSelectionRange(0, 0);
                        this.$refs.input.focus();
                    }, 0)
                }
                else if(this.$refs.input.createTextRange){
                    let rng = this.$refs.input.createTextRange();
                    rng.move('character', 0);
                    rng.select();

                }
            },
            onBlur(e) {

                if (this.updateBlur) {
                    this.$emit('input', e.target.value);
                }
                this.showInput = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .inputSpan-container {
        position: relative;
        word-wrap: break-word;
        word-break: break-all;
        cursor: text;
        .input {
            position: absolute;
            left: 0;
            z-index: 999;
        }
    }
</style>