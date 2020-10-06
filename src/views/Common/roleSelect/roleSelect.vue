<template>
    <div class="roleSelect-container">
        <vBTree ref="btree" @onSelectChange="onSelectChange"></vBTree>

        <div class="ivu-modal-footer">
            <Button type="primary"
                    size="large"
                    @click="save">确定</Button>
        </div>
    </div>
</template>

<script>
    import vBTree from '../../BaseManage/organizetionManage/bTree/bTree';
    export default {
        name: 'roleSelect',
        components: {
            vBTree
        },
        data() {
            return {
                // nodeItem: { // 当前选中节点 角色分组节点数据
                //     roleId: '',
                //     parentId: '',
                //     roleNo: '',
                //     name: '',
                //     remark: '',
                //     nodeType: '',
                //     sort: 0,
                // }

                nodeItem: []
            };
        },
        methods: {
            onSelectChange(item) {
                this.nodeItem = item;
            },
            save() {
                this.$emit('onSelectRole', this.nodeItem);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .roleSelect-container {
        margin-bottom: 61px;
        height: 400px;
        overflow-y: auto;
        .ivu-modal-footer {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }
</style>