<template>
    <div class="employeeSelect-container">
        <div class="modal-body">
            <vIvxFilterBox>
                <Form inline>
                    <FormItem label="检索:" :label-width="65">
                        <Input v-model="searchParams.condition.name" placeholder="请输入姓名、UID" />
                    </FormItem>
                    <FormItem label="所属单位类型:" :label-width="90">
                        <Select v-model="searchParams.condition.unitType"
                                placeholder="全部"
                                clearable
                                style="width: 220px;">
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
                       :height="400"
                       :columns="tableColumns"
                       :data="filterSelected ? tableDataFilterSelected:tableData"
                       :highlight-row="!multiple"
                       @on-current-change="onCurrentChange"
                       @on-select="onSelect"
                       @on-select-cancel="onSelectCancel"
                       @on-select-all="onSelectAll"
                       @on-selection-change="onSelectionChange"></Table>
                <Page v-if="!filterSelected"
                      prev-text="上一页"
                      next-text="下一页"
                      show-total
                      :current="searchParams.current"
                      :page-size="searchParams.size"
                      :total="searchParams.total"
                      @on-change="onPageChange"></Page>
            </div>
        </div>

        <div class="ivu-modal-footer six-modal-footer-padding-bottom-0">
            <Button type="primary"
                    size="large"
                    :loading="loading"
                    @click="addPerson">添加</Button>
        </div>
    </div>
</template>

<script>
    import vIvxFilterBox from '@/components/ivxFilterBox/ivxFilterBox';
    export default {
        name: 'employeeSelect',
        components: {vIvxFilterBox},
        props: {
            // 数据源类型
            // noUnit、hasUnit、all
            userSourceType: {
                type: String,
                default: 'all'
            },
            unitId: {
                type: String,
                default: ''
            },
            multiple: {
                type: Boolean,
                default: true
            },
            selectedValue: {
                type: Array,
                default() {
                    return [];
                }
            },
            // 过滤已选的值
            filterSelected: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: this.filterSelected ? 10000:7,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        userSource: 'all',
                        unitId: '',
                        name: '',
                        unitType: ''
                    }
                },
                tableColumns: [
                    { title: '选择', width: 60, align: 'center', type: this.multiple ? 'selection' : 'index'},
                    { title: '姓名', width: 120, align: 'center', key: 'name' },
                    { title: 'UID', width: 80, align: 'center', key: 'uId' },
                    { title: '性别', width: 70, align: 'center', key: 'sexStr' },
                    { title: '年龄', width: 70, align: 'center', key: 'age' },
                    { title: '民族', width: 100, align: 'center', key: 'nationStr' },
                    { title: '职称级别', width: 120, align: 'center', key: 'titleLevel' },
                    { title: '技术职称', width: 120, align: 'center', key: 'titleName' },
                    { title: '学历', width: 120, align: 'center', key: 'education' },
                    { title: '联系电话', width: 120, align: 'center', key: 'phone' },
                    { title: '身份证号码', width: 160, align: 'center', key: 'IdNumber' },
                    { title: '岗位', width: 160, align: 'center', key: 'job' }
                ],
                tableData: [],
                tableDataFilterSelected: [],
                selectValue: [],
                selectItems: [],
                loading: false,

                // 字典
                dict_unitType: []
            };
        },
        watch: {
            selectedValue: {
                immediate: true,
                handler(val) {
                    this.selectValue = val;
                    this.selectItems = [];
                    this.getData();
                    // this.tableData.forEach((v, idx) => {
                    //     this.$refs.table.objData[idx]._isChecked = this.selectValue.indexOf(v.userId) > -1;
                    //     if (this.selectValue.indexOf(v.userId) > -1) {
                    //         this.selectItems.push(v);
                    //     }
                    // });
                }
            },
            unitId: {
                handler(val) {
                    this.searchParams.condition.unitId = val;
                },
                immediate: true
            },

            'searchParams.current': {
                handler() {
                    this.getData();
                }
            },
            'searchParams.condition': {
                deep: true,
                handler() {
                    this.getData();
                }
            },
            tableData(val) {
                if (this.filterSelected) {
                    this.tableDataFilterSelected = val.filter(v => this.selectedValue.indexOf(v.userId) === -1);
                }
                else {
                    setTimeout(() => {
                        val.forEach((v, idx) => {
                            if (this.selectValue.indexOf(v.userId) > -1) {
                                this.$refs.table.objData[idx]._isChecked = true;
                                this.selectItems.push(v);
                            }
                        });
                    }, 200);
                }
            },
            userSourceType: {
                immediate: true,
                handler(val) {
                    this.searchParams.condition.userSource = val;
                    this.searchParams.condition.unitId = this.unitId;
                }
            }
        },
        computed: {

        },
        mounted() {
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
                // let data = Object.assign({}, this.searchParams);
                //
                // if (data.condition.unitType === 'all') {
                //     data.condition.unitType = '';
                // }
                this.$http({
                    method: 'post',
                    url: '/user/list',
                    data: JSON.stringify(this.searchParams)
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

            /**
             * 表格选择
             */
            onCurrentChange(currentRow, oldCurrentRow) {
                this.selectItems = currentRow;
                this.selectValue = currentRow.userId;
            },
            onSelect(selection, row) {
                this.selectItems.push(row);
                this.selectValue.push(row.userId);
            },
            onSelectCancel(selection, row) {
                let idx = this.selectValue.indexOf(row.userId);
                this.selectValue.splice(idx, 1);
                this.selectItems.splice(idx, 1);
            },
            onSelectAll(selection) {
                selection.forEach((val) => {
                    let idx = this.selectValue.indexOf(val.userId);
                    if (idx === -1) {
                        this.selectValue.push(val.userId);
                        this.selectItems.push(val);
                    }
                });
            },
            onSelectionChange(selection) {
                let data = this.filterSelected ? this.tableDataFilterSelected : this.tableData;

                if (selection.length === 0) {
                    data.forEach((val) => {
                        let idx = this.selectValue.indexOf(val.userId);
                        if (idx !== -1) {
                            this.selectValue.splice(idx, 1);
                            this.selectItems.splice(idx, 1);
                        }
                    });
                }
            },

            addPerson() {
                // this.loading = true;
                this.$emit('handleSelect', this.selectValue, this.selectItems);
            }
        }
    }
</script>

<style lang="scss" >
    .employeeSelect-container {

        .modal-body {
            /*height: 660px;*/
            /*overflow-y: auto;*/
            /*overflow-x: hidden;*/
        }
    }
</style>