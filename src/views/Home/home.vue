<template>
    <div class="home-container">
        <Row :gutter="20">
            <i-col span="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;">
                <vInfoCard shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
                    <vCountTo :end="infor.count" count-class="count-style"/>
                    <p>{{ infor.title }}</p>
                </vInfoCard>
            </i-col>
        </Row>
        <div class="gutter-line"></div>
        <Row :gutter="20">
            <i-col span="8">
                <Card shadow></Card>
            </i-col>
            <i-col span="16">
                <Card shadow></Card>
            </i-col>
        </Row>
    </div>
</template>

<script>
    import vInfoCard from '../../components/info-card';
    import vCountTo from '../../components/count-to';
    export default {
        name: 'mhome',
        components: {
            vInfoCard,
            vCountTo
        },
        data() {
            return {
                inforCardData: [
                    { title: '从业单位(家)', icon: 'md-person-add', count: 803, color: '#2d8cf0' },
                    { title: '从业人员(人)', icon: 'md-locate', count: 23432, color: '#19be6b' },
                    { title: '在建项目(个)', icon: 'md-help-circle', count: 142, color: '#ff9900' },
                    { title: '交竣工项目(个)', icon: 'md-share', count: 657, color: '#ed3f14' },
                    { title: '建设里程(km)', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
                    { title: '监督工作(人次)', icon: 'md-map', count: 14, color: '#9A66E4' }
                ]
            };
        }
    }
</script>

<style lang="scss">
    .home-container {
        .gutter-line {
            height: 20px;
        }
    }
    .count-style{
        font-size: 50px;
    }
</style>