<template>
    <div class="eSignatureSelect-container">
        <div class="modal-body">
            <vIvxFilterBox>
                <Form inline>
                    <FormItem label="名称:" :label-width="65">
                        <Input v-model="searchParams.searchKey" placeholder="请输入电子签名名称" />
                    </FormItem>
                    <FormItem :label-width="20">
                        <Button type="primary"
                                @click="getData">检索</Button>
                    </FormItem>
                </Form>
            </vIvxFilterBox>

            <div class="ivx-table-box">
                <Table ref="table"
                       border
                       height="540"
                       :columns="tableColumns"
                       :data="tableData"
                       @on-select="onSelect"
                       @on-select-cancel="onSelectCancel"
                       @on-select-all="onSelectAll"
                       @on-selection-change="onSelectionChange"></Table>
                <Page prev-text="上一页"
                      next-text="下一页"
                      show-total
                      :current="searchParams.current"
                      :page-size="searchParams.size"
                      :total="searchParams.total"
                      :on-change="onPageChange"></Page>
            </div>
        </div>

        <div class="ivu-modal-footer">
            <Button type="primary"
                    size="large"
                    :loading="loading"
                    @click="add">添加</Button>
        </div>
    </div>
</template>

<script>
    import vIvxFilterBox from '@/components/ivxFilterBox/ivxFilterBox';
    export default {
        name: 'eSignatureSelect',
        components: {vIvxFilterBox},
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 7,      // 每页几行
                    total: 0,     // 总行数
                    searchKey: ''
                },
                tableColumns: [
                    { title: '选择', width: 60, align: 'center', type: 'selection'},
                    { title: '名称', width: 120, align: 'center', key: 'name' },
                    { title: '类型', width: 120, align: 'center', key: 'fileFormat' },
                    { title: '上传时间', width: 180, align: 'center', key: 'insTime' },
                    { title: '状态', width: 120, align: 'center', key: 'signatureStatusLabel' },
                    { title: '授权用户', width: 120, align: 'center', key: 'userName' },
                    { title: '路径',  align: 'left', key: 'url' }
                ],
                tableData: [
                    {
                        signatureId: '001',
                        name: '电子签名',
                        fileFormat: '.png',
                        url: '/user.jpg',
                        insTime: '2018-09-08 00:00:00',
                        signatureStatusLabel: '已授权',
                        userName: '陈亮'
                    },
                    {
                        signatureId: '002',
                        name: '电子签名',
                        fileFormat: '.png',
                        url: '/user.jpg',
                        insTime: '2018-09-08 00:00:00',
                        signatureStatusLabel: '已授权',
                        userName: '陈亮'
                    }
                ],
                selectValue: [],
                loading: false
            };
        },
        mounted() {
            this.selectValue = [];
            // this.getData();
        },
        methods: {
            /**
             * 分页控件-切换页面
             * @param current
             */
            onPageChange(current) {
                this.searchParams.current = current;
            },
            // 获取表格数据
            getData() {
                this.$http({
                    method: 'post',
                    url: '/getUserList',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records;
                        this.searchParams.total = res.data.total;
                    }
                })
            },
            /**
             * 表格选择
             */
            onSelect(selection, row) {
                this.selectValue.push(row.signatureId);
            },
            onSelectCancel(selection, row) {
                let idx = this.selectValue.indexOf(row.signatureId);
                this.selectValue.splice(idx, 1);
            },
            onSelectAll(selection) {
                selection.forEach((val) => {
                    let idx = this.selectValue.indexOf(val.signatureId);
                    if (idx === -1) {
                        this.selectValue.push(val.signatureId);
                    }
                });
            },
            onSelectionChange(selection) {
                if (selection.length === 0) {
                    this.tableData.forEach((val) => {
                        let idx = this.selectValue.indexOf(val.signatureId);
                        if (idx !== -1) {
                            this.selectValue.splice(idx, 1);
                        }
                    });
                }
            },
            add() {
                this.loading = true;
                this.$emit('handleSelect', this.selectValue);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .eSignatureSelect-container {
        .ivu-modal-footer {
            padding-bottom: 0;
        }
    }
</style>