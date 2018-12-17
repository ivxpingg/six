<template>
    <div class="filesSelect-container">
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

            <div class="ivx-table-box">
                <Table border
                       :loading="tableLoading"
                       :columns="tableColumns"
                       :data="tableData"
                       :height="400"
                       highlight-row
                       @on-row-dblclick="onRowDbclick"
                       @on-current-change="onCurrentChange"></Table>
            </div>

        </Modal>

        <vViewFile ref="viewFile"
                   :title="viewFileProps.title"
                   :src="viewFileProps.src"
                   :format="viewFileProps.format"
                   :target="viewFileProps.target"></vViewFile>
    </div>
</template>
<script>
    import modalMixin from '../../../lib/mixin/modalMixin';
    import uploadMixin from '../../../lib/mixin/uploadMixin';
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox.vue';
    import vViewFile from '../../../components/viewFile/viewFile';
    import Config from '../../../config';
    import MOMENT from 'moment';
    export default {
        name: 'filesSelect',
        mixins: [modalMixin, uploadMixin],
        components: {vIvxFilterBox,vViewFile},
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
                uploadParams: {

                },
                searchParams: {},
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '文件名', align: 'center', key: 'fileName' },
                    { title: '文件格式', width: 100, align: 'center', key: 'fileFormat' },
                    { title: '上传时间', width: 180, align: 'center',
                        render:(h, params) => {
                            return h('div', MOMENT(params.row.insTime).format('YYYY-MM-DD HH:mm:ss'));
                        }
                    },
                    {
                        title: '操作',
                        width: 240,
                        align: 'center',
                        render: (h, params) => {
                            let list = [];
                            list.push(
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small',
                                        icon: 'ios-eye-outline'
                                    },
                                    on: {
                                        click: () => {
                                            if (this.viewFileProps.src !== '') {
                                                this.$refs.viewFile.refresh();
                                            }
                                            this.viewFileProps.title = params.row.fileName;
                                            this.viewFileProps.src =  Config[Config.env].filePath + params.row.url;
                                            this.viewFileProps.format = params.row.fileFormat;

                                        }
                                    }
                                }, '预览')
                            );

                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [],
                tableLoading: false,
                viewFileProps: {
                    title: '',
                    src: '',
                    format: '',
                    target: ''
                }
            }
        },
        mounted(){
            this.getData();
        },
        methods: {
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'get',
                    url: '/file/userCanChooseFileList'
                }).then(res => {
                    this.tableLoading = false;
                    if(res.code === 'SUCCESS') {
                        this.tableData = res.data || [];
                    }
                }).catch(e => {
                    this.tableLoading = false;
                })
            },
            onRowDbclick() {
                this.add();
            },
            onCurrentChange(currentRow, oldCurrentRow) {
                this.selectItems = currentRow;
                this.selectValue = currentRow.fileId;
            },
            add() {
                this.$emit('handleSelect', this.selectValue, this.selectItems);
            },

            fileUploadSuccess(response, file, fileList) {
                if (response.code === 'SUCCESS') {
                    this.selectValue = response.data.fileId;
                    this.selectItems = {
                        fileId: response.data.fileId,
                        fileName: response.data.fileName,
                        fileFormat: response.data.fileFormat,
                        url: response.data.url
                    }
                    this.add();
                }

            }

        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    .filesSelect-container {
    }
</style>