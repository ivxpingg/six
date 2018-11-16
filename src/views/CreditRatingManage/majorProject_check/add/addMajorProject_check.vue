<template>
    <div class="addMajorProject_check-container">
        <Modal v-model="modalValue" title="重点项目考勤">
            <Form ref="form"
                  class="form"
                  inline
                  :model="formData"
                  :rules="rules"
                  :label-width="80">
                <FormItem label="项目名称:" prop="projectId">
                    <Select v-model="formData.projectId" style="width: 510px;">
                        <Option v-for="item in projectList"
                                :key="item.projectId"
                                :value="item.projectId"
                                :label="`${item.projectName} (标段：${item.part})`"></Option>
                    </Select>
                </FormItem>

            </Form>
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
                    projectAttendances: []
                },
                rules: {},
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
            // 获取项目列表
            getProjectList() {
                this.$http({
                    method: 'get',
                    url: '/supervisionCheck/monitorProjectList'
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.projectList = res.data || [];
                        if (this.projectList.length > 0) {
                            this.searchParams.formData.projectId = res.data[0].projectId;
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
                projectUnitList.forEach(val => {
                    let list = {
                        unitTypeLabel: val.unitTypeLabel,
                        unitName: val.unitName,
                        unitId: val.unitId
                    }

                });
            },
            // 根据不同单位类型获取不同的项目职务
            getProjectDuty_unitType(unitType) {
                let obj;

                switch (unitType) {
                    // 监督单位
                    case 'supervisory_unit':

                        break;
                    // 建设单位
                    case 'construction_unit':
                        obj = {
                            projectDuty: 'safety_manager',
                            projectDutyLabel: '安全负责人'
                        };
                        break;
                    // 监理单位
                    case 'supervisor_unit':
                        break;
                    // 设计单位
                    case 'design_unit':
                        break;
                    // 施工单位
                    case 'work_unit':
                        break;
                    // 试验检测单位
                    case 'test_unit':
                        break;
                    // 其他单位
                    case 'other_units':
                        break;
                    // 行政执法单位
                    case 'law_enforcement_unit':
                        break;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .addMajorProject_check-container {
    }
</style>