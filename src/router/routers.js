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
                component: () => import('@/views/QualitySupervisionManage/qualitySupervision_register/qualitySupervision_register.vue'),
                meta: {
                    icon: '_qualitySupervision_register',
                    title: '质量监督登记'
                }
            },
            {
                path: 'qualitySupervision_accept',
                name: 'qualitySupervision_accept',
                component: () => import('@/views/QualitySupervisionManage/qualitySupervision_accept/qualitySupervision_accept.vue'),
                meta: {
                    icon: '_qualitySupervision_accept',
                    title: '质量监督受理'
                }
            },
            {
                path: 'qualitySupervision_tell',
                name: 'qualitySupervision_tell',
                component: () => import('@/views/QualitySupervisionManage/qualitySupervision_tell/qualitySupervision_tell.vue'),
                meta: {
                    icon: '_qualitySupervision_tell',
                    title: '质量监督交底'
                }
            },
            {
                path: 'qualitySupervision_check',
                name: 'qualitySupervision_check',
                component: () => import('@/views/QualitySupervisionManage/qualitySupervision_check/qualitySupervision_check.vue'),
                meta: {
                    icon: '_qualitySupervision_check',
                    title: '质量监督检查'
                }
            },
            {
                path: 'qualitySupervision_account',
                name: 'qualitySupervision_account',
                component: () => import('@/views/QualitySupervisionManage/qualitySupervision_account/qualitySupervision_account.vue'),
                meta: {
                    icon: '_account',
                    title: '质量监督台账'
                }
            },
            {
                path: 'qualitySupervision_complaint',
                name: 'qualitySupervision_complaint',
                component: () => import('@/views/QualitySupervisionManage/qualitySupervision_complaint/qualitySupervision_complaint.vue'),
                meta: {
                    icon: '_qualitySupervision_complaint',
                    title: '质量安全投诉管理'
                }
            },
            {
                path: 'qualityProjectCreate',
                name: 'qualityProjectCreate',
                component: () => import('@/views/QualitySupervisionManage/qualityProjectCreate/qualityProjectCreate.vue'),
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
                component: () => import('@/views/SafetySupervisionManage/safetySupervision_notification/safetySupervision_notification.vue'),
                meta: {
                    icon: '_safetySupervision_notification',
                    title: '安全通知'
                }
            },
            {
                path: 'safetySupervision_check',
                name: 'safetySupervision_check',
                component: () => import('@/views/SafetySupervisionManage/safetySupervision_check/safetySupervision_check.vue'),
                meta: {
                    icon: '_safetySupervision_check',
                    title: '安全督查检查'
                }
            },
            {
                path: 'safetySupervision_account',
                name: 'safetySupervision_account',
                component: () => import('@/views/SafetySupervisionManage/safetySupervision_account/safetySupervision_account.vue'),
                meta: {
                    icon: '_account',
                    title: '安全督查台账'
                }
            },
            {
                path: 'safetySupervision_examine',
                name: 'safetySupervision_examine',
                // component: () => import('@/views/SafetySupervisionManage/safetySupervision_examine/safetySupervision_examine.vue'),
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
                component: () => import('@/views/CreditRatingManage/creditRating_record/creditRating_record.vue'),
                meta: {
                    icon: '_creditRating_record',
                    title: '信用评价记录'
                }
            },
            {
                path: 'creditRating_account',
                name: 'creditRating_account',
                component: () => import('@/views/CreditRatingManage/creditRating_account/creditRating_account.vue'),
                meta: {
                    icon: '_account',
                    title: '信用评价管理台账'
                }
            },
            {
                path: 'majorProject_check',
                name: 'majorProject_check',
                // component: () => import('@/views/CreditRatingManage/majorProject_check/majorProject_check.vue'),
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
                component: () => import('@/views/QAManage/QA_report/QA_report.vue'),
                meta: {
                    icon: '_QA_report',
                    title: '质量检测报表'
                }
            },
            {
                path: 'QA_analyze',
                name: 'QA_analyze',
                component: () => import('@/views/QAManage/QA_analyze/QA_analyze.vue'),
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
                component: () => import('@/views/RecordAndCompletedManage/projectRecords/projectRecords.vue'),
                meta: {
                    icon: '_projectRecords',
                    title: '工程备案'
                }
            },
            {
                path: 'project_verification',
                name: 'project_verification',
                component: () => import('@/views/RecordAndCompletedManage/project_verification/project_verification.vue'),
                meta: {
                    icon: '_project_verification',
                    title: '交工检测核验'
                }
            },
            {
                path: 'projectCompleteQuality_authenticate',
                name: 'projectCompleteQuality_authenticate',
                component: () => import('@/views/RecordAndCompletedManage/projectCompleteQuality_authenticate/projectCompleteQuality_authenticate.vue'),
                meta: {
                    icon: '_projectCompleteQuality_authenticate2',
                    title: '竣工质量鉴定'
                }
            },
            {
                path: 'projectFileManage',
                name: 'projectFileManage',
                component: () => import('@/views/RecordAndCompletedManage/projectFileManage/projectFileManage.vue'),
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