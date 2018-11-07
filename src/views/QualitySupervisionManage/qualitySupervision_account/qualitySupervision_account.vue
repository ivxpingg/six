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
        <vLedgerType2 v-show="ledgerType === '2'"></vLedgerType2>
        <vLedgerType3 v-show="ledgerType === '3'"></vLedgerType3>
        <vLedgerType4 v-show="ledgerType === '4'"></vLedgerType4>
        <vLedgerType5 v-show="ledgerType === '5'"></vLedgerType5>
        <vLedgerType6 v-show="ledgerType === '6'"></vLedgerType6>

    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vLedgerType0 from './ledgerType/ledgerType_0';
    import vLedgerType1 from './ledgerType/ledgerType_1';
    import vLedgerType2 from './ledgerType/ledgerType_2';
    import vLedgerType3 from './ledgerType/ledgerType_3';
    import vLedgerType4 from './ledgerType/ledgerType_4';
    import vLedgerType5 from './ledgerType/ledgerType_5';
    import vLedgerType6 from './ledgerType/ledgerType_6';
    export default {
        name: 'qualitySupervision_account',
        components: {
            vIvxFilterBox,
            vLedgerType0,
            vLedgerType1,
            vLedgerType2,
            vLedgerType3,
            vLedgerType4,
            vLedgerType5,
            vLedgerType6
        },
        data() {
            return {
                ledgerType: '0',
                dict_ledgerType: [],
            };
        },
        mounted() {
            this.getDict('ledgerType');
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
                    if(res.code === 'SUCCESS') {
                        this[`dict_${type}`] = res.data;
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .qualitySupervision_account-container {
    }
</style>