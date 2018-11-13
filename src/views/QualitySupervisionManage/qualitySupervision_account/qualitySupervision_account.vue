<template>
    <div class="qualitySupervision_account-container">
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

        <vSupervisionCountRecord v-show="type === '1'"></vSupervisionCountRecord>
        <vSupervisionContentRecord v-show="type === '2'"
                                   :checkType="checkType"></vSupervisionContentRecord>
        <vFileRegisterRecord v-show="type === '3'"
                             :fileRecordType="fileRecordType"></vFileRegisterRecord>
    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vSupervisionCountRecord from '../../Common/ledgerTable/supervisionCountRecord';
    import vSupervisionContentRecord from '../../Common/ledgerTable/supervisionContentRecord';
    import vFileRegisterRecord from '../../Common/ledgerTable/fileRegisterRecord';
    export default {
        name: 'qualitySupervision_account',
        components: {
            vIvxFilterBox,
            vSupervisionCountRecord,
            vSupervisionContentRecord,
            vFileRegisterRecord
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
            },
            fileRecordType() {
                for (let i = 0; i < this.ledgerTypeList.length; i++) {
                    if (this.ledgerType === this.ledgerTypeList[i].value) {
                        return this.ledgerTypeList[i].fileRecordType || '';
                    }
                }
            }
        },
        data() {
            return {
                ledgerType: '1',
                // 固定台账分类
                ledgerTypeList: [
                    {
                        type: '1',
                        label: '在监项目督查台账',
                        value: '1'
                    },
                    {
                        type: '2',
                        label: '质量告知单台账',
                        value: '2',
                        checkType: 'quality_notice'
                    },
                    {
                        type: '2',
                        label: '质量安全抽查意见书台账',
                        value: '3',
                        checkType: 'spot_check'
                    },
                    {
                        type: '2',
                        label: '质量不良行为记录台账',
                        value: '4',
                        checkType: 'quality_bad_behavior'
                    },
                    {
                        type: '2',
                        label: '督查通报台账',
                        value: '5',
                        checkType: 'check_notice'
                    },
                    {
                        type: '3',
                        label: '质量监督申请材料核查意见书台账',
                        value: '6',
                        fileRecordType: 'apply_file_check'
                    },
                    {
                        type: '3',
                        label: '质量监督管理受理通知书台账',
                        value: '7',
                        fileRecordType: 'accept_notice'
                    }
                ],
            };
        }
    }
</script>

<style lang="scss" scoped>
    .qualitySupervision_account-container {
    }
</style>