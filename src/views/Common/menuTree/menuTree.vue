<template>
    <div class="menuTree-container">
        <Tree ref="tree"
              :data="treeMenuData"
              show-checkbox
              @on-check-change="onCheck_Change"></Tree>

    </div>
</template>

<script>
    export default {
        name: 'menuTree',
        props: {
            checkedNodes: {
                type: Array,
                default: () => {
                    return [];
                }
            }
        },
        data() {
            return {
                menuData: [],
                treeMenuData: []
            };
        },
        watch: {
            menuData(val) {
                let list = [];
                if (val.length > 0) {
                    list = this.transformTreeData(val, false);
                }
                this.treeMenuData = list;
            },
            checkedNodes(val) {
                this.$refs.tree.flatState.forEach((data) => {
                    this.$set(data.node, 'checked', false);
                    this.$set(data.node, 'indeterminate', false);
                    if (!data.node.children || data.node.children.length === 0 ) {
                        this.checkedNodes.forEach((node) => {
                            if (data.node.menuId === node.menuId) {
                                this.$set(data.node, 'checked', true);
                            }
                        });
                    }
                });
            }
        },
        mounted() {
            this.getMenuData();
        },
        methods: {
            getMenuData() {
                this.$http({
                    method: 'post',
                    url: '/menu/list'
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.menuData = res.data;
                    }
                })
            },
            transformTreeData(children, expand) {
                let attr = [];
                children.forEach((val) => {
                    let item = {};
                    Object.assign(item, val);
                    item.title = item.menuName;
                    item.expand = expand;
                    item.children = [];
                    item.selected = false;
                    item.checked = false;
                    // item.render = this.render;
                    attr.push(item);
                    if (val.children) {
                        item.children = this.transformTreeData(val.children, false);
                    }
                });
                return attr;
            },

            onCheck_Change(item) {
                this.$emit('onCheckChange');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .menuTree-container {
    }
</style>