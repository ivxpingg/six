<template>
    <div class="filesSelect2-container">
        <Modal v-model="modalValue"
               title="选择文件"
               :width="800">
            <vIvxFilterBox>
                <Upload ref="upload"
                        :action="uploadAtion"
                        :showUploadList="uploadParams.showUploadList"
                        :multiple="uploadParams.multiple"
                        :accept="uploadParams.accept"
                        :maxSize="uploadParams.maxSize"
                        :before-upload="fileBeforeUpload"
                        :on-exceeded-size="exceededSize"
                        :on-error="fileUploadError"
                        :on-success="fileUploadSuccess">
                    <Button type="primary" icon="ios-cloud-upload-outline">上传文件</Button>
                </Upload>

                <Form inline>
                    <FormItem>
                        <Select v-model="projectId_select" v-if="projectId === ''" placeholder="请选择项目">
                            <Option v-for="item in projectList"
                                    :key="item.projectId"
                                    :value="item.projectId"
                                    :label="item.projectName"></Option>
                        </Select>
                    </FormItem>
                </Form>
            </vIvxFilterBox>

            <vModalBothSides :height="460">
                <template slot="left">
                    <Menu theme="light"
                          :width="`200px`"
                          :activeName="activeName"
                          @on-select="onSelect">
                        <MenuItem name="1" v-if="cProjectId">
                            <Icon type="md-document" />
                            <Badge :count="menuCount_0" type="success" :offset="offset">监督受理材料</Badge>
                        </MenuItem>
                        <MenuItem name="2" v-if="cProjectId">
                            <Icon type="md-document" />
                            <Badge :count="menuCount_1" type="success" :offset="offset">监督过程材料</Badge>
                        </MenuItem>
                        <MenuItem name="3" v-if="cProjectId">
                            <Icon type="md-document" />
                            <Badge :count="menuCount_2" type="success" :offset="offset">交工验收材料</Badge>
                        </MenuItem>
                        <MenuItem name="4" v-if="cProjectId">
                            <Icon type="md-document" />
                            <Badge :count="menuCount_3" type="success" :offset="offset">竣工鉴定材料</Badge>
                        </MenuItem>
                        <MenuItem name="5">
                            <Icon type="md-document" />
                            <Badge :count="menuCount_4" type="success" :offset="offset">个人材料</Badge>
                        </MenuItem>
                    </Menu>
                </template>
                <template slot="right">
                    <vProjectFiles_0 v-show="activeName === '1' && !openFilesList"
                                     :key="'idx_0'"
                                     :folderList="folderList.projectFiles_0"
                                     @callback="onSelect_folderType"></vProjectFiles_0>
                    <vProjectFiles_0 v-show="activeName === '2' && !openFilesList"
                                     :key="'idx_1'"
                                     :folderList="folderList.projectFiles_1"
                                     @callback="onSelect_folderType"></vProjectFiles_0>
                    <vProjectFiles_0 v-show="activeName === '3' && !openFilesList"
                                     :key="'idx_2'"
                                     :folderList="folderList.projectFiles_2"
                                     @callback="onSelect_folderType"></vProjectFiles_0>
                    <vProjectFiles_0 v-show="activeName === '4' && !openFilesList"
                                     :key="'idx_3'"
                                     :folderList="folderList.projectFiles_3"
                                     @callback="onSelect_folderType"></vProjectFiles_0>
                    <vProjectFiles_0 v-show="activeName === '5' && !openFilesList"
                                     :key="'idx_4'"
                                     :folderList="folderList.projectFiles_4"
                                     @callback="onSelect_folderType"></vProjectFiles_0>

                    <vProjectFilesList v-if="openFilesList"
                                       :folderType="folderType"
                                       :projectId="cProjectId"
                                       @callback="callback_change" ></vProjectFilesList>

                </template>
            </vModalBothSides>
            <div slot="footer">
                <Button type="primary" size="large" @click="save">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import modalMixin from '../../../lib/mixin/modalMixin';
    import uploadMixin from '../../../lib/mixin/uploadMixin';
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox.vue';
    import vModalBothSides from '../../../components/modal-body/modal-both-sides';
    import vProjectFiles_0 from '../../RecordAndCompletedManage/projectFileManage/modalProjectFiles/module/projectFiles_0';
    import vProjectFilesList from '../../RecordAndCompletedManage/projectFileManage/modalProjectFiles/module/projectFilesList';
    export default {
        name: 'filesSelect2',
        mixins: [modalMixin, uploadMixin],
        components: {
            vIvxFilterBox,
            vModalBothSides,
            vProjectFiles_0,
            vProjectFilesList
        },
        props: {
            fileType: {
                type: String,
                default: 'monitor_procedure'
            },
            projectId: {
                type: String,
                default: ''
            }
        },
        computed: {
            cProjectId() {
                return this.projectId || this.projectId_select || false;
            },
            uploadAtion() {
                return this.uploadParams.actionUrl + '/' + this.fileType;  // 个人附件
            },
            menuCount_0() {
                let count = 0;
                this.folderList.projectFiles_0.forEach(v => {
                    count += v.selectedFileList.length;
                });

                return count;
            },
            menuCount_1() {
                let count = 0;
                this.folderList.projectFiles_1.forEach(v => {
                    count += v.selectedFileList.length;
                });

                return count;
            },
            menuCount_2() {
                let count = 0;
                this.folderList.projectFiles_2.forEach(v => {
                    count += v.selectedFileList.length;
                });

                return count;
            },
            menuCount_3() {
                let count = 0;
                this.folderList.projectFiles_3.forEach(v => {
                    count += v.selectedFileList.length;
                });

                return count;
            },
            menuCount_4() {
                let count = 0;
                this.folderList.projectFiles_4.forEach(v => {
                    count += v.selectedFileList.length;
                });

                return count;
            }
        },
        data() {
            return {
                projectList: [],
                projectId_select: '',

                activeName: '1',
                openFilesList: false,
                offset: [-3, -3],

                folderType: {
                    parentId: '',
                    index: 0,
                    folderName: '',
                    url: '',
                    selectedFileList: []
                },

                folderList: {
                    projectFiles_0: [
                        {
                            parentId: 'projectFiles_0',
                            index: 0,
                            folderName: '项目受理登记材料',
                            url: '/archive/registerAttachList',
                            selectedFileList: [],
                            auth: true
                        },
                        {
                            parentId: 'projectFiles_0',
                            index: 1,
                            folderName: '项目受理下发材料',
                            url: '/archive/sendAttachList',
                            selectedFileList: [],
                            auth: false
                        }
                    ],
                    projectFiles_1: [
                        {
                            folderName: '工程备案材料',
                            url: '/archive/projectRecordAttachList',
                            selectedFileList: [],
                            auth: true
                        },
                        {
                            folderName: '质量监督过程材料',
                            url: '/archive/qualityProcessAttachList',
                            selectedFileList: [],
                            auth: false
                        },
                        {
                            folderName: '安全监督过程材料',
                            url: '/archive/safeProcessAttachList',
                            selectedFileList: [],
                            auth: false
                        },
                        {
                            folderName: '监督通知材料',
                            url: '/archive/supervisionNoticeAttachList',
                            selectedFileList: [],
                            auth: false
                        },
                        {
                            folderName: '信用评价记录材料',
                            url: '/archive/creditEvaluateAttachList',
                            selectedFileList: [],
                            auth: false
                        },
                        {
                            folderName: '质量安全投诉材料',
                            url: '/archive/complaintAttachList',
                            selectedFileList: [],
                            auth: false
                        },
                        {
                            folderName: '公文办理材料',
                            url: '/archive/documentHandleList',
                            selectedFileList: [],
                            auth: false
                        },
                    ],
                    projectFiles_2: [
                        {
                            folderName: '交工检测核验材料',
                            url: '/archive/handoverOpinionAttachList',
                            selectedFileList: [],
                            auth: true
                        },
                        {
                            folderName: '平安工地考核材料',
                            url: '/archive/',
                            selectedFileList: [],
                            auth: false
                        }
                    ],
                    projectFiles_3: [
                        {
                            folderName: '竣工质量鉴定材料',
                            url: '/archive/completeAttachList',
                            selectedFileList: [],
                            auth: true
                        },
                        {
                            folderName: '品质工程材料',
                            url: '/archive/',
                            selectedFileList: [],
                            auth: false
                        }
                    ],
                    projectFiles_4: [
                        {
                            folderName: '个人文件',
                            url: '/file/userCanChooseFileList',
                            selectedFileList: [],
                            auth: true
                        }
                    ]
                }
            };
        },
        watch: {
            cProjectId: {
                immediate: true,
                handler(val) {
                    this.activeName = !val ? '5': '1';

                    this.folderList.projectFiles_0.forEach(v => {
                        v.selectedFileList = [];
                    });

                    this.folderList.projectFiles_1.forEach(v => {
                        v.selectedFileList = [];
                    });

                    this.folderList.projectFiles_2.forEach(v => {
                        v.selectedFileList = [];
                    });

                    this.folderList.projectFiles_3.forEach(v => {
                        v.selectedFileList = [];
                    });
                }
            },

            '$store.state.user.userType': {
                immediate: true,
                handler(val) {
                    console.dir(val);
                    if(val === 'supervisor') {
                        this.folderList.projectFiles_0[1].auth = true;
                        this.folderList.projectFiles_1[1].auth = true;
                        this.folderList.projectFiles_1[2].auth = true;
                        this.folderList.projectFiles_1[3].auth = true;
                        this.folderList.projectFiles_1[4].auth = true;
                        this.folderList.projectFiles_1[5].auth = true;
                        this.folderList.projectFiles_1[6].auth = true;
                        this.folderList.projectFiles_2[1].auth = true;
                        this.folderList.projectFiles_3[1].auth = true;
                    }
                    else {
                        this.folderList.projectFiles_0[1].auth = false;
                        this.folderList.projectFiles_1[1].auth = false;
                        this.folderList.projectFiles_1[2].auth = false;
                        this.folderList.projectFiles_1[3].auth = false;
                        this.folderList.projectFiles_1[4].auth = false;
                        this.folderList.projectFiles_1[5].auth = false;
                        this.folderList.projectFiles_1[6].auth = false;
                        this.folderList.projectFiles_2[1].auth = false;
                        this.folderList.projectFiles_3[1].auth = false;
                    }

                }
            }

        },
        mounted() {
            this.getProjectList();
        },
        methods: {
            getProjectList() {
                this.$http({
                    method: 'post',
                    url: '/archive/archiveList',
                    data: JSON.stringify({
                        projectName: ''
                    })
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.projectList = res.data || [];
                    }
                });
            },
            onSelect(name) {
                this.openFilesList = false;
                this.activeName = name;
            },
            onSelect_folderType(folderInfo) {
                Object.assign(this.folderType, folderInfo);
                this.openFilesList = true;
            },
            // 文件选择
            callback_change(data, active) {
                if (active) {
                    this.folderType.selectedFileList.push(data);
                }
                else {
                    let idx = this.folderType.selectedFileList.indexOf(data);
                    this.folderType.selectedFileList.splice(idx, 1);
                }
            },
            fileUploadSuccess(response, file, fileList) {
                this.$Loading.finish();
                if (response.code === 'SUCCESS') {
                    this.selectValue = [response.data.fileId];
                    this.selectItems = [{
                        fileId: response.data.fileId,
                        fileName: response.data.fileName,
                        fileFormat: response.data.fileFormat,
                        url: response.data.url
                    }];
                    this.add();
                }
            },
            save() {
                let list = [];
                for(let key in this.folderList) {
                    this.folderList[key].forEach(val => {
                        list = list.concat(val.selectedFileList);
                    })
                }

                this.selectItems = list;
                this.selectValue = list.map(v => v.fileId);
                this.add();
            },

            add() {
                this.$emit('handleSelect', this.selectValue, this.selectItems);
            }

        }
    }
</script>

<style lang="scss" scoped>
    .filesSelect2-container {
    }
</style>