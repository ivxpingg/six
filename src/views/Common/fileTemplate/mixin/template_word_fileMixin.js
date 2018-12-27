import Config from '../../../../config';
import vInputSpan from '../inputSpan/inputSpan';
export default {
    components: {vInputSpan},
    props: {
        print2x: {
            type: Boolean,
            default: false
        },
        // 签名参数
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
        },
        data: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    computed: {
        scale() {
            return this.print2x ? 2 : 1;
        },
        classNamePri() {
            return this.print2x ? 'six-template-content-2x' : 'six-template-content-1x'
        },
        // 打印不要下划线
        prindUnderLine() {
            return !this.print2x;
        }
    },
    data() {
        return {
            // 盖章计算
            stampState: false,
            offsetX: 0,
            offsetY: 0
        }
    },
    watch:{
        data: {
            immediate: true,
            deep: true,
            handler(val) {
                if (val) {
                    Object.assign(this.temData, val);
                }
            }
        },
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

            this.$emit('callback');
        }
    }
};