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
                          @on-select="onSelectFolder"></vIvxFile>
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
                immediate: true,
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
                        // this.fileList = [
                        //     {
                        //         fileId: '001',
                        //         fileName: '文件1'
                        //     },{
                        //         fileId: '002',
                        //         fileName: '文件2'
                        //     },
                        //     {
                        //         fileId: '003',
                        //         fileName: '文件3'
                        //     },
                        //     {
                        //         fileId: '004',
                        //         fileName: '文件4'
                        //     }
                        //
                        // ];
                    }
                })
            },
            // 判断文件是否已选
            isAcitve(item) {
                // return this.folderType.selectedFileList.indexOf(item) > -1;
                for(let i = 0; i < this.folderType.selectedFileList.length; i++) {
                    if (this.folderType.selectedFileList[i].fileId === item.fileId) {
                        return true;
                    }
                }
                return false;
            },
            onSelectFolder(data, active){
                this.$emit('callback', data, active);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .projectFilesList-container {
        .file-list {
            /*overflow: hidden;*/
            li {
                float: left;
                margin: 15px;
            }
        }
    }
</style>