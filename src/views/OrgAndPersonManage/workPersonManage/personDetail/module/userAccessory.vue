<template>
    <div class="vUnitAccessory-container">
        <Row :gutter="10">
            <template v-for="(item, idx) in list">
                <i-col span="4" :key="`thumb-${idx}`">
                    <vThumb :src="item.src" :title="item.title"></vThumb>
                </i-col>
            </template>
        </Row>
    </div>
</template>

<script>
    import vThumb from '../../../../Common/thumb/thumb';
    export default {
        name: 'vUnitAccessory',
        components: {vThumb},
        props: {
            userId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                list: []
            };
        },
        watch: {
            userId: {
                immediate: true,
                handler(val) {
                    if (val) {
                        this.getAccessory();
                    }
                }
            }
        },
        mounted() {},
        methods: {
            getAccessory() {
                this.$http({
                    method: 'get',
                    url: '/getUnitAccessory',
                    params: {
                        userId: this.userId
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        this.list = res.data;
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .vUnitAccessory-container {
    }
</style>