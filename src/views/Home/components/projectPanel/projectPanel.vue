<template>
    <Card shadow>
        <p slot="title">
            <!--<Icon type="ios-notifications" />-->
            在建项目一览
        </p>
        <div class="card-content">
            <Tabs v-model="tabsValue">
                <TabPane name="highway" label="公路">
                    <Table :columns="tableColumns" :data="tableData_highway" :height="234"></Table>
                </TabPane>
                <TabPane name="waterway" label="水路">
                    <Table :columns="tableColumns" :data="tableData_highway" :height="234"></Table>
                </TabPane>
            </Tabs>
        </div>
    </Card>
</template>
<script>
    export default {
        name: 'projectPanel',
        data() {
            return {
                tabsValue: 'highway',
                tableColumns: [
                    {
                        type: 'index',
                        title: '排名',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '项目',
                        key: 'name',
                        width: 150,
                        align: 'center',
                    },
                    {
                        title: '进度',
                        align: 'center',
                        render(h, params) {
                        // <Progress :percent="25" />
                            return h('Progress', {
                                props: {
                                    percent: params.row.progress
                                }
                            });
                        }
                    }

                ],
                tableData_highway: [
                    {
                        name: 'G237六安北互通至农科院段改建工程',
                        progress: 35,
                        linkPreWeek: '10%'
                    },
                    {
                        name: '金安区乡级畅通Y006孙范路改建工程',
                        progress: 55,
                        linkPreWeek: '10%'
                    },
                    {
                        name: '金安区乡级畅通二黄路（先生店－孙岗）改建工程',
                        progress: 15,
                        linkPreWeek: '10%'
                    },
                    {
                        name: '霍山县黄家畈大桥水毁加固改造工程',
                        progress: 80,
                        linkPreWeek: '10%'
                    },
                    {
                        name: 'KJ.144   裕安区乡级公路畅通工程韩摆渡棉场至城南渡槽公路改建工程',
                        progress: 70,
                        linkPreWeek: '10%'
                    },
                    {
                        name: '金寨县乡级公路畅通工程（吴家店-花石乡公路、S210-桃岭-槐树湾公路、马店-九曲岭）',
                        progress: 33,
                        linkPreWeek: '10%'
                    },
                ],
                tableData_waterway: [],
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>