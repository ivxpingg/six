<template>
    <div class="folder-container"
         @click="onSelect"
         @mouseover="onMouseOver"
         @mouseleave="onMouseLeave">
        <Icon :type="type"
              class="folder-icon"
              :size="size"/>
        <p class="title" v-show="title!== ''">{{title}}</p>
    </div>
</template>

<script>
    export default {
        name: 'folder',
        props: {
            size: {
                type: Number,
                default: 64,
            },
            title: {
                type: String,
                default: ''
            },
            list: {
                type: Array,
                default: () => {
                    return [];
                }
            }
        },
        data() {
            return {
                type: 'ios-folder'
            };
        },
        methods: {
            onSelect() {
                this.$emit('on-select', this.title, this.list);
            },
            onMouseOver() {
                this.type = 'ios-folder-open';
            },
            onMouseLeave() {
                this.type = 'ios-folder';
            }
        }
    }
</script>

<style lang="scss" scoped>
    .folder-container {
        text-align: center;
        cursor: pointer;
        .folder-icon {
            color: rgba(244, 158, 34, 0.7);
            &:hover {
                color: rgba(244, 158, 34, 1);
            }
        }
        .title {

        }
    }
</style>