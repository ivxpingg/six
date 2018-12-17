<template>
    <div class="filesSelectButton-container ivu-upload">
        <div class="ivu-upload ivu-upload-select">
            <Button icon="ios-cloud-upload-outline" type="primary" @click="onClick_select">选择文件</Button>
        </div>
        <ul class="ivu-upload-list">
            <template v-for="(item, idx) in fileList">
                <li class="ivu-upload-list-file ivu-upload-list-file-finish">
                <span>
                    <i class="ivu-icon ivu-icon-ios-image"></i> {{item.fileName}}.{{item.fileFormat}}
                </span>
                    <i class="ivu-icon ivu-icon-ios-close ivu-upload-list-remove" style="" @click="remove(idx)"></i>
                </li>
            </template>
        </ul>

        <vFilesSelect ref="modal_filesSelect" :multiple="multiple" :fileType="fileType" @handleSelect="onSelected"></vFilesSelect>
    </div>
</template>
<script>
    import vFilesSelect from './filesSelect.vue';
    export default {
        name: 'filesSelectButton',   // 用于选择文件
        components: {vFilesSelect},
        props: {
            multiple: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            // 上传的文件类型
            fileType: {
                type: String,
                default: 'monitor_procedure'
            }
        },
        data() {
            return {
                fileList: []
            }
        },
        methods: {
            onClick_select() {
                this.$refs.modal_filesSelect.modalValue = true;
            },
            remove(idx) {
                this.fileList.splice(idx, 1);
            },
            onSelected(selectValue, selectItems) {
                if (selectValue) {
                    if (this.multiple) {
                        let arr = this.fileList.find(v => selectValue === v.fileId);
                        if (arr === undefined) {
                            this.fileList.push(selectItems);
                        }
                    }
                    else {
                        this.fileList = [selectItems];
                    }
                    this.$emit('modal-callback', this.fileList);
                }
                this.$refs.modal_filesSelect.modalValue = false;
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    .filesSelectButton-container {
    }
</style>