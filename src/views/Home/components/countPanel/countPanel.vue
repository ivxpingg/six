<template>
    <Row :gutter="20">
        <i-col span="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;">
            <vInfoCard shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
                <vCountTo :end="infor.count" count-class="count-style"/>
                <p>{{ infor.title }}</p>
            </vInfoCard>
        </i-col>
    </Row>
</template>
<script>
    import vInfoCard from '../../../../components/info-card';
    import vCountTo from '../../../../components/count-to';
    export default {
        name: 'countPanel',
        components: {
            vInfoCard,
            vCountTo
        },
        props:{
            inforCardData: {
                type: Array,
                required: true,
                default: () => []
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>