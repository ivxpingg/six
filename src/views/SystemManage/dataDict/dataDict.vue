<template>
    <div class="dataDict-container ivu-card ivu-card-bordered ivu-card-dis-hover">
        <div class="left-panel">
            <Card :bordered="false" dis-hover>
                <vIvxFilterBox>
                    <Form inline>
                        <FormItem>
                            <Input v-model="filterValue" placeholder="检索" style="width: 125px;">
                                <Icon type="ios-search" slot="suffix" />
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Select v-model="filterType" style="width: 120px" transfer>
                                <Option value="all">全部</Option>
                                <Option v-for="item in dictTypeList" :value="item.type" :key="item.type">{{item.description}}</Option>
                            </Select>
                        </FormItem>
                    </Form>
                </vIvxFilterBox>

                <ul class="ul-dict-list ivu-transfer-list-content" ref="dict_list">
                    <template v-for="(item, idx) in dictList_dom">
                        <li class="ivu-transfer-list-content-item"
                            :class="{'active': currentItem.id === item.id}"
                            @click="onClick_dict(item)"
                            :key="`dict_${item.id}`">{{item.label}}</li>
                    </template>
                </ul>
            </Card>

        </div>
        <div class="right-panel">
            <Card :bordered="false" dis-hover>
                <vIvxFilterBox>
                    <Button type="primary" @click="modal_addDict_click">添加字典</Button>
                    <Button type="primary" :disabled="currentItem.id === ''" @click="delDict_click">删除字典</Button>
                </vIvxFilterBox>
                <vEditDict v-show="currentItem.id !== ''" :did="currentItem.id"
                           @editDict_callback="editDict_callback"
                           style="padding-top: 10px; width: 300px"></vEditDict>
            </Card>
        </div>

        <Modal v-model="modal_addDict"
               title="添加字典"
               draggable
               ok-text="保存"
               @on-ok="addDict_click"
               :width="400">
            <Form ref="formAdd"
                  :model="format_dict"
                  :rules="rules"
                  :label-width="55">
                <FormItem label="类型:" prop="type">
                    <Input v-model="format_dict.type" placeholder="字典类型" />
                </FormItem>
                <FormItem label="描述:" prop="description">
                    <Input v-model="format_dict.description" placeholder="描述" />
                </FormItem>
                <FormItem label="键值:" prop="label">
                    <Input v-model="format_dict.label" placeholder="键值" />
                </FormItem>
                <FormItem label="值:" prop="value">
                    <Input v-model="format_dict.value" placeholder="值" />
                </FormItem>
                <FormItem label="排序:" prop="sort">
                    <Input v-model="format_dict.sort" number placeholder="排序，如：1，2，3" />
                </FormItem>
            </Form>
        </Modal>

    </div>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    import vEditDict from './editDict/editDict';
    export default {
        name: 'dataDict',
        components: {vIvxFilterBox, vEditDict},
        data() {
            return {
                searchParams: {
                    current: 1,        // 当前第几页
                    size: 100000,          // 每页几行
                    total: 0,          // 总行数
                    searchKey: ''      // 模糊查询参数
                },
                dictList: [],
                filterValue: '',
                filterType: 'all',
                currentItem: {
                    id: '',
                    type: '',         // 类型
                    description: '',  // 描述
                    label: '',        // 键值
                    value: '',        // 字典值
                    sort: 0
                },
                rules: {
                    description: [{ required: true, message: '描述不能为空！', trigger: 'blur' }],
                    type: [{ required: true, message: '类型不能为空！', trigger: 'blur' }],
                    label: [{ required: true, message: '键值不能为空！', trigger: 'blur' }],
                    value: [{ required: true, message: '值不能为空！', trigger: 'blur' }],
                    sort: [{ required: true, type: 'number', message: '排序不能为空！', trigger: 'blur' }],
                },

                // 添加字典
                modal_addDict: false,
                format_dict: {
                    type: '',
                    description: '',
                    label: '',
                    value: '',
                    sort: 0
                }
            };
        },
        computed: {
            dictTypeList() {
                let dictType = [];
                let types = {};
                this.dictList.forEach((val) => {
                    if (!types[val.type]) {
                        types[val.type] = val.type;
                        dictType.push({
                            type: val.type,
                            description: val.description
                        });
                    }
                });
                return dictType;
            },
            dictList_dom() {
                let list = [];
                this.dictList.forEach((val) => {
                    if ((val.label.indexOf(this.filterValue.trim()) > -1
                        || val.description.indexOf(this.filterValue.trim()) > -1
                        || val.type.indexOf(this.filterValue.trim()) > -1)
                        && (this.filterType === 'all' || val.type === this.filterType.trim())) {
                        list.push(val);
                    }
                });

                return list;
            }
        },
        watch: {

        },
        mounted() {
            this.getDictList();
        },
        methods: {
            getDictList() {
                this.$http({
                    method: 'post',
                    url: '/dict/list',
                    data: JSON.stringify(this.searchParams)
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.dictList = res.data.page.records || [];
                    }
                })
            },

            onClick_dict(item) {
                Object.assign(this.currentItem, item);
            },

            modal_addDict_click() {
                this.modal_addDict = true;
            },
            editDict_callback() {
                this.getDictList();
            },
            addDict_click() {
                this.$refs.formAdd.validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/dict/add',
                            data: JSON.stringify(this.format_dict)
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '添加成功！'
                                });
                                this.getDictList();
                            }
                        })
                    }
                })
            },

            delDict_click() {
                this.$Modal.confirm({
                   title: '删除字典',
                    content: `确定要删除<${this.currentItem.label}>?`,
                    onOk: () => {
                        this.$http({
                            method: 'get',
                            url: '/dict/delete',
                            params: {
                                id: this.currentItem.id
                            }
                        }).then(res => {
                            if(res.code === 'SUCCESS') {
                                this.$Message.success({
                                    content: '删除成功！'
                                });
                                this.getDictList();
                            }
                        })
                    }
                });

            }
        }
    }
</script>

<style lang="scss" scoped>
    .dataDict-container {
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

        .ul-dict-list {
            position: absolute;
            padding: 0 12px;
            top: 60px;
            left: 0;
            right: 0;
            bottom: 0;
            min-height: 640px;
            overflow-y: auto;
            .ivu-transfer-list-content-item {
                margin-bottom: 4px;
                border-radius: 4px;
                &.active {
                    color: #FFF;
                    background-color: #2d8cf0;
                }
            }
        }
    }
</style>