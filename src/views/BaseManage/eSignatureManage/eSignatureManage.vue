<template>
    <div class="eSignatureManage-container">
        <vIvxFilterBox dashed>
            <Button type="primary"
                    icon="md-add"
                    @click="modal_addSignature_open">上传签名</Button>
        </vIvxFilterBox>

        <div class="ivx-table-box">
            <Table border
                   height="540"
                   :loading="tableLoading"
                   :columns="tableColumns"
                   :data="tableData"></Table>
            <Page prev-text="上一页"
                  next-text="下一页"
                  show-total
                  :current="searchParams.current"
                  :page-size="searchParams.size"
                  :total="searchParams.total"
                  :on-change="onPageChange"></Page>
        </div>


        <Modal v-model="modal_addSignature"
               title="上传电子签名"
               :width="360"
               footer-hide>
            <vUploadSignature @addSignaturCallback="modal_addSignaturCallback"></vUploadSignature>
        </Modal>

        <Modal v-model="modal_supervisorDetail"
               title="查看电子签名"
               :width="600"
               footer-hide>
            <img :src="imgUrl" alt="" style="width: 100%;">
        </Modal>
    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vUploadSignature from './uploadSignature/uploadSignature';
    import Config from '../../../config';
    export default {
        name: 'eSignatureManage',
        components: {vIvxFilterBox, vUploadSignature},
        data() {
            return {
                searchParams: {
                    current: 1,        // 当前第几页
                    size: 10,          // 每页几行
                    total: 0           // 总行数
                },
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '名称', width: 120, align: 'center', key: 'name' },
                    { title: '类型', width: 120, align: 'center', key: 'fileFormat' },
                    { title: '上传时间', width: 180, align: 'center', key: 'insTime' },
                    { title: '状态', width: 120, align: 'center', key: 'signatureStatusLabel' },
                    { title: '授权用户', width: 120, align: 'center', key: 'userName' },
                    { title: '路径',  align: 'left', key: 'url' },
                    {
                        title: '操作',
                        width: 180,
                        align: 'center',
                        render: (h, params) => {
                            let list = [
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small',
                                        icon: 'ios-eye-outline'
                                    },
                                    on: {
                                        click: () => {
                                            this.url = params.row.url;
                                            this.modal_supervisorDetail = true;
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'ios-trash-outline'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteSignature(params.row);
                                        }
                                    }
                                }, '删除')
                            ];

                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [
                    // {
                    //     signatureId: '001',
                    //     name: '电子签名',
                    //     fileFormat: '.png',
                    //     url: '/user.jpg',
                    //     insTime: '2018-09-08 00:00:00',
                    //     signatureStatusLabel: '已授权',
                    //     userName: '陈亮'
                    // },
                    // {
                    //     signatureId: '002',
                    //     name: '电子签名',
                    //     fileFormat: '.png',
                    //     url: '/user.jpg',
                    //     insTime: '2018-09-08 00:00:00',
                    //     signatureStatusLabel: '已授权',
                    //     userName: '陈亮'
                    // }
                ],
                tableLoading: true,

                // 新增电子签名
                modal_addSignature: false,

                // 监查电子签名
                modal_supervisorDetail: false,
                url: ''
            };
        },
        computed: {
            imgUrl() {
                return Config[Config.env].origin + this.url;
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            /**
             * 分页控件-切换页面
             * @param current
             */
            onPageChange(current) {
                this.searchParams.current = current;
            },
            modal_addSignature_open() {
                this.modal_addSignature = true;
            },
            modal_addSignaturCallback() {
                this.modal_addSignature = false;
            },
            // 获取表格数据
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/signature/list',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.page.records;
                        this.searchParams.total = res.data.page.total;
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            },

            deleteSignature(row) {
                this.$Modal.confirm({
                   title: '删除',
                   content: `确定要删除<${row.name}>电子签名,删除后不可恢复！`,
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/getUserList',
                            params: {
                                signatureId: row.signatureId
                            }
                        }).then((res) => {
                            if (res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '删除成功！'
                                });
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
    .eSignatureManage-container {

    }
</style>