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
                <!--<MenuItem name="2" v-show="projectId !== ''">-->
                    <!--<Icon type="md-chatbubbles" />-->
                    <!--材料明细一览表-->
                <!--</MenuItem>-->
                <!--<MenuItem name="3" v-show="projectId !== ''">-->
                    <!--<Icon type="md-heart" />-->
                    <!--参建单位与人员情况-->
                <!--</MenuItem>-->
            </Menu>
        </template>

        <template slot="right">
            <vProjectBaseInfo  v-if="activeName === '1'"
                               :projectId="projectId"
                               @modal_addProject_callback="modal_addProject_callback"
                               class="six-modal-body-inner"></vProjectBaseInfo>

            <!--<vFileDetailLists v-if="activeName === '2' && projectId !== ''"-->
                              <!--:projectId="projectId"-->
                              <!--class="six-modal-body-inner"></vFileDetailLists>-->

            <!--<vUnitAndPerson v-if="activeName === '3' && projectId !== ''"-->
                            <!--:projectId="projectId"-->
                            <!--class="six-modal-body-inner"></vUnitAndPerson>-->

        </template>
    </vModalBothSides>
</template>

<script>
    import vModalBothSides from '../../../../components/modal-body/modal-both-sides';
    import vProjectBaseInfo from './projectBaseInfo/projectBaseInfo';
    import vFileDetailLists from '../../../Common/fileDetailLists/fileDetailLists';
    import vUnitAndPerson from './unitAndPerson/unitAndPerson';
    export default {
        name: 'addProject',
        components: {vModalBothSides, vProjectBaseInfo, vFileDetailLists, vUnitAndPerson},
        deactivated () {
            this.$destroy(true);
        },
        data() {
            return {
                activeName: '1',
                projectId: ''
            };
        },
        mounted() {
        },
        methods: {
            onSelect(name) {
                this.activeName = name;
            },
            modal_addProject_callback() {
                this.$emit('modal_callback');
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