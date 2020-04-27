import MOMENT from 'moment';
// 绘制项目在地图上的线路
export default {
    data() {
        return {
            projectShowList: [],
            polygonOverlays: [],

            format_edit: {
                projectId: '',
                projectShowId: '',
                projectPosition: '',
                lat: null,
                lon: null,
                attendanceLocation: ""  // json
            },

            polyline_edit: null,
            marker_edit: null,   //修改多打卡点 弃用
            markerList: []    // 存放多个打卡点，Marker对象
        }
    },
    methods: {
        getProjectShowList() {
            this.$http({
                method: 'get',
                url: '/projectShow/list'
            }).then(res => {
                if (res.code = 'SUCCESS') {
                    this.projectShowList = res.data || [];
                    this.drawPolygonOverlay();
                }
            });
        },

        // 绘制覆盖物
        drawPolygonOverlay() {
            let that = this;
            let opts = {
                width : 250,     // 信息窗口宽度
                // height: 80,     // 信息窗口高度
                // title : "信息窗口" , // 信息窗口标题
                enableMessage:true//设置允许信息窗发送短息
            };
            this.removePolygonOverlay();

            this.projectShowList.forEach(val => {
                let points = eval(val.projectPosition);

                let array = points.map(v => {
                    return new BMap.Point(v.lng, v.lat);
                });

                let polyline = new BMap.Polyline(array, this.styleOptions);   //创建折线

                polyline.info = val;

                //创建右键菜单
                let markerMenu = new BMap.ContextMenu();
                markerMenu.addItem(new BMap.MenuItem('编辑', this.polylineEdit));
                // markerMenu.addItem(new BMap.MenuItem('查看视频', this.watchVideo));
                polyline.addContextMenu(markerMenu);

                //
                let infoWindow;
                // polyline.addEventListener('mouseover', function (e) {
                polyline.addEventListener('click', function (e) {
                    let p = e.target;

                    let time = that.$moment(p.info.planBeginTime).format('YYYY年MM月DD日');

                    let html = `<div>项目名称: ${p.info.projectName}</div>
                                <div>标段: ${p.info.part || ''}</div>
                                <div>建设地点: ${p.info.address || ''}</div>
                                <div>地区: ${p.info.province || ''}${p.info.city || ''}${p.info.county || ''}</div>
                                <div>项目类型: ${p.info.projectTypeLabel || ''}</div>
                                <div>技术等级: ${p.info.technicalLevelLabel}</div>
                                <div>结构类型: ${p.info.structureTypeLabel || ''}</div>
                                <div>工程性质: ${p.info.projectPropertyLabel || ''}</div>
                                <div>建设里程: ${p.info.mileage} 公里</div>
                                <div>设计时速: ${p.info.designSpeed}km/h</div>
                                <div>开工时间: ${time}</div>
                                <div>交工时间: ${that.$moment(p.info.planEndTime).format('YYYY年MM月DD日')}</div>
                                <div>联系人: ${p.info.contacts || ''}</div>
                                <div>联系电话: ${p.info.contactPhone || ''}</div>`;


                    let point = p.getPath()[0];
                    infoWindow = new BMap.InfoWindow(html, opts);  // 创建信息窗口对象
                    if (!p.isEdit) {
                        that.map.openInfoWindow(infoWindow, point); //开启信息窗口
                    }
                });

                // polyline.addEventListener('mouseout', function (e) {
                //     that.map.closeInfoWindow(infoWindow); //开启信息窗口
                // });

                this.map.addOverlay(polyline);   //增加折线

                this.polygonOverlays.push(polyline);
            });
        },

        // 移除覆盖物
        removePolygonOverlay(filterOverlay) {
            this.polygonOverlays.forEach(val => {
                if (val !== filterOverlay) {
                    this.map.removeOverlay(val);
                }
            });

            this.polygonOverlays = [];
        },

        // 覆盖物右键菜单 - 编辑
        polylineEdit(e, r, polyline) {
            polyline.isEdit = true;

            if (!this.drawingManager) {
                this.initDrawingManager();
            }

            this.status = 'edit';
            this.removePolygonOverlay(polyline);
            this.polyline_edit = polyline;
            this.format_edit.projectId = polyline.info.projectId;
            this.format_edit.projectShowId = polyline.info.projectShowId;
            this.format_edit.lon = polyline.info.lon;
            this.format_edit.lat = polyline.info.lat;
            this.format_edit.attendanceLocation = polyline.info.attendanceLocation;

            // 测试数据
            // this.format_edit.attendanceLocation = `[{lon: ${polyline.info.lon}, lat: ${polyline.info.lat}}, {lon: ${polyline.info.lon + 0.03}, lat: ${polyline.info.lat + 0.02}}]`;
            if (this.format_edit.attendanceLocation) {
                try {
                    let pointList = eval(this.format_edit.attendanceLocation);
                    pointList.forEach((val) => {
                        let marker = new BMap.Marker(new BMap.Point(val.lon, val.lat));
                        marker.enableDragging();
                        //创建右键菜单
                        let markerMenu = new BMap.ContextMenu();
                        markerMenu.addItem(new BMap.MenuItem('移除', (e, r, mark) => {
                            this.map.removeOverlay(mark);
                            this.markerList.splice(this.markerList.indexOf(mark), 1)
                            // console.dir(this.markerList);
                        }));
                        marker.addContextMenu(markerMenu);

                        this.map.addOverlay(marker);
                        this.markerList.push(marker);
                    })
                } catch (e) {
                    console.log('打卡点转化为json解析出错')
                }
            }

            // this.marker_edit = new BMap.Marker(new BMap.Point(this.format_edit.lon, this.format_edit.lat));
            // this.map.addOverlay(this.marker_edit);
            // this.marker_edit.enableDragging();


            polyline.enableEditing();
        },

        // 看视频
        watchVideo(e, r, polyline) {
            this.modal_video = true;
            this.video_projectName = polyline.info.projectName;
            this.initPlugin();
        },

        // 编辑保存
        onClick_save() {
            this.format_edit.projectPosition = JSON.stringify(this.polyline_edit.getPath());
            //this.format_edit.lon = this.marker_edit.getPosition().lng;
            //this.format_edit.lat = this.marker_edit.getPosition().lat;

            if (this.markerList) {
                let json = [];
                this.markerList.forEach((marker) => {
                    json.push({
                        lon: marker.getPosition().lng,
                        lat: marker.getPosition().lat
                    })
                });
                this.format_edit.attendanceLocation = JSON.stringify(json);
                console.dir(this.format_edit.attendanceLocation);
            }

            this.$http({
                method: 'post',
                url: '/projectShow/update',
                data: JSON.stringify(this.format_edit)
            }).then(res => {
                if (res.code === 'SUCCESS') {
                    this.map.removeOverlay(this.polyline_edit);
                    this.cancel_status();
                    this.$Message.success('保存成功!');
                }
            })
        }
    }
}
