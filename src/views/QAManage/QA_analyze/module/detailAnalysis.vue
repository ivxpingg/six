<template>
    <div class="detailAnalysis-container">
        <div class="ivx-table-box">
            <Table border
                   :height="540"
                   :loading="tableLoading"
                   :columns="tableColumns"
                   :data="tableData"></Table>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'detailAnalysis',
        props: {
            projectName: {
                type: String,
                default: ''
            },
            year: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                tableColumns: [
                    { title: '单位工程', align: 'center', key: 'itemClassify' },
                    { title: '分部工程类别', align: 'center', key: 'secondItemClassify' },
                    { title: '抽查项目', align: 'center', key: 'itemTYpe' },
                    { title: '抽检数量', align: 'center', key: 'num' },
                    { title: '合格数量', align: 'center', key: 'passNum' },
                    { title: '合格率', align: 'center', key: 'passRate' }
                ],
                tableData: [],
                tableLoading: false
            };
        },
        watch: {
            projectName: {
                immediate: true,
                handler(val) {
                    if (val !== '') {
                        this.getData();
                    }
                }
            },
            year(val) {
                if (this.projectName !== '') {
                    this.getData();
                }
            }
        },
        methods: {
            getData() {
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/dataAnalysis/dataDetail',
                    data: JSON.stringify({
                        projectName: this.projectName,
                        year: this.year
                    })
                }).then(res => {
                    this.tableLoading = false;

                    if(res.code === 'SUCCESS') {
                        this.tableData = res.data || [];
                    }
                }).catch(error => {
                    this.tableLoading = false;
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .detailAnalysis-container {
    }
</style>