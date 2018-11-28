<template>
    <div class="addMajorProject_check-container">
        <Modal v-model="modalValue"
               :width="800"
               title="重点项目考勤">
            <Form ref="form"
                  class="form"
                  inline
                  :model="formData"
                  :rules="rules"
                  :label-width="110">
                <FormItem label="项目名称:" prop="projectId">
                    <Select v-model="formData.projectId" style="width: 510px;">
                        <Option v-for="item in projectList"
                                :key="item.projectId"
                                :value="item.projectId"
                                :label="`${item.projectName}`"></Option>
                    </Select>
                </FormItem>

                <FormItem label="考勤启动时间:" prop="beginAttendanceTime">
                    <DatePicker v-model="formData.beginAttendanceTime"
                                type="date"
                                @on-change="onChange_beginAttendanceTime"
                                placeholder="请选择时间"></DatePicker>
                </FormItem>

                <template  v-for="item_1 in formData.projectAttendances_my">
                    <!--单位-->
                    <FormItem :label="`${item_1.unitTypeLabel}:`">
                        <Input v-model="item_1.unitName"
                               style="width: 310px;"
                               readonly />
                        (请选择以下重点人员作为考勤对象)
                    </FormItem>

                    <!--职务-->
                    <FormItem v-for="(item_2, idx) in item_1.dutyList"
                              :label="`${item_2.projectDutyLabel}：`">
                        <!--用户选择-->
                        <Select v-model="item_2.projectUserId" style="width: 200px;">
                            <Option v-for="(item_user, uidx) in item_1.userList"
                                    :key="item_1.unitId + item_user.userId + uidx"
                                    :value="item_user.projectUserId"
                                    :label="item_user.name"></Option>
                        </Select>
                    </FormItem>

                </template>

            </Form>

            <div slot="footer">
                <Button type="primary" size="large" @click="beforeSave">保存</Button>
            </div>

        </Modal>
    </div>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    export default {
        name: 'addMajorProject_check',  // 添加重点项目考勤
        mixins: [modalMixin],
        data() {
            return {
                projectList: [],
                projectUnitList: [],
                formData: {
                    projectId: '',
                    beginAttendanceTime: '',
                    projectAttendances: [],   // 提交的数据结构
                    projectAttendances_my: [] // 自己的数据结构
                },
                rules: {
                    projectId: [{ required: true, message: '项目不能为空！', trigger: 'blur' }],
                    beginAttendanceTime: [{ required: true, message: '考勤启动时间不能为空！', trigger: 'blur' }]
                },
                // 字典
                dict_projectDuty: []  // 项目职务（项目重点考勤）
            };
        },
        watch: {
            'formData.projectId'(val) {
                if(val) {
                    this.getProjectUnitList(val);
                }
            }
        },
        mounted() {
            this.getProjectList();
            this.getDict(['projectDuty']);
        },
        methods: {
            onChange_beginAttendanceTime(value) {
                this.formData.beginAttendanceTime = value;
            },

            getDict(list) {
                this.$http({
                    method: 'get',
                    url: '/dict/getListByTypes',
                    params: {
                        types: list.join(',')
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        list.forEach(val => {
                            this[`dict_${val}`] = res.data[val];
                        });

                    }
                })
            },
            // 获取考勤项目列表
            getProjectList() {

                this.$http({
                    method: 'get',
                    url: '/projectAudit/chooseProjectListForHandover',
                    // url: '/supervisionCheck/monitorProjectList'
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.projectList = res.data || [];
                        if (this.projectList.length > 0) {
                            this.formData.projectId = res.data[0].projectId;
                        }
                    }
                })
            },

            // 获取参建单位列表
            getProjectUnitList(projectId) {
                this.$http({
                    method: 'get',
                    url: '/project/projectUnitList',
                    params: {
                        projectId: projectId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.projectUnitList = res.data || [];
                        this.setFormItem(this.projectUnitList);
                    }
                })
            },
            // 动态设置表单单位与考勤人员对象
            //@params projectUnitList 参建单位列表
            setFormItem(projectUnitList) {
                this.formData.projectAttendances = [];
                this.formData.projectAttendances_my = [];
                projectUnitList.forEach(val => {
                    this.getProjectUser_unit(val.projectUnitId).then(userList => {
                        let list = {
                            unitTypeLabel: val.unitTypeLabel,
                            unitName: val.unitName,
                            unitId: val.unitId,
                            userList: userList,
                            dutyList: []
                        };

                        list.dutyList = this.getProjectDuty_unitType(val.unitType);
                        this.formData.projectAttendances_my.push(list);
                    });
                });
            },
            // 根据不同单位类型获取不同的项目职务
            getProjectDuty_unitType(unitType) {
                let obj;

                switch (unitType) {
                    // 监督单位
                    case 'supervisory_unit':
                        obj = [
                            { projectUserId: '', userId: '', projectDuty: 'safety_manager', projectDutyLabel: '安全负责人' },
                            { projectUserId: '', userId: '', projectDuty: 'test_room_director', projectDutyLabel: '中心实验室主任' },
                            { projectUserId: '', userId: '', projectDuty: 'project_manager', projectDutyLabel: '项目经理' },
                            { projectUserId: '', userId: '', projectDuty: 'construction_director', projectDutyLabel: '工地实验室主任' },
                            { projectUserId: '', userId: '', projectDuty: 'manager', projectDutyLabel: '总监' },
                            { projectUserId: '', userId: '', projectDuty: 'headman', projectDutyLabel: '总监组长' },
                            { projectUserId: '', userId: '', projectDuty: 'safety_supervision', projectDutyLabel: '安全专业监理' }];
                        break;
                    // 建设单位
                    case 'construction_unit':
                        obj = [
                            { projectUserId: '', userId: '', projectDuty: 'safety_manager', projectDutyLabel: '安全负责人' },
                            { projectUserId: '', userId: '', projectDuty: 'test_room_director', projectDutyLabel: '中心实验室主任' },
                            { projectUserId: '', userId: '', projectDuty: 'project_manager', projectDutyLabel: '项目经理' },
                            { projectUserId: '', userId: '', projectDuty: 'construction_director', projectDutyLabel: '工地实验室主任' },
                            { projectUserId: '', userId: '', projectDuty: 'manager', projectDutyLabel: '总监' },
                            { projectUserId: '', userId: '', projectDuty: 'headman', projectDutyLabel: '总监组长' },
                            { projectUserId: '', userId: '', projectDuty: 'safety_supervision', projectDutyLabel: '安全专业监理' }];
                        break;
                    // 监理单位
                    case 'supervisor_unit':
                        obj = [
                            { projectUserId: '', userId: '', projectDuty: 'safety_manager', projectDutyLabel: '安全负责人' },
                            { projectUserId: '', userId: '', projectDuty: 'test_room_director', projectDutyLabel: '中心实验室主任' },
                            { projectUserId: '', userId: '', projectDuty: 'project_manager', projectDutyLabel: '项目经理' },
                            { projectUserId: '', userId: '', projectDuty: 'construction_director', projectDutyLabel: '工地实验室主任' },
                            { projectUserId: '', userId: '', projectDuty: 'manager', projectDutyLabel: '总监' },
                            { projectUserId: '', userId: '', projectDuty: 'headman', projectDutyLabel: '总监组长' },
                            { projectUserId: '', userId: '', projectDuty: 'safety_supervision', projectDutyLabel: '安全专业监理' }];
                        break;
                    // 设计单位
                    case 'design_unit':
                        obj = [
                            { projectUserId: '', userId: '', projectDuty: 'safety_manager', projectDutyLabel: '安全负责人' },
                            { projectUserId: '', userId: '', projectDuty: 'test_room_director', projectDutyLabel: '中心实验室主任' },
                            { projectUserId: '', userId: '', projectDuty: 'project_manager', projectDutyLabel: '项目经理' },
                            { projectUserId: '', userId: '', projectDuty: 'construction_director', projectDutyLabel: '工地实验室主任' },
                            { projectUserId: '', userId: '', projectDuty: 'manager', projectDutyLabel: '总监' },
                            { projectUserId: '', userId: '', projectDuty: 'headman', projectDutyLabel: '总监组长' },
                            { projectUserId: '', userId: '', projectDuty: 'safety_supervision', projectDutyLabel: '安全专业监理' }];
                        break;
                    // 施工单位
                    case 'work_unit':
                        obj = [
                            { projectUserId: '', userId: '', projectDuty: 'safety_manager', projectDutyLabel: '安全负责人' },
                            { projectUserId: '', userId: '', projectDuty: 'test_room_director', projectDutyLabel: '中心实验室主任' },
                            { projectUserId: '', userId: '', projectDuty: 'project_manager', projectDutyLabel: '项目经理' },
                            { projectUserId: '', userId: '', projectDuty: 'construction_director', projectDutyLabel: '工地实验室主任' },
                            { projectUserId: '', userId: '', projectDuty: 'manager', projectDutyLabel: '总监' },
                            { projectUserId: '', userId: '', projectDuty: 'headman', projectDutyLabel: '总监组长' },
                            { projectUserId: '', userId: '', projectDuty: 'safety_supervision', projectDutyLabel: '安全专业监理' }];
                        break;
                    // 试验检测单位
                    case 'test_unit':
                        obj = [
                            { projectUserId: '', userId: '', projectDuty: 'safety_manager', projectDutyLabel: '安全负责人' },
                            { projectUserId: '', userId: '', projectDuty: 'test_room_director', projectDutyLabel: '中心实验室主任' },
                            { projectUserId: '', userId: '', projectDuty: 'project_manager', projectDutyLabel: '项目经理' },
                            { projectUserId: '', userId: '', projectDuty: 'construction_director', projectDutyLabel: '工地实验室主任' },
                            { projectUserId: '', userId: '', projectDuty: 'manager', projectDutyLabel: '总监' },
                            { projectUserId: '', userId: '', projectDuty: 'headman', projectDutyLabel: '总监组长' },
                            { projectUserId: '', userId: '', projectDuty: 'safety_supervision', projectDutyLabel: '安全专业监理' }];
                        break;
                    // 其他单位
                    case 'other_units':
                        obj = [
                            { projectUserId: '', userId: '', projectDuty: 'safety_manager', projectDutyLabel: '安全负责人' },
                            { projectUserId: '', userId: '', projectDuty: 'test_room_director', projectDutyLabel: '中心实验室主任' },
                            { projectUserId: '', userId: '', projectDuty: 'project_manager', projectDutyLabel: '项目经理' },
                            { projectUserId: '', userId: '', projectDuty: 'construction_director', projectDutyLabel: '工地实验室主任' },
                            { projectUserId: '', userId: '', projectDuty: 'manager', projectDutyLabel: '总监' },
                            { projectUserId: '', userId: '', projectDuty: 'headman', projectDutyLabel: '总监组长' },
                            { projectUserId: '', userId: '', projectDuty: 'safety_supervision', projectDutyLabel: '安全专业监理' }];
                        break;
                    // 行政执法单位
                    case 'law_enforcement_unit':
                        obj = [
                            { projectUserId: '', userId: '', projectDuty: 'safety_manager', projectDutyLabel: '安全负责人' },
                            { projectUserId: '', userId: '', projectDuty: 'test_room_director', projectDutyLabel: '中心实验室主任' },
                            { projectUserId: '', userId: '', projectDuty: 'project_manager', projectDutyLabel: '项目经理' },
                            { projectUserId: '', userId: '', projectDuty: 'construction_director', projectDutyLabel: '工地实验室主任' },
                            { projectUserId: '', userId: '', projectDuty: 'manager', projectDutyLabel: '总监' },
                            { projectUserId: '', userId: '', projectDuty: 'headman', projectDutyLabel: '总监组长' },
                            { projectUserId: '', userId: '', projectDuty: 'safety_supervision', projectDutyLabel: '安全专业监理' }];
                        break;
                }

                return obj;
            },

            // 获取参建单位用户列表
            getProjectUser_unit(projectUnitId) {
                return new Promise((resolve, reject) => {
                    this.$http({
                        method: 'get',
                        url: '/project/viewProjectUser',
                        params: {
                            projectUnitId: projectUnitId
                        }
                    }).then((res) => {
                        if (res.code === 'SUCCESS') {
                            resolve(res.data || []);
                        }
                    }).catch(() =>{
                        reject([]);
                    })
                })
            },

            // 保存
            save() {
                this.$http({
                    method: 'post',
                    url: '/projectAttendance/add?projectId=' + this.formData.projectId + '&beginAttendanceTime=' + this.formData.beginAttendanceTime,
                    data: JSON.stringify(this.formData.projectAttendances)
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.$Message.success('添加成功！');
                        this.modalValue = false;
                        this.$emit('modal-callback');
                    }
                })

            },
            beforeSave() {
                this.$refs.form.validate(valide => {
                    if (valide) {
                        this.formData.projectAttendances = [];
                        this.formData.projectAttendances_my.forEach((val, idx) => {

                            val.dutyList.forEach(val_duty => {
                                if (val_duty.projectUserId) {
                                    for (let i = 0; i < val.userList.length; i++) {
                                        if (val.userList[i].projectUserId === val_duty.projectUserId) {
                                            val_duty.userId = val.userList[i].userId;
                                            break;
                                        }
                                    }
                                }

                                this.formData.projectAttendances.push(val_duty);
                            })

                        });

                       this.save();
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .addMajorProject_check-container {
    }
</style>