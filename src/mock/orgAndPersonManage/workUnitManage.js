const unitList = {
    current: 1,
    size: 10,
    total: 100,
    records: [
        {
            unitName: '厦门卫星定位应用股份有限公司',
            orgCode: 'AZ2300125',
            qualificationTypeLabel: '公路',
            qualification: 'AA',
            unitTypeLabel: '施工单位',
            leader: '深明命',
            telephone: '18203215240',
            email: '123@qq.com',
            companyAddress: '厦门市软件园二期'
        }
    ]
};

const unitDetail = {
    unitName: '厦门卫星定位应用股份有限公司',
    orgCode: 'AZ2300125',
    qualificationTypeLabel: '公路',
    qualification: 'AA',
    unitTypeLabel: '施工单位',
    leader: '深明命',
    telephone: '18203215240',
    email: '123@qq.com',
    companyAddress: '厦门市软件园二期'
}

export const getUnitList = (req) => {
    return {
        code: 1,
        data: unitList,
        msg: ''
    }
};