<template>
    <div class="roleManage-container ivu-card ivu-card-bordered ivu-card-dis-hover">

        <div class="left-panel">
            <vBTree @onSelectChange="onSelectChange"></vBTree>
        </div>
        <div class="right-panel">
            <Card :bordered="false" dis-hover>
                <vIvxFilterBox>
                    <Button type="primary" v-show="selectType === 'role'">添加角色</Button>
                    <Button type="primary" v-show="selectType === 'role'">删除角色</Button>
                    <Button type="primary" v-show="selectType === 'group'">添加子节点</Button>
                    <Button type="primary" v-show="selectType === 'group'">删除子节点</Button>
                </vIvxFilterBox>

                <Row :gutter="20" style="margin-top: 20px;">
                    <Col :span="12">
                        <Card v-show="selectType === 'role'">
                            <p slot="title">节点管理</p>
                            <vRoleInfo :roleId="nodeItem.roleId"></vRoleInfo>
                        </Card>
                    </Col>
                    <Col :span="12">
                        <Card v-show="selectType === 'role'">
                            <p slot="title">菜单权限</p>
                            <vMenuTree></vMenuTree>
                        </Card>
                    </Col>
                </Row>


            </Card>
        </div>

    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vBTree from '../organizetionManage/bTree/bTree';
    import vRoleInfo from './roleInfo/roleInfo';
    import vGroupInfo from './groupInfo/groupInfo';
    import vMenuTree from '../../Common/menuTree/menuTree';
    export default {
        name: 'roleManage',
        components: {
            vIvxFilterBox,
            vBTree,
            vRoleInfo,
            vGroupInfo,
            vMenuTree},
        data() {
            return {
                selectType: '',   // 当前选中节点类型 'group': 分组; 'role' : 角色
                nodeItem: { // 当前选中节点 角色分组节点数据
                    roleId: '',
                    parentId: '',
                    roleNo: '',
                    name: '',
                    remark: '',
                    nodeType: '',
                    sort: 0,
                },
            };
        },
        methods: {
            onSelectChange(item) {
                if (item.length === 0) {
                    this.selectType = '';
                }
                else {
                    this.selectType = item[0].nodeType;
                    this.roleItem = Object.assign(this.roleItem, item[0]);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .roleManage-container {
        position: relative;
        display: flex;
        min-height: 700px;
        .left-panel {
            width: 300px;
            height: 100%;
            min-height: 700px;
            border-right: 1px solid #dcdee2;
        }
        .right-panel {
            flex: 1;
        }
    }
</style>