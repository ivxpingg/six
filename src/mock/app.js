
const menuList = [
    {
        icon: 'ios-home',
        name: 'home',
        meta: {
            title: '首页'
        },
        href: 'home'
    },
    {
        icon: 'ios-map',
        name: 'showSystem',
        meta: {
            title: '综合展示系统'
        },
        href: 'https://www.baidu.com/'
    },
    {
        icon: 'ios-paper',
        name: 'BaseManage',
        meta: {
            title: '基础信息管理'
        },
        children: [
            {
                icon: 'md-git-network',
                name: 'organizetionManage',
                meta: {
                    title: '组织结构管理'
                }
            },
            {
                icon: 'ios-people',
                name: 'roleManage',
                meta: {
                    title: '角色管理'
                }
            },
            {
                icon: 'ios-image',
                name: 'eSignatureManage',
                meta: {
                    title: '电子签名管理'
                }
            },
            {
                icon: 'ios-infinite',
                name: 'auditProcessManage',
                meta: {
                    title: '审核流程管理'
                }
            }
        ]
    },
    {
        icon: 'ios-people',
        name: 'OrgAndPersonManage',
        meta: {
            title: '机构与人员管理'
        },
        children: [
            {
                icon: '_unit',
                name: 'workUnitManage',
                meta: {
                    title: '从业单位管理'
                }
            },
            {
                icon: '_person-manage',
                name: 'workPersonManage',
                meta: {
                    title: '从业人员管理'
                }
            },
            {
                icon: '_supervise-person-manage',
                name: 'supervisorsManage',
                meta: {
                    title: '监督单位人员管理'
                }
            }
        ]
    },
    {
        icon: 'ios-ribbon',
        name: 'QualitySupervisionManage',
        meta: {
            title: '质量监督管理'
        },
        children: [
            {
                icon: '',
                name: 'qualitySupervision_register',
                meta: {
                    title: '质量监督登记'
                }
            },
            {
                icon: '',
                name: 'qualitySupervision_accept',
                meta: {
                    title: '质量监督受理'
                }
            },
            {
                icon: '',
                name: 'qualitySupervision_tell',
                meta: {
                    title: '质量监督交底'
                }
            },
            {
                icon: '',
                name: 'qualitySupervision_check',
                meta: {
                    title: '质量监督检查'
                }
            },
            {
                icon: '',
                name: 'qualitySupervision_account',
                meta: {
                    title: '质量监督台账'
                }
            },
            {
                icon: '',
                name: 'qualitySupervision_complaint',
                meta: {
                    title: '质量监督投述管理'
                }
            },
            {
                icon: '',
                name: 'qualityProjectCreate',
                meta: {
                    title: '品质工程创建'
                }
            }
        ]
    },
    {
        icon: 'ios-book',
        name: 'SafetySupervisionManage',
        meta: {
            title: '安全监督管理'
        },
        children: [
            {
                icon: '',
                name: 'qualitySupervision_register',
                meta: {
                    title: '安全通知'
                }
            },
            {
                icon: '',
                name: 'safetySupervision_check',
                meta: {
                    title: '安全督查检查'
                }
            },
            {
                icon: '',
                name: 'safetySupervision_account',
                meta: {
                    title: '安全督查台账'
                }
            },
            {
                icon: '',
                name: 'safetySupervision_examine',
                meta: {
                    title: '平安工地考核'
                }
            }
        ]
    },
    {
        icon: 'ios-medal',
        name: 'CreditRatingManage',
        meta: {
            title: '信用评价管理'
        },
        children: [
            {
                icon: '',
                name: 'creditRating_record',
                meta: {
                    title: '信用评价记录'
                }
            },
            {
                icon: '',
                name: 'creditRating_account',
                meta: {
                    title: '信用评价管理台账'
                }
            }
        ]
    },
    {
        icon: 'ios-construct',
        name: 'QAManage',
        meta: {
            title: '质量检测管理'
        },
        children: [
            {
                icon: '',
                name: 'QA_report',
                meta: {
                    title: '质量检测报表'
                }
            },
            {
                icon: '',
                name: 'QA_analyze',
                meta: {
                    title: '质量安全检测数据分析'
                }
            },
        ]
    },
    {
        icon: 'ios-clipboard',
        name: 'RecordAndCompletedManage',
        meta: {
            title: '备案及交竣工管理'
        },
        children: [
            {
                icon: '',
                name: 'projectRecords',
                meta: {
                    title: '工程备案'
                }
            },
            {
                icon: '',
                name: 'project_verification',
                meta: {
                    title: '交工检测核验'
                }
            },
            {
                icon: '',
                name: 'projectCompleteQuality_authenticate',
                meta: {
                    title: '竣工质量鉴定'
                }
            },
            {
                icon: '',
                name: 'projectFileManage',
                meta: {
                    title: '工程档案管理'
                }
            }
        ]
    }
]

const getMenuList = (req) => {
    return {
        status: 1,
        result: menuList,
        msg: ''
    }
};

export default {
    getMenuList
}