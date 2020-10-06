<template>
    <div class="safetySupervision_account-container">
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

        <vSupervisionContentRecord v-show="type === '2'"
                                   :checkType="checkType"></vSupervisionContentRecord>
    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vSupervisionContentRecord from '../../Common/ledgerTable/supervisionContentRecord';
    export default {
        name: 'safetySupervision_account',   // 安全督查台账
        components: {
            vIvxFilterBox,
            vSupervisionContentRecord
        },
        computed: {
            type() {
                for (let i = 0; i < this.ledgerTypeList.length; i++) {
                    if (this.ledgerType === this.ledgerTypeList[i].value) {
                        return this.ledgerTypeList[i].type;
                    }
                }
            },
            checkType () {
                for (let i = 0; i < this.ledgerTypeList.length; i++) {
                    if (this.ledgerType === this.ledgerTypeList[i].value) {
                        return this.ledgerTypeList[i].checkType || '';
                    }
                }
            }
        },
        data() {
            return {
                ledgerType: '1',
                ledgerTypeList: [
                    {
                        type: '2',
                        label: '安全告知单台账',
                        value: '1',
                        checkType: 'safe_notice'
                    },
                    {
                        type: '2',
                        label: '安全不良行为记录台账',
                        value: '2',
                        checkType: 'safe_bad_behavior'
                    }
                ],
            };
        }
    }
</script>

<style lang="scss" scoped>
    .safetySupervision_account-container {
    }
</style>