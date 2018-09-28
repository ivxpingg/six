<template>
    <Card class="workUnitManage-container">
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
                <Button type="primary" icon="ios-cloud-upload-outline">导入单位</Button>
            </Upload>
            <Button type="primary"
                    icon="md-add"
                    @click="modal_addUnit_open">添加单位</Button>
        </vIvxFilterBox>

        <vIvxFilterBox dashed>
            <Form inline>
                <FormItem label="搜索条件:" :label-width="65">
                    <Input v-model="searchParams.searchKey"
                           style="width: 220px;"
                           placeholder="单位名称、机构代码、负责人、电话号码"/>
                </FormItem>
            </Form>
        </vIvxFilterBox>

        <vIvxFilterBox>
            <Form inline>
                <FormItem label="筛选条件:" :label-width="65">
                    <RadioGroup v-model="searchParams.unitType" type="button">
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

        <Modal v-model="modal_unitDetail"
               className="modal-unitDetail"
               title="从业单位详情"
               :width="1200"
               footer-hide>
            <vUnitDetail :unitId="unitId"></vUnitDetail>
        </Modal>

        <Modal v-model="modal_addUnit"
               title="添加从业单位"
               :width="1000"
               footer-hide>
            <vAddUnit @addUnitCallback="modal_addUnit_callback"></vAddUnit>
        </Modal>
    </Card>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import Config from '../../../config';
    import vUnitDetail from './unitDetail/unitDetail';
    import vAddUnit from './addUnit/addUnit';
    export default {
        // 从业单位管理
        name: 'workUnitManage',
        components: {vIvxFilterBox, vUnitDetail, vAddUnit},
        data() {
            return {
                searchParams: {
                    current: 1,      // 当前第几页
                    size: 10,      // 每页几行
                    total: 0,     // 总行数
                    beginDate: '',     // 开始时间
                    endDate: '',       // 结束时间
                    searchKey: '',      // 模糊查询参数
                    unitType: ''
                },
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '单位名称', width: 180, align: 'center', key: 'unitName' },
                    { title: '机构代码', width: 180, align: 'center', key: 'orgCode' },
                    { title: '资质类别', width: 180, align: 'center', key: 'qualificationTypeLabel' },
                    { title: '资质许可等级', width: 180, align: 'center', key: 'qualification' },
                    { title: '单位类型', width: 180, align: 'center', key: 'unitTypeLabel' },
                    { title: '负责人', width: 180, align: 'center', key: 'leader' },
                    { title: '联系方式', width: 180, align: 'center', key: 'telephone' },
                    { title: '电子邮件', width: 180, align: 'center', key: 'email' },
                    { title: '公司地址', width: 180, align: 'center', key: 'companyAddress' },
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
                                            this.unitId = params.row.unitId;
                                            this.modal_unitDetail = true;
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

                // 单位详情弹出框
                modal_unitDetail: false,
                unitId: '',

                // 添加单位弹出框
                modal_addUnit: false
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
                    url: '/getDictList',
                    params: {
                        type: 'D001'
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
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

            modal_addUnit_open() {
                this.modal_addUnit = true;
            },
            modal_addUnit_callback() {
                this.modal_addUnit = false;
                this.getData();
            },

            // 获取表格数据
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'get',
                    url: '/getUnitList',
                    params: this.searchParams
                }).then((res) => {
                    this.tableLoading = false;
                    if (res.code === 'SUCCESS') {
                        this.tableData = res.data.records;
                        this.searchParams.total = res.data.total;
                    }
                }).catch(() => {
                    this.tableLoading = false;
                })
            },

            unitDetail(row) {

            }
        }
    }
</script>

<style lang="scss" scoped>
    .workUnitManage-container {

    }
</style>
<style lang="scss">
    .modal-unitDetail {
        .ivu-modal-body {
            padding: 0;
        }
    }
</style>