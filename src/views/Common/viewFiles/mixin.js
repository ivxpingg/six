import vViewFiles from './viewFiles';
export default {
    components: {vViewFiles},
    methods: {
        getData_vViewFile(relationId,fileType, key) {
            this.$http({
                method: 'get',
                url: '/file/attachList',
                params: {
                    relationId: relationId,
                    fileType: fileType
                }
            }).then((res) => {
                if (res.code === 'SUCCESS') {
                    this[key] = res.data || [];
                }
            })
        }
    }
}