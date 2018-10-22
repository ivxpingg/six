<template>
    <div class="creditRating_account-container">
        <vIvxFilterBox dashed>
            <Form inline>
                <FormItem label="台账类型:" :label-width="65">
                    <Select v-model="safeLedgerType">
                        <Option v-for="item in dict_safeLedgerType"
                                :key="item.id"
                                :value="item.value"
                                :label="item.label"></Option>
                    </Select>
                </FormItem>
            </Form>
        </vIvxFilterBox>

        <vLedgerTyper_credit_0 v-show="safeLedgerType === '0'"></vLedgerTyper_credit_0>
        <vLedgerTyper_credit_1 v-show="safeLedgerType === '1'"></vLedgerTyper_credit_1>
        <vLedgerTyper_credit_2 v-show="safeLedgerType === '2'"></vLedgerTyper_credit_2>
        <vLedgerTyper_credit_3 v-show="safeLedgerType === '3'"></vLedgerTyper_credit_3>

    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vLedgerTyper_credit_0 from './ledgerType/ledgerTyper_credit_0';
    import vLedgerTyper_credit_1 from './ledgerType/ledgerTyper_credit_1';
    import vLedgerTyper_credit_2 from './ledgerType/ledgerTyper_credit_2';
    import vLedgerTyper_credit_3 from './ledgerType/ledgerTyper_credit_3';
    export default {
        name: 'creditRating_account',  // 信用评价管理台账
        components: {
            vIvxFilterBox,
            vLedgerTyper_credit_0,
            vLedgerTyper_credit_1,
            vLedgerTyper_credit_2,
            vLedgerTyper_credit_3
        },
        data() {
            return {
                safeLedgerType: '0',
                dict_safeLedgerType: [],
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