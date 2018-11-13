<template>
    <div class="unitAccessory-container">
        <vIvxFilterBox v-if="editable">
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
        </vIvxFilterBox>
        <Row :gutter="10">
            <template v-for="(item, idx) in list">
                <i-col span="4" :key="`thumb-${idx}`" style="margin-top: 10px;">
                    <vThumb :src="item.url" :title="item.fileName"></vThumb>
                </i-col>
            </template>
        </Row>
    </div>
</template>

<script>
    import vIvxFilterBox from '../../../../../components/ivxFilterBox/ivxFilterBox';
    import uploadMixin from '../../../../../lib/mixin/uploadMixin';
    import vThumb from '../../../../Common/thumb/thumb';
    export default {
        name: 'unitAccessory',  // 附件信息
        mixins: [uploadMixin],
        components: {vIvxFilterBox, vThumb},
        props: {
            unitId: {
                type: String,
                required: true
            },
            editable: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            uploadAtion() {
                return this.uploadParams.actionUrl + '/user_attach';  // 个人附件
            }
        },
        data() {
            return {
                list: []
            };
        },
        watch: {
            unitId: {
                immediate: true,
                handler(val) {
                    if (val) {
                        this.getAccessory();
                    }
                }
            }
        },
        mounted() {},
        methods: {
            getAccessory() {
                this.$http({
                    method: 'get',
                    url: '/unit/unitAttachList',
                    params: {
                        unitId: this.unitId
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.list = res.data;
                    }
                });
            },
            fileUploadSuccess(response, file, fileList) {
                if (response.code === 'SUCCESS') {
                    this.addUnitAttach(response.data.fileId);
                }

            },
            addUnitAttach(fileId) {
                this.$http({
                    method: 'get',
                    url: '/unit/addUnitAttach',
                    params: {
                        unitId: this.unitId,
                        fileId: fileId
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.$Message.success('上传成功！');
                        this.getAccessory();
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .unitAccessory-container {
    }
</style>