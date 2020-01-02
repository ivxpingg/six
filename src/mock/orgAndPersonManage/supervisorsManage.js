const superviorList = {
    current: 1,
    size: 10,
    total: 100,
    records: [
        {
            userId: '001',
            name: '姓名',
            uId: 'uid',
            department: '科室',
            job: '职务',
            titleLevel: '职称级别',
            unitName: '六安市交通质监处',
            telephone: '3952581',         // 固定电话
            mobileShortNum: '25811111',   // 移动小号
            phone: '15332112141',         // 手机
            tenureTime: '2006-06',        // 任职时间
            sex: '1',
            sexStr: '男',
            nation: '0',
            nationLabel: '汉族',
            nativePlace: '祖籍六安',
            age: 26,
            IdNumber: '362521236521233632',
            birthday: '1992-06-06',  //
            workDate: '2010-09',    // 工作年月
            joinPartyDate: '2006-01',
            education: '学历',
            graduateSchool: '毕业院校',
            profession: '专业',
            graduateDate: '2018-01-01',
            identityType: '',
            identityTypeLabel: '身份类别',
            titleName: '技术职称',
            lawNumber: '3450008',
            lawType: '0',
            lawTypeLabel: '执法证类型',
            divideWork: '领导分工及科室人员',
            belongState: '0',
            belongStateLabel: '在编',
            remark: '11'
        },{
            userId: '001',
            name: '姓名',
            uId: 'uid',
            department: '科室',
            job: '职务',
            titleLevel: '职称级别',
            unitName: '六安市交通质监',
            telephone: '3952581',         // 固定电话
            mobileShortNum: '25811111',   // 移动小号
            phone: '15332112141',         // 手机
            tenureTime: '2006-06',        // 任职时间
            sex: '1',
            sexStr: '男',
            nation: '0',
            nationLabel: '汉族',
            nativePlace: '祖籍六安',
            age: 26,
            IdNumber: '362521236521233632',
            birthday: '1992-06-06',  //
            workDate: '2010-09',    // 工作年月
            joinPartyDate: '2006-01',
            education: '学历',
            graduateSchool: '毕业院校',
            profession: '专业',
            graduateDate: '2018-01-01',
            identityType: '',
            identityTypeLabel: '身份类别',
            titleName: '技术职称',
            lawNumber: '3450008',
            lawType: '0',
            lawTypeLabel: '执法证类型',
            divideWork: '领导分工及科室人员',
            belongState: '0',
            belongStateLabel: '在编',
            remark: '11'
        }
    ]
};

// 获取监督人员表格(分页)
export const getSupervisorList = (req) => {
    return {
        code: 'SUCCESS',
        data: superviorList,
        msg: ''
    }
};