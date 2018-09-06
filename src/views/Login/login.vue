<template>
    <div class="login-container">
        <div class="login-container-inner">
            <header class="login-header"></header>
            <div class="login-body"></div>
            <footer class="login-footer"></footer>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'user',
        data() {
            return {};
        }
    }
</script>

<style lang="scss" scoped>
    .login-container {
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        .login-container-inner {
            min-height: 100%;

            .login-header {}
            .login-body {}
            .login-footer {}
        }
    }
</style>