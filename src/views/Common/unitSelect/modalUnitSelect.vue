<template>
    <div class="modalUnitSelect-container">

        <Modal v-model="modalValue"
               title="单位选择"
               :width="1200"
               :z-index="zIndex"
               footer-hide>
            <vUnitSelect :multiple="multiple"
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
        data() {
            return {};
        }
    }
</script>

<style lang="scss" scoped>
    .modalUnitSelect-container {
    }
</style>