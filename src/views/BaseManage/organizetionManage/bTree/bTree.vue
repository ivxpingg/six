<template>
    <div class="bTree-container ivu-card ivu-card-dis-hover" :bordered="false">
        <vIvxFilterBox>
            <Form>
                <FormItem>
                    <Input placeholder="检索组织结构">
                        <Icon type="ios-search" slot="suffix" />
                    </Input>
                </FormItem>
            </Form>
        </vIvxFilterBox>
        <div class="tree-box">
            <Tree :data="groupTreeData"
                  :load-data="loadData"
                  @on-select-change="onSelectChange"></Tree>
        </div>
    </div>
</template>

<script>
    import vIvxFilterBox from '../../../../components/ivxFilterBox/ivxFilterBox';
    export default {
        name: 'bTree',
        components: {vIvxFilterBox},
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
                    list = this.transformTreeData(val);
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
                    url: '/roleGroup/list'
                }).then(res => {
                    if (res.code === 'SUCCESS'){
                        this.menuList = res.data;
                    }
                });
            },
            transformTreeData(children) {
                let attr = [];
                children.forEach((val) => {
                    let item = {};
                    Object.assign(item, val);
                    item.title = item.roleGroupName;
                    item.expand = false;
                    item.loading = false;
                    item.children = [];
                    attr.push(item);
                    if (val.children) {

                        item.children = this.transformTreeData(val.children);
                    }
                });
                return attr;
            },

            loadData(item, callback) {
                this.$http({
                    method: 'get',
                    url: '/role/list',
                    params: {
                        roleGroupId: item.roleGroupId
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS'){
                        this.transform_loadData(res.data, callback);
                    }
                });
            },
            transform_loadData(data, callback) {
                data.forEach((val) => {
                   val.title = val.name;
                });

                callback(data);
            },

            onSelectChange(item) {
               this.$emit('onSelectChange', item);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .bTree-container {
        width: 268px;
        padding: 16px;
    }
</style>