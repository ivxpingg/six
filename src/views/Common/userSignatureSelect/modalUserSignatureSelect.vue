<template>
    <div class="modalUserSignatureSelect-container">
        <Modal v-model="modalValue"
               title="电子签名选择"
               :width="600"
               footer-hide>
            <div class="img-list">
                <img v-for="item in objData"
                     :src="item.url"
                     :alt="item.name" @click="onclick(item)" />
            </div>
        </Modal>
    </div>
</template>

<script>
    import modalMixin from '../../../lib/mixin/modalMixin';
    import Config from '../../../config';
    export default {
        name: 'modalUserSignatureSelect',
        mixins: [modalMixin],
        data() {
            return {
                data: []
            };
        },
        computed: {
            objData() {
                return this.data.map((v) => {
                    return Object.assign({}, v, {url: v.url});
                });
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                this.$http({
                    method: 'get',
                    url: '/signature/userSignatureList'
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.data = res.data || [];
                    }
                })
            },

            // 获取签名
            getSignature() {
                if (this.objData.length === 1) {
                    this.$emit('modal-callback', this.objData[0]);
                }
                else {
                    this.modalValue = true;
                }
            },
            onclick(item) {
                this.$emit('modal-callback', item);
                this.modalValue = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modalUserSignatureSelect-container {

    }

    .img-list {
        min-height: 150px;
        img {
            display: inline-block;
            margin: 20px;
            width: 100px;
            height: 100px;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
                margin: 10px;
                width: 120px;
                height: 120px;
            }
        }
    }
</style>