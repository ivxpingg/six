<template>
    <div class="unitDetail-container">
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
                    人员情况
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
            <vUnitBaseInfo v-show="activeName === '1'"></vUnitBaseInfo>
            <vUnitPersons v-show="activeName === '2'"></vUnitPersons>
            <vUnitEvaluate v-show="activeName === '3'"></vUnitEvaluate>
            <vUnitAccessory v-show="activeName === '4'"></vUnitAccessory>
        </div>
    </div>
</template>

<script>
    import vUnitBaseInfo from './module/unitBaseInfo';
    import vUnitPersons from './module/unitPersons';
    import vUnitEvaluate from './module/unitEvaluate';
    import vUnitAccessory from './module/unitAccessory';
    export default {
        name: 'unitDetail',  // 单位详情
        components: {
            vUnitBaseInfo,
            vUnitPersons,
            vUnitEvaluate,
            vUnitAccessory
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
    .unitDetail-container {
        display: flex;

        .left-panel {
            .ivu-menu {
                height: 100%;
            }
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