<template>
    <div class="viewFile-container">
        <Modal class="thumb-modal"
               v-model="modalShow"
               :width="800"
               :title="title"
               footer-hide>
            <div style="text-align: center">
                <img class="img" :src="_src" alt="" style="max-width: 768px;">
            </div>
        </Modal>
    </div>
</template>

<script>
    import Config from '../../config';
    export default {
        name: 'viewFile',  // 查看文件
        props: {
            title: {
                type: String,
                default: ''
            },
            src: {
                type: String,
                required: true
            },
            format: {
                type: String,
                default: ''
            },
            // 打开方式  默认根据文件格式选择
            // _blank： 在新窗口打开
            target: {
                type: String,
                default: ''
            }
        },
        computed: {
            fileFormat() {
                if(this.format !== '') {
                    return this.format;
                }
                else {
                    return '';
                }
            },
            _src() {
                if (this.src.length > 0 && this.src.indexOf('http://') === -1) {
                    return Config[Config.env].filePath + this.src;
                }
                else {
                    return this.src;
                }
            }
        },
        watch: {
            _src(val) {
                if(val !== '') {
                    this.refresh();
                }
            }
        },
        data() {
            return {
                modalShow: false,
                formats: ['png', 'jpg', 'jpeg', 'bmp']
            }
        },
        methods: {
            refresh() {
                setTimeout(() => {

                    if ( this.formats.indexOf(this.fileFormat) === -1 || this.target === '_blank') {
                        window.open(this._src);
                    }
                    else {
                        this.modalShow = true;
                    }
                },100);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .viewFile-container {
    }
</style>