<template>
    <div class="viewFiles-container">
        <Modal v-model="modalValue"
               title="查看附件"
               :width="800"
               :footer-hide="!select">
            <div class="ivx-table-box">
                <Table border
                       height="400"
                       :columns="tableColumns"
                       :data="data"
                       :highlight-row="!multiple"
                       @on-current-change="onCurrentChange"
                       @on-select="onSelect"
                       @on-select-cancel="onSelectCancel"
                       @on-select-all="onSelectAll"
                       @on-selection-change="onSelectionChange"></Table>
            </div>
            <div slot="footer">
                <Button type="primary"
                        size="large"
                        @click="addSelect">添加</Button>
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
            },
            // 增加选择附件功能
            select: {
                type: Boolean,
                default: false
            },
            multiple: {
                type: Boolean,
                default: true
            },
        },
        data() {
            return {
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: this.multiple ? 'selection' : 'index' },
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
                },
                selectItems: [],
                selectValue: []
            };
        },
        methods:{
            onCurrentChange(currentRow, oldCurrentRow) {
                this.selectItems = currentRow;
                this.selectValue = currentRow.fileId;
            },
            /**
             * 表格选择
             */
            onSelect(selection, row) {
                this.selectItems.push(row);
                this.selectValue.push(row.fileId);
            },
            onSelectCancel(selection, row) {
                let idx = this.selectValue.indexOf(row.fileId);
                this.selectValue.splice(idx, 1);
                this.selectItems.splice(idx, 1);
            },
            onSelectAll(selection) {
                selection.forEach((val) => {
                    let idx = this.selectValue.indexOf(val.fileId);
                    if (idx === -1) {
                        this.selectValue.push(val.fileId);
                        this.selectItems.push(val);
                    }
                });
            },
            onSelectionChange(selection) {
                if (selection.length === 0) {
                    this.data.forEach((val) => {
                        let idx = this.selectValue.indexOf(val.fileId);
                        if (idx !== -1) {
                            this.selectValue.splice(idx, 1);
                            this.selectItems.splice(idx, 1);
                        }
                    });
                }
            },
            addSelect() {
                this.$emit('onSelect', this.selectItems);
                this.selectValue = [];
                this.selectItems = [];
                this.modalValue = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .viewFiles-container {
    }
</style>