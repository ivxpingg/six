<template>
    <div class="uploadFileManage-container">
        <vIvxFilterBox v-if="!isView">
            <Upload :action="uploadParams.actionUrl"
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
                   height="540"
                   :loading="tableLoading"
                   :columns="tableColumns"
                   :data="tableData"></Table>
        </div>

    </div>
</template>

<script>
    import vIvxFilterBox from '@/components/ivxFilterBox/ivxFilterBox';
    import Config from '../../../../config';
    import MOMENT from 'moment';
    import uploadMixin from '../../../../lib/mixin/uploadMixin';
    export default {
        name: 'uploadFileManage',
        mixins: [uploadMixin],
        components: {vIvxFilterBox},
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
                                    }
                                }, '删除')
                            );
                        }
                        list.push(
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'ios-cloud-download-outline'
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
        data() {
            return {
                uploadParams: {
                    actionUrl: Config[Config.env].origin + Config[Config.env].ajaxUrl + '',
                    showUploadList: false,  // 显示已上传列表
                    multiple: false,        // 是否支持多选
                    data: {},               // 上传附带参数
                    // name: '',               // 上传的文件字段名, 默认file
                    // accept: '.xlsx',             // 接收上传的文件类型
                    maxSize: 40960,                // 文件大小限制，单位 kb
                },
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
                    {
                        fileName: '设计图',
                        fileFormat: '.png',
                        insTime: '2018-08-01'
                    }
                ],
                tableLoading: false,
            };
        },
        methods: {
            fileUploadSuccess(response, file, fileList) {
                this.$Loading.finish();
            },
            getData() {
                this.$http({
                    method: 'get',
                    url: '/',
                    params: {
                        projectId: this.projectId
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.tableData = res.data || [];
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .uploadFileManage-container {
    }
</style>