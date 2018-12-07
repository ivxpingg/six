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
            </Menu>
        </template>

        <template slot="right">
            <vProjectBaseInfo  v-show="activeName === '1'"
                               :key="'add'"
                               @modal_addProject_callback="modal_addProject_callback"
                               class="six-modal-body-inner"></vProjectBaseInfo>


        </template>
    </vModalBothSides>
</template>

<script>
    import vModalBothSides from '../../../../components/modal-body/modal-both-sides';
    import vProjectBaseInfo from './projectBaseInfo/projectBaseInfo';
    // import vFileDetailLists from '../../../Common/fileDetailLists/fileDetailLists';
    // import vUnitAndPerson from './unitAndPerson/unitAndPerson';
    export default {
        name: 'addProject',
        components: {vModalBothSides, vProjectBaseInfo},
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