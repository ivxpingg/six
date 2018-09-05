<template>
    <Card shadow>
        <p slot="title">
            <Icon type="ios-folder" />
            信息采集管理
        </p>
        <a href="#" slot="extra">
            <Icon type="ios-more" />
            更多
        </a>
        <div class="card-content">
            <Row :gutter="10">
                 <template v-for="(item, idx) in fileList">
                     <i-col span="8" :key="`folder${idx}`">
                         <vFolder :title="item.time"
                                  :list="item.list"
                                  @on-select="onClickFolder"></vFolder>
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
                    <template v-for="(item, idx) in folderInfo.list">
                        <i-col span="8" :key="`thumb-${idx}`">
                            <vThumb :src="item.src" :title="item.title"></vThumb>
                        </i-col>
                    </template>
                </Row>
            </div>
        </Modal>
    </Card>
</template>
<script>
    import vThumb from './thumb/thumb';
    import imgUrl from '@/assets/images/user.jpg';
    import imgUrl1 from '@/assets/images/logo.jpg';
    import imgUrl3 from '@/assets/images/logo2.png';
    import imgUrl2 from '@/assets/images/logo-min.jpg';
    import vFolder from './folder/folder';

    const list = [
        { src: imgUrl, title: '图片标题'},
        { src: imgUrl3, title: '图片标题'},
        { src: imgUrl1, title: '图片标题'},
        { src: imgUrl2, title: '图片标题'},
        { src: imgUrl1, title: '图片标题'},
        { src: imgUrl, title: '图片标题'},
        { src: imgUrl3, title: '图片标题'},
        { src: imgUrl1, title: '图片标题'},
        { src: imgUrl2, title: '图片标题'},
        { src: imgUrl1, title: '图片标题'},
        { src: imgUrl, title: '图片标题'},
        { src: imgUrl3, title: '图片标题'},
        { src: imgUrl1, title: '图片标题'},
        { src: imgUrl2, title: '图片标题'},
        { src: imgUrl1, title: '图片标题'},
        { src: imgUrl, title: '图片标题'},
        { src: imgUrl3, title: '图片标题'},
        { src: imgUrl1, title: '图片标题'},
        { src: imgUrl2, title: '图片标题'},
        { src: imgUrl1, title: '图片标题'}
    ];
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
                fileList: [
                    { title: '文件1', time: '2018-09-01', list: list },
                    { title: '文件2', time: '2018-09-02', list: list },
                    { title: '文件3', time: '2018-09-03', list: list },
                    { title: '文件4', time: '2018-09-04', list: list },
                    { title: '文件5', time: '2018-09-05', list: list },
                    { title: '文件6', time: '2018-09-06', list: list },
                    { title: '文件4', time: '2018-09-07', list: list },
                    { title: '文件5', time: '2018-09-08', list: list }
                ]
            }
        },
        methods: {
            onClickFolder(title, list) {
                this.folderInfo.title = title;
                this.folderInfo.list = list || [];
                this.modalFolder = true;
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>