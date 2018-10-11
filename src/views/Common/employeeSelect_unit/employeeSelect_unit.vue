<template>
    <div class="employeeSelect_unit-container">
        <div class="modal-body">
            <vIvxFilterBox>
                <Form inline>
                    <FormItem label="检索:" :label-width="65">
                        <Input v-model="searchParams.searchKey" placeholder="请输入姓名、UID" />
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
                       @on-select="onSelect"
                       @on-select-cancel="onSelectCancel"
                       @on-select-all="onSelectAll"
                       @on-selection-change="onSelectionChange"></Table>
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
        name: 'employeeSelect_unit',  // 根据单位选择的从业人员
        components: {vIvxFilterBox},
        props: {
            unitId: {
                type: String,
                required: true
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
                    searchKey: '',
                },
                tableColumns: [
                    { title: '选择', width: 60, align: 'center', type: 'selection'},
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

                selectValue: [],
                loading: false
            };
        },
        computed:{
            filterData() {
                return this.tableData.filter(val => this.selectedList.indexOf(val.unitId) === -1);
            }
        },
        watch: {
            unitId() {
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
            }
        },
        mounted() {
            this.selectValue = [];
            this.getData();
        },
        methods: {
            // 获取表格数据
            getData() {
                this.$http({
                    method: 'post',
                    url: '/user/list',
                    params: {
                        unitId: this.unitId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records || [];
                        this.searchParams.total = res.data.total;
                    }
                })
            },

            /**
             * 表格选择
             */
            onSelect(selection, row) {
                this.selectValue.push(row.userId);
            },
            onSelectCancel(selection, row) {
                let idx = this.selectValue.indexOf(row.userId);
                this.selectValue.splice(idx, 1);
            },
            onSelectAll(selection) {
                selection.forEach((val) => {
                    let idx = this.selectValue.indexOf(val.userId);
                    if (idx === -1) {
                        this.selectValue.push(val.userId);
                    }
                });
            },
            onSelectionChange(selection) {
                if (selection.length === 0) {
                    this.tableData.forEach((val) => {
                        let idx = this.selectValue.indexOf(val.userId);
                        if (idx !== -1) {
                            this.selectValue.splice(idx, 1);
                        }
                    });
                }
            },
            addPerson() {
                this.loading = true;
                this.$emit('handleSelect', this.selectValue);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .employeeSelect_unit-container {
    }
</style>