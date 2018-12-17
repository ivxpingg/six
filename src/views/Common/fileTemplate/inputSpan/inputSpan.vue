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
                    'padding-left': this.currentValue.trim() === ''? '40px': '0',
                    'border-bottom': this.underLine ? '1px solid #000' : 'none'
                }
            },
            inputStyle() {
                return {
                    width: this.inputWidth + 'px',
                    top: this.inputTop + 'px'
                }
            }
        },
        props: {
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
            inputWidth: {
                type: Number,
                default: 200
            },
            inputTop: {
                type: Number,
                default: -32
            }
        },
        watch: {
            currentValue(val) {
                if (val === this.value)  return;
                this.$emit('input', this.currentValue);
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
            onBlur() {
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
        .input {
            position: absolute;
            left: 0;
            z-index: 99;
        }
    }
</style>