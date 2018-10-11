<template>
    <div class="qualitySupervision_account-container">
        <vIvxFilterBox dashed>
            <Form inline>
                <FormItem label="台账类型:" :label-width="65">
                    <Select v-model="ledgerType">
                        <Option v-for="item in dict_ledgerType"
                                :key="item.id"
                                :value="item.value"
                                :label="item.label"></Option>
                    </Select>
                </FormItem>
            </Form>
        </vIvxFilterBox>

        <vLedgerType0 v-show="ledgerType === '0'"></vLedgerType0>
        <vLedgerType1 v-show="ledgerType === '1'"></vLedgerType1>

    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vLedgerType0 from './ledgerType/ledgerType_0';
    import vLedgerType1 from './ledgerType/ledgerType_1';
    export default {
        name: 'qualitySupervision_account',
        components: {
            vIvxFilterBox,
            vLedgerType0,
            vLedgerType1
        },
        data() {
            return {
                ledgerType: '0',
                dict_ledgerType: [],
            };
        },
        watch: {
            'searchParams.condition': {
                deep: true,
                handler(){
                    this.getData();
                }
            }
        },
        mounted() {
            this.getDict('ledgerType');
            this.getData();
        },
        methods: {
            /**
             * 分页控件-切换页面
             * @param current
             */
            onPageChange(current) {
                this.searchParams.current = current;
            },
            getDict(type) {
                this.$http({
                    method: 'get',
                    url: '/dict/getListByType',
                    params: {
                        type: type
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this[`dict_${type}`] = res.data;
                    }
                })
            },
            onChage_daterange(value) {
                this.searchParams.condition.beginTime = value[0];
                this.searchParams.condition.endTime = value[1];
            },
            // 获取表格数据
            getData() {
                this.$http({
                    method: 'post',
                    url: '/',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records;
                        this.searchParams.total = res.data.total;
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            }

        }
    }
</script>

<style lang="scss" scoped>
    .qualitySupervision_account-container {
    }
</style>