<template>
    <div class="modalCreditCodeSelect-container">
        <Modal v-model="modalValue"
               title="扣分代码"
               :width="1200">
            <vIvxFilterBox>
                <Form inline>
                    <FormItem label="关键字:" :label-width="65">
                        <Input v-model="searchParams.condition.searchKey" placeholder="请输入关键字" />
                    </FormItem>
                    <FormItem label="信用类型:" :label-width="70">
                        <Select v-model="searchParams.condition.creditType" clearable
                                placeholder="全选"
                                style="width: 200px;">
                            <Option v-for="(item, idx) in select_creditType"
                                    :value="item"
                                    :key="`creditType_${idx}`">{{item}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="一级目录:" :label-width="70" v-show="select_firstDirectory.length > 0">
                        <Select v-model="searchParams.condition.firstDirectory" clearable
                                placeholder="全选"
                                style="width: 200px;">
                            <Option v-for="(item, idx) in select_firstDirectory"
                                    :value="item"
                                    :key="`firstDirectory_${idx}`">{{item}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="二级目录:" :label-width="70" v-show="select_secondDirectory.length > 0">
                        <Select v-model="searchParams.condition.secondDirectory" clearable
                                placeholder="全选"
                                style="width: 200px;">
                            <Option v-for="(item, idx) in select_secondDirectory"
                                    :value="item"
                                    :key="`secondDirectory_${idx}`">{{item}}</Option>
                        </Select>
                    </FormItem>
                </Form>
            </vIvxFilterBox>
            <div class="ivx-table-box">
                <Table ref="table"
                       border
                       size="small"
                       height="330"
                       :columns="tableColumns"
                       :data="filterData"
                       :highlight-row="!multiple"
                       @on-row-dblclick="onRowDbclick"
                       @on-current-change="onCurrentChange"></Table>
                <Page prev-text="上一页"
                      next-text="下一页"
                      show-total
                      :current="searchParams.current"
                      :page-size="searchParams.size"
                      :total="searchParams.total"
                      @on-change="onPageChange"></Page>
            </div>

            <div slot="footer">
                <Button type="primary"
                        size="large"
                        @click="onSelected">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import modalMixin from '../../../lib/mixin/modalMixin';
    import vIvxFilterBox from '@/components/ivxFilterBox/ivxFilterBox';
    export default {
        name: 'modalCreditCodeSelect',
        components: {vIvxFilterBox},
        mixins: [modalMixin],
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
            },
            selectedValue: {
                type: Array,
                default() {
                    return [];
                }
            },
            filterSelected: {
                type: Boolean,
                default: false
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
                        creditType: '',
                        firstDirectory: '',
                        secondDirectory: ''
                    }
                },
                tableColumns: [
                    { title: '选择', width: 60, align: 'center', type: this.multiple ? 'selection' : 'index'},
                    { title: '信用编号', width: 180, align: 'center', key: 'creditNo' },
                    { title: '信用类型', width: 180, align: 'center', key: 'creditType' },
                    { title: '一级目录', width: 180, align: 'center', key: 'firstDirectory' },
                    { title: '二级目录', width: 180, align: 'center', key: 'secondDirectory' },
                    { title: '信用内容', width: 180, align: 'center', key: 'content' },
                    { title: '评分标准', width: 180, align: 'center', key: 'scoreStandard' },
                    { title: '备注', width: 180, align: 'center', key: 'remark' }
                ],
                tableData: [
                    {
                        creditCodeId: '001',        // 主键ID
                        creditType:'信用类型',           // 信用类型
                        firstDirectory: '一级目录',     // 一级目录
                        secondDirectory: '二级目录',    // 二级目录
                        creditNo: 'NO.1254',     // 信用编号、扣分代码
                        content: '信用内容',             // 信用内容
                        scoreStandard: '评分标准',       // 评分标准
                        remark: '备注'

                    }
                ],

                selectValue: [],
                selectItems: [],

                loading: false,


                select_creditType: [],      // 信用类型
                select_firstDirectory: [],  // 一级目录
                select_secondDirectory: []  // 二级目录
            };
        },
        watch: {
            'searchParams.current'() {
                this.getData();
            },
            'searchParams.condition': {
                deep: true,
                handler() {
                    this.getData();
                }
            },
            'searchParams.condition.creditType'(val) {
                if (!val) {
                    this.searchParams.condition.firstDirectory = '';
                    this.searchParams.condition.secondDirectory = '';
                    this.select_firstDirectory = [];
                    this.select_secondDirectory = [];
                }
                else {
                    this.get_firstDirectory();
                }
            },
            'searchParams.condition.firstDirectory'(val) {
                if (!val) {
                    this.searchParams.condition.firstDirectory = '';
                    this.searchParams.condition.secondDirectory = '';
                    this.select_firstDirectory = [];
                    this.select_secondDirectory = [];
                }
                else {
                    this.get_secondDirectory();
                }
            },
            selectedList() {
                this.selectValue = [];
                this.selectItems = [];
            },
            filterData(val) {
                let that = this;
                setTimeout(() => {
                    val.forEach((v, idx) => {
                        if (that.selectValue.indexOf(v.creditCodeId) > -1) {
                            that.$refs.table.objData[idx]._isChecked = true;
                        }
                    });
                }, 200);
            }
        },
        computed: {
            filterData() {
                return this.tableData.filter(val => this.selectedList.indexOf(val.creditCodeId) === -1);
            }
        },
        mounted() {
            this.getData();
            this.get_creditType();
        },
        methods: {
            // 获取信用类型
            get_creditType() {
                this.$http({
                    method: 'get',
                    url: '/creditCode/creditTypeList'
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.select_creditType = res.data || [];
                    }
                })
            },
            // 根据信用类型 获取一级目录
            get_firstDirectory() {
                this.$http({
                    method: 'get',
                    url: '/creditCode/firstDirectoryList',
                    params: {
                        creditType: this.searchParams.condition.creditType
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.select_firstDirectory = res.data || [];
                    }
                })
            },
            // 根据信用类型和一级目录 获取一级目录
            get_secondDirectory() {
                this.$http({
                    method: 'get',
                    url: '/creditCode/secondDirectoryList',
                    params: {
                        creditType: this.searchParams.condition.creditType,
                        firstDirectory: this.searchParams.condition.firstDirectory
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.select_secondDirectory = res.data || [];
                    }
                })
            },

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
                    url: '/creditCode/creditCodePage',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records || [];
                        this.searchParams.total = res.data.total;
                    }
                })
            },

            // 双击选择数据
            onRowDbclick() {
                this.onSelected();
            },
            onCurrentChange(currentRow, oldCurrentRow) {
                this.selectItems = currentRow;
                this.selectValue = currentRow.creditCodeId;
            },

            // 确定已选内容返回父组件
            onSelected() {
                if (this.selectItems) {
                    this.$emit('modal-callback', this.selectValue, this.selectItems);
                }
                this.modalValue = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modalCreditCodeSelect-container {
    }
</style>