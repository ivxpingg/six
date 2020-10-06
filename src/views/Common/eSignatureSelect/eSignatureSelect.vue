<template>
    <div class="eSignatureSelect-container">
        <div class="modal-body">
            <vIvxFilterBox>
                <Form inline>
                    <FormItem label="名称:" :label-width="65">
                        <Input v-model="searchParams.name" placeholder="请输入电子签名名称" />
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
                       height="360"
                       :columns="tableColumns"
                       :data="tableData"
                       :highlight-row="!multiple"
                       @on-current-change="onCurrentChange"
                       @on-select="onSelect"
                       @on-select-cancel="onSelectCancel"
                       @on-select-all="onSelectAll"
                       @on-selection-change="onSelectionChange"></Table>
            </div>
        </div>

        <div class="ivu-modal-footer">
            <Button type="primary"
                    size="large"
                    @click="add">授权</Button>
        </div>
    </div>
</template>

<script>
    import vIvxFilterBox from '@/components/ivxFilterBox/ivxFilterBox';
    import MOMENT from 'moment';
    export default {
        name: 'eSignatureSelect',
        components: {vIvxFilterBox},
        props: {
            multiple: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                searchParams: {
                    name: ''
                },
                tableColumns: [
                    { title: '选择', width: 60, align: 'center', type: this.multiple ? 'selection' : 'index'},
                    { title: '名称', align: 'center', key: 'name' },
                    { title: '类型', width: 120, align: 'center', key: 'fileFormat' },
                    { title: '上传时间', width: 180, align: 'center', key: 'insTime',
                        render:(h, params) => {
                            return h('div', MOMENT(params.row.insTime).format('YYYY-MM-DD HH:mm:ss'));
                        }
                    },
                    { title: '状态', width: 120, align: 'center', key: 'signatureStatusLabel' }
                ],
                tableData: [],
                selectValue: [],
                selectItems: []
            };
        },
        mounted() {
            this.selectValue = [];
            this.getData();
        },
        methods: {
            // 获取表格数据
            getData() {
                this.$http({
                    method: 'get',
                    url: '/signature/chooseList',
                    params: {
                        name: this.searchParams.name
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data;
                    }
                })
            },
            /**
             * 表格选择
             */
            onCurrentChange(currentRow, oldCurrentRow) {
                this.selectItems = currentRow;
                this.selectValue = currentRow.signatureId;
            },
            onSelect(selection, row) {
                this.selectItems.push(row);
                this.selectValue.push(row.signatureId);
            },
            onSelectCancel(selection, row) {
                let idx = this.selectValue.indexOf(row.signatureId);
                this.selectValue.splice(idx, 1);
                this.selectItems.splice(idx, 1);
            },
            onSelectAll(selection) {
                selection.forEach((val) => {
                    let idx = this.selectValue.indexOf(val.signatureId);
                    if (idx === -1) {
                        this.selectValue.push(val.signatureId);
                        this.selectItems.push(val);
                    }
                });
            },
            onSelectionChange(selection) {
                if (selection.length === 0) {
                    this.tableData.forEach((val) => {
                        let idx = this.selectValue.indexOf(val.signatureId);
                        if (idx !== -1) {
                            this.selectValue.splice(idx, 1);
                            this.selectItems.splice(idx, 1);
                        }
                    });
                }
            },
            add() {
                this.$emit('handleSelect', this.selectValue, this.selectItems);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .eSignatureSelect-container {

    }
</style>