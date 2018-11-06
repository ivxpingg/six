<template>
    <div class="projectFilesList-container">
        <ul class="file-list">
            <li v-for="(item, idx) in fileList" :key="idx">
                <vIvxFile :title="item.fileName"
                          :active="isAcitve(item)"
                          :size="folderSize"
                          :fontSize="fontSize"
                          type="success"
                          :data="item"
                          :rows="3"
                          @on-select="onSelectFolder(item)"></vIvxFile>
            </li>
        </ul>
    </div>
</template>

<script>
    import vIvxFile from '../../../../../components/folder/file';
    export default {
        name: 'projectFilesList',   // 文件列表
        components: {vIvxFile},
        props: {
            projectId: {
                type: String,
                default: ''
            },
            /*
            * folderType: {
                    parentId: '',
                    index: 0,
                    folderName: '',
                    url: '',
                    selectedFileList: []
                }
            * */
            folderType: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        watch: {
            folderType: {
                deep: true,
                handler(val) {
                    if (val.url) {
                        this.getData();
                    }
                }
            }
        },
        data() {
            return {
                folderSize: 90,
                fontSize: 12,
                fileList: []
            };
        },
        methods: {
            getData() {
                this.$http({
                    method: 'get',
                    url: this.folderType.url,
                    params: {
                        projectId: this.projectId
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.fileList = res.data || [];
                    }
                })
            },
            // 判断文件是否已选
            isAcitve(item) {
                return this.folderType.selectedFileList.indexOf(item) > -1;
            },
            onSelectFolder(data, active){
                debugger
                this.$emit('callback', data, active);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .projectFilesList-container {
        .file-list {
            overflow: hidden;
            li {
                float: left;
                margin: 15px;
            }
        }
    }
</style>