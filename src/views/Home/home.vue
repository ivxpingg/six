<template>
    <div class="home-container">
        <vCountPanel :inforCardData="inforCardData"></vCountPanel>
        <div class="gutter-line"></div>
        <Row class="row-box" :gutter="20">
            <i-col span="8"><vUserInfoPanel></vUserInfoPanel></i-col>
            <i-col span="16"><vSupervisionCount></vSupervisionCount></i-col>
            <i-col span="8"><vNoticePanel></vNoticePanel></i-col>
            <i-col span="8"><vInfoCollectionPanel></vInfoCollectionPanel></i-col>
            <i-col span="8"><vProjectPanel></vProjectPanel></i-col>
            <i-col span="16"><vFilesManage></vFilesManage></i-col>
            <i-col span="8"><vLogPanel></vLogPanel></i-col>
        </Row>
    </div>
</template>

<script>
    import vCountPanel from './components/countPanel/countPanel.vue';
    import vUserInfoPanel from './components/userInfoPanel/userInfoPanel.vue';
    import vSupervisionCount from './components/supervisionCount/supervisionCountPanel.vue';
    import vNoticePanel from './components/noticePanel/noticePanel.vue';
    import vInfoCollectionPanel from './components/infoCollectionPanel/infoCollectionPanel.vue';
    import vProjectPanel from './components/projectPanel/projectPanel.vue';
    import vFilesManage from './components/filesManage/filesManagePanel.vue';
    import vLogPanel from './components/logPanel/logPanel.vue';
    export default {
        name: 'mhome',
        components: {
            vCountPanel,
            vUserInfoPanel,
            vSupervisionCount,
            vNoticePanel,
            vInfoCollectionPanel,
            vProjectPanel,
            vFilesManage,
            vLogPanel
        },
        data() {
            return {
                inforCardData: [
                    { title: '从业单位(家)', icon: '_unit', count: 803, color: '#2d8cf0' },
                    { title: '从业人员(人)', icon: 'md-person', count: 13432, color: '#19be6b' },
                    { title: '在建项目(个)', icon: 'md-cube', count: 142, color: '#ff9900' },
                    { title: '交竣工项目(个)', icon: '_projectCompleteQuality_authenticate', count: 657, color: '#ed3f14' },
                    { title: '建设里程(km)', icon: 'md-flag', count: 112, color: '#E46CBB' },
                    { title: '监督工作(人次)', icon: '_safetySupervision_check', count: 14, color: '#9A66E4' }
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

        .row-box {
            .ivu-col {
                margin-bottom: 20px;
            }

            .ivu-card-body {
                height: 320px;
            }
        }
    }


    .count-style{
        font-size: 50px;
    }
</style>