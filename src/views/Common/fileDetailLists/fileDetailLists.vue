<template>
    <div class="fileDetailLists-container">
        <Table ref="table"
               border
               disabled-hover
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
            <vUploatFileManage :projectId="projectId" ></vUploatFileManage>
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
        name: 'fileDetailLists',
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
            }
        },
        created() {
            if (!this.isView) {
                let columns = [
                    {
                        title: '操作',
                        width: 200,
                        align: 'center',
                        render:(h, params) => {
                            return h('div', [
                                h('Button', {
                                    style: {
                                        marginRight: '10px'
                                    },
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-document-outline'
                                    },
                                    on: {
                                        click: () => {

                                            this.modal_uploadFileManage = true;
                                        }
                                    }
                                }, '附件管理'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-create-outline'
                                    },
                                    on: {
                                        click: () => {
                                            this.formData.projectFileId = params.row.projectFileId;
                                            this.formData.remark = params.row.remark;
                                            this.modal_remark = true;
                                        }
                                    }
                                }, '备注')
                            ]);
                        }
                    }
                ];
                this.tableColumns = this.tableColumns.concat(columns);
            }

        },
        updated() {

        },
        watch: {},
        mounted() {
             this.mergeCol();
        },
        data() {
            return {
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '项目', width: 80, align: 'center', key: 'item'},
                    { title: '明细', minWidth: 120, align: 'left', key: 'itemDetail'},
                    { title: '份数', width: 80, align: 'center', key: 'num'},
                    { title: '上传状态', width: 100, align: 'center', key: 'fileStatus'},
                    { title: '备注', width: 80, align: 'center', key: 'remark'}
                ],
                tableData: [
                    {
                        projectFileId: '0525',
                        fileTemplateId: '001',
                        projectId: '01',
                        classify: '质量监督申请处理标签',
                        item: '质量监督登记表',
                        itemDetail: '工程基本概括一览表',
                        num: 0,
                        fileStatus: '',
                        fileStatusLabel: '未上传',
                        remark: '备注'
                    },
                    {
                        projectFileId: '0525',
                        fileTemplateId: '001',
                        projectId: '01',
                        classify: '质量监督申请处理标签',
                        item: '质量监督登记表',
                        itemDetail: '项目建设管理机构情况表',
                        num: 0,
                        fileStatus: '',
                        fileStatusLabel: '未上传',
                        remark: '备注'
                    },
                    {
                        projectFileId: '0525',
                        fileTemplateId: '001',
                        projectId: '01',
                        classify: '质量监督申请处理标签',
                        item: '质量监督登记表',
                        itemDetail: '监理单位主要人员情况表',
                        num: 0,
                        fileStatus: '',
                        fileStatusLabel: '未上传',
                        remark: '备注'
                    },
                    {
                        projectFileId: '0525',
                        fileTemplateId: '001',
                        projectId: '01',
                        classify: '质量监督申请处理标签',
                        item: '质量监督登记表',
                        itemDetail: '施工单位主要人员情况表',
                        num: 0,
                        fileStatus: '',
                        fileStatusLabel: '未上传',
                        remark: '备注'
                    },
                    {
                        projectFileId: '0525',
                        fileTemplateId: '001',
                        projectId: '01',
                        classify: '质量监督申请处理标签',
                        item: '建设程序文件',
                        itemDetail: '施工图设计批复文件',
                        num: 0,
                        fileStatus: '',
                        fileStatusLabel: '未上传',
                        remark: '备注'
                    },
                    {
                        projectFileId: '0525',
                        fileTemplateId: '001',
                        projectId: '01',
                        classify: '质量监督申请处理标签',
                        item: '建设程序文件',
                        itemDetail: '全套施工图纸',
                        num: 0,
                        fileStatus: '',
                        fileStatusLabel: '未上传',
                        remark: '备注'
                    },
                    {
                        projectFileId: '0525',
                        fileTemplateId: '001',
                        projectId: '01',
                        classify: '质量监督申请处理标签',
                        item: '建设程序文件',
                        itemDetail: '监理合同(副本)及招投标文件',
                        num: 0,
                        fileStatus: '',
                        fileStatusLabel: '未上传',
                        remark: '备注'
                    }
                ],

                // 附件管理
                modal_uploadFileManage: false,

                // 备注
                modal_remark: false,
                formData: {
                    projectId: '',
                    fileTemplateId: '',
                    projectFileId: '',
                    remark: ''
                }
            };
        },
        methods: {
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
                    url: '/',
                    params: {
                        projectId: this.projectId
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.tableData = res.data || [];
                    }
                })
            },

            save() {

            },

            // 保存备注
            saveRemark() {
                this.$http({
                    method: 'post',
                    url: '/',
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