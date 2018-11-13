<template>
    <Card shadow>
        <p slot="title">
            <Icon type="ios-folder" />
            信息采集管理
        </p>
        <!--<a href="#" slot="extra">-->
            <!--<Icon type="ios-more" />-->
            <!--更多-->
        <!--</a>-->
        <div class="card-content">
            <Row :gutter="10">
                 <template v-for="item in folderList">
                     <i-col span="8" :key="item">
                         <vFolder :title="item"
                                  @on-select="onClickFolder(item)"></vFolder>
                     </i-col>
                 </template>
            </Row>
        </div>

        <Modal v-model="modalFolder"
               :width="860" :scrollable="true">
            <p slot="header" >
                <Icon type="ios-folder"></Icon>
                <span>{{folderInfo.title}}</span>
            </p>
            <div style="height: 500px; overflow-y: auto; overflow-x: hidden;">
                <Row :gutter="10">
                    <template v-for="(item, idx) in fileList">
                        <i-col span="8" :key="`thumb-${idx}`">
                            <vThumb :src="item.url" :title="item.fileName"></vThumb>
                        </i-col>
                    </template>
                </Row>
            </div>
        </Modal>
    </Card>
</template>
<script>
    import vThumb from '../../../Common/thumb/thumb';
    import vFolder from './folder/folder';
    import Config from '../../../../config';
    export default {
        name: 'infoCollectionPanel',
        components: {vThumb, vFolder},
        data() {
            return {
                modalFolder: false,
                folderInfo: {
                    title: '',
                    list: []
                },
                folderList: [],
                fileList: []
            }
        },

        mounted() {
            this.getFolders();
        },
        methods: {
            onClickFolder(time) {
                this.fileList = [];
                this.getFileList(time);

                this.modalFolder = true;
            },

            getFolders() {
                this.$http({
                    method: 'get',
                    url: '/collectionInfo/list'
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.folderList = res.data || [];
                    }
                })
            },

            getFileList(time) {
                this.$http({
                    method: 'get',
                    url: '/collectionInfo/fileList',
                    params: {
                        searchTime: time
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.fileList = res.data || [];
                    }
                })
            },

            getImageUrl(url) {
                return Config[Config.env].filePath + url;
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>