import vViewFiles from './viewFiles';
export default {
    components: {vViewFiles},
    methods: {
        /**
         * 获取附件信息
         * @param relationId
         * @param fileType
         * @param key
         */
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