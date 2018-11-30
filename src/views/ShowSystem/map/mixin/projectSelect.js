export default {
    data() {
        return {
            modal_projectSelect: false,
            projectList_select: [],
            setTime: null,
            projectValue_select: ''
        }
    },
    methods: {
        // 获取未添加地图信息的项目
        getProjectList_select() {
            this.$http({
                method: 'get',
                url: '/projectShow/chooseProjectList'
            }).then(res => {
                if (res.code = 'SUCCESS') {
                    this.projectList_select = res.data || [];
                    this.projectValue_select = '';
                }
            })
        },

        onClick_add_modal() {
            this.modal_projectSelect = true;
        },

        // 选择项目 设置当前选择要添加的项目信息
        onChange_selectProject(value) {
            for (let i = 0; i < this.projectList_select.length; i++) {
                if (this.projectList_select[i].projectId === value) {
                    Object.assign(this.currentProject, this.projectList_select[i]);
                }
            }
            this.formData_add.projectId = value;
        },

        // 确定选择的项目
        onOk_add_modal() {
            this.status = 'add';
            this.removePolygonOverlay();
            if (this.drawingManager) {
                this.drawingManager.open();
                this.drawingManager.setDrawingMode(BMAP_DRAWING_POLYLINE);
            }
            else {
                this.initDrawingManager();
                this.setTime = setInterval(()=> {
                    if (this.drawingManager) {
                        clearInterval(this.setTime);
                        this.onOk_add_modal();
                    }
                }, 100);
            }

        }
    }
}