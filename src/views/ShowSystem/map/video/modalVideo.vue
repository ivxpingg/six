<template>
    <Modal v-model="modalValue"
           title="视频监控"
           footer-hide
           :height="500"
           :width="600">
        <div style="height: 500px; overflow-x: hidden; overflow-y: auto;">
            <Tree ref="tree" :data="treeData_clc"></Tree>
        </div>
        <!--<iframe id="iframeCarmer" style="border: 0;" width=0 height=0></iframe>-->

    </Modal>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    export default {
        name: 'modalVideo',
        mixins: [modalMixin],
        computed: {

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
                orgList: [], // 组织结构
                cameraList:  [],
                treeData_clc: [],

                selected_nodeKey: ''

            };
        },
        mounted() {
            this.getTreeOrg();
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
            getTreeOrg() {
                this.$http({
                    method: 'get',
                    url: '/hikvision/controlUnitPage'
                }).then(res => {
                    if(res.data.code === '200') {
                        this.orgList = res.data.data;
                        this.orgList = this.orgList.filter(v => {
                            return v.unitLevel !== 1 || v.name === '重点项目监控';
                        });
                        this.getCameraList();
                    }
                })
            },
            getCameraList() {
                this.$http({
                    method: 'get',
                    url: '/hikvision/cameraInfos'
                }).then(res => {
                    if(res.data.code === '200') {
                        this.cameraList = res.data.data;
                        // this.cameraList = this.cameraList.filter(v => {
                        //    return v.name.indexOf('G312') > -1 || v.name.indexOf('S366') > -1;
                        // });
                        this.resetData();
                    }
                })
            },
            resetData() {
                this.orgList.sort((a, b) => {
                     return a.unitLevel - b.unitLevel;
                });

                // this.treeData_clc
                let root = this.findChildren('-1');

                this.buildTreeData(root, this.treeData_clc, 1);
            },
            buildTreeData(root, obj, expandLevel) {
                root.forEach(v => {
                    v.title = v.name;
                    if (v.unitLevel < expandLevel) {
                        v.expand = true;
                    }
                    v.render = (h, { root, node, data }) => {

                        let doms = [];

                        if (data.cameraId) {
                            doms.push(h('Icon', {
                                props: {
                                    type: 'ios-videocam'
                                },
                                style: {
                                    marginRight: '8px'
                                }
                            }))
                        }
                        doms.push(h('span', {

                        }, data.title));

                        return h ('span', {
                            'class': {
                                'ivu-tree-title-selected': this.selected_nodeKey === data.nodeKey
                            },
                            style: {
                                display: 'inline-block',
                                cursor: 'pointer'
                            },
                            on: {
                                click: () => {
                                    this.selected_nodeKey = data.nodeKey;
                                    if (data.cameraId) {
                                        this.openCamera(data);
                                    }
                                }
                            }
                        }, doms);
                    };

                    obj.push(v);

                    let children = this.findChildren(v.indexCode);
                    if (children && children.length > 0) {
                        v.children = [];
                        this.buildTreeData(children, v.children, expandLevel);
                    }
                });

                return root;
            },
            findChildren(indexCode) {
                let result = [];
                result = this.orgList.filter((v) => indexCode === v.parentIndexCode);

                if (result.length === 0) {
                    return this.cameraList.filter((v) => indexCode === v.parentIndexCode);
                }
                else {
                    return result;
                }

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

                if (node &&  node.indexCode && node.cameraId) {
                    this.getAppKey().then(() => {
                        this.urlParan.CamList = node.indexCode;
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