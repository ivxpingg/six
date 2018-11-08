<template>
    <div class="modalProjectFiles-container">
        <Modal v-model="modalValue"
               :width="800"
               title="工程档案"
               class-name="modal-body-padding0">
            <vModalBothSides :height="460">
                <template slot="left">
                    <Menu theme="light"
                          :width="`200px`"
                          :activeName="activeName"
                          @on-select="onSelect">
                        <MenuItem name="1">
                            <Icon type="md-document" />
                            <Badge :count="getCount(0)" type="success" :offset="offset">监督受理材料</Badge>
                        </MenuItem>
                        <MenuItem name="2">
                            <Icon type="md-document" />
                            <Badge :count="getCount(1)" type="success" :offset="offset">监督过程材料</Badge>
                        </MenuItem>
                        <MenuItem name="3">
                            <Icon type="md-document" />
                            <Badge :count="getCount(2)" type="success" :offset="offset">交工验收材料</Badge>
                        </MenuItem>
                        <MenuItem name="4">
                            <Icon type="md-document" />
                            <Badge :count="getCount(3)" type="success" :offset="offset">竣工鉴定材料</Badge>
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

                    <vProjectFilesList v-show="openFilesList"
                                       :folderType="folderType"
                                       :projectId="projectId"
                                       @callback="callback_change" ></vProjectFilesList>

                </template>
            </vModalBothSides>
            <div slot="footer">
                <Button type="primary" size="large" @click="save">移送交通行政执法局</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import modalMixin from '../../../../lib/mixin/modalMixin';
    import vModalBothSides from '../../../../components/modal-body/modal-both-sides';
    import vProjectFiles_0 from './module/projectFiles_0';
    // import vProjectFiles_1 from './module/projectFiles_1';
    // import vProjectFiles_2 from './module/projectFiles_2';
    // import vProjectFiles_3 from './module/projectFiles_3';
    import vProjectFilesList from './module/projectFilesList';
    export default {
        name: 'modalProjectFiles',
        mixins: [modalMixin],
        components: {
            vModalBothSides,
            vProjectFiles_0,
            vProjectFilesList
        },
        props: {
            projectId: {
                type: String,
                default: ''
            }
        },
        watch: {
            projectId(val) {
                this.folderList.projectFiles_0[0].forEach(v => {
                    v.selectedFileList = [];
                });

                this.folderList.projectFiles_0[1].forEach(v => {
                    v.selectedFileList = [];
                });

                this.folderList.projectFiles_0[2].forEach(v => {
                    v.selectedFileList = [];
                });

                this.folderList.projectFiles_0[3].forEach(v => {
                    v.selectedFileList = [];
                });
            }
        },
        data() {
            return {
                activeName: '1',
                openFilesList: false,
                offset: [-3, -3],

                folderList: {
                    projectFiles_0: [
                        {
                            parentId: 'projectFiles_0',
                            index: 0,
                            folderName: '项目受理登记材料',
                            url: '/archive/registerAttachList',
                            selectedFileList: []
                        },
                        {
                            parentId: 'projectFiles_0',
                            index: 1,
                            folderName: '项目受理下发材料',
                            url: '/archive/sendAttachList',
                            selectedFileList: []
                        }
                    ],
                    projectFiles_1: [
                        {
                            folderName: '工程备案材料',
                            url: '/archive/registerAttachList',
                            selectedFileList: []
                        },
                        {
                            folderName: '质量监督过程材料',
                            url: '/archive/registerAttachList',
                            selectedFileList: []
                        },
                        {
                            folderName: '安全监督过程材料',
                            url: '/archive/registerAttachList',
                            selectedFileList: []
                        },
                        {
                            folderName: '监督通知材料',
                            url: '/archive/registerAttachList',
                            selectedFileList: []
                        },
                        {
                            folderName: '信用评价记录材料',
                            url: '/archive/registerAttachList',
                            selectedFileList: []
                        },
                        {
                            folderName: '质量安全投诉材料',
                            url: '/archive/registerAttachList',
                            selectedFileList: []
                        },
                    ],
                    projectFiles_2: [
                        {
                            folderName: '交工检测核验材料',
                            url: '/archive/registerAttachList',
                            selectedFileList: []
                        },
                        {
                            folderName: '平安工地考核材料',
                            url: '/archive/sendAttachList',
                            selectedFileList: []
                        }
                    ],
                    projectFiles_3: [
                        {
                            folderName: '竣工质量鉴定材料',
                            url: '/archive/registerAttachList',
                            selectedFileList: []
                        },
                        {
                            folderName: '品质工程材料',
                            url: '/archive/sendAttachList',
                            selectedFileList: []
                        }
                    ]
                },

                //
                folderType: {
                    parentId: '',
                    index: 0,
                    folderName: '',
                    url: '',
                    selectedFileList: []
                }
            };
        },
        methods:{
            onSelect(name) {
                this.openFilesList = false;
                this.activeName = name;
            },
            onSelect_folderType(folderInfo) {
                Object.assign(this.folderType, folderInfo);
                this.openFilesList = true;
            },

            getCount(idx) {
                let count = 0;
                this.folderList[`projectFiles_${idx}`].forEach(v => {
                    count += v.selectedFileList.length;
                });
                return count;
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

            // 移送交通行政执法局
            save() {

            }
        }
    }
</script>

<style lang="scss" scoped>
    .modalProjectFiles-container {
    }
</style>