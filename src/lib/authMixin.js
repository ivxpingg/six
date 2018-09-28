export default {
    data() {
        return {
            auth: this.$store.state.app.auth[this.$route.name]
        }
    },
    computed: {
        auth_add() {
            return this.auth.length === 0 ? false : (this.auth.indexOf('all') > -1 || this.auth.indexOf('add') > -1);
        },
        auth_update() {
            return this.auth.length === 0 ? false : (this.auth.indexOf('all') > -1 || this.auth.indexOf('update') > -1);
        },
        auth_del() {
            return this.auth.length === 0 ? false : (this.auth.indexOf('all') > -1 || this.auth.indexOf('del') > -1);
        }
    }
}