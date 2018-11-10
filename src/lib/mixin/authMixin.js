export default {
    data() {
        return {
            auth: this.$store.state.app.auth[this.$route.name]
        }
    },
    computed: {
        // start 首页权限设置
        auth_home_count() {
            return this.auth.length === 0 ? false : (this.auth.indexOf('all') > -1 || this.auth.indexOf('count') > -1);
        },
        auth_home_supervisionCount() {
            return this.auth.length === 0 ? false : (this.auth.indexOf('all') > -1 || this.auth.indexOf('supervisionCount') > -1);
        },
        auth_home_projectPanel() {
            return this.auth.length === 0 ? false : (this.auth.indexOf('all') > -1 || this.auth.indexOf('projectPanel') > -1);
        },
        auth_home_other() {
            return this.auth.length === 0 ? false : (this.auth.indexOf('all') > -1 || this.auth.indexOf('other') > -1);
        },
        // end 首页权限设置

        // 添加权限
        auth_add() {
            return this.auth.length === 0 ? false : (this.auth.indexOf('all') > -1 || this.auth.indexOf('add') > -1);
        },
        // 更新权限
        auth_update() {
            return this.auth.length === 0 ? false : (this.auth.indexOf('all') > -1 || this.auth.indexOf('update') > -1);
        },
        // 删除权限
        auth_del() {
            return this.auth.length === 0 ? false : (this.auth.indexOf('all') > -1 || this.auth.indexOf('del') > -1);
        },
        // 审核权限
        auth_audit() {
            return this.auth.length === 0 ? false : (this.auth.indexOf('all') > -1 || this.auth.indexOf('audit') > -1);
        }
    }
}