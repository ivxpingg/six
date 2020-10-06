<template>
    <div class="modalLawsSelect-container">
        <Modal v-model="modalValue"
               title="法律法规"
               :width="1200">
            <vIvxFilterBox>
                <Form inline>
                    <FormItem label="关键字:" :label-width="65">
                        <Input v-model="searchParams.condition.searchKey" placeholder="请输入关键字" />
                    </FormItem>
                    <FormItem label="来源文件:" :label-width="70">
                        <Select v-model="searchParams.condition.lawType" clearable
                                placeholder="全选"
                                style="width: 200px;">
                            <Option v-for="(item, idx) in select_lawTypeList"
                                    :value="item"
                                    :key="`lawType_${idx}`">{{item}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="文件章节:" :label-width="70" v-show="select_lawSectionList.length > 0">
                        <Select v-model="searchParams.condition.lawSection" clearable
                                placeholder="全选"
                                style="width: 200px;">
                            <Option v-for="(item, idx) in select_lawSectionList"
                                    :value="item"
                                    :key="`lawSectionList_${idx}`">{{item}}</Option>
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
                       :data="tableData"
                       :highlight-row="true"
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
        name: 'modalLawsSelect',
        components: {vIvxFilterBox},
        mixins: [modalMixin],
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 7,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        searchKey: '',
                        lawType: '',
                        lawSection: ''
                    }
                },
                tableColumns: [
                    { title: '选择', width: 60, align: 'center', type: 'index'},
                    { title: '来源文件', width: 180, align: 'center', key: 'lawType' },
                    { title: '文件章节', width: 180, align: 'center', key: 'lawSection' },
                    { title: '法律法规条文', minWidth: 180, align: 'center', key: 'lawContent' }
                ],
                tableData: [],
                selectItems: [],

                loading: false,

                select_lawTypeList: [],      // 来源文件
                select_lawSectionList: [],  // 文件章节
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
            'searchParams.condition.lawType'(val) {
                this.select_lawSectionList = [];
                this.searchParams.condition.lawSection = '';
                if (val) {
                    this.getLawSectionList();
                }
            }
        },
        mounted() {
            this.getData();
            this.getLawTypeList();
        },
        methods: {
            /**
             * 分页控件-切换页面
             * @param current
             */
            onPageChange(current) {
                this.searchParams.current = current;
            },

            // 法律类型列表
            getLawTypeList() {
                this.$http({
                    method: 'get',
                    url: '/LawRegulation/lawTypeList'
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.select_lawTypeList = res.data || [];
                        this.searchParams.condition.lawType = '';
                    }
                })
            },
            // 获取来源文件
            getLawSectionList() {
                this.$http({
                    method: 'get',
                    url: '/LawRegulation/lawSectionList',
                    params: {
                        lawType: this.searchParams.condition.lawType
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.select_lawSectionList = res.data || [];
                    }
                })
            },

            // 获取表格数据
            getData() {
                this.$http({
                    method: 'post',
                    url: '/LawRegulation/lawRegulationPage',
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
            },

            // 确定已选内容返回父组件
            onSelected() {
                if (this.selectItems) {
                    this.$emit('modal-callback', this.selectItems);
                }
                this.modalValue = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modalLawsSelect-container {
    }
</style>