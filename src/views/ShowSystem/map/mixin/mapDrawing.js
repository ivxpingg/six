// 百度地图鼠标绘制 线路和打卡点
export default {
    data() {
        return {

            // 保存绘制的线路位置信息
            polyline: null,
            // 打卡点
            marker: null,

            // 绘制线路样式
            styleOptions: {
                strokeColor:"yellow",    //边线颜色。
                fillColor:"yellow",      //填充颜色。当参数为空时，圆形将没有填充效果。
                strokeWeight: 5,       //边线的宽度，以像素为单位。
                strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
                fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
                strokeStyle: 'solid' //边线的样式，solid或dashed。
            },
            // 鼠标绘制工具对象
            drawingManager: null,

            formData_add: {
                projectId: '',
                projectPosition: '',
                lat: null,
                lon: null,
                attendanceLocation: ""
            }
        }
    },
    methods: {
        // 绘制线路
        initDrawingManager() {
            this.drawingManager = new BMapLib.DrawingManager(this.map, {
                isOpen: false, //是否开启绘制模式
                enableDrawingTool: false, //是否显示工具栏
                drawingToolOptions: {
                    anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                    offset: new BMap.Size(5, 5), //偏离值
                },
                polylineOptions: this.styleOptions, //线的样式
            });

            this.drawingManager.addEventListener('overlaycomplete', this.overlaycomplete);
        },
        overlaycomplete(drawing) {
            switch(drawing.drawingMode) {
                case 'polyline':
                    if (drawing.overlay.getPath().length === 1) {
                        this.cancel_status();
                        return;
                    }

                    if (this.polyline) {
                        this.map.removeOverlay(this.polyline);
                    }
                    this.polyline = drawing.overlay;
                    this.polyline.enableEditing();
                    this.drawingManager.close();
                    break;
                case 'marker':
                    let marker = drawing.overlay;
                    marker.enableDragging();
                    //创建右键菜单
                    let markerMenu = new BMap.ContextMenu();
                    markerMenu.addItem(new BMap.MenuItem('移除', (e, r, mark) => {
                        this.map.removeOverlay(mark);
                        this.markerList.splice(this.markerList.indexOf(mark), 1)
                        // console.dir(this.markerList);
                    }));
                    marker.addContextMenu(markerMenu);
                    this.markerList.push(marker);
                    this.drawingManager.close();
                    //
                    // if (this.status === 'edit') {
                    //     if (this.marker_edit) {
                    //         this.map.removeOverlay(this.marker_edit);
                    //     }
                    //     this.marker_edit = drawing.overlay;
                    //     this.format_edit.lat = this.marker_edit.getPosition().lat;
                    //     this.format_edit.lon = this.marker_edit.getPosition().lng;
                    //     this.marker_edit.enableDragging();
                    //     this.drawingManager.close();
                    //
                    // }
                    // else {
                    //     if (this.marker) {
                    //         this.map.removeOverlay(this.marker);
                    //     }
                    //     this.marker = drawing.overlay;
                    //     this.marker.enableDragging();
                    //     this.drawingManager.close();
                    // }
                    break;
            }
        },

        // 提交绘制线路 和打卡点
        onClick_complete_draw() {

            if (this.polyline) {
                this.formData_add.projectPosition = JSON.stringify(this.polyline.getPath());
            }

            if (this.marker) {
                this.formData_add.lat = this.marker.getPosition().lat;
                this.formData_add.lon = this.marker.getPosition().lng;
            }

            if (this.markerList) {
                let json = [];
                this.markerList.forEach((marker) => {
                    json.push({
                        lon: marker.getPosition().lng,
                        lat: marker.getPosition().lat
                    })
                });
                this.formData_add.attendanceLocation = JSON.stringify(json);
                console.dir(this.formData_add.attendanceLocation);
            }

            this.$http({
                method: 'post',
                url: '/projectShow/add',
                data: JSON.stringify(this.formData_add)
            }).then(res => {
                if (res.code === 'SUCCESS') {
                    this.getProjectList_select();
                    this.cancel_status();
                    this.$Message.success('添加成功!');
                }
            })

        },

        // 添加打卡点
        onClick_addMarker_modal() {
            this.drawingManager.open();
            this.drawingManager.setDrawingMode(BMAP_DRAWING_MARKER);
        },
    }
}
