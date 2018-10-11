<template>
    <div class="qualitySupervision_complaint-container">

    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    export default {
        name: 'qualitySupervision_complaint',
        components: {vIvxFilterBox},
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        searchKey: '',      // 模糊查询参数
                        handleStatus: ''
                    }
                }
            };
        }
    }
</script>

<style lang="scss" scoped>
    .qualitySupervision_complaint-container {
    }
</style>