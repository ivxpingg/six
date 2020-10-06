import imgUrl1 from '@/assets/testImg/1.png';
import imgUrl2 from '@/assets/testImg/2.png';
import imgUrl3 from '@/assets/testImg/3.png';
import imgUrl11 from '@/assets/testImg/11.png';
import imgUrl22 from '@/assets/testImg/22.png';
import imgUrl33 from '@/assets/testImg/33.png';

const unitList = {
    current: 1,
    size: 10,
    total: 100,
    records: [
        {
            unitId: 'D001',
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
    unitId: 'D001',
    unitName: '厦门卫星定位应用股份有限公司',  // 单位名称
    orgCode: 'AZ2300125',                   // 机构代码
    registerAddress: '注册地址',
    unitType: '1',
    unitTypeLabel: '单位类型：施工单位',
    leader: '负责人深明命',
    telephone: '18203215240',
    email: '123@qq.com',
    companyAddress: '公司地址厦门市软件园二期',
    website: '网站地址',
    qualificationType: '001',
    qualificationTypeLabel: '公路(资质类别)',
    parentUnitName: '母体机构单位名称',
    parentUnitLeader: '母体机构负责人',
    parentUnitTelephone: '母体负责人联系方式',
    primaryTechnology: 10,              //'工程技术初级职称人数',
    mediumTechnology: 20,               //'工程技术中级职称人数',
    highTechnology: 30,                 //'工程技术高级职称人数',
    totalTechnology: 60,                // 技术总人数
    primaryManage: 111,                 //经济管理初级职称人数
    mediumManage: 222,                  //经济管理中级职称人数
    highManage: 333,                    //经济管理高级职称人数
    totalManage: 666,                   //'经济管理总人数'
    countTime: '2018-10-10',            // 统计时间
    qualification: 'AA'                 // 许可证等级

};

const unitPerson ={
    current: 1,
    size: 10,
    total: 100,
    records:[
        {
            userId: '001',
            name: '张山1',
            uId: '10392',
            sex: '0',
            sexStr: '女',
            age: 26,
            nation: '0',
            nationStr: '汉族',
            titleLevel: '职称级别',
            titleName: '职称名称',
            education: '学历',
            phone: '15332112141',
            IdNumber: '362521236521233632',
            job: '岗位'
        },{
            userId: '002',
            name: '张山2',
            uId: '10392',
            sex: '0',
            sexStr: '女',
            age: 26,
            nation: '0',
            nationStr: '汉族',
            titleLevel: '职称级别',
            titleName: '职称名称',
            education: '学历',
            phone: '15332112141',
            IdNumber: '362521236521233632',
            job: '岗位'
        },{
            userId: '003',
            name: '张山3',
            uId: '10392',
            sex: '0',
            sexStr: '女',
            age: 26,
            nation: '0',
            nationStr: '汉族',
            titleLevel: '职称级别',
            titleName: '职称名称',
            education: '学历',
            phone: '15332112141',
            IdNumber: '362521236521233632',
            job: '岗位'
        },{
            userId: '004',
            name: '张山4',
            uId: '10392',
            sex: '0',
            sexStr: '女',
            age: 26,
            nation: '0',
            nationStr: '汉族',
            titleLevel: '职称级别',
            titleName: '职称名称',
            education: '学历',
            phone: '15332112141',
            IdNumber: '362521236521233632',
            job: '岗位'
        },{
            userId: '005',
            name: '张山5',
            uId: '10392',
            sex: '0',
            sexStr: '女',
            age: 26,
            nation: '0',
            nationStr: '汉族',
            titleLevel: '职称级别',
            titleName: '职称名称',
            education: '学历',
            phone: '15332112141',
            IdNumber: '362521236521233632',
            job: '岗位'
        },{
            userId: '006',
            name: '张山6',
            uId: '10392',
            sex: '0',
            sexStr: '女',
            age: 26,
            nation: '0',
            nationStr: '汉族',
            titleLevel: '职称级别',
            titleName: '职称名称',
            education: '学历',
            phone: '15332112141',
            IdNumber: '362521236521233632',
            job: '岗位'
        },{
            userId: '007',
            name: '张山7',
            uId: '10392',
            sex: '0',
            sexStr: '女',
            age: 26,
            nation: '0',
            nationStr: '汉族',
            titleLevel: '职称级别',
            titleName: '职称名称',
            education: '学历',
            phone: '15332112141',
            IdNumber: '362521236521233632',
            job: '岗位'
        },{
            userId: '010',
            name: '张山10',
            uId: '10392',
            sex: '0',
            sexStr: '女',
            age: 26,
            nation: '0',
            nationStr: '汉族',
            titleLevel: '职称级别',
            titleName: '职称名称',
            education: '学历',
            phone: '15332112141',
            IdNumber: '362521236521233632',
            job: '岗位'
        },{
            userId: '008',
            name: '张山8',
            uId: '10392',
            sex: '0',
            sexStr: '女',
            age: 26,
            nation: '0',
            nationStr: '汉族',
            titleLevel: '职称级别',
            titleName: '职称名称',
            education: '学历',
            phone: '15332112141',
            IdNumber: '362521236521233632',
            job: '岗位'
        },{
            userId: '009',
            name: '张山9',
            uId: '10392',
            sex: '0',
            sexStr: '女',
            age: 26,
            nation: '0',
            nationStr: '汉族',
            titleLevel: '职称级别',
            titleName: '职称名称',
            education: '学历',
            phone: '15332112141',
            IdNumber: '362521236521233632',
            job: '岗位'
        }
    ]
};

const unitAccessory = [
    { src: imgUrl1, title: '图片标题'},
    { src: imgUrl2, title: '图片标题'},
    { src: imgUrl3, title: '图片标题'},
    { src: imgUrl2, title: '图片标题'},
    { src: imgUrl11, title: '图片标题'},
    { src: imgUrl22, title: '图片标题'},
    { src: imgUrl33, title: '图片标题'},
    { src: imgUrl1, title: '图片标题'},
    { src: imgUrl2, title: '图片标题'},
    { src: imgUrl3, title: '图片标题'},
    { src: imgUrl2, title: '图片标题'},
    { src: imgUrl11, title: '图片标题'},
    { src: imgUrl22, title: '图片标题'},
    { src: imgUrl33, title: '图片标题'},
    { src: imgUrl1, title: '图片标题'},
    { src: imgUrl2, title: '图片标题'},
    { src: imgUrl3, title: '图片标题'},
    { src: imgUrl2, title: '图片标题'},
    { src: imgUrl11, title: '图片标题'},
    { src: imgUrl22, title: '图片标题'},
    { src: imgUrl33, title: '图片标题'},
    { src: imgUrl1, title: '图片标题'},
    { src: imgUrl2, title: '图片标题'},
    { src: imgUrl3, title: '图片标题'},
    { src: imgUrl2, title: '图片标题'},
    { src: imgUrl11, title: '图片标题'},
    { src: imgUrl22, title: '图片标题'},
    { src: imgUrl33, title: '图片标题'},
    { src: imgUrl1, title: '图片标题'},
    { src: imgUrl2, title: '图片标题'},
    { src: imgUrl3, title: '图片标题'},
    { src: imgUrl2, title: '图片标题'},
    { src: imgUrl11, title: '图片标题'},
    { src: imgUrl22, title: '图片标题'},
    { src: imgUrl33, title: '图片标题'},
    { src: imgUrl1, title: '图片标题'},
    { src: imgUrl2, title: '图片标题'},
    { src: imgUrl3, title: '图片标题'},
    { src: imgUrl2, title: '图片标题'},
    { src: imgUrl11, title: '图片标题'},
    { src: imgUrl22, title: '图片标题'},
    { src: imgUrl33, title: '图片标题'},
    { src: imgUrl1, title: '图片标题'},
    { src: imgUrl2, title: '图片标题'},
    { src: imgUrl3, title: '图片标题'},
    { src: imgUrl2, title: '图片标题'},
    { src: imgUrl11, title: '图片标题'},
    { src: imgUrl22, title: '图片标题'},
    { src: imgUrl33, title: '图片标题'}
];

// 获取单位表格(分页)
export const getUnitList = (req) => {
    return {
        code: 'SUCCESS',
        data: unitList,
        msg: ''
    }
};

// 根据单位ID获取单位详情
export const getUnitById = (req) => {
    return {
        code: 'SUCCESS',
        data: unitDetail,
        msg: ''
    }
};

// 获取单位人员情况(分页)
export const getUnitPersonById = (req) => {
    // console.dir(req);
    return {
        code: 'SUCCESS',
        data: unitPerson,
        msg: ''
    }
}

// 获取单位附件信息
export const getUnitAccessory = (req) => {
    return {
        code: 'SUCCESS',
        data: unitAccessory,
        msg: ''
    }
}