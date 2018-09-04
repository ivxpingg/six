
const menuList = [
    {
        icon: 'ios-home',
        name: 'home',
        meta: {
            title: '首页'
        }
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
                icon: '_qualitySupervision_register',
                name: 'qualitySupervision_register',
                meta: {
                    title: '质量监督登记'
                }
            },
            {
                icon: '_qualitySupervision_accept',
                name: 'qualitySupervision_accept',
                meta: {
                    title: '质量监督受理'
                }
            },
            {
                icon: '_qualitySupervision_tell',
                name: 'qualitySupervision_tell',
                meta: {
                    title: '质量监督交底'
                }
            },
            {
                icon: '_qualitySupervision_check',
                name: 'qualitySupervision_check',
                meta: {
                    title: '质量监督检查'
                }
            },
            {
                icon: '_account',
                name: 'qualitySupervision_account',
                meta: {
                    title: '质量监督台账'
                }
            },
            {
                icon: '_qualitySupervision_complaint',
                name: 'qualitySupervision_complaint',
                meta: {
                    title: '质量监督投述管理'
                }
            },
            {
                icon: '_qualityProjectCreate',
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
                icon: '_safetySupervision_notification',
                name: 'safetySupervision_notification',
                meta: {
                    title: '安全通知'
                }
            },
            {
                icon: '_safetySupervision_check',
                name: 'safetySupervision_check',
                meta: {
                    title: '安全督查检查'
                }
            },
            {
                icon: '_account',
                name: 'safetySupervision_account',
                meta: {
                    title: '安全督查台账'
                }
            },
            {
                icon: '_safetySupervision_examine',
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
                icon: '_creditRating_record',
                name: 'creditRating_record',
                meta: {
                    title: '信用评价记录'
                }
            },
            {
                icon: '_account',
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
                icon: '_QA_report',
                name: 'QA_report',
                meta: {
                    title: '质量检测报表'
                }
            },
            {
                icon: '_QA_analyze',
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
                icon: '_projectRecords',
                name: 'projectRecords',
                meta: {
                    title: '工程备案'
                }
            },
            {
                icon: '_project_verification',
                name: 'project_verification',
                meta: {
                    title: '交工检测核验'
                }
            },
            {
                icon: '_projectCompleteQuality_authenticate',
                name: 'projectCompleteQuality_authenticate',
                meta: {
                    title: '竣工质量鉴定'
                }
            },
            {
                icon: '_projectFileManage',
                name: 'projectFileManage',
                meta: {
                    title: '工程档案管理'
                }
            }
        ]
    },
    {
        icon: 'ios-settings',
        name: 'SystemManage',
        meta: {
            title: '系统管理'
        },
        children: [
            {
                icon: '_data-dict',
                name: 'dataDict',
                meta: {
                    title: '数据字典'
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