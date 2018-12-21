<template>
    <div class="filesSelect2-container">
        <Modal v-model="modalValue"
               title="选择文件"
               :width="800"
               footer-hide >

            <vIvxFilterBox>
                <Upload ref="upload"
                        :action="uploadAtion"
                        :showUploadList="uploadParams.showUploadList"
                        :multiple="uploadParams.multiple"
                        :accept="uploadParams.accept"
                        :maxSize="uploadParams.maxSize"
                        :before-upload="fileBeforeUpload"
                        :on-exceeded-size="exceededSize"
                        :on-error="fileUploadError"
                        :on-success="fileUploadSuccess">
                    <Button type="primary" icon="ios-cloud-upload-outline">上传文件</Button>
                </Upload>
            </vIvxFilterBox>

            <ul class="project-list">
                <li v-for="(item, idx) in projectList" :key="idx">
                    <vIvxFolder :title="item.projectName"
                                :size="folderSize"
                                :data="item"
                                :rows="3" @on-select="onSelectFolder"></vIvxFolder>
                </li>
            </ul>

        </Modal>
    </div>
</template>

<script>
    import modalMixin from '../../../lib/mixin/modalMixin';
    import uploadMixin from '../../../lib/mixin/uploadMixin';
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox.vue';
    export default {
        name: 'filesSelect2',
        mixins: [modalMixin, uploadMixin],
        components: {vIvxFilterBox},
        props: {
            fileType: {
                type: String,
                default: 'monitor_procedure'
            }
        },
        computed: {
            uploadAtion() {
                return this.uploadParams.actionUrl + '/' + this.fileType;  // 个人附件
            }
        },
        data() {
            return {
                searchParams: {
                    projectName: ''
                },
                folderSize: 90,
                projectList: [],
                currentRow: {
                    projectId: ''
                }
            };
        },
        mounted() {
            this.getData();
        },
        methods: {
            // 获取字符长度，中文长度为2
            getStringLength(str) {
                return str.replace(/[\u0391-\uFFE5]/g,"aa").length; //先把中文替换成两个字节的英文，在计算长度
            },
            // 选择的文件夹
            onSelectFolder(item) {
                this.currentRow.projectId = item.projectId;
                this.$refs.modal_projectFiles.modalValue = true;
            },

            getData() {
                this.$http({
                    method: 'post',
                    url: '/archive/archiveList',
                    data: JSON.stringify(this.searchParams)
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.projectList = res.data || [];
                    }
                })
            }

        }
    }
</script>

<style lang="scss" scoped>
    .filesSelect2-container {
    }
</style>