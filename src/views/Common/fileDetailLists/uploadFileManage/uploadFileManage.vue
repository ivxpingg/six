<template>
    <div class="uploadFileManage-container">
        <vIvxFilterBox v-if="!isView">
            <Upload :action="uploadAction"
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
            <Button type="primary">删除所有文件</Button>
        </vIvxFilterBox>

        <div class="ivx-table-box">
            <Table border
                   height="400"
                   :loading="tableLoading"
                   :columns="tableColumns"
                   :data="tableData"></Table>
        </div>

        <vViewFile ref="viewFile"
                   :title="viewFileProps.title"
                   :src="viewFileProps.src"
                   :format="viewFileProps.format"
                   :target="viewFileProps.target"></vViewFile>

    </div>
</template>

<script>
    import vIvxFilterBox from '@/components/ivxFilterBox/ivxFilterBox';
    import MOMENT from 'moment';
    import uploadMixin from '../../../../lib/mixin/uploadMixin';
    import vViewFile from '../../../../components/viewFile/viewFile';
    import Config from '../../../../config';
    export default {
        name: 'uploadFileManage',
        mixins: [uploadMixin],
        components: {vIvxFilterBox, vViewFile},
        props: {
            isView: {
                type: Boolean,
                default: false
            },
            projectId: {
                type: String,
                default() {
                    return '';
                }
            },
            fileTemplateId: {
                type: String,
                default() {
                    return '';
                }
            },
            projectFileId: {
                type: String,
                default() {
                    return '';
                }
            }
        },
        created() {
            let columns = [
                {
                    title: '操作',
                    width: this.isView ? 170:240,
                    align: 'center',
                    // fixed: 'right',
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
                        if (!this.isView) {
                            list.push(
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'ios-trash-outline'
                                    },
                                    on: {
                                        click: () => {
                                            this.del(params.row);
                                        }
                                    }
                                }, '删除')
                            );
                        }
                        list.push(
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    to: Config[Config.env].filePath + params.row.url,
                                    icon: 'ios-cloud-download-outline',
                                    target: '_blank'
                                }
                            }, '下载')
                        );

                        return h('div',{
                            class: 'ivx-table-cell-handle'
                        },list);
                    }
                }
            ];
            this.tableColumns = this.tableColumns.concat(columns);
        },
        computed:{
            uploadAction() {
                return this.uploadParams.actionUrl + '/register';
            }
        },
        watch: {
            projectFileId(val) {
                if(val !== '') {
                    this.getData();
                }
            }
        },
        data() {
            return {
                uploadParams: {},
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '文件名', align: 'center', key: 'fileName' },
                    { title: '文件格式', width: 100, align: 'center', key: 'fileFormat' },
                    { title: '上传时间', width: 180, align: 'center',
                        render:(h, params) => {
                            return h('div', MOMENT(params.row.insTime).format('YYYY-MM-DD HH:mm:ss'));
                        }
                    }
                    // {
                    //     title: '操作',
                    //     width: 240,
                    //     align: 'center',
                    //     // fixed: 'right',
                    //     render: (h, params) => {
                    //         let list = [
                    //             h('Button', {
                    //                 props: {
                    //                     type: 'info',
                    //                     size: 'small',
                    //                     icon: 'ios-eye-outline'
                    //                 }
                    //             }, '预览'),
                    //             h('Button', {
                    //                 props: {
                    //                     type: 'error',
                    //                     size: 'small',
                    //                     icon: 'ios-trash-outline'
                    //                 }
                    //             }, '删除'),
                    //             h('Button', {
                    //                 props: {
                    //                     type: 'primary',
                    //                     size: 'small',
                    //                     icon: 'ios-cloud-download-outline'
                    //                 }
                    //             }, '下载')
                    //         ];
                    //
                    //         return h('div',{
                    //             class: 'ivx-table-cell-handle'
                    //         },list);
                    //     }
                    // }
                ],
                tableData: [
                ],
                tableLoading: false,

                viewFileProps: {
                    title: '',
                    src: '',
                    format: '',
                    target: ''
                }
            };
        },
        methods: {
            fileUploadSuccess(response, file, fileList) {
                this.$Loading.finish();
                if(response.code === 'SUCCESS') {
                    this.$http({
                        method: 'post',
                        url: '/project/saveProjectFile',
                        data: JSON.stringify({
                            fileIds: [response.data.fileId],
                            projectId: this.projectId,
                            fileTemplateId: this.fileTemplateId,
                            projectFileId: this.projectFileId
                        })
                    }).then(res => {
                        if(res.code === 'SUCCESS') {
                            this.$Message.success('上传成功！');

                            if (this.projectFileId === '') {
                                this.$emit('callback', res.data);
                            }
                            else {
                                this.$emit('callback');
                            }

                            this.getData();
                        }
                    })
                }
            },
            getData() {
                this.$http({
                    method: 'get',
                    url: '/project/viewProjectAttachList',
                    params: {
                        projectFileId: this.projectFileId
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.tableData = res.data || [];
                    }
                })
            },

            // 删除
            del(row) {
                this.$Modal.confirm({
                    title: '删除',
                    content: `确定要删除<${row.fileName}>附件?`,
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/project/deleteProjectFile',
                            params: {
                                projectFileId: this.projectFileId,
                                fileId: row.fileId
                            }
                        }).then(res => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success('删除成功！');
                                this.$emit('callback');
                                this.getData();
                            }
                        })
                    }
                });

            }
        }
    }
</script>

<style lang="scss" scoped>
    .uploadFileManage-container {
    }
</style>