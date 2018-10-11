<template>
    <div class="modalEmployeeSelect-container">
        <Modal v-model="modalValue"
               title="选择人员"
               :width="1200"
               footer-hide>
            <vEmployeeSelect :multiple="multiple" @handleSelect="selectedPerson"></vEmployeeSelect>
        </Modal>
    </div>

</template>

<script>
    import modalMixin from '../../../lib/mixin/modalMixin';
    import vEmployeeSelect from '../employeeSelect/employeeSelect';
    export default {
        name: 'modalEmployeeSelect',
        mixins: [modalMixin],
        components: {vEmployeeSelect},
        data() {
            return {
                multiple: false
            };
        },
        methods: {
            selectedPerson(selectValue, selectItems) {
                if (this.selectValue) {
                    this.$emit('modal-callback', selectValue, selectItems);
                }
                this.onVisibleChange(false);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modalEmployeeSelect-container {
    }
</style>