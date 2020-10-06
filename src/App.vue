<template>
  <div id="myApp">
      <router-view></router-view>
  </div>
</template>

<script>
    import { mapMutations, mapActions } from 'vuex'
    export default {
        name: 'sixApp',
        data() {
            return {};
        },
        created() {
            this.getMenuList();
        },
        mounted() {
            let that = this;
            window.onresize = function (e) {
                that.onresize(e);
            }
            // this.getMenuList();
        },
        methods: {
            ...mapMutations([
                'onresize'
            ]),
            ...mapActions([
                'getMenuList'
            ])
        }
    }
</script>

<style>
#myApp {
    width: 100%;
    height: 100%;
}
</style>
