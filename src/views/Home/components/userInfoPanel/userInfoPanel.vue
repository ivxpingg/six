<template>
    <Card shadow>
        <p slot="title">
            <Icon type="md-person" />
            个人信息
        </p>
        <a href="#" slot="extra">
            <Icon type="ios-create-outline" />
            编辑
        </a>
        <div class="card-content">

        </div>
    </Card>
</template>
<script>
    export default {
        name: 'userInfoPanel',
        data() {
            return {}
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>