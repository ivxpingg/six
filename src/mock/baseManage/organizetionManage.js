const roleGroup = [
    {
        roleGroupId: '',
        roleGroupNo: '',
        parentId: '',
        parentIds: '',
        roleGroupName: '',
        sort: 0,
        remark: ''
    }
];

const getRoleGroup = (req) => {
    return {
        status: 1,
        result: roleGroup,
        msg: ''
    }
};

export default {
    getRoleGroup
}