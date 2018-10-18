<template>
    <div class="modalUnitSelect-container">

        <Modal v-model="modalValue"
               title="单位选择"
               :width="1200"
               footer-hide>
            <vUnitSelect :multiple="multiple"
                         :unitType="unitType"
                         :selectedValue="selectedValue"
                         :filterSelected="filterSelected"
                         @handleSelect="selectedPerson"></vUnitSelect>
        </Modal>

    </div>
</template>

<script>
    import modalMixin from '../../../lib/mixin/modalMixin';
    import vUnitSelect from '../unitSelect/unitSelect';
    export default {
        name: 'modalUnitSelect',
        mixins: [modalMixin],
        components: {vUnitSelect},
        props: {
            unitType: {
                type: String,
                default: ''
            },
            multiple: {
                type: Boolean,
                default: false
            },
            selectedValue: {
                type: Array,
                default() {
                    return [];
                }
            },
            // 是否过滤已选的值
            filterSelected: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {

            };
        },
        methods: {
            selectedPerson(selectValue, selectItems) {
                if (selectValue) {
                    this.$emit('modal-callback', selectValue, selectItems);
                }
                this.modalValue = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modalUnitSelect-container {
    }
</style>