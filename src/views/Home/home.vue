<template>
    <div class="home-container" ref="home">
        <vCountPanel :inforCardData="inforCardData"></vCountPanel>
        <div class="gutter-line"> </div>
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
                    { title: '交竣工项目(个)', icon: '_projectCompleteQuality_authenticate2', count: 657, color: '#ed3f14' },
                    { title: '建设里程(km)', icon: 'md-flag', count: 112, color: '#E46CBB' },
                    { title: '监督工作(人次)', icon: '_safetySupervision_check', count: 14, color: '#9A66E4' }
                ]
            };
        },
        mounted() {
            this.$Notice.info({
                title: '消息通知',
                desc: '您还有3项事务暂未处理，其中2项即将逾期，请尽快处理。',
                duration: 10
            });
        },
        methods: {
            toPdf() {

                let that = this;
                html2canvas(this.$refs.home).then(function(canvas) {

                    let imgData = canvas.toDataURL('image/jpeg');
                    let doc = new jspdf("p", "pt", [1291,1313]);
                    doc.addImage(imgData, 'JPEG', 0, 0,1291,1313);
                    console.dir(doc.output('datauristring'));
                    // that.submit(doc.output());
                    // doc.save('content.pdf');
                    // document.body.appendChild(canvas);
                });
                // html2canvas(this.$refs.home, {
                //     onrendered: function(canvas) {
                //
                //         debugger
                //
                //         //通过html2canvas将html渲染成canvas，然后获取图片数据
                //         let imgData = canvas.toDataURL('image/jpeg');
                //
                //         //初始化pdf，设置相应格式
                //         let doc = new jspdf("p", "mm", "a4");
                //
                //         //这里设置的是a4纸张尺寸
                //         doc.addImage(imgData, 'JPEG', 0, 0,210,297);
                //
                //         //输出保存命名为content的pdf
                //         doc.save('content.pdf');
                //     }
                // });
            }
        }
    }
</script>

<style lang="scss">
    .home-container {
        .gutter-line {
            height: 20px;
        }

        .row-box {
            & > .ivu-col {
                margin-bottom: 20px;
                height: 371px;
                overflow: hidden;
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