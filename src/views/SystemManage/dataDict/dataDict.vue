<template>
    <Card class="dataDict-container">
        <div class="dataDict-container-inner">
            <div class="left-panel">
                <vIvxFilterBox>
                    <Form>
                        <FormItem>
                            <Input placeholder="检索" style="width: auto">
                                <Icon type="ios-search" slot="suffix" />
                            </Input>
                        </FormItem>
                    </Form>
                </vIvxFilterBox>

            </div>
            <div class="right-panel">
                <vIvxFilterBox>
                    <Button type="primary">添加字典</Button>
                </vIvxFilterBox>
            </div>
        </div>
    </Card>
</template>

<script>
    import vIvxFilterBox from '../../../components/ivxFilterBox/ivxFilterBox';
    export default {
        name: 'dataDict',
        components: {vIvxFilterBox},
        data() {
            return {
                dictList: []
            };
        },
        mounted() {
            this.getDictList();
        },
        methods: {
            getDictList() {
                this.$http({
                    method: 'post',
                    url: '/dict/list'
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        this.dictList = res.data.page.records;
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dataDict-container{
        .dataDict-container-inner {
            display: flex;
            height: 700px;
            .left-panel {
                width: 300px;
                height: 100%;
                min-height: 600px;
                /*border-right: 1px solid #dcdee2;*/
            }
            .right-panel {
                flex: 1;
            }
        }
    }
</style>