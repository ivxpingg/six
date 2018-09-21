<template>
    <div class="employeeSelect-container">
        <div class="modal-body">
            <vIvxFilterBox>
                <Form inline>
                    <FormItem label="人员名称:" :label-width="65">
                        <Input v-model="searchParams.name" placeholder="请输入姓名" />
                    </FormItem>
                    <FormItem label="人员UID:" :label-width="65">
                        <Input v-model="searchParams.uId" placeholder="请输入UID" />
                    </FormItem>
                    <FormItem label="所属单位类型:" :label-width="90">
                        <Select v-model="searchParams.unitType" style="width: 220px;">
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
            unitId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 7,      // 每页几行
                    total: 0,     // 总行数
                    unitId: '',
                    name: '',
                    uId: '',
                    unitType: 'all'
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
                loading: false,

                // 字典
                dict_unitType: []
            };
        },
        watch: {
            unitId: {
                handler(val) {
                    this.searchParams.unitId = val;
                },
                immediate: true
            },
            tableData(val) {
                let that = this;

                setTimeout(() => {
                    val.forEach((v, idx) => {
                        if (that.selectValue.indexOf(v.userId) > -1) {
                            that.$refs.table.objData[idx]._isChecked = true;
                        }
                    });
                }, 200);
            },
        },
        computed: {},
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

                if (data.unitType === 'all') {
                    data.unitType = '';
                }
                this.$http({
                    method: 'post',
                    url: '/getUnitPersonById',
                    data: JSON.stringify(data)
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records;
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

<style lang="scss" >
    .employeeSelect-container {
        .modal-body {
            height: 690px;
            overflow-y: auto;
            overflow-x: hidden;
        }
        .ivu-modal-footer {
            padding-bottom: 0;
        }
    }
</style>

<style lang="scss">
    .modal-unitDetail {
        .ivu-modal-body {
            padding: 0;
        }
    }
</style>