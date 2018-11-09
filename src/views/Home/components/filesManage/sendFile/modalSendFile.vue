<template>
    <div class="modalSendFile-container">
        <Modal v-model="modalValue" title="发送文件">
            <Form :model="formData" :rules="rules" :label-width="80">
                <FormItem>

                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import modalMixin from '../../../../../lib/mixin/modalMixin';
    import uploadMixin from '../../../../../lib/mixin/uploadMixin';
    export default {
        name: 'modalSendFile',
        mixins: [modalMixin, uploadMixin],
        data() {
            return {
                formData: {

                },
                rules: {}
            };
        }
    }
</script>

<style lang="scss" scoped>
    .modalSendFile-container {
    }
</style>