<template>
    <div class="accessoryFileList-container">
        <Modal v-model="modalValue"
               title="查看附件"
               :width="800"
               footer-hide
               @on-visible-change="onVisibleChange">
            <div class="ivx-table-box">
                <Table border
                       height="450"
                       :loading="tableLoading"
                       :columns="tableColumns"
                       :data="tableData"></Table>
            </div>
        </Modal>
    </div>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    export default {
        name: 'accessoryFileList',  // 查看附件列表
        mixins: [modalMixin],
        data() {
            return {
                tableColumns: [
                    { title: '序号', width: 60, align: 'center', type: 'index', },
                    { title: '名称', align: 'center', key: 'name' },
                    { title: '类型', width: 80, align: 'center', key: 'fileFormat' },
                    { title: '上传时间', width: 180, align: 'center', key: 'insTime' },
                    { title: '上传者', width: 120, align: 'center', key: 'userName' },
                    // { title: '路径',  align: 'left', key: 'url' },
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
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'md-download',
                                        to: 'http://www.baidu.com',
                                        target: '_blank'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteSignature(params.row);
                                        }
                                    }
                                }, '下载')
                            ];

                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData:[
                    {
                        name: '文件名称1',
                        fileFormat: '.png',
                        url: '/user.jpg',
                        insTime: '2018-09-08 00:00:00',
                        userName: '陈亮'
                    },
                    {
                        name: '文件名称1',
                        fileFormat: '.png',
                        url: '/user.jpg',
                        insTime: '2018-09-08 00:00:00',
                        userName: '陈亮'
                    },
                    {
                        name: '文件名称2',
                        fileFormat: '.png',
                        url: '/user.jpg',
                        insTime: '2018-09-08 00:00:00',
                        userName: '陈亮'
                    }
                ],
                tableLoading: false,
            };
        },
        methods: {
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/',
                    params: {}
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data;
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .accessoryFileList-container {
    }
</style>