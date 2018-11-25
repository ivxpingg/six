<template>
    <div class="creditRating_account-container">
        <vIvxFilterBox dashed>
            <Form inline>
                <FormItem label="台账类型:" :label-width="65">
                    <Select v-model="ledgerType">
                        <Option v-for="(item, idx) in ledgerTypeList"
                                :key="idx"
                                :value="item.value"
                                :label="item.label"></Option>
                    </Select>
                </FormItem>
            </Form>
        </vIvxFilterBox>

        <!--交工项目综合评价表-->
        <vHandoverCountRecord v-show="creditRecord === 'project_credit'"></vHandoverCountRecord>
        <!--企业信用评价表-->
        <vUnitCreditRecord v-show="creditRecord === 'unit_credit'"></vUnitCreditRecord>
        <!--人员信用评价表-->
        <vUserCreditRecord v-show="creditRecord === 'user_credit'"></vUserCreditRecord>

    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vHandoverCountRecord from '../../Common/ledgerTable/handoverCountRecord';
    import vUnitCreditRecord from '../../Common/ledgerTable/unitCreditRecord';
    import vUserCreditRecord from '../../Common/ledgerTable/userCreditRecord';
    export default {
        name: 'creditRating_account',  // 信用评价管理台账
        components: {
            vIvxFilterBox,
            vHandoverCountRecord,
            vUnitCreditRecord,
            vUserCreditRecord
        },
        computed: {
            type() {
                for (let i = 0; i < this.ledgerTypeList.length; i++) {
                    if (this.ledgerType === this.ledgerTypeList[i].value) {
                        return this.ledgerTypeList[i].type;
                    }
                }
            },
            creditRecord() {
                for (let i = 0; i < this.ledgerTypeList.length; i++) {
                    if (this.ledgerType === this.ledgerTypeList[i].value) {
                        return this.ledgerTypeList[i].creditRecord;
                    }
                }
            }
        },
        data() {
            return {
                ledgerType: '1',
                ledgerTypeList: [
                    {
                        type: '1',    // 台账组件类型
                        label: '交工项目综合评价表',
                        value: '1',                     // 标识
                        creditRecord: 'project_credit'  // 台账参数
                    },
                    {
                        type: '2',
                        label: '企业信用评价表',
                        value: '2',
                        creditRecord: 'unit_credit'
                    },
                    {
                        type: '3',
                        label: '人员信用评价表',
                        value: '3',
                        creditRecord: 'user_credit'
                    }
                ],
            };
        },
        mounted() {
            this.getDict('safeLedgerType');
        },
        methods: {
            getDict(type) {
                this.$http({
                    method: 'get',
                    url: '/dict/getListByType',
                    params: {
                        type: type
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this[`dict_${type}`] = res.data;
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .creditRating_account-container {
    }
</style>