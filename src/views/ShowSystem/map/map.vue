<template>
    <div class="baidu-map">
        <div class="map-header">

            <img class="title-logo" src="../../../assets/images/logo.png" alt="logo">
            <div class="title"> 全市交通工程质量综合展示系统</div>
            <ul class="map-btn">
                <li style="padding-top: 8px;">
                    <DatePicker :value="searchParams.year"
                                class="datapicker"
                                size="small"
                                type="year"
                                placeholder="选择时间"
                                style="width: 100px;"
                                @on-change="onChange_dataYear"></DatePicker>
                </li>
                <!--<li> <Button size="large" type="text" ghost custom-icon="iconfont icon-bianji"> 编辑 </Button></li>-->
                <li> <Button :to="downUrl" ghost icon="md-arrow-round-down" download="" target="_blank">下载视频播放器插件</Button> </li>

                <li> <Button size="large" type="text" ghost icon="ios-videocam"
                             @click="onClick_video_modal"> 查看视频 </Button> </li>

                <li> <Button size="large" type="text" ghost custom-icon="iconfont icon-tianjia"
                             v-show="status === 'normal'"
                             @click="onClick_add_modal"> 添加 </Button> </li>

                <li> <Button size="large" type="text" ghost custom-icon="iconfont icon-tianjia"
                             v-show="status === 'add' || status === 'edit'"
                             @click="onClick_addMarker_modal"> 添加打卡点 </Button> </li>

                <li> <Button size="large" type="text" ghost custom-icon="iconfont icon-wancheng"
                             v-show="status === 'add'"
                             @click="onClick_complete_draw"> 完成 </Button></li>

                <li> <Button size="large" type="text" ghost custom-icon="iconfont icon-wancheng"
                             v-show="status === 'edit'"
                             @click="onClick_save"> 保存 </Button></li>

                <li> <Button size="large" type="text" ghost custom-icon="iconfont icon-wancheng"
                             v-show="status === 'add' || status === 'edit'"
                             @click="cancel_status"> 取消 </Button></li>

                <li> <Button size="large" type="text" ghost to="/home" custom-icon="iconfont icon-fanhuiyulan" v-show="status === 'normal'"> 返回 </Button> </li>
            </ul>
        </div>
        <div class="map" id="baidu_map"></div>

        <!--选择添加项目-->
        <Modal title="选择项目"
               :width="450"
               v-model="modal_projectSelect"
               ok-text="绘制线路"
               @on-ok="onOk_add_modal">
            <Form>
                <FormItem label="项目：" :label-width="60">
                    <Select v-model="projectValue_select" @on-change="onChange_selectProject">
                        <Option v-for="(item, idx) in projectList_select"
                                :key="item.projectId + idx"
                                :label="`${item.projectName}(${item.part})`"
                                :value="item.projectId"></Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>

        <!--视频窗口-->
        <Modal :title="video_projectName"
               v-model="modal_video"
               :width="800"
               @on-cancel="destroyWnd"
               footer-hide>
            <vModalBothSides :height="450" style="margin: -16px;">
                <div slot="left">
                    <div style="width: 140px;">
                        <Tree :data="data1"></Tree>
                    </div>
                </div>
                <div slot="right">
                    <Row>
                        <i-col span="24">
                            <div class="video-panel" :class="{'video-panel-max': video_max}" @dblclick="switch_max"></div>
                        </i-col>
                    </Row>
                    <!--<div class="video-box" ref="video_div" id="video_div"></div>-->
                </div>
            </vModalBothSides>
        </Modal>

        <vModalVideo ref="modal_video"></vModalVideo>

        <iframe id="iframeCarmer" style="border: 0;" width=0 height=0></iframe>
    </div>
</template>
<script>
    import initBMap from './initBMap';
    import Config from '../../../config';
    import vCommonIcon from '@/components/commonIcon/commonIcon';
    import vModalBothSides from '../../../components/modal-body/modal-both-sides';
    import projectSelect_mixin from './mixin/projectSelect';
    import mapDrawing_mixin from './mixin/mapDrawing';
    import projectLine_mixin from './mixin/projectLine';
    import videoControl_mixin from './mixin/videoControl';
    import vModalVideo from './video/modalVideo';
    import MOMENT from 'moment';
    export default {
        name: 'baiduMap',
        mixins: [projectSelect_mixin, mapDrawing_mixin, projectLine_mixin, videoControl_mixin],
        components: {vCommonIcon, vModalBothSides, vModalVideo},
        computed: {
            downUrl() {
                return Config[Config.env].origin + '/plugIn/VideoClientSetup_20190102.exe';
            }
        },
        data() {
            return {
                map: null,

                searchParams: {
                    year: ''
                },
                // 当前选择的项目
                currentProject:{

                },

                // 当前状态： 编辑状态：edit; 添加状态： add; 默认状态： normal
                status: 'normal',

                // 测试
                data1: [
                    { title: '视频1' },
                    { title: '视频2' },
                    { title: '视频3' },
                    { title: '视频4' },
                    { title: '视频5' },
                    { title: '视频6' },
                    { title: '视频7' }
                ],
                video_max: false,


                iframeUrl: '',
                urlParan: {
                    PalyType: 'PlayReal',
                    SvrIp: 'open8200.hikvision.com',
                    SvrPort: '446',
                    // SvrIp: '112.53.236.78',
                    // SvrPort: '84',
                    appkey: '24079203',
                    appSecret: '',
                    time: '',
                    timeSecret: '',
                    httpsflag: '1',
                    CamList: ''
                },

                // 视频列表
                cameraList:  []
            }
        },
        beforeDestroy() {
            this.destroyWnd();
        },
        created() {
            this.searchParams.year = MOMENT().format('YYYY');
            this.$parent.year = this.searchParams.year;
        },
        mounted() {
            initBMap('baidu_map').then((m) => {
                this.map = m;
                this.getProjectShowList();
            });

            this.getProjectList_select();

            // this.getCameraList();
        },
        methods: {
            onChange_dataYear(value) {
                this.searchParams.year = value;
                this.$parent.year = value;
            },
            // 取消添加或编辑
            cancel_status() {
                if (this.polyline) {
                    this.map.removeOverlay(this.polyline);
                }
                if (this.marker) {
                    this.map.removeOverlay(this.marker);
                }

                if (this.polyline_edit) {
                    this.map.removeOverlay(this.polyline_edit);
                }
                if (this.marker_edit) {
                    this.map.removeOverlay(this.marker_edit);
                }

                this.formData_add.projectId = '';
                this.formData_add.projectPosition = '';
                this.formData_add.lat = null;
                this.formData_add.lon = null;

                this.polyline = null;
                this.marker = null;
                this.status = 'normal';
                if(this.drawingManager) {
                    this.drawingManager.close();
                }

                this.getProjectShowList();
            },

            switch_max() {
                this.video_max = !this.video_max;
            },

            //
            onClick_video_modal() {
                this.$refs.modal_video.modalValue = true;
                //
                // this.openCamera();
            },

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
            openCamera() {
                // console.dir(item);

                let attr = this.cameraList.map((v, idx )=> { return v.indexCode + '@' + v.name;});

                this.getAppKey().then(() => {
                    this.urlParan.CamList = attr.join(',');
                    this.setUrl();
                }).catch(() => {
                    this.setUrl();
                });
                // if (item[0].indexCode) {
                //
                // }
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    .baidu-map {
        position: relative;
        height: 100%;

    .map-header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 70px;
        background-color: rgba(39,58,85,0.9);
        z-index: 111;

    .title-logo {
        float: left;
        margin-top: 12px;
        margin-left: 20px;
        width: 45px;
    }
    .title {
        float: left;
        padding-left: 20px;
        font-size: 30px;
        color: #fff;
        font-weight: 700;
        line-height: 70px;
        letter-spacing: 8px;

    }

    .map-btn {
        float: right;
        padding-top: 18px;
        padding-right: 60px;
    li {
        float: left;
        margin-left: 18px;
    .ivu-btn {
        color: #FFF;
        font-weight: 700;
        border: none;
        box-shadow: none;
    &:hover, &:active {
                  color: #BBB;
                  border: none;
              }
    }
    }
    }
    }
    .map {
        height: 100%;
    }
    }

    .video-box {
        width: 600px;
        height: 400px;
        border: 1px solid red;
    }

    .video-panel {
        background-color: #333;
        border: 1px solid #666;
        width: 600px;
        height: 400px;

    &.video-panel-max {
         position: fixed;
         z-index: 99999;
         top: 0;
         left: 0;
         width: 100%;
         height: 100%;
     }
    }
</style>
<style lang="scss">
    // 去掉百度地图Logo
    .anchorBL {
        display: none;
    }

    .modal-list-info {
        position: absolute;
        top: 0;
        left: 0;
        min-width: 250px;
        background-color: #FFF;
        z-index: 10;
    .ivu-form-item {
        margin-bottom: 0;
    }

    .ivu-modal-footer {
        display: none;
    }
    }

    .modal-list-info {
    .ivu-poptip-arrow {
        left: 50%;
        margin-left: -7px;
        bottom: -7px;
        border-width: 7px 7px 0;
        border-top-color: rgba(255,255,255,1);
    }
    }

    .datapicker {
    .ivu-icon {
        color: #FFF;
    }

    .ivu-input {
        color: #fff;
        border: 1px solid #fff;
        background-color: transparent;
    }

    }
</style>