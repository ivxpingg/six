const userList = {
    current: 1,
    size: 10,
    total: 100,
    records: [
        {
            userId: '001',
            name: '姓名',
            uId: 'uid',
            sex: '0',
            sexStr: '女',
            age: 26,
            nation: '0',
            nationStr: '汉族',
            titleLevel: '职称级别',
            titleName: '技术职称',
            certificate: '资格证书',
            certificateNo: '资格证书编号',
            education: '学历',
            graduateSchool: '毕业院校',
            graduateDate: '2018-01-01',
            phone: '15332112141',
            IdNumber: '362521236521233632',
            unitName: '厦门卫星定位',
            unitType: '0',
            unitTypeLabel: '建设单位',
            job: '岗位'
        }
    ]
};

const userInfoById = {
    userId: '001',
    name: '姓名',
    uId: 'uid',
    sex: '0',
    sexStr: '女',
    age: 26,
    nation: '0',
    nationStr: '汉族',
    titleLevel: '职称级别',
    titleName: '技术职称',
    certificate: '资格证书',
    certificateNo: '资格证书编号',
    education: '学历',
    graduateSchool: '毕业院校',
    profession: '计算机与技术',
    graduateDate: '2018-01-01',
    phone: '15332112141',
    email: '123@qq.com',
    IdNumber: '362521236521233632',
    beginTime: '2018-01-01',
    endTime: '2018-12-31'
};

// 供职单位记录
const userUnitInfo = {
    current: 1,
    size: 10,
    total: 100,
    records: [
        {
            unitName: '单位名称',
            department: '部门名称',
            job: '职务',
            titleName: '技术职称',
            titleLevel: '职称级别',
            phone: '15332112141',
            state: '在职',
            beginTime: '2018-01-01',
            endTime: ''
        },
        {
            unitName: '建设单位',
            department: '设计部门',
            job: '设计师',
            titleName: '技术职称',
            titleLevel: '职称级别',
            phone: '15332112141',
            state: '离职',
            beginTime: '2017-01-01',
            endTime: '2017-12-31'
        },
        {
            unitName: '建设单位',
            department: '设计部门',
            job: '设计师',
            titleName: '技术职称',
            titleLevel: '职称级别',
            phone: '15332112141',
            state: '离职',
            beginTime: '2017-01-01',
            endTime: '2017-12-31'
        },
        {
            unitName: '建设单位',
            department: '设计部门',
            job: '设计师',
            titleName: '技术职称',
            titleLevel: '职称级别',
            phone: '15332112141',
            state: '离职',
            beginTime: '2017-01-01',
            endTime: '2017-12-31'
        },
        {
            unitName: '建设单位',
            department: '设计部门',
            job: '设计师',
            titleName: '技术职称',
            titleLevel: '职称级别',
            phone: '15332112141',
            state: '离职',
            beginTime: '2017-01-01',
            endTime: '2017-12-31'
        },
        {
            unitName: '建设单位',
            department: '设计部门',
            job: '设计师',
            titleName: '技术职称',
            titleLevel: '职称级别',
            phone: '15332112141',
            state: '离职',
            beginTime: '2017-01-01',
            endTime: '2017-12-31'
        },
        {
            unitName: '建设单位',
            department: '设计部门',
            job: '设计师',
            titleName: '技术职称',
            titleLevel: '职称级别',
            phone: '15332112141',
            state: '离职',
            beginTime: '2017-01-01',
            endTime: '2017-12-31'
        },
        {
            unitName: '建设单位',
            department: '设计部门',
            job: '设计师',
            titleName: '技术职称',
            titleLevel: '职称级别',
            phone: '15332112141',
            state: '离职',
            beginTime: '2017-01-01',
            endTime: '2017-12-31'
        },
        {
            unitName: '建设单位',
            department: '设计部门',
            job: '设计师',
            titleName: '技术职称',
            titleLevel: '职称级别',
            phone: '15332112141',
            state: '离职',
            beginTime: '2017-01-01',
            endTime: '2017-12-31'
        }
    ]
};


// 获取从业人员表格(分页)
export const getUserList = (req) => {
    return {
        code: 'SUCCESS',
        data: userList,
        msg: ''
    }
};

// 根据单位ID获取单位详情
export const getUserInfoById = (req) => {
    return {
        code: 'SUCCESS',
        data: userInfoById,
        msg: ''
    }
};

export const getUserUnitInfo = req => {
    return {
        code: 'SUCCESS',
        data: userUnitInfo,
        msg: ''
    }
}