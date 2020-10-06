<template>
    <vModalBothSides class="qualitySupervision_register_edit-container" :height="650">
        <template slot="left">
            <Menu theme="light"
                  :width="`200px`"
                  :activeName="activeName"
                  @on-select="onSelect">
                <MenuItem name="1">
                    <Icon type="md-document" />
                    项目基本信息
                </MenuItem>
                <MenuItem name="2" v-show="projectId !== ''">
                    <Icon type="md-chatbubbles" />
                    材料明细一览表
                </MenuItem>
                <MenuItem name="3" v-show="projectId !== ''">
                    <Icon type="md-heart" />
                    参建单位与人员情况
                </MenuItem>
            </Menu>
        </template>

        <template slot="right">
            <vProjectBaseInfo  v-show="activeName === '1'"
                               :projectId="projectId"
                               :key="'edit'"
                               :isView="isView"
                               @modal_updateProject_callback="modal_updateProject_callback"
                               class="six-modal-body-inner"></vProjectBaseInfo>

            <vFileDetailLists v-show="activeName === '2'"
                              :projectId="projectId"
                              :isView="isView"
                              templateType="quality_supervision"
                              class="six-modal-body-inner"></vFileDetailLists>

            <vUnitAndPerson v-show="activeName === '3'"
                            :projectId="projectId"
                            :isView="isView"
                            class="six-modal-body-inner"></vUnitAndPerson>

        </template>
    </vModalBothSides>
</template>

<script>
    import vModalBothSides from '../../../../components/modal-body/modal-both-sides';
    import vProjectBaseInfo from '../../qualitySupervision_register/add/projectBaseInfo/projectBaseInfo';
    import vFileDetailLists from '../../../Common/fileDetailLists/fileDetailLists';
    import vUnitAndPerson from '../../qualitySupervision_register/add/unitAndPerson/unitAndPerson';
    import authMixin from '../../../../lib/mixin/authMixin';
    export default {
        name: 'projectCheck',  // 项目材料复核
        mixins: [authMixin],
        components: {vModalBothSides, vProjectBaseInfo, vFileDetailLists, vUnitAndPerson},
        props: {
            isView: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            projectId: {
                type: String,
                required: true
            }
        },
        computed: {},
        data() {
            return {
                activeName: '1'
            };
        },
        methods: {
            onSelect(name) {
                this.activeName = name;
            },
            modal_updateProject_callback() {
                this.$emit('modal_callback');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .projectCheck-container {
    }
</style>