<template>
    <div class="fileDetailLists-container">
        <Table ref="table"
               border
               :size="templateType === 'quality_supervision' ? 'small' : ''"
               disabled-hover
               :class="{'custom-ivu-table': isView, 'custom-ivu-table2': templateType !== 'quality_supervision'}"
               :data="tableData"
               :columns="tableColumns"></Table>
        <!--<div v-if="!isView" class="ivu-modal-footer">-->
            <!--<Button type="primary"-->
                    <!--size="large"-->
                    <!--@click="save">保存</Button>-->
        <!--</div>-->

        <Modal v-model="modal_uploadFileManage"
               title="附件管理"
               :width="800"
               footer-hide>
            <vUploatFileManage :isView="isView"
                               :projectId="projectId"
                               :projectFileId="currentRow.projectFileId"
                               :templateType="currentRow.templateType"
                               :fileTemplateId="currentRow.fileTemplateId" @callback="callback_uploadFileManage"></vUploatFileManage>
        </Modal>
        <Modal v-model="modal_remark"
               title="备注"
               :width="400"
               @on-ok="saveRemark">
            <Form>
                <FormItem :label-width="60" label="备注:">
                    <Input v-model="formData.remark" type="textarea" placeholder="备注" />
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import vUploatFileManage from './uploadFileManage/uploadFileManage';
    export default {
        name: 'fileDetailLists',  // 材料明细一览表
        components: {vUploatFileManage},
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
            /**
             * 模板类型 (字典) 默认：quality_supervision（质量监督申请处理标签）,
             * 空字符串代表全部模板
             */
            templateType: {
                type: String,
                default: ''
            }
        },
        created() {},
        updated() {

        },
        watch: {
            isView: {
                immediate: true,
                handler() {
                    this.setTableColumns();
                }
            },
            projectId: {
                immediate: true,
                handler(val) {
                    if (val !== '') {
                        this.formData.projectId = val;
                        this.getData();
                    }
                }
            }
        },
        mounted() {

        },
        data() {
            return {
                tableColumns: [],
                tableData: [
                    // {
                    //     projectFileId: '0525',
                    //     fileTemplateId: '001',
                    //     projectId: '01',
                    //     classify: '质量监督申请处理标签',
                    //     item: '质量监督登记表',
                    //     itemDetail: '工程基本概括一览表',
                    //     num: 0,
                    //     fileStatus: '',
                    //     fileStatusLabel: '未上传',
                    //     remark: '备注'
                    // }
                ],

                // 附件管理
                modal_uploadFileManage: false,

                // 备注
                modal_remark: false,
                currentRow: {
                    fileTemplateId: '',
                    projectFileId: ''
                },
                formData: {
                    projectId: '',
                    fileTemplateId: '',
                    projectFileId: '',
                    templateType: '',
                    remark: ''
                }
            };
        },
        methods: {
            setTableColumns() {
                if (this.isView) {
                    this.tableColumns = [
                        { title: '序号', width: 35, align: 'center', type: 'index', },
                        { title: '项目', width: 80, align: 'center', key: 'item'},
                        { title: '明细', minWidth: 120, align: 'left', key: 'itemDetail'},
                        { title: '备注', width: 90, align: 'left', key: 'remark'},
                        { title: '份数', width: 45, align: 'center', key: 'num',
                            render: (h, params) => {
                                if (params.row.num && params.row.num > 0) {
                                    return h('span', {
                                        style: {
                                            cursor: 'pointer',
                                            'text-decoration': 'underline'
                                        },
                                        on: {
                                            click: () => {
                                                this.currentRow.fileTemplateId = params.row.fileTemplateId || '';
                                                this.currentRow.projectFileId = params.row.projectFileId || '';
                                                this.currentRow.templateType = params.row.templateType || '';
                                                this.modal_uploadFileManage = true;
                                            }
                                        }
                                    }, params.row.num)
                                }
                                else {
                                    return h('span', '0');
                                }
                            }
                        }
                    ]
                }
                else {
                    this.tableColumns = [
                        { title: '序号', width: 35, align: 'center', type: 'index', },
                        { title: '项目', width: 80, align: 'center', key: 'item'},
                        { title: '明细', minWidth: 120, align: 'left', key: 'itemDetail'},
                        { title: '份数', width: 80, align: 'center', key: 'num',
                            render: (h, params) => {
                                if (params.row.num && params.row.num > 0) {
                                    return h('span', params.row.num)
                                }
                                else {
                                    return h('span', '0');
                                }
                            }
                        },
                        { title: '上传状态', width: 100, align: 'center', key: 'fileStatus', render: (h, params) =>{
                                return h('div', params.row.fileStatus === '1' ? '已上传' : '未上传');
                            }},
                        { title: '备注', width: 90, align: 'left', key: 'remark'},
                        {
                            title: '操作',
                            width: 200,
                            align: 'center',
                            render: (h, params) => {
                                let list = [];

                                list.push(h('Button', {
                                    style: {
                                        marginRight: '10px'
                                    },
                                    props: {
                                        type: this.isView ? 'text':'primary',
                                        size: 'small',
                                        icon: 'ios-document-outline'
                                    },
                                    on: {
                                        click: () => {

                                            this.currentRow.fileTemplateId = params.row.fileTemplateId || '';
                                            this.currentRow.projectFileId = params.row.projectFileId || '';
                                            this.currentRow.templateType = params.row.templateType;
                                            this.modal_uploadFileManage = true;
                                        }
                                    }
                                }, '附件管理'));

                                list.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-create-outline'
                                    },
                                    on: {
                                        click: () => {
                                            this.formData.fileTemplateId = params.row.fileTemplateId;
                                            this.formData.projectFileId = params.row.projectFileId || '';
                                            this.formData.remark = params.row.remark;
                                            this.modal_remark = true;
                                        }
                                    }
                                }, '备注'));

                                return h('div', list);
                            }
                        }
                    ]
                }
            },
            mergeCol() {
                let ivuTableRows = this.$refs.table.$el.querySelector('.ivu-table-body').querySelectorAll('.ivu-table-row');
                let item = '',
                    setIdx,
                    rowspan = 1;
                this.tableData.forEach((val, idx) => {
                    if (item === val.item) {
                        ++rowspan;
                        ivuTableRows[idx].removeChild(ivuTableRows[idx].childNodes[1]);
                    }
                    else {
                        if (idx !== 0) {
                            ivuTableRows[setIdx].childNodes[1].setAttribute('rowspan', rowspan);
                        }

                        setIdx = idx;
                        item = val.item;
                        rowspan = 1;
                    }
                });
                ivuTableRows[setIdx].childNodes[1].setAttribute('rowspan', rowspan);
            },
            getData() {
                this.$http({
                    method: 'get',
                    url: '/project/projectFileList',
                    params: {
                        projectId: this.projectId,
                        templateType: this.templateType
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.tableData = res.data || [];

                        setTimeout(() => {
                            this.mergeCol();
                        }, 1000);
                    }
                })
            },
            save() {

            },

            // 文件上传成功 回调
            callback_uploadFileManage(row) {
                if (row) {
                    this.currentRow.fileTemplateId = row.fileTemplateId;
                    this.currentRow.projectFileId = row.projectFileId;
                }
                this.getData();
            },

            // 保存备注
            saveRemark() {
                this.$http({
                    method: 'post',
                    url: '/project/updateFileRemark',
                    data: JSON.stringify(this.formData)
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.$Message.success({
                            content: '保存备注成功！'
                        });
                        this.getData();
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .fileDetailLists-container {
    }
</style>

<style lang="scss">

    .fileDetailLists-container {
        .ivu-table-cell {
            padding-left: 9px;
            padding-right: 9px;
        }
        .ivu-table td {
            height: 42px;
        }
        .ivu-table-small td {
            height: 20px;
        }
    }

    $color: rgba(181,43,25,0.4);
    .custom-ivu-table {
        border-color: $color;

        .ivu-table:before {
            background-color: $color;
        }
        .ivu-table:after {
            background-color: $color;
        }

        .ivu-table th {
            /*background-color: #FFF;*/
        }

        .ivu-table-border td, .ivu-table-border th {
            border-right: 1px solid $color;
        }
        .ivu-table td, .ivu-table th {
            border-bottom: 1px solid $color;
        }
    }
</style>