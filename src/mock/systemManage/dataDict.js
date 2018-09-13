import {getParams} from '../../lib/util';

const dictList = {
    D001: [
        {
            id: '0',
            parentId: '',
            value: '001',
            label: '监督单位',
            type: 'D001',
            description: '单位类型'
        },
        {
            id: '0',
            parentId: '',
            value: '002',
            label: '建设单位',
            type: 'D001',
            description: '单位类型'
        },
        {
            id: '0',
            parentId: '',
            value: '003',
            label: '监理单位',
            type: 'D001',
            description: '单位类型'
        },
        {
            id: '0',
            parentId: '',
            value: '004',
            label: '施工单位',
            type: 'D001',
            description: '单位类型'
        },
        {
            id: '0',
            parentId: '',
            value: '005',
            label: '设计单位',
            type: 'D001',
            description: '单位类型'
        }
    ]
};


export const getDictList = (req) => {
    let params = getParams(req.url);
    return {
        code: 'SUCCESS',
        data: dictList[params.type],
        msg: ''
    }
};

