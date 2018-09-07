<template>
  <div id="app">
     <router-view/>
  </div>
</template>

<script>
    import { mapMutations, mapActions } from 'vuex'
    export default {
        name: 'sixApp',
        data() {
            return {};
        },
        mounted() {
            let that = this;
            window.onresize = function (e) {
                that.onresize(e);
            }
        },
        methods: {
            ...mapMutations([
                'onresize'
            ])
        }
    }
</script>

<style>
#app {
    width: 100%;
    height: 100%;
}
</style>
