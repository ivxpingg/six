<template>
    <div class="unitSelect-container">
        <div class="modal-body">
            <vIvxFilterBox>
                <Form inline>
                    <FormItem label="关键字:" :label-width="65">
                        <Input v-model="searchParams.condition.searchKey" placeholder="请输入单位名称、机构代码" />
                    </FormItem>
                    <FormItem label="所属单位类型:" :label-width="90">
                        <Select v-model="searchParams.condition.unitType" style="width: 220px;">
                            <Option value="all">全部</Option>
                            <Option v-for="item in dict_unitType" :value="item.value" :key="`unitType_${item.id}`">{{item.label}}</Option>
                        </Select>
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
                       :data="filterData"
                       :highlight-row="!multiple"
                       @on-current-change="onCurrentChange"
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

        <div class="ivu-modal-footer six-modal-footer-padding-bottom-0">
            <Button type="primary"
                    size="large"
                    :loading="loading"
                    @click="addUnit">添加</Button>
        </div>
    </div>
</template>

<script>
    import vIvxFilterBox from '@/components/ivxFilterBox/ivxFilterBox';
    export default {
        name: 'unitSelect',
        components: {vIvxFilterBox},
        props: {
            multiple: {
                type: Boolean,
                default: false
            },
            selectedList: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 7,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        searchKey: '',
                        unitType: 'all'
                    }
                },
                tableColumns: [
                    { title: '选择', width: 60, align: 'center', type: this.multiple ? 'selection' : 'index'},
                    { title: '单位名称', width: 180, align: 'center', key: 'unitName' },
                    { title: '机构代码', width: 180, align: 'center', key: 'orgCode' },
                    { title: '资质类别', width: 180, align: 'center', key: 'qualificationTypeLabel' },
                    { title: '资质许可等级', width: 180, align: 'center', key: 'qualification' },
                    { title: '单位类型', width: 180, align: 'center', key: 'unitTypeLabel' },
                    { title: '负责人', width: 180, align: 'center', key: 'leader' },
                    { title: '联系方式', width: 180, align: 'center', key: 'telephone' },
                    { title: '电子邮件', width: 180, align: 'center', key: 'email' },
                    { title: '公司地址', width: 180, align: 'center', key: 'companyAddress' }
                ],
                tableData: [],

                selectValue: [],
                selectItems: [],

                loading: false,
                // 字典
                dict_unitType: []
            };
        },
        watch: {
            selectedList() {
                this.selectValue = [];
                this.selectItems = [];
            },
            unitId: {
                handler(val) {
                    this.searchParams.unitId = val;
                },
                immediate: true
            },
            'searchParams.condition.unitType'() {
                this.getData();
            },
            filterData(val) {
                let that = this;

                setTimeout(() => {
                    val.forEach((v, idx) => {
                        if (that.selectValue.indexOf(v.unitId) > -1) {
                            that.$refs.table.objData[idx]._isChecked = true;
                        }
                    });
                }, 200);
            },
        },
        computed: {
            filterData() {
                return this.tableData.filter(val => this.selectedList.indexOf(val.unitId) === -1);
            }
        },
        mounted() {
            this.selectValue = [];
            this.getData();
            this.getDict_unitType();
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
                let data = Object.assign({}, this.searchParams);

                if (data.condition.unitType === 'all') {
                    data.condition.unitType = '';
                }
                this.$http({
                    method: 'post',
                    url: '/unit/list',
                    data: JSON.stringify(data)
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records || [];
                        this.searchParams.total = res.data.total;
                    }
                })
            },

            getDict_unitType() {
                this.$http({
                    method: 'get',
                    url: '/dict/getListByType',
                    params: {
                        type: 'unitType'
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.dict_unitType = res.data;
                    }
                })
            },

            onCurrentChange(currentRow, oldCurrentRow) {
                this.selectItems = currentRow;
                this.selectValue = currentRow.unitId;
            },
            /**
             * 表格选择
             */
            onSelect(selection, row) {
                this.selectItems.push(row);
                this.selectValue.push(row.unitId);
            },
            onSelectCancel(selection, row) {
                let idx = this.selectValue.indexOf(row.unitId);
                this.selectValue.splice(idx, 1);
                this.selectItems.splice(idx, 1);
            },
            onSelectAll(selection) {
                selection.forEach((val) => {
                    let idx = this.selectValue.indexOf(val.unitId);
                    if (idx === -1) {
                        this.selectValue.push(val.unitId);
                        this.selectItems.push(val);
                    }
                });
            },
            onSelectionChange(selection) {
                if (selection.length === 0) {
                    this.tableData.forEach((val) => {
                        let idx = this.selectValue.indexOf(val.unitId);
                        if (idx !== -1) {
                            this.selectValue.splice(idx, 1);
                            this.selectItems.splice(idx, 1);
                        }
                    });
                }
            },
            addUnit() {
                this.$emit('handleSelect', this.selectValue, this.selectItems);
            }
        }
    }
</script>

<style lang="scss">
    .unitSelect-container {
        .modal-body {
            height: 660px;
            overflow-y: auto;
            overflow-x: hidden;
        }
    }
</style>