<template>
    <div class="viewFile-container">
        <Modal class="thumb-modal"
               v-model="modalShow"
               :width="800"
               :title="title"
               footer-hide>
            <div style="text-align: center">
                <img class="img" :src="src" alt="" style="max-width: 768px;">
            </div>
        </Modal>
    </div>
</template>

<script>
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
            }
        },
        watch: {
            src(val) {
                if(val !== '') {
                    this.refresh();
                }
            }
        },
        data() {
            return {
                modalShow: false
            }
        },
        methods: {
            refresh() {
                if (this.fileFormat === '' || this.target === '_blank') {
                    window.open(this.src);
                }
                else {
                    this.modalShow = true;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .viewFile-container {
    }
</style>