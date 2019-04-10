<template>
    <div class="template_word_file_0-container">
        <div :class="classNamePri">
            <div v-for="(item, idx) in temData.stamp"
                 class="signature-box"
                 :key="item.userId + idx"
                 :style="{
                 transform: `translate(${item.offsetX * scale - 50}px, ${item.offsetY * scale -50}px)`}">
                <img :src="joinUrl(item.url)" alt=""/>
            </div>

            <!--盖章图层-->
            <div class="stamp-layer"  v-show="stampState">
                <img class="signature-img"
                     :src="joinUrl(eSignature.url)"
                     :alt="eSignature.name"
                     :style="{
                 transform: `translate(${offsetX * scale -50}px, ${offsetY * scale -50}px)`}">
            </div>
            <div class="stamp-layer-mouse"
                 v-show="stampState"
                 @mousemove="onMousemove($event)" @click="onClick_stamp"></div>

            <!--第一页-->
            <div class="page">
                <h1>公路工程质量监督管理受理通知书</h1>
                <div class="text-16 text-align-right line-height-28 m-t-10" >
                    编号：
                    <vInputSpan v-model="temData.page_1.value_1" :scale="scale"></vInputSpan>
                </div>
                <div class="box-bottom">
                    <div class="text-18 letter-spacing-2 m-b-30">工程名称：
                        <vInputSpan v-model="temData.page_1.value_2" display="inline-block" :scale="scale" :width="320" :inputWidth="320"></vInputSpan>
                    </div>
                    <div class="text-18 letter-spacing-2 m-b-30">监督单位：
                        <vInputSpan v-model="temData.page_1.value_3" display="inline-block" :scale="scale" :width="320" :inputWidth="320"></vInputSpan>
                    </div>

                    <div class="text-16 line-height-28 text-align-center">
                        <vInputSpan v-model="temData.page_1.value_4" :scale="scale" :underLine="false"></vInputSpan>年
                        <vInputSpan v-model="temData.page_1.value_5" :scale="scale" :underLine="false"></vInputSpan>月
                        <vInputSpan v-model="temData.page_1.value_6" :scale="scale" :underLine="false"></vInputSpan>日
                    </div>
                </div>
            </div>

            <!--第二页-->
            <div class="page">
                <div class="text-16 text-align-left line-height-28   m-b-10">
                    <vInputSpan v-model="temData.page_2.value_1" :underLine="prindUnderLine" :scale="scale"></vInputSpan>：
                </div>
                <div :class="classNameType.mainClass_list1">
                    根据《建设工程质量管理条例》、《建设工程安全生产管理条
                    例》、《公路水运工程安全生产监督管理办法》、《公路水运工程质量监督管理规定》和《六安市公路水运工程质量监督实施细则》等规定，我局受理
                    <vInputSpan v-model="temData.page_2.value_2" :scale="scale" :underLine="prindUnderLine"></vInputSpan>
                    的质量监督，并将按下述计划由
                    <vInputSpan v-model="temData.page_2.value_3" :scale="scale" :underLine="prindUnderLine"></vInputSpan>
                    等组成监督小组对该工程进行质量监督。
                    <vInputSpan v-model="temData.page_2.value_4" :scale="scale" :underLine="prindUnderLine"></vInputSpan>
                </div>

                <div :class="classNameType.mainClass_list1">
                    一、项目概况
                </div>
                <div :class="classNameType.mainClass_list1">
                    二、监督依据
                </div>
                <div :class="classNameType.mainClass_list1">
                    三、监督范围、期限、内容和方式
                </div>
                <div :class="classNameType.mainClass_list1">
                    四、监督主要工作
                </div>
                <div :class="classNameType.mainClass_list1">
                    五、监督计划
                </div>
                <div :class="classNameType.mainClass_list1">
                    （一）工程准备阶段
                </div>
                <div :class="classNameType.mainClass_list1">
                    （二）工程实施阶段
                </div>
                <div :class="classNameType.mainClass_list1">
                    （三）交工、竣工验收阶段
                </div>
                <div :class="classNameType.mainClass_list1">
                    六、问题处理方式
                </div>
                <div :class="classNameType.mainClass_list1">
                    七、其他内容
                </div>

            </div>

            <!--第三页-->
            <div class="page">
                <div :class="classNameType.mainClass">
                    一、项目概况
                    <Input v-model="temData.page_3.value_1.value_1_1" type="textarea" class="input-boder-none" :rows="25" placeholder="请输入项目概况"/>
                </div>
                <ButtonGroup class="btn-group-list top-85" v-if="!print2x" size="small" vertical>
                    <Button icon="ios-add" type="success" title="新增页" @click="addPage" v-show="temData.page_3.value_1.pageIndex < 6"></Button>
                    <Button icon="ios-close" type="error" title="删除最后一页" @click="delPage" v-show="temData.page_3.value_1.pageIndex > 1"></Button>
                </ButtonGroup>
            </div>
            <!-- 项目概况 -->
            <div class="page" v-if="temData.page_3.value_1.pageIndex > 1">
                <div :class="classNameType.mainClass">
                    <Input v-model="temData.page_3.value_1.value_1_2" type="textarea" class="input-boder-none" :rows="26" placeholder="请输入项目概况"/>
                </div>
            </div>
            <div class="page" v-if="temData.page_3.value_1.pageIndex > 2">
                <div :class="classNameType.mainClass">
                    <Input v-model="temData.page_3.value_1.value_1_3" type="textarea" class="input-boder-none" :rows="26" placeholder="请输入项目概况"/>
                </div>
            </div>
            <div class="page" v-if="temData.page_3.value_1.pageIndex > 3">
                <div :class="classNameType.mainClass">
                    <Input v-model="temData.page_3.value_1.value_1_4" type="textarea" class="input-boder-none" :rows="26" placeholder="请输入项目概况"/>
                </div>
            </div>
            <div class="page" v-if="temData.page_3.value_1.pageIndex > 4">
                <div :class="classNameType.mainClass">
                    <Input v-model="temData.page_3.value_1.value_1_5" type="textarea" class="input-boder-none" :rows="26" placeholder="请输入项目概况"/>
                </div>
            </div>
            <div class="page" v-if="temData.page_3.value_1.pageIndex > 5">
                <div :class="classNameType.mainClass">
                    <Input v-model="temData.page_3.value_1.value_1_6" type="textarea" class="input-boder-none" :rows="26" placeholder="请输入项目概况"/>
                </div>
            </div>
            <!-- END 项目概况 -->

            <div class="page">
                <div :class="classNameType.mainClass">
                    二、监督依据
                </div>
                <div :class="classNameType.mainClass_list1">
                    1．建设工程质量管理条例（2017年687号修订）；
                </div>
                <div :class="classNameType.mainClass_list1">
                    2．建设工程安全生产管理条例（国务院2003年第393号）；
                </div>
                <div :class="classNameType.mainClass_list1">
                    3．公路建设监督管理办法（交通运输部2006年第6号）；
                </div>
                <div :class="classNameType.mainClass_list1">
                    4.公路水运工程安全生产监督管理办法（交通运输部2017年第25号）；
                </div>
                <div :class="classNameType.mainClass_list1">
                    5. 公路水运工程质量监督管理规定（交通运输部2017年第28号）；
                </div>
                <div :class="classNameType.mainClass_list1">
                    6.公路工程竣（交）工验收办法实施细则（交公路发[2010]65号）；
                </div>
                <div :class="classNameType.mainClass_list1">
                    7.六安市公路水运工程质量监督实施细则（六交工监〔2014〕5号）；
                </div>
                <div :class="classNameType.mainClass_list1">
                    8．公路工程质量检验评定标准（JTG F80/1-2017）；
                </div>
                <div :class="classNameType.mainClass_list1">
                    9. 交通运输部办公厅关于加强公路水运工程质量安全监督管理工作的指导意见（交办安监〔2017〕162号）；
                </div>
                <div :class="classNameType.mainClass_list1">
                    10. 经批复的工程设计文件、变更设计文件，以及合同文件；
                </div>
                <div :class="classNameType.mainClass_list1">
                    11.项目内容涉及的国家标准或行业标准和安徽省颁布现行法规、标准、规范等。
                </div>
                <div :class="classNameType.mainClass">
                    三、监督范围、期限、内容和方式
                </div>
                <div :class="classNameType.mainClass">
                    （一）监督范围
                </div>
                <div :class="classNameType.mainClass_list1">
                    <vInputSpan v-model="temData.page_4.value_1" :scale="scale" :underLine="prindUnderLine" :inputWidth="400"></vInputSpan>

                </div>
            </div>

            <!--第四页-->
            <div class="page">

                <div :class="classNameType.mainClass">
                    （二）监督期限
                </div>
                <div :class="classNameType.mainClass_list1">
                    本项目自建设单位办理完成施工许可或者开工备案手续之日起至工程竣工验收完成之日止为工程质量监督期。
                </div>
                <div :class="classNameType.mainClass">
                    （三）监督内容
                </div>
                <div :class="classNameType.mainClass_list1">
                    1.从业单位执行法律、法规和规章的情况。
                </div>
                <div :class="classNameType.mainClass_list1">
                    2.从业单位对公路水运工程建设强制性标准的执行情况。
                </div>
                <div :class="classNameType.mainClass_list1">
                    3.建设单位、勘察设计单位、施工单位、监理单位、试验检测单位对该项目的质量安全管理行为、质量安全责任落实及质量安全保证体系运行情况。
                </div>
                <div :class="classNameType.mainClass_list1">
                    4.主要工程材料、构配件和设备的质量情况。
                </div>
                <div :class="classNameType.mainClass_list1">
                    5.主体结构工程实体质量等情况。
                </div>

                <div :class="classNameType.mainClass">
                    （四）监督方式
                </div>
                <div :class="classNameType.mainClass_list1">
                    监督检查方式分为综合督查、专项督查、备案督查和随机抽查等。
                </div>
                <div :class="classNameType.mainClass_list1">
                    1.综合督查：掌握工程总体质量状况，针对质量安全管理行为、施工工艺和工程实体质量，通过现场查看、查阅资料、对工程实体及原材料质量抽样检测等方式进行全面督查。督查提前3天通知项目建设单位。
                </div>
                <div :class="classNameType.mainClass_list1">
                    2.专项督查：根据项目建设特点，掌握工程薄弱环节、关键工序、重要部位质量安全状况，通过查验资料或抽样检测等方式，对程序、行为和实体等方面进行有针对性地督查。督查提前1天通知项目建设单位。
                </div>
                <div :class="classNameType.mainClass_list1">
                    3.备案督查:工地试验室和工程质量安全责任登记等进行备案管理。
                </div>
                <div :class="classNameType.mainClass_list1">
                    4.随机抽查：掌握工程质量安全管理的动态，通过查看施工现场等方式，了解工艺及实体外观、内业资料和质量通病治理等情况。
                </div>
            </div>

            <!--第五页-->
            <div class="page">

                <div :class="classNameType.mainClass">
                    四、监督主要工作
                </div>
                <div :class="classNameType.mainClass_list1">
                    1.监督检查工程项目涉及的法律、法规、强制性技术标准、规范和合同的执行情况。
                </div>
                <div :class="classNameType.mainClass_list1">
                    2.监督检查从业单位是否具有依法取得的相应等级的资质证书，从业人员是否按照国家规定经考试合格，取得上岗资格。
                </div>
                <div :class="classNameType.mainClass_list1">
                    3.监督检查建设、勘察、设计单位、施工和监理单位质量安全保证体系的针对性、严密性和运行的有效性，以及各单位质量安全保证体系之间的协调性和一致性。
                </div>
                <div :class="classNameType.mainClass_list1">
                    4.监督检查勘察、设计文件是否符合国家规定的技术标准和规范要求，设计文件是否达到国家规定的编制要求。
                </div>
                <div :class="classNameType.mainClass_list1">
                    5.监督检查施工、监理和设备、材料供应单位是否严格按照有关质量标准和技术规范进行施工、监理和供应设备、材料。
                </div>
                <div :class="classNameType.mainClass_list1">
                    6.监督检查监理单位的质量管理和现场质量控制情况，以及对公路工程关键部位和隐蔽工程的旁站情况、对各施工工序的质量检查情况。
                </div>
                <div :class="classNameType.mainClass_list1">
                    7.监督检查试验检测设备是否合格，试验方法是否规范，试验数据是否准确，试验检测频率是否符合有关规定。
                </div>
                <div :class="classNameType.mainClass_list1">
                    8.监督检查材料采购、进场和使用等环节的质量情况，并公布抽查样品的质量检测结果，检查关键设备的性能情况。
                </div>
                <div :class="classNameType.mainClass_list1">
                    9.对公路工程质量情况进行抽检，分析主要质量指标的变化情况，评估总体质量状况和存在的主要问题，提出加强质量管理的政策措施和指导性意见，定期发布质量动态信息。
                </div>
                <div :class="classNameType.mainClass_list1">
                    10.按规定开展对监理、试验检测单位信用评价工作。
                </div>
                <div :class="classNameType.mainClass_list1">
                    11.负责组织对完工项目进行质量验证性检测和质量鉴定。
                </div>

            </div>

            <!--第六页-->
            <div class="page">

                <div :class="classNameType.mainClass_list1">
                    12. 法律、法规和规章规定的其他职责。
                </div>
                <div :class="classNameType.mainClass">
                    五、监督计划
                </div>
                <div :class="classNameType.mainClass">
                    （一）工程准备阶段
                </div>
                <div :class="classNameType.mainClass_list1">
                    1、监督检查建设单位基本建设程序执行情况。
                </div>
                <div :class="classNameType.mainClass_list1">
                    2．核查建设单位依据有关规定对施工、监理单位履行合同行为的检查情况。
                </div>
                <div :class="classNameType.mainClass_list1">
                    3.核查建设、监理、施工等从业单位工地试验室的建立情况，对符合要求的工地试验室进行登记备案。
                </div>
                <div :class="classNameType.mainClass_list1">
                    4.督查建设、施工、监理单位质量安全保证体系、规章制度等的建立情况。
                </div>
                <div :class="classNameType.mainClass_list1">
                    5.督查相关从业单位驻地及拌和站、预制场等场站标准化建设情况；督查验证试验、标准试验、工艺试验等工作开展情况。
                </div>
                <div :class="classNameType.mainClass_list1">
                    6.核查交工验收质量检测方案的合理性；专项施工方案的编制、审批情况。
                </div>
                <div :class="classNameType.mainClass_list1">
                    7.核查建设单位对开工前的安全生产条件落实情况等。
                </div>
                <div :class="classNameType.mainClass">
                    （二）工程实施阶段
                </div>
                <div :class="classNameType.mainClass_list1">
                    1．严格按照相关法律、法规、规章、技术标准、规范和文件的要求，开展对建设、施工、监理等从业单位质量安全管理行为、施工工艺、工程实体质量和现场安全等方面的监督工作。
                </div>
                <div :class="classNameType.mainClass_list1">
                    2．对工程项目进行质量安全责任登记备案。
                </div>
                <div :class="classNameType.mainClass_list1">
                    3．督查建设、施工、监理等从业单位质量安全保证体系的运转情况。
                </div>
                <div :class="classNameType.mainClass_list1">
                    4．对工程使用的原材料、砼构件、半成品、成品和产品质量进行监督检查，对工程质量进行随机抽检。
                </div>
                <div :class="classNameType.mainClass_list1">
                    5．对施工过程中的原始记录、技术资料、试验检测资料、监理签认资料进行抽查。
                </div>
                <div :class="classNameType.mainClass_list1">
                    6．对质量薄弱环节与涉及结构强度和安全性的重要指标进行督查。
                </div>

            </div>

            <!--第七页-->
            <div class="page">

                <div :class="classNameType.mainClass_list1">
                    7．结合工艺标准化要求，对质量通病的治理等情况进行监督检查。
                </div>
                <div :class="classNameType.mainClass_list1">
                    8.检查安全生产标准化建设推进情况，对平安工地建设□、普通干线公路施工标准化建设 □、品质工程创建□等情况进行监督检查。
                </div>
                <div :class="classNameType.mainClass_list1">
                    9．对参建单位及其人员质量安全失信行为进行登记，并归档作为年度信用评价的依据。
                </div>
                <div :class="classNameType.mainClass">
                    （三）交工、竣工验收阶段
                </div>
                <div :class="classNameType.mainClass_list1">
                    根据工程进度分阶段开展交工验收质量验证性检测工作，出具交工验收质量核验意见。竣工验收前组织检测单位对关键复测项目进行复测，对建设项目进行竣工验收质量鉴定，出具监督工作报告；根据有关规定签发参建单位综合评价等级证书。
                </div>

                <div :class="classNameType.mainClass">
                    六、问题处理方式
                </div>
                <div :class="classNameType.mainClass_list1">
                    对督查中发现的质量安全问题，违法情节轻微，相关单位能及时改正的，由交通质监机构责令改正，督促整改落实；违法情节严重的，会同交通综合执法机构依法处理。
                </div>
                <div :class="classNameType.mainClass">
                    七、其他内容
                </div>
                <div :class="classNameType.mainClass_list1">
                    1.从业单位及其工作人员应当主动接受、配合建设工程质量监督机构的监督检查，不得拒绝或者阻碍，及时按要求提供有关工程质量安全的文件和材料。
                </div>
                <div :class="classNameType.mainClass_list1">
                    2.建设、设计、施工、监理单位应认真贯彻落实上级交通主管部门有关项目管理的重要文件，按照要求开展相关的活动。
                </div>
                <div :class="classNameType.mainClass_list1">
                    3.建设单位应督促施工、监理单位对监督检查发现的问题及时整改、并按规定期限将处理结果书面报我局备案。
                </div>
                <div :class="classNameType.mainClass_list1">
                    4.欢迎对我局的监督工作提出意见和建议，以便促进我们进一步改进工作。
                </div>

            </div>

            <!--第八页-->
            <div class="page">

                <div :class="classNameType.mainClass">
                    质量举报电话：0564-3952580、3952097
                </div>
                <div :class="classNameType.mainClass">
                    廉 政 举 报：0564-3952099
                </div>
                <div :class="classNameType.mainClass">
                    通信地址：六安市梅山南路交通大厦十三楼
                </div>
                <div :class="classNameType.mainClass">
                    六安市交通建设工程质量监督局
                </div>
                <div :class="classNameType.mainClass">
                    邮编：237005
                </div>

                <div class="box-bottom">
                    <div class="text-16 line-height-28 text-align-left m-b-30">签发人：</div>
                    <div class="text-18 text-align-right letter-spacing-2 m-b-10" >六安市交通建设工程质量监督局</div>
                    <div class="text-16 line-height-28 text-align-right">
                        <vInputSpan v-model="temData.page_8.value_1" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>年
                        <vInputSpan v-model="temData.page_8.value_2" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>月
                        <vInputSpan v-model="temData.page_8.value_3" :scale="scale" :inputWidth="60" :underLine="false"></vInputSpan>日
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>

<script>
    import template_word_fileMixin from './mixin/template_word_fileMixin';
    import classMixin from './mixin/classMixin';
    export default {
        name: 'template_word_file_0', // 质量监督管理受理通知书
        mixins: [classMixin, template_word_fileMixin],
        data() {
            return {
                // 模板输入数据
                temData: {
                    page_1: {
                        value_1: '',
                        value_2: '',
                        value_3: '',
                        value_4: '',
                        value_5: '',
                        value_6: '',
                    },
                    page_2: {
                        value_1: '',
                        value_2: '',
                        value_3: '',
                        value_4: '',
                    },
                    page_3: {
                        value_1: {
                            pageIndex: 1,  // 1 到 6
                            value_1_1: '',
                            value_1_2: '',
                            value_1_3: '',
                            value_1_4: '',
                            value_1_5: '',
                            value_1_6: ''
                        },
                    },
                    page_4: {
                        value_1: '',
                    },
                    page_8: {
                        value_1: '',
                        value_2: '',
                        value_3: ''
                    },
                    stamp: []
                }
            };
        },
        methods: {
            // 判断是否全部填写
            // @return Boolean
            validateContent() {
                for (let key in this.temData) {
                    if (key !== 'stamp') {

                        for (let k in this.temData[key]) {
                            if (this.temData[key][k] === '') {
                                return false;
                            }
                        }

                    }
                }
                return true;
            },

            // 新增页面
            addPage() {
                if (this.temData.page_3.value_1.pageIndex < 6 ) {
                    this.temData.page_3.value_1.pageIndex++;
                }
            },
            // 移除页面
            delPage() {
                if (this.temData.page_3.value_1.pageIndex > 1) {
                    this.temData.page_3.value_1.pageIndex--;
                }
            }
        }
    }
</script>

<style lang="scss" src="./template.scss"></style>
<style lang="scss" src="./template2x.scss"></style>
<style lang="scss" src="./template2x_extra.scss"></style>
<style lang="scss" scoped>
    .template_word_file_0-container {
        display: inline-block;
    }
</style>