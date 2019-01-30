<template>
    <Card class="projectFileManage-container">
        <vIvxFilterBox>
            <!--<Button type="primary"-->
                    <!--icon="ios-list">移交处理清单</Button>-->
            <!--<Button type="primary"-->
                    <!--icon="ios-options">案件清单处理</Button>-->
            <!--<Button type="primary"-->
                    <!--icon="md-document"-->
                    <!--@click="modalLogView('archive')">查看日志</Button>-->

            <Form inline style="float: right;">
                <FormItem label="检索:" :label-width="45">
                    <Select :value="searchParams_list.projectId" placement="bottom-end" @on-change="onChange_select">
                        <Option v-for="item in projectList"
                                :key="item.projectId" :value="item.projectId" :label="item.projectName"></Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <DatePicker
                            ref="dataPicker"
                            clearable
                            format="yyyy-MM-dd"
                            type="daterange"
                            placement="bottom-end"
                            placeholder="请选择时间"
                            @on-change="onChange_search_daterange"
                            style="width: 180px"></DatePicker>
                </FormItem>
                <FormItem v-show="showFileName">
                    <Input v-model="searchParams_list.fileName" placeholder="文件名" />
                </FormItem>
                <FormItem>
                   <Button type="primary" icon="md-close" size="small" @click="clearSearching">清空</Button>
                </FormItem>
            </Form>
        </vIvxFilterBox>
        <vIvxFilterBox v-show="!searching">
            <Form inline>
                <FormItem label="筛选条件:" :label-width="65">
                    <Input v-model="searchParams.projectName" placeholder="项目名称" />
                </FormItem>
            </Form>
        </vIvxFilterBox>

        <div class="ivx-table-box" v-show="searching">
            <Table border
                   :height="540"
                   :loading="tableLoading"
                   :columns="tableColumns"
                   :data="tableData"></Table>
        </div>

        <ul class="project-list" v-show="!searching">
            <li v-for="(item, idx) in projectList" :key="idx">
                <vIvxFolder :title="item.projectName"
                            :size="folderSize"
                            :data="item"
                            :rows="3" @on-select="onSelectFolder"></vIvxFolder>
            </li>
        </ul>

        <vModalProjectFiles ref="modal_projectFiles" :projectId="currentRow.projectId"></vModalProjectFiles>

        <!--查看日志-->
        <vModalLogView ref="modalLogView" :logType="six_logType" ></vModalLogView>

        <vViewFile ref="viewFile" :title="currnetRow_table.fileName" :src="currnetRow_table.url" :format="currnetRow_table.fileFormat"></vViewFile>
    </Card>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vIvxFolder from '../../../components/folder/folder';
    import vModalProjectFiles from './modalProjectFiles/modalProjectFiles';
    import logViewMixin from '../../Common/logView/mixin';
    import Config from '../../../config';
    import vViewFile from '../../../components/viewFile/viewFile';
    export default {
        name: 'projectFileManage',   // 工程档案管理
        mixins: [logViewMixin],
        components: {vIvxFilterBox, vIvxFolder, vModalProjectFiles, vViewFile},
        computed: {
            searching() {

                return !!this.searchParams_list.projectId
                    || this.searchParams_list.beginTime !== ''
                    || this.searchParams_list.endTime !== ''
                    || this.searchParams_list.fileName.trim() !== '';
            },
            showFileName() {
                if (this.$store.state.user.userType === 'supervisor') {
                    return true;
                }
                else {
                    return !!this.searchParams_list.projectId
                }

            }
        },
        data() {
            return {
                searchParams_list: {
                    projectId: undefined,
                    beginTime: '',
                    endTime: '',
                    fileName: ''
                },
                tableLoading: false,
                currnetRow_table: {
                    url: '',
                    fileName: '',
                    fileFormat: ''
                },
                tableColumns: [
                    { title: '序号', width: 60, type: 'index', },
                    { title: '项目名称', minWidth: 160, align: 'center', key: 'projectName' },
                    { title: '标段', width: 90, align: 'center', key: 'part',
                        render: (h, params) => {
                            return h('span', params.row.part || '');
                        }
                    },
                    { title: '文件名', minWidth: 160, align: 'center', key: 'fileName' },
                    { title: '文件格式', width: 100, align: 'center', key: 'fileFormat' },
                    { title: '时间', width: 120, align: 'center',
                        render: (h, params) => {
                            return h('span', this.$moment(params.row.insTime).format('YYYY-MM-DD'));
                        }
                    },
                    { title: '操作', width: 140, align: 'center',
                        render: (h, params) => {
                            let list = [];

                            let fileFormats = ['jpg', 'png', 'gif', 'jpeg', 'bmp', 'pdf'];

                            if (fileFormats.indexOf(params.row.fileFormat.toLowerCase()) > -1) {
                                list.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            Object.assign(this.currnetRow_table, params.row);
                                            this.$refs.viewFile.refresh();
                                        }
                                    }
                                }, '查看'));
                            }

                            list.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    to: Config[Config.env].filePath + params.row.url,
                                    target: '_blank',
                                    size: 'small'
                                },
                                attrs: {
                                    download: params.row.fileName + '.' + params.row.fileFormat
                                }
                            }, '下载'));

                            return h('div', {
                                class: 'ivx-table-cell-handle'
                            }, list);
                        }
                    },

                ],
                tableData: [],

                searchParams: {
                    projectName: ''
                },
                folderSize: 90,
                projectList: [
                    // {
                    //     projectId: '001',
                    //     projectName: '六安市眉山大桥建设项目1'
                    // }
                ],

                currentRow: {
                    projectId: ''
                }
            };
        },
        watch: {
            searchParams: {
                deep: true,
                handler() {
                    this.getData();
                }
            },

            'searchParams_list': {
                deep: true,
                handler(val) {
                    this.getData_list();
                }
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            onChange_select(value) {
                this.searchParams_list.projectId = value;
            },
            onChange_search_daterange(value) {
                this.searchParams_list.beginTime = value[0];
                this.searchParams_list.endTime = value[1];
            },
            clearSearching() {
                this.$refs.dataPicker.handleClear();
                this.searchParams_list.projectId = undefined;
                this.searchParams_list.beginTime = '';
                this.searchParams_list.endTime = '';
                this.searchParams_list.fileName = '';
            },

            // 获取字符长度，中文长度为2
            getStringLength(str) {
                return str.replace(/[\u0391-\uFFE5]/g,"aa").length; //先把中文替换成两个字节的英文，在计算长度
            },
            // 选择的文件夹
            onSelectFolder(item) {
                this.currentRow.projectId = item.projectId;
                this.$refs.modal_projectFiles.modalValue = true;
            },

            getData() {
                this.$http({
                    method: 'post',
                    url: '/archive/archiveList',
                    data: JSON.stringify(this.searchParams)
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.projectList = res.data || [];
                    }
                })
            },

            getData_list() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/archive/archiveRecordList',
                    data: JSON.stringify(this.searchParams_list)
                }).then(res => {
                    this.tableLoading = false;
                    if(res.code === 'SUCCESS') {
                        this.tableData = res.data || [];
                    }
                }).catch(e => {
                    this.tableLoading = false;
                })
            }

        }
    }
</script>

<style lang="scss" scoped>
    .projectFileManage-container {
        .project-list {
            padding-bottom: 100px;
            overflow: hidden;
            li {
                float: left;
                margin: 15px;
            }
        }
    }
</style>