<template>
    <div class="personDetail-container">
        <div class="left-panel">
            <Menu theme="light"
                  :width="`160px`"
                  :activeName="activeName"
                  @on-select="onSelect">
                <MenuItem name="1">
                    <Icon type="md-document" />
                    基本信息
                </MenuItem>
                <MenuItem name="2">
                    <Icon type="md-chatbubbles" />
                    供职单位
                </MenuItem>
                <MenuItem name="3">
                    <Icon type="md-heart" />
                    信用评价
                </MenuItem>
                <MenuItem name="4">
                    <Icon type="md-leaf" />
                    附件信息
                </MenuItem>
            </Menu>
        </div>
        <div class="right-panel">
            <vUserBaseInfo v-show="activeName === '1'" :userId="userId" editable></vUserBaseInfo>
            <vUserUnit v-show="activeName === '2'" :userId="userId"></vUserUnit>
            <vUserEvaluate v-show="activeName === '3'" :userId="userId" ></vUserEvaluate>
            <vUserAccessory v-show="activeName === '4'" :userId="userId"></vUserAccessory>
        </div>
    </div>
</template>

<script>
    import vUserBaseInfo from './module/userBaseInfo';
    import vUserUnit from './module/userUnit';
    import vUserEvaluate from './module/userEvaluate';
    import vUserAccessory from './module/userAccessory';
    export default {
        name: 'personDetail',
        components: {
            vUserBaseInfo,
            vUserUnit,
            vUserEvaluate,
            vUserAccessory
        },
        props: {
            userId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                activeName: '1'
            };
        },
        methods: {
            onSelect(name) {
                this.activeName = name;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .personDetail-container {
        display: flex;

        .left-panel {

        }
        .right-panel {
            flex: 1;
            padding: 16px;
            height: 600px;
            overflow-y: auto;
            overflow-x: hidden;
        }
    }
</style>