import Main from '@/views/Main/main.vue';
const Login = [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录'
        },
        component: () => import('@/views/Login/login.vue')
    }
];

// 综合展示系统
const ShowSystem = [
    {
        path: '/showSystem',
        name: 'showSystem',
        meta: {
            title: '综合展示'
        },
        component: () => import('@/views/ShowSystem/showSystem.vue')
    }
];

// 首页
const Home = [
    {
        path: '/',
        //name: 'home',
        redirect: '/home',
        component: Main,
        meta: {
            hideInMenu: true,
            notCache: true
        },
        children: [{
            path: '/home',
            name: 'home',
            component: () => import('@/views/Home/home.vue'),
            meta: {
                hideInMenu: true,
                title: '首页',
                notCache: true
            }
        }]
    }
];

// 基础信息管理
const BaseManage = [
    {
        path: '/BaseManage',
        name: 'BaseManage',
        component: Main,
        meta: {
            icon: 'ios-paper',
            title: '基础信息管理'
        },
        children: [
            {
                path: 'organizetionManage',
                name: 'organizetionManage',
                meta: {
                    icon: 'md-git-network',
                    title: '组织结构管理'
                },
                component: () => import('@/views/BaseManage/organizetionManage/organizetionManage.vue')
            },
            {
                path: 'roleManage',
                name: 'roleManage',
                component: () => import('@/views/BaseManage/roleManage/roleManage.vue'),
                meta: {
                    icon: 'ios-people',
                    title: '角色管理'
                }
            },
            {
                path: 'eSignatureManage',
                name: 'eSignatureManage',
                component: () => import('@/views/BaseManage/eSignatureManage/eSignatureManage.vue'),
                meta: {
                    icon: 'ios-image',
                    title: '电子签名管理'
                }
            },
            {
                path: 'auditProcessManage',
                name: 'auditProcessManage',
                component: () => import('@/views/BaseManage/auditProcessManage/auditProcessManage.vue'),
                meta: {
                    icon: 'ios-infinite',
                    title: '审核流程管理'
                }
            }
        ]
    }
];

// 机构与人员管理
const OrgAndPersonManage = [
    {
        path: '/OrgAndPersonManage',
        name: 'OrgAndPersonManage',
        component: Main,
        meta: {
            icon: 'ios-people',
            title: '机构与人员管理'
        },
        children: [
            {
                path: 'workUnitManage',
                name: 'workUnitManage',
                component: () => import('@/views/OrgAndPersonManage/workUnitManage/workUnitManage.vue'),
                meta: {
                    icon: '_unit',
                    title: '从业单位管理'
                }
            },
            {
                path: 'workPersonManage',
                name: 'workPersonManage',
                component: () => import('@/views/OrgAndPersonManage/workPersonManage/workPersonManage.vue'),
                meta: {
                    icon: '_person-manage',
                    title: '从业人员管理'
                }
            },
            {
                path: 'supervisorsManage',
                name: 'supervisorsManage',
                component: () => import('@/views/OrgAndPersonManage/supervisorsManage/supervisorsManage.vue'),
                meta: {
                    icon: '_supervise-person-manage',
                    title: '监督单位人员管理'
                }
            }
        ]
    }
];

// 质量监督管理
const QualitySupervisionManage = [
    {
        path: '/QualitySupervisionManage',
        name: 'QualitySupervisionManage',
        component: Main,
        meta: {
            icon: 'ios-ribbon',
            title: '质量监督管理'
        },
        children: [
            {
                path: 'qualitySupervision_register',
                name: 'qualitySupervision_register',
                meta: {
                    icon: '_qualitySupervision_register',
                    title: '质量监督登记'
                }
            },
            {
                path: 'qualitySupervision_accept',
                name: 'qualitySupervision_accept',
                meta: {
                    icon: '_qualitySupervision_accept',
                    title: '质量监督受理'
                }
            },
            {
                path: 'qualitySupervision_tell',
                name: 'qualitySupervision_tell',
                meta: {
                    icon: '_qualitySupervision_tell',
                    title: '质量监督交底'
                }
            },
            {
                path: 'qualitySupervision_check',
                name: 'qualitySupervision_check',
                meta: {
                    icon: '_qualitySupervision_check',
                    title: '质量监督检查'
                }
            },
            {
                path: 'qualitySupervision_account',
                name: 'qualitySupervision_account',
                meta: {
                    icon: '_account',
                    title: '质量监督台账'
                }
            },
            {
                path: 'qualitySupervision_complaint',
                name: 'qualitySupervision_complaint',
                meta: {
                    icon: '_qualitySupervision_complaint',
                    title: '质量安全投诉管理'
                }
            },
            {
                path: 'qualityProjectCreate',
                name: 'qualityProjectCreate',
                meta: {
                    icon: '_qualityProjectCreate',
                    title: '品质工程创建'
                }
            }
        ]
    }
];

// 安全监督管理
const SafetySupervisionManage = [
    {
        path: '/SafetySupervisionManage',
        name: 'SafetySupervisionManage',
        component: Main,
        meta: {
            icon: 'ios-book',
            title: '安全监督管理'
        },
        children: [
            {
                path: 'safetySupervision_notification',
                name: 'safetySupervision_notification',
                meta: {
                    icon: '_safetySupervision_notification',
                    title: '安全通知'
                }
            },
            {
                path: 'safetySupervision_check',
                name: 'safetySupervision_check',
                meta: {
                    icon: '_safetySupervision_check',
                    title: '安全督查检查'
                }
            },
            {
                path: 'safetySupervision_account',
                name: 'safetySupervision_account',
                meta: {
                    icon: '_account',
                    title: '安全督查台账'
                }
            },
            {
                path: 'safetySupervision_examine',
                name: 'safetySupervision_examine',
                meta: {
                    icon: '_safetySupervision_examine',
                    title: '平安工地考核'
                }
            }
        ]
    }
];

// 信用评价管理
const CreditRatingManage = [
    {
        path: '/CreditRatingManage',
        name: 'CreditRatingManage',
        component: Main,
        meta: {
            icon: 'ios-medal',
            title: '信用评价管理'
        },
        children: [
            {
                path: 'creditRating_record',
                name: 'creditRating_record',
                meta: {
                    icon: '_creditRating_record',
                    title: '信用评价记录'
                }
            },
            {
                path: 'creditRating_account',
                name: 'creditRating_account',
                meta: {
                    icon: '_account',
                    title: '信用评价管理台账'
                }
            },
            {
                path: 'majorProject_check',
                name: 'majorProject_check',
                meta: {
                    icon: '_majorProject_check',
                    title: '重点项目考勤管理'
                }
            }
        ]
    }
];

// 质量检测管理
const QAManage = [
    {
        path: '/QAManage',
        name: 'QAManage',
        component: Main,
        meta: {
            icon: 'ios-construct',
            title: '质量检测管理'
        },
        children: [
            {
                path: 'QA_report',
                name: 'QA_report',
                meta: {
                    icon: '_QA_report',
                    title: '质量检测报表'
                }
            },
            {
                path: 'QA_analyze',
                name: 'QA_analyze',
                meta: {
                    icon: '_QA_analyze',
                    title: '质量安全检测数据分析'
                }
            }
        ]
    }
];

// 备案及交竣工管理
const RecordAndCompletedManage = [
    {
        path: '/RecordAndCompletedManage',
        name: 'RecordAndCompletedManage',
        component: Main,
        meta: {
            icon: 'ios-clipboard',
            title: '备案及交竣工管理'
        },
        children: [
            {
                path: 'projectRecords',
                name: 'projectRecords',
                meta: {
                    icon: '_projectRecords',
                    title: '工程备案'
                }
            },
            {
                path: 'project_verification',
                name: 'project_verification',
                meta: {
                    icon: '_project_verification',
                    title: '交工检测核验'
                }
            },
            {
                path: 'projectCompleteQuality_authenticate',
                name: 'projectCompleteQuality_authenticate',
                meta: {
                    icon: '_projectCompleteQuality_authenticate2',
                    title: '竣工质量鉴定'
                }
            },
            {
                path: 'projectFileManage',
                name: 'projectFileManage',
                meta: {
                    icon: '_projectFileManage',
                    title: '工程档案管理'
                }
            }
        ]
    }
];

// 系统管理
const SystemManage = [
    {
        path: '/SystemManage',
        name: 'SystemManage',
        component: Main,
        meta: {
            icon: 'ios-settings',
            title: '系统管理'
        },
        children: [
            {
                path: 'dataDict',
                name: 'dataDict',
                meta: {
                    icon: '_data-dict',
                    title: '数据字典'
                },
                component: () => import('@/views/SystemManage/dataDict/dataDict.vue')
            }
        ]
    }
]

export default [
    ...Login,
    ...Home,
    ...ShowSystem,
    ...BaseManage,
    ...OrgAndPersonManage,
    ...QualitySupervisionManage,
    ...SafetySupervisionManage,
    ...CreditRatingManage,
    ...QAManage,
    ...RecordAndCompletedManage,
    ...SystemManage
]