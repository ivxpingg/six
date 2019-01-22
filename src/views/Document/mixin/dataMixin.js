export default {
    data() {
        return {
            // 固定几种文件类型选择，与 fileRecordType字典 数据对应
            dict_fileRecordType: [
                { fileRecordType: 'accept_notice', templateName: '质量监督管理受理通知书' },
                { fileRecordType: 'apply_file_check', templateName: '质量监督申请材料核查意见书'},
                { fileRecordType: 'com_check_notice', templateName: '综合督查通报' },
                { fileRecordType: 'spot_check', templateName: '质量安全监督抽查意见通知书' },
                { fileRecordType: 'official_letter',  templateName: '公函'}
            ]
        }
    }
}