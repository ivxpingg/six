<template>
    <div class="supervisionCountRecord-container">
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.projectName"
                           style="width: 220px;"
                           placeholder="项目名称"/>
                </FormItem>
                <FormItem label="选择时间:" :label-width="65">
                    <DatePicker type="daterange"
                                @on-change="onChage_daterange"
                                placeholder="选择时间"
                                style="width: 200px"></DatePicker>
                </FormItem>
            </Form>
        </vIvxFilterBox>
        <div class="ivx-table-box">
            <Table border
                   :height="540"
                   :loading="tableLoading"
                   :columns="_joinColumns"
                   :data="tableData"></Table>
        </div>
    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import MOMENT from 'moment';
    export default {
        name: 'supervisionCountRecord',  // 在监项目督查台账
        components: {vIvxFilterBox},
        computed: {
            _joinColumns() {
                let columns = [];
                let keys = [];
                let widths = {
                    '项目名称': 180,
                    '日期': 120
                };

                columns.push({ title: '序号', width: 60, align: 'center', type: 'index', });

                this.tableData.forEach(v => {
                    for (let key in v) {
                        let _key = key.replace(/'/g, '');

                        if (keys.indexOf(_key) === -1) {
                            keys.push(_key);

                            let col = {
                                title: _key,
                                align: 'center',
                                minWidth: 80,
                                width: widths[_key] ||_key.length * 12 + 40,
                                key: _key
                            };
                            if (_key === '日期') {
                                col.render = (h, params) => {
                                    return h('div', params.row[_key] ? MOMENT(params.row[_key]).format('YYYY-MM-DD'):'');
                                }
                                columns.splice(1, 0, col);
                            }
                            else {
                                columns.push(col);
                            }
                        }
                    }
                });

                return columns;
            }
        },
        data() {
            return {
                searchParams: {
                    projectName: '',      // 模糊查询参数
                    beginTime: '',
                    endTime: '',
                    county: ''
                },

                tableData: [],
                tableLoading: false
            };
        },
        watch: {
            county: {
                immediate: true,
                handler(val) {
                    this.searchParams.county = val;
                }
            },
            searchParams: {
                deep: true,
                handler() {
                    this.getData();
                }
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            onChage_daterange(value) {
                this.searchParams.beginTime = value[0];
                this.searchParams.endTime = value[1];
            },

            // 获取表格数据
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/record/supervisionCountRecord',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data || [];
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .supervisionCountRecord-container {
        padding-top: 10px;
    }
</style>