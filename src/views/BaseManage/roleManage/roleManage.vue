<template>
    <div class="roleManage-container ivu-card ivu-card-bordered ivu-card-dis-hover">
        <div class="left-panel" v-show="auth.length > 0">
            <vBTree ref="btree" @onSelectChange="onSelectChange"></vBTree>
        </div>
        <div class="right-panel">
            <Card :bordered="false" dis-hover>
                <vIvxFilterBox>
                    <Button type="primary" v-show="selectType === 'group'" @click="modal_addNode_open('role')">添加角色</Button>
                    <Button type="error" v-show="selectType === 'role'" @click="onClick_delNode('role')">删除角色</Button>
                    <Button type="primary" v-show="selectType === 'group' || selectType === ''" @click="modal_addNode_open('group')">添加节点</Button>
                    <Button type="error" v-show="selectType === 'group' && selectType !== ''" @click="onClick_delNode('group')">删除节点</Button>
                </vIvxFilterBox>

                <Row :gutter="20" style="margin-top: 20px; width: 800px">
                    <Col :span="12">
                        <Card v-show="selectType !== ''">
                            <p slot="title">节点管理</p>
                            <vRoleInfo class="roleInfo"
                                       :roleId="nodeItem.roleId"
                                       @updateNodeCallback="modal_addNodeCallback"></vRoleInfo>
                        </Card>
                    </Col>
                    <Col :span="12">
                        <Card v-show="selectType === 'role'">
                            <p slot="title">菜单权限</p>
                            <vMenuTree ref="menuTree"
                                       class="menu-tree"
                                       :checkedNodes="roleMenuAuth"
                                       :roleId="nodeItem.roleId"
                                       @onCheckChange="menuTree_onCheckChange"></vMenuTree>
                            <div class="ivu-modal-footer">
                                <Button type="primary"
                                        size="large"
                                        @click="saveMenuTreeAuth">保存</Button>
                            </div>
                        </Card>
                    </Col>
                </Row>

            </Card>
        </div>

        <Modal v-model="modal_addNode"
               title="添加节点"
               :width="350"
               footer-hide>
            <vAddNode :parentId="addNodeParentId"
                      :nodeType="addNodeType"
                      @modal_addNodeCallback="modal_addNodeCallback"></vAddNode>
        </Modal>

    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vBTree from '../organizetionManage/bTree/bTree';
    import vRoleInfo from './roleInfo/roleInfo';
    import vMenuTree from '../../Common/menuTree/menuTree';
    import vAddNode from './addNode/addNode';
    import { mapMutations } from 'vuex'
    export default {
        name: 'roleManage',
        components: {
            vIvxFilterBox,
            vBTree,
            vRoleInfo,
            vMenuTree,
            vAddNode
        },
        computed: {
            addNodeParentId() {
                return this.selectType === '' ? '0' : this.nodeItem.roleId;
            },
            roleMenus() {
                return this.menuTreeCheckNodes.map((val) => {
                    return {
                        roleId: this.nodeItem.roleId,
                        menuId: val.menuId
                    };
                });
            }
        },
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
                roleMenuAuth: [],
                menuTreeCheckNodes: [],

                // 添加节点
                modal_addNode: false,
                addNodeType: 'group',
                auth: this.$store.state.app.auth[this.$route.name]
            };
        },
        watch: {
            'nodeItem.roleId'(val) {
                if (val !== '') {
                    this.getRoleMenu();
                }
            }
        },
        mounted() {
            console.dir(this.auth);
        },
        methods: {
            ...mapMutations([
                'setAuth'
            ]),
            // 角色树选择
            onSelectChange(item) {
                if (item.length === 0) {
                    this.selectType = '';
                }
                else {
                    this.selectType = item[0].nodeType;
                    this.nodeItem = Object.assign(this.nodeItem, item[0]);
                }
            },
            onClick_delNode() {
                if (this.nodeItem.children.length > 0) {
                    this.$Message.error({
                        content: `无法删除，<${this.nodeItem.name}>节点下存在子节点`
                    });
                }
                else {
                    this.$Modal.confirm({
                        title: '删除',
                        content: `确定要删除<${this.nodeItem.name}>节点？`,
                        onOk: () => {
                            this.$http({
                                method: 'get',
                                url: '/role/delete',
                                params: {
                                    roleId: this.nodeItem.roleId
                                }
                            }).then(res => {
                                if(res.code === 'SUCCESS') {
                                    this.$Message.success({
                                        content: '删除成功！'
                                    });
                                    this.selectType = '';
                                    this.nodeItem.roleId = '';
                                    this.$refs.btree.getData();
                                }
                            })
                        }
                    });
                }
            },
            modal_addNode_open(type) {
                this.addNodeType = type;
                this.modal_addNode = true;
            },
            modal_addNodeCallback() {
                this.modal_addNode = false;
                this.$refs.btree.getData();
            },
            /**
             * 菜单树返回的选中的项， 获取选中的项没有采用默认方法，
             *
             * @param item
             */
            menuTree_onCheckChange(item) {
                this.menuTreeCheckNodes = this.$refs.menuTree.$refs.tree.flatState.filter(obj => obj.node.checked || obj.node.indeterminate).map(obj => obj.node);
            },

            // 获取角色菜单权限
            getRoleMenu() {
                this.$http({
                    method: 'get',
                    url: '/role/getRoleMenu',
                    params: {
                        roleId: this.nodeItem.roleId
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.roleMenuAuth = res.data === '' ? [] : res.data;
                    }
                })
            },

            // 保存角色的菜单权限
            saveMenuTreeAuth() {
                this.$http({
                    method: 'post',
                    url: '/role/addRoleMenu',
                    data: JSON.stringify(this.roleMenus)
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.$Message.success({
                            content: '菜单权限保存成功！'
                        })
                    }
                })
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

            .roleInfo {
                height: 399px;
            }

            .menu-tree {
                height: 350px;
                overflow-y: auto;
            }
            .ivu-modal-footer {
                padding-bottom: 0px;
            }
        }
    }
</style>