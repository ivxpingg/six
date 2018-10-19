<template>
    <div class="safetySupervision_account-container">
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

        <vLedgerTyper_safe_0 v-show="safeLedgerType === '0'"></vLedgerTyper_safe_0>
        <vLedgerTyper_safe_1 v-show="safeLedgerType === '1'"></vLedgerTyper_safe_1>
    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vLedgerTyper_safe_0 from './ledgerType/ledgerTyper_safe_0';
    import vLedgerTyper_safe_1 from './ledgerType/ledgerTyper_safe_1';
    export default {
        name: 'safetySupervision_account',   // 安全督查台账
        components: {
            vIvxFilterBox,
            vLedgerTyper_safe_0,
            vLedgerTyper_safe_1
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
    .safetySupervision_account-container {
    }
</style>