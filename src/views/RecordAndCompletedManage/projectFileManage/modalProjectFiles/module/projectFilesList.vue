<template>
    <div class="projectFilesList-container">
        <ul class="file-list">
            <li v-for="(item, idx) in fileList" :key="idx">
                <vIvxFile :title="item.fileName"
                            :size="folderSize"
                            :fontSize="fontSize"
                            type="success"
                            :rows="3" @on-select="onSelectFolder(item)"></vIvxFile>
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
            onSelectFolder() {

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