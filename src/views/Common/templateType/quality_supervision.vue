<template>
    <div class="quality_supervision-container">
        <div class="page">
            <div class="title-unit">六安市交通建设工程质量监督局</div>
            <div class="title-template">{{templateTitle}}</div>
            <Row>
                <i-col span="17">
                    <div class="item">
                        <span class="item-label">报送单位：</span>
                        <span> {{projectInfo.unitName}} </span>
                    </div>
                </i-col>
                <i-col span="7">
                    <div class="item">
                        <span class="item-label">收件日期：</span>
                        <span>{{projectInfo.insTime}}</span>
                    </div>
                </i-col>
            </Row>
            <div class="divider-line"></div>
            <Row>
                <i-col span="14">
                    <div class="item">
                        <span class="item-label">项目名称：</span>
                        <span style="display: inline-block; width: 210px;">
                            <span>{{projectInfo.projectName}}</span>
                        </span>
                    </div>
                </i-col>
                <i-col span="8">
                    <div class="item">
                        <span class="item-label">联系人/电话：</span>
                        <span>{{projectInfo.contacts}}-{{projectInfo.contactPhone}}</span>
                    </div>
                </i-col>
            </Row>
            <div class="divider-line"></div>

            <Row>
                <i-col span="24">
                    <div class="item">
                        <span class="item-label">材料明细：</span>
                    </div>
                </i-col>
            </Row>
            <vFileDetailLists :projectId="projectId"
                              isView
                              :templateType="templateType"></vFileDetailLists>
        </div>

        <div class="page">
            <Row>
                <i-col span="24">
                    <div class="item">
                        <span class="item-label">监督科办理情况：</span>
                    </div>
                    <i-col span="24">
                        <Input v-model="textObj.textarea_0"
                               type="textarea"
                               :rows="5"
                               :readonly="textObj.readonly_0"
                               :autosize="{minRows:5, maxRows: 5}" />
                    </i-col>
                    <i-col span="24">
                        <div class="form-item">
                            <label>签名：</label>
                            <div class="form-content">
                                <Input v-model="textObj.name_0" :readonly="textObj.readonly_0" />
                            </div>
                        </div>
                    </i-col>
                </i-col>
            </Row>

            <div class="divider-line"></div>

            <Row>
                <i-col span="24">
                    <div class="item">
                        <span class="item-label">分管领导意见：</span>
                    </div>
                </i-col>
                <i-col span="24">
                    <Input v-model="textObj.textarea_1"
                           type="textarea"
                           :rows="5"
                           :readonly="textObj.readonly_1"
                           :autosize="{minRows:5, maxRows: 5}"/>
                </i-col>
                <i-col span="24">
                    <div class="form-item">
                        <label>签名：</label>
                        <div class="form-content">
                            <Input v-model="textObj.name_1" :readonly="textObj.readonly_1"/>
                        </div>
                    </div>
                </i-col>
            </Row>

            <div class="divider-line"></div>

            <Row>
                <i-col span="24">
                    <div class="item">
                        <span class="item-label">领导批示：</span>
                    </div>
                </i-col>
                <i-col span="24">
                    <Input v-model="textObj.textarea_2"
                           type="textarea"
                           :rows="5"
                           :readonly="textObj.readonly_2"
                           :autosize="{minRows:5, maxRows: 5}" />
                </i-col>
                <i-col span="24">
                    <div class="form-item">
                        <label>签名：</label>
                        <div class="form-content">
                            <Input v-model="textObj.name_2" :readonly="textObj.readonly_2"/>
                        </div>
                    </div>
                </i-col>
            </Row>

            <div class="divider-line"></div>
        </div>

        <div v-for="item in auditContent[0].eSignature"
             class="signature-box"
             :style="{
                 transform: `translate(${item.x-50}px, ${item.y-50}px)`}">
            <img :src="joinUrl(item.url)" alt=""/>
        </div>

        <div class="stamp-layer" v-show="stampState">
            <img class="signature-img"
                 :src="joinUrl(eSignatureUrl)"
                 :alt="eSignatureName"
                 :style="{
                 transform: `translate(${offsetX-50}px, ${offsetY-50}px)`}">
        </div>
        <div class="stamp-layer-mouse"
             v-show="stampState"
             @mousemove="onMousemove($event)" @click="onClick_stamp"></div>
    </div>
</template>

<script>
    import vFileDetailLists from '../fileDetailLists/fileDetailLists';
    import Config from '../../../config';
    import MOMENT from 'moment';
    export default {
        name: 'quality_supervision',  // 质量监督申请处理标签
        components: {vFileDetailLists},
        props: {
            projectId: {
                type: String,
                default: ''
            },
            eSignatureUrl: {
                type: String,
                default: ''
            },
            eSignatureName: {
                type: String,
                default: ''
            },
            signatureId: {
                type: String,
                default: ''
            },
            userId: {
                type: String,
                default: ''
            },
            auditProcessId: {
                type: String,
                default: ''
            },
            processStepId: {
                type: String,
                default: ''
            },
            // 模板名称
            templateTitle: {
                type: String,
                default: '质量监督申请处理标签'
            },
            templateType: {
                type: String,
                default: 'quality_supervision'
            }
        },
        watch: {
            projectId(val) {
                if (val) {
                    this.getData();
                    this.getAuditContent();
                }
            },
            eSignatureUrl(val) {
                if (val !== '') {
                    this.stampState = true;
                }
                else {
                    this.stampState = false;
                }
            },
            processStepId(val) {},
            textObj: {
                deep: true,
                handler() {
                    this.auditContent[0].textarea_0 = this.textObj.textarea_0;
                    this.auditContent[0].textarea_1 = this.textObj.textarea_1;
                    this.auditContent[0].textarea_2 = this.textObj.textarea_2;
                    this.auditContent[0].name_0 = this.textObj.name_0;
                    this.auditContent[0].name_1 = this.textObj.name_1;
                    this.auditContent[0].name_2 = this.textObj.name_2;

                    this.auditInfo.auditContent = JSON.stringify(this.auditContent);

                    this.$emit('modal-eSignature', this.auditInfo);
                }
            }
        },
        data() {
            return {
                currentUserId: this.$store.state.user.userId,
                // 项目信息
                projectInfo: {
                    insTime: '',
                    unitName: '',
                    projectName: '',
                    buildUnitStr: '',
                    contacts: '',
                    contactPhone: '',
                    auditProcessId: '',
                    processStepId: ''
                },

                // 盖章计算
                stampState: false,
                offsetX: 0,
                offsetY: 0,

                // 审核信息 提交审核信息
                auditInfo: {
                    auditContent: '',
                    projectId: '',
                    auditProcessId: '',
                    processStepId: ''
                },

                auditContent: [{
                    textarea_0: '',
                    textarea_1: '',
                    textarea_2: '',
                    name_0: '',
                    name_1: '',
                    name_2: '',
                    eSignature: [
                        // {
                        //     processStepId: '',
                        //     userId: '',
                        //     signatureId: '',
                        //     url: '',
                        //     x: 0,
                        //     y: 0
                        // }
                    ]
                }],

                // 存放内容审核的内容
                textObj: {
                    textarea_0: '',
                    textarea_1: '',
                    textarea_2: '',
                    name_0: '',
                    name_1: '',
                    name_2: '',
                    readonly_0: false,
                    readonly_1: false,
                    readonly_2: false
                }
            };
        },
        methods: {
            // 拼接图片地址
            joinUrl(url) {
                return Config[Config.env].filePath + url;
            },

            // 获取项目详情
            getData() {
                this.$http({
                    method: 'get',
                    url: '/project/query',
                    params: {
                        projectId: this.projectId
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        Object.assign(this.projectInfo, res.data, {
                            insTime: res.data.insTime ? MOMENT(res.data.insTime).format('YYYY-MM-DD') : ''
                        });
                        this.auditInfo.projectId = res.data.projectId;
                        this.auditInfo.auditProcessId = res.data.auditProcessId;
                        this.auditInfo.processStepId = res.data.processStepId;
                    }
                })
            },


            // 获取审核内容信息
            getAuditContent() {
                this.$http({
                    method: 'get',
                    url: '/projectAudit/getAuditContent',
                    params: {
                        projectId: this.projectId
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {

                         if (res.data.auditContent) {
                             try {
                                 this.auditContent = eval(res.data.auditContent);

                                 this.textObj.textarea_0 = this.auditContent[0].textarea_0;
                                 this.textObj.textarea_1 = this.auditContent[0].textarea_1;
                                 this.textObj.textarea_2 = this.auditContent[0].textarea_2;
                                 this.textObj.name_0 = this.auditContent[0].name_0;
                                 this.textObj.name_1 = this.auditContent[0].name_1;
                                 this.textObj.name_2 = this.auditContent[0].name_2;
                                 this.textObj.readonly_0 = !(this.textObj.textarea_0 === '');
                                 this.textObj.readonly_1 = !(this.textObj.textarea_1 === '');
                                 this.textObj.readonly_2 = !(this.textObj.textarea_2 === '');
                             }
                             catch (e) {

                             }
                         }
                    }
                })
            },

            onMousemove(e) {
                if (this.stampState) {
                    this.offsetX = e.offsetX;
                    this.offsetY = e.offsetY;
                }
            },
            onClick_stamp() {
                let ifExits = false;
                this.auditContent[0].eSignature.forEach((v) => {
                    if (v.signatureId === this.signatureId && v.processStepId === this.processStepId) {
                        ifExits = true;
                        v.x = this.offsetX;
                        v.y = this.offsetY;
                    }
                });
                if (!ifExits) {
                    this.auditContent[0].eSignature.push({
                        processStepId: this.processStepId,
                        userId: this.userId,
                        signatureId: this.signatureId,
                        url: this.eSignatureUrl,
                        x: this.offsetX,
                        y: this.offsetY
                    })
                }
                this.stampState = false;

                this.auditContent[0].textarea_0 = this.textObj.textarea_0;
                this.auditContent[0].textarea_1 = this.textObj.textarea_1;
                this.auditContent[0].textarea_2 = this.textObj.textarea_2;
                this.auditContent[0].name_0 = this.textObj.name_0;
                this.auditContent[0].name_1 = this.textObj.name_1;
                this.auditContent[0].name_2 = this.textObj.name_2;

                this.auditInfo.auditContent = JSON.stringify(this.auditContent);

                this.$emit('modal-eSignature', this.auditInfo);
            }
        }
    }
</script>

<style lang="scss" scoped>
    $color: #b52b19;

    .quality_supervision-container {
        position: relative;
        width: 595.28px;
        .page {
            padding: 30px;
            width: 595.28px;
            height: 841.89px;
        }

        .signature-box {
            position: absolute;
            z-index: 10;
            top: 0;
            left: 0;
            width: 100px;
            height: 100px;
            img {
                width: 100px;
                height: 100px;
                border-image: none;
                border: none;
            }
        }

        .stamp-layer{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 100;
            background-color: rgba(33,33,33,0.2);
            overflow: hidden;
            .signature-img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100px;
                height: 100px;
                box-shadow:3px 3px 5px #7d7d7d;
                transition: all 0.05s;
            }
        }
        .stamp-layer-mouse {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 101;
            cursor: url("./images/cursor-stamp.png"), pointer;
        }


        .divider-line {
            height: 0;
            border-top: 2px solid $color;
        }
        .title-unit {
            padding-bottom: 12px;
            color: $color;
            font-size: 16px;
            text-align: center;
        }
        .title-template {
            color: $color;
            font-size: 26px;
            font-weight: 700;
            text-align: center;
            letter-spacing: 4px;
        }

        .item{
            padding-top: 20px;
            .item-label {
                color: $color;
                font-size: 16px;
                letter-spacing: 2px;
            }
        }

        .form-item {
            padding: 10px 0 20px;
            text-align: right;
            vertical-align: middle;
            label {
                color: $color;
                font-size: 14px;
                line-height: 32px;
            }
            .form-content {
                display: inline-block;
            }
        }
    }
</style>

<style lang="scss">

    .quality_supervision-container{
        .form-item {
            .form-content {
                .ivu-input {
                    border: none;
                }
            }
        }
    }
</style>