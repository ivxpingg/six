<template>
    <div class="projectFiles_0-container">
        <ul class="folder-list">
            <li v-for="(item, idx) in folderList" :key="idx">
                <vIvxFolder :title="item.folderName"
                            :size="folderSize"
                            :fontSize="fontSize"
                            :data="item"
                            :count="item.selectedFileList.length"
                            type="success"
                            :rows="3" @on-select="onSelectFolder"></vIvxFolder>
            </li>
        </ul>
    </div>
</template>

<script>
    import vIvxFolder from '../../../../../components/folder/folder';
    export default {
        name: 'projectFiles_0',   // 监督受理材料
        components: {vIvxFolder},
        props: {
            folderList: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            return {
                folderSize: 98,
                fontSize: 12
            };
        },
        methods: {
            onSelectFolder(item) {
                this.$emit('callback', item);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .projectFiles_0-container {
        .folder-list {
            overflow: hidden;
            li {
                float: left;
                margin: 15px;
            }
        }
    }
</style>