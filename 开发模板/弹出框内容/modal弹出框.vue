<template>
    <div class="modal弹出框-container">

        <!--处理标签审核-->
        <Modal v-model="modal_"
               title="处理标签审核"
               :width="1000"
               footer-hide>
            <div class="six-modal-body-inner"
                 @modal_callback="modal_callback_noticeModification"></div>
        </Modal>


        <div >
            <div class="ivu-modal-footer">
                <Button type="primary"
                        size="large"
                        @click="save">保存</Button>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'modal弹出框',
        data() {
            return {};
        }
    }
</script>

<style lang="scss" scoped>
    .modal弹出框-container {
    }
</style>