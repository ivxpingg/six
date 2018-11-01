<template>
    <div class="modalAuditProcessSelect-container">
        <Modal v-model="modalValue"
               :title="title"
               :width="894"
               footer-hide>
            <vAuditProcessSelect
                             @handleSelect="onSelected"></vAuditProcessSelect>
        </Modal>
    </div>
</template>

<script>
    import modalMixin from '../../../lib/mixin/modalMixin';
    import vAuditProcessSelect from './auditProcessSelect';
    export default {
        name: 'modalAuditProcessSelect',
        mixins: [modalMixin],
        components: {vAuditProcessSelect},
        props: {
            title: {
                type: String,
                default() {
                    return '选择流程';
                }
            }
        },
        data() {
            return {};
        },
        methods: {
            onSelected(selectValue, selectItems) {
                if (selectValue) {
                    this.$emit('modal-callback', selectValue, selectItems);
                }
                this.modalValue = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modalAuditProcessSelect-container {
    }
</style>