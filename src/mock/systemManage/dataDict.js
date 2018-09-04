const dictList = [
    {
        id: '',
        parentId: '',
        value: '',
        label: '',
        type: ''
    }
];


const getDictList = (req) => {
    return {
        status: 1,
        result: dictList,
        msg: ''
    }
};

export default {
    getDictList
}

