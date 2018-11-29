<template>
    <div class="baidu-map">
        <div class="map-header">

            <img class="title-logo" src="../../../assets/images/logo.png" alt="logo">
            <div class="title"> 综合展示系统</div>
            <ul class="map-btn">
                <!--<li> <Button size="large" type="text" ghost custom-icon="iconfont icon-bianji"> 编辑 </Button></li>-->
                <li> <Button size="large" type="text" ghost custom-icon="iconfont icon-tianjia"
                             v-show="status === 'normal'"
                             @click="onClick_add_modal"> 添加 </Button> </li>

                <li> <Button size="large" type="text" ghost custom-icon="iconfont icon-tianjia"
                             v-show="status === 'add'"
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

                <li> <Button size="large" type="text" ghost to="/home" custom-icon="iconfont icon-bianji" v-show="status === 'normal'"> 返回 </Button> </li>
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

    </div>
</template>
<script>
    import initBMap from './initBMap';
    import vCommonIcon from '@/components/commonIcon/commonIcon';
    import projectSelect_mixin from './mixin/projectSelect';
    import mapDrawing_mixin from './mixin/mapDrawing';
    import projectLine_mixin from './mixin/projectLine';

    export default {
        name: 'baiduMap',
        mixins: [projectSelect_mixin, mapDrawing_mixin, projectLine_mixin],
        components: {vCommonIcon},
        data() {
            return {
                map: null,

                // 当前选择的项目
                currentProject:{

                },

                // 当前状态： 编辑状态：edit; 添加状态： add; 默认状态： normal
                status: 'normal'
            }
        },
        mounted() {
            initBMap('baidu_map').then((m) => {
                this.map = m;
                this.getProjectShowList();
            });

            this.getProjectList_select();
        },
        methods: {
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
            background-color: rgba(17,48,124,0.9);
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
                color: #01b0ff;
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
                        color: #01b0ff;
                        font-weight: 700;
                        border: none;
                        box-shadow: none;
                        &:hover, &:active {
                            color: #FFF;
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
</style>