<template>
    <div class="viewFiles-container">
        <Modal v-model="modalValue"
               title="查看附件"
               :width="800"
               footer-hide>
            <div class="ivx-table-box">
                <Table border
                       height="400"
                       :columns="tableColumns"
                       :data="data"></Table>
            </div>

            <vViewFile ref="viewFile"
                       :title="viewFileProps.title"
                       :src="viewFileProps.src"
                       :format="viewFileProps.format"
                       :target="viewFileProps.target"></vViewFile>
        </Modal>
    </div>
</template>

<script>
    import modalMixin from '../../../lib/mixin/modalMixin';
    import MOMENT from 'moment';
    import uploadMixin from '../../../lib/mixin/uploadMixin';
    import vViewFile from '../../../components/viewFile/viewFile';
    import Config from '../../../config';
    export default {
        name: 'viewFiles',
        mixins: [modalMixin, uploadMixin],
        components: {vViewFile},
        props: {
            preview: {
                type: Boolean,
                default: true
            },
            download: {
                type: Boolean,
                default: true
            },
            data: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
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
                        // fixed: 'right',
                        render: (h, params) => {
                            let list = [];

                            if (this.preview) {
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
                            }

                            if (this.download) {
                                list.push(
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small',
                                            to: Config[Config.env].filePath + params.row.url,
                                            icon: 'ios-cloud-download-outline',
                                            target: '_blank'
                                        },
                                        attrs: {
                                            download: params.row.fileName + '.' + params.row.fileFormat
                                        }
                                    }, '下载')
                                );
                            }

                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],

                viewFileProps: {
                    title: '',
                    src: '',
                    format: '',
                    target: ''
                }
            };
        }
    }
</script>

<style lang="scss" scoped>
    .viewFiles-container {
    }
</style>