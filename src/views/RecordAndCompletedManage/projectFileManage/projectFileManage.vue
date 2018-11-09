<template>
    <Card class="projectFileManage-container">
        <vIvxFilterBox>
            <Button type="primary"
                    icon="ios-list">移交处理清单</Button>
            <Button type="primary"
                    icon="ios-options">案件清单处理</Button>
        </vIvxFilterBox>
        <vIvxFilterBox>
            <Form inline>
                <FormItem label="筛选条件:" :label-width="65">
                    <Input v-model="searchParams.projectName" placeholder="项目名称" />
                </FormItem>
            </Form>
        </vIvxFilterBox>
        <ul class="project-list">
            <li v-for="(item, idx) in projectList" :key="idx">
                <vIvxFolder :title="item.projectName"
                            :size="folderSize"
                            :data="item"
                            :rows="3" @on-select="onSelectFolder"></vIvxFolder>
            </li>
        </ul>

        <vModalProjectFiles ref="modal_projectFiles" :projectId="currentRow.projectId"></vModalProjectFiles>
    </Card>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vIvxFolder from '../../../components/folder/folder';
    import vModalProjectFiles from './modalProjectFiles/modalProjectFiles';
    export default {
        name: 'projectFileManage',   // 工程档案管理
        components: {vIvxFilterBox, vIvxFolder, vModalProjectFiles},
        data() {
            return {
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
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
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
            }

        }
    }
</script>

<style lang="scss" scoped>
    .projectFileManage-container {
        .project-list {
            overflow: hidden;
            li {
                float: left;
                margin: 15px;
            }
        }
    }
</style>