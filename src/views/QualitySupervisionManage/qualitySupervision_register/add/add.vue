<template>
    <vModalBothSides class="add-container" :height="650">
        <template slot="left">
            <Menu theme="light"
                  :width="`200px`"
                  :activeName="activeName"
                  @on-select="onSelect">
                <MenuItem name="1">
                    <Icon type="md-document" />
                    项目基本信息
                </MenuItem>
                <MenuItem name="2">
                    <Icon type="md-chatbubbles" />
                    材料明细一览表
                </MenuItem>
                <MenuItem name="3">
                    <Icon type="md-heart" />
                    参建单位与人员情况
                </MenuItem>
            </Menu>
        </template>

        <template slot="right">
            <vProjectBaseInfo  v-show="activeName === '1'"
                               :projectId="projectId"
                               class="six-modal-body-inner"></vProjectBaseInfo>
        </template>
    </vModalBothSides>
</template>

<script>
    import vModalBothSides from '../../../../components/modal-body/modal-both-sides';
    import vProjectBaseInfo from './projectBaseInfo/projectBaseInfo';
    export default {
        name: 'addProject',
        components: {vModalBothSides, vProjectBaseInfo},
        deactivated () {
            this.$destroy(true);
        },
        data() {
            return {
                activeName: '1',
                projectId: '',
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
    .add-container {
        .ivu-menu {
            height: 100%;
        }
    }
</style>