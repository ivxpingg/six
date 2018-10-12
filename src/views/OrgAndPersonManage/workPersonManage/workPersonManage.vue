<template>
    <Card class="workPersonManage-container">
        <vIvxFilterBox dashed>
            <Upload :action="uploadParams.actionUrl"
                    :showUploadList="uploadParams.showUploadList"
                    :multiple="uploadParams.multiple"
                    :accept="uploadParams.accept"
                    :maxSize="uploadParams.maxSize"
                    :before-upload="fileBeforeUpload"
                    :on-exceeded-size="exceededSize"
                    :on-error="fileUploadError"
                    :on-success="fileUploadSuccess">
                <Button type="primary" icon="ios-cloud-upload-outline">导入人员</Button>
            </Upload>
            <Button type="primary"
                    icon="md-add"
                    @click="modal_addUser_open">添加人员</Button>
        </vIvxFilterBox>
        <vIvxFilterBox dashed>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.condition.name"
                           style="width: 220px;"
                           placeholder="姓名"/>
                </FormItem>
            </Form>
        </vIvxFilterBox>

        <vIvxFilterBox>
            <Form inline>
                <FormItem label="筛选条件:" :label-width="65">
                    <RadioGroup v-model="searchParams.condition.unitType" type="button">
                        <Radio label="">全部</Radio>
                        <Radio v-for="(item, idx) in dict_unitType"
                               :label="item.value" :key="'unitType_' + idx">{{item.label}}</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </vIvxFilterBox>

        <div class="ivx-table-box">
            <Table border
                   height="540"
                   :loading="tableLoading"
                   :columns="tableColumns"
                   :data="tableData"></Table>
            <Page prev-text="上一页"
                  next-text="下一页"
                  show-total
                  :current="searchParams.current"
                  :page-size="searchParams.size"
                  :total="searchParams.total"
                  :on-change="onPageChange"></Page>
        </div>

        <Modal v-model="modal_userDetail"
               className="modal-userDetail"
               title="从业人员详情"
               :width="1200"
               footer-hide>
            <vPersonDetail :userId="userId"></vPersonDetail>
        </Modal>

        <Modal v-model="modal_addUser"
               title="添加从业人员"
               :width="1000"
               footer-hide>
            <vAddUser @addUnitCallback="modal_addUser_callback"></vAddUser>
        </Modal>
    </Card>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import Config from '../../../config';
    import vPersonDetail from './personDetail/personDetail';
    import vAddUser from './addPerson/addPerson';
    export default {
        // 从业人员管理
        name: 'workPersonManage',
        components: {vIvxFilterBox, vPersonDetail, vAddUser},
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    condition: {
                        name: '',      // 模糊查询参数
                        unitType: ''
                    }
                },
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '姓名', width: 120, align: 'center', key: 'name' },
                    { title: 'UID', width: 80, align: 'center', key: 'uId' },
                    { title: '性别', width: 70, align: 'center', key: 'sexStr' },
                    { title: '年龄', width: 70, align: 'center', key: 'age' },
                    { title: '民族', width: 100, align: 'center', key: 'nationStr' },
                    { title: '职称级别', width: 120, align: 'center', key: 'titleLevel' },
                    { title: '技术职称', width: 120, align: 'center', key: 'titleName' },
                    { title: '资格证书', width: 120, align: 'center', key: 'certificate' },
                    { title: '资格证书编号', width: 120, align: 'center', key: 'certificateNo' },
                    { title: '学历', width: 120, align: 'center', key: 'education' },
                    { title: '毕业院校', width: 120, align: 'center', key: 'graduateSchool' },
                    { title: '毕业时间', width: 120, align: 'center', key: 'graduateDate' },
                    { title: '联系电话', width: 120, align: 'center', key: 'phone' },
                    { title: '身份证号码', width: 160, align: 'center', key: 'IdNumber' },
                    { title: '单位', width: 160, align: 'center', key: 'unitName' },
                    { title: '单位类型', width: 160, align: 'center', key: 'unitTypeLabel' },
                    { title: '职务', width: 160, align: 'center', key: 'job' },

                    // { title: '备案', width: 180, align: 'center', key: 'unitName' },
                    {
                        title: '操作',
                        width: 120,
                        align: 'center',
                        fixed: 'right',
                        render: (h, params) => {
                            let list = [
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small',
                                        icon: 'ios-eye-outline'
                                    },
                                    on: {
                                        click: () => {
                                            this.userId = params.row.userId;
                                            this.modal_userDetail = true;
                                        }
                                    }
                                }, '查看')
                            ];

                            return h('div',{
                                class: 'ivx-table-cell-handle'
                            },list);
                        }
                    }
                ],
                tableData: [],
                tableLoading: true,
                uploadParams: {
                    actionUrl: Config[Config.env].origin + Config[Config.env].ajaxUrl + '',
                    showUploadList: false,  // 显示已上传列表
                    multiple: false,        // 是否支持多选
                    data: {},               // 上传附带参数
                    //name: '',               // 上传的文件字段名, 默认file
                    accept: '.xlsx',             // 接收上传的文件类型
                    maxSize: 4096,                // 文件大小限制，单位 kb
                },

                // 数据字典
                dict_unitType: [],

                // 从业人员详情弹出框
                modal_userDetail: false,
                userId: '',

                // 添加从业人员
                modal_addUser: false
            };
        },
        watch: {
            searchParams: {
                deep: true,
                handler() {
                    this.getData();
                }
            }
        },
        mounted() {
            this.getData();
            this.getDict();
        },
        methods: {
            fileBeforeUpload() {
                this.$Loading.start();
            },
            exceededSize(file, fileList) {
                this.$Notice.warning({
                    title: '超过文件大小限制',
                    desc: `文件   ${file.name} 太大, 不能超过 ${this.maxSize / 1024}M.`
                });
            },
            fileUploadError(error, file, fileList) {
                this.$Loading.error();
                this.$Notice.error({
                    title: '超过文件大小限制',
                    desc: `${error.message}`
                });
            },
            fileUploadSuccess(response, file, fileList) {
                this.$Loading.finish();
            },

            // 获取单位类别的数据字典
            getDict() {
                this.$http({
                    method: 'get',
                    url: '/dict/getListByType',
                    params: {
                        type: 'unitType'
                    }
                }).then(res => {
                    if(res.code) {
                        this.dict_unitType = res.data;
                    }
                })
            },

            /**
             * 分页控件-切换页面
             * @param current
             */
            onPageChange(current) {
                this.searchParams.current = current;
            },

            modal_addUser_open() {
                this.modal_addUser = true;
            },
            modal_addUser_callback() {
                this.modal_addUser = false;
                this.getData();
            },

            // 获取表格数据
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/user/list',
                    data: JSON.stringify(this.searchParams)
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records;
                        this.searchParams.total = res.data.total;
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .workPersonManage-container {
    }
</style>

<style lang="scss">
    .modal-userDetail {
        .ivu-modal-body {
            padding: 0;
        }
    }
</style>