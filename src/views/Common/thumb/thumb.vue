<template>
    <div class="thumb-container">
        <div class="img-box"
             @click="showModal"
             :style="{ backgroundImage: `url(${src})`, height: `${height}px` }">
        </div>
        <p v-show="title!== ''" class="title">{{title}}</p>

        <Modal class="thumb-modal"
               v-model="modalShow"
               :width="800"
               :title="title">
            <div style="text-align: center">
                <img class="img" :src="src" alt="">
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: 'thumb',
        props: {
            src: {
                type: String,
                default: () => {return '';}
            },
            title: {
                type: String,
                default: () => {return '';}
            },
            height: {
                type: Number,
                default: 100
            }
        },
        data() {
            return {
                modalShow: false,
            };
        },
        methods: {
            showModal() {
                this.modalShow = true;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .thumb-container {
        .img-box {
            overflow: hidden;
            cursor: pointer;
            height: 100px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }

        .title {
            text-align: center;
        }
    }

    .thumb-modal {
        .img {
            max-width: 100%;
        }
    }
</style>