<template>
    <div class="modalEmployeeSelect-container">
        <Modal v-model="modalValue"
               title="选择人员"
               :width="900"

               footer-hide>
            <vEmployeeSelect :multiple="multiple"
                             :userSourceType="userSourceType"
                             :unitId="unitId"
                             :selectedValue="selectedValue"
                             :filterSelected="filterSelected"
                             @handleSelect="selectedPerson"></vEmployeeSelect>
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
        props: {
            // all、hasUnit、noUnit
            userSourceType: {
                type: String,
                default: 'all'
            },
            unitId: {
                type: String,
                default: ''
            },
            multiple: {
                type: Boolean,
                default: false
            },
            zIndex: {
                type: Number,
                default: 1000
            },
            selectedValue: {
                type: Array,
                default() {
                    return [];
                }
            },
            // 过滤已选的值
            filterSelected: {
                type: Boolean,
                default: false
            }

        },
        data() {
            return { };
        },
        methods: {
            selectedPerson(selectValue, selectItems) {
                if (selectValue) {
                    this.$emit('modal-callback', selectValue, selectItems);
                }
                // this.onVisibleChange(false);
                this.modalValue = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modalEmployeeSelect-container {
    }
</style>