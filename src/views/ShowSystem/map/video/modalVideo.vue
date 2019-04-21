<template>
    <Modal v-model="modalValue"
           title="视频监控"
           footer-hide
           :width="500">
        <Tree :data="treeData" @on-select-change="openCamera"></Tree>
        <!--<iframe id="iframeCarmer" style="border: 0;" width=0 height=0></iframe>-->

    </Modal>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    export default {
        name: 'modalVideo',
        mixins: [modalMixin],
        computed: {
            treeData() {
                let list = this.cameraList.map(v => {
                    v.title = v.name;
                    v.render = (h, { root, node, data }) => {
                        return h ('span', {
                            style: {
                                display: 'inline-block',
                                width: '100%'
                            },
                            on: {
                                click: () => {
                                    this.openCamera(node);
                                }
                            }
                        }, [
                            h('Icon', {
                                props: {
                                    type: 'ios-videocam'
                                },
                                style: {
                                    marginRight: '8px'
                                }
                            }),
                            h('span', data.title)
                        ])

                    }
                    return v;
                });

                return [{
                    title: '视频列表',
                    expand: true,
                    children: list
                }]
            }
        },
        data() {
            return {
                iframeUrl: '',

                urlParan: {
                    PalyType: 'PlayReal',
                    // SvrIp: 'open8200.hikvision.com',
                    // SvrPort: '443',
                    // appkey: '26458282',
                    SvrIp: '112.53.236.78',
                    SvrPort: '446',
                    appkey: '24079203',
                    appSecret: '',
                    time: '',
                    timeSecret: '',
                    httpsflag: '1',
                    CamList: ''
                },

                // 视频列表
                cameraList:  []
            };
        },
        mounted() {
            this.getCameraList();
        },
        methods: {
            getAppKey() {
                return new Promise((resolve, reject) => {
                    this.$http({
                        method: 'get',
                        url: '/hikvision/security'
                    }).then(res => {
                        if(res.data.code === '0') {
                            this.urlParan.appSecret = res.data.data.appSecret;
                            this.urlParan.time = res.data.data.time;
                            this.urlParan.timeSecret = res.data.data.timeSecret;

                            resolve();
                        }
                        else{
                            reject(res);
                        }
                    }).catch((e) => {
                        reject(e);
                    })
                })
            },
            getCameraList() {
                this.$http({
                    method: 'get',
                    url: '/hikvision/cameraInfos'
                }).then(res => {

                    if(res.data.code === '200') {
                        this.cameraList = res.data.data;
                    }
                })
            },
            setUrl() {
                this.iframeUrl = 'hikvideoclient://ReqType:' + this.urlParan.PalyType + ';'
                    + 'VersionTag:artemis' + ';'
                    + 'SvrIp:' + this.urlParan.SvrIp + ';'
                    + 'SvrPort:' + this.urlParan.SvrPort + ';'
                    + 'Appkey:' + this.urlParan.appkey + ';'
                    + 'AppSecret:' + this.urlParan.appSecret + ';'
                    + 'time:' + this.urlParan.time + ';'
                    + 'timesecret:' + this.urlParan.timeSecret + ';'
                    + 'httpsflag:' + this.urlParan.httpsflag + ';'
                    + 'WndCount:1;'
                    + 'CamList:' + this.urlParan.CamList + ';';

                document.getElementById("iframeCarmer").src = this.iframeUrl;
            },
            openCamera(node) {
                // console.dir(item);

                // let attr = this.cameraList.map(v => v.indexCode);
                //
                // this.getAppKey().then(() => {
                //     this.urlParan.CamList = attr.join(',');
                //     this.setUrl();
                // });

                if (node.node.indexCode) {
                    this.getAppKey().then(() => {
                        this.urlParan.CamList = node.node.indexCode + '@' + node.node.name || '';
                        this.setUrl();
                    });
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modalVideo-container {
    }
</style>