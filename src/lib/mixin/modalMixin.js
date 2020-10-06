export default {
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        value: {
            immediate: true,
            handler(val) {
                this.modalValue = val;
            }
        }
    },
    data() {
        return {
            modalValue: false
        }
    },
    methods: {
        onOk() {
            this.onVisibleChange(false);
        },
        onVisibleChange(val) {
            this.$emit('close', val);
        }
    }
}