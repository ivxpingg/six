<template>
    <div class="bTree-container ivu-card ivu-card-dis-hover" :bordered="false">
        <vIvxFilterBox>
            <Form>
                <FormItem>
                    <Input placeholder="检索组织结构" >
                        <Icon type="ios-search" slot="suffix" />
                    </Input>
                </FormItem>
            </Form>
        </vIvxFilterBox>
        <div class="tree-box">
            <Tree :data="groupTreeData"
                  @on-select-change="onSelectChange"></Tree>
        </div>
    </div>
</template>

<script>
    import vIvxFilterBox from '../../../../components/ivxFilterBox/ivxFilterBox';
    export default {
        name: 'bTree',
        components: {vIvxFilterBox},
        props: {
            roleId: {
                type: String,
                default: ''
            },
            // 树展开的层级
            expandLevel: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {
                menuList: [],
                groupTreeData: []
            };
        },
        watch: {
            menuList(val) {
                let list = [];
                if (val.length > 0) {
                    list = this.transformTreeData(val, 0);
                }
                this.groupTreeData = list;
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                this.$http({
                    method: 'get',
                    url: '/role/list'
                }).then(res => {
                    if (res.code === 'SUCCESS'){
                        this.menuList = res.data;
                    }
                });
            },
            transformTreeData(children, level) {
                let attr = [];
                children.forEach((val) => {
                    let item = {};
                    Object.assign(item, val);
                    item.title = item.name;
                    item.expand = level <= this.expandLevel;
                    item.children = [];
                    item.selected = false;
                    item.render = this.render;
                    attr.push(item);
                    if (val.children) {
                        item.children = this.transformTreeData(val.children, level + 1);
                    }
                });
                return attr;
            },

            render(h, { root, node, data }) {
                let attr = [];
                let cls = 'ivu-tree-title';

                if (data.nodeType === 'role') {
                    attr.push(h('Icon', {
                        props: {
                            type: 'md-person'
                        },
                        style: {
                            marginRight: '5px'
                        }
                    }));
                }
                else {
                    // attr.push(h('Icon', {
                    //     props: {
                    //         type: 'md-git-merge'
                    //     },
                    //     style: {
                    //         marginRight: '5px'
                    //     }
                    // }));
                }
                attr.push(h('span', data.title));

                if (data.roleId === this.roleId) {
                    data.selected = true;
                    cls += ' ivu-tree-title-selected';
                }
                return h('span', {
                    class: {
                        'ivu-tree-title': true,
                        'ivu-tree-title-selected': data.selected
                    },
                    style: {
                        cursor: 'pointer'
                    },
                    on: {
                        click: () => {
                            root.forEach((val) => {
                                if (val.node.roleId !== data.roleId) {
                                    val.node.selected = false;
                                }
                            });

                            data.selected = !data.selected;
                            if (data.selected) {
                                this.onSelectChange([data]);
                            }
                            else {
                                this.onSelectChange([]);
                            }
                        }
                    }
                }, attr);
            },

            onSelectChange(item) {
               this.$emit('onSelectChange', item);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .bTree-container {
        /*width: 268px;*/
        padding: 16px;
    }
</style>