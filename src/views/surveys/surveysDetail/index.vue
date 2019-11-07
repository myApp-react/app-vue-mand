<template>
    <div class="surveysDetail-container">
        <div class="surveysDetail-inner">
            <div class="surveysDetail-intro">
                <div class="surveys-title">{{this.title}}</div>
                <div class="surveys-note">{{this.note}}</div>
            </div>
            <div class="surveysDetail-list">
                <ul>
                    <li v-if="questions.length>0" v-for="(item,index) in questions" :key="index">
                        <p class="questionName">{{index+1}}、{{item.question}}{{item.type===2?'（多选）':''}}</p>
                        <div v-if="item.type === 1">
                            <md-radio
                                    v-model="item.result"
                                    :options="item.options"
                                    icon="icon-radio-active"
                                    icon-inverse="icon-radio"
                                    icon-position="left"
                                    icon-size="sm"
                            >
                                <template slot-scope="{ option }">
                                    <!--<div class="md-radio-custom-title">{{option.optionName}}</div>-->
                                    <!--<div class="md-radio-custom-brief">{{option.optionName}}</div>-->
                                    <p>{{option.optionName}}</p>
                                </template>
                            </md-radio>
                        </div>
                        <div v-else-if="item.type === 2">
                            <md-check-list
                                    v-model="item.result"
                                    :options="item.options"
                                    :max="0"
                                    iconPosition="left"
                                    icon="icon-checkbox-active"
                                    iconInverse="icon-checkbox"
                                    iconSize="sm"
                                    :disabled="status===1"
                            >
                                <div slot="content" slot-scope="{ option }">
                                    <p style="margin: 8px 0 8px 0 ">{{option.optionName}}</p>
                                </div>
                            </md-check-list>
                        </div>
                        <div v-else-if="item.type === 3" class="textarea-out">
                            <textarea
                                    :disabled="status===1"
                                    v-model="item.result"
                                    placeholder="请输入答案..."
                                    maxlength="60"
                                    class="textarea"></textarea>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="surveysDetail-submit">
            <!--<p class="tips">-->
            <!--问卷题目需全部填写，才能提交-->
            <!--</p>-->
            <md-button :disabled="status === 1" @click="submitAnswer">提交问卷</md-button>
        </div>
        <div class="modal" v-show="notice">
            <div class="notice">
                {{notice}}
            </div>
        </div>
    </div>
</template>

<script>
    import {Radio, CheckList, InputItem, Field, Button, Toast} from 'mand-mobile'
    import {detail, submit} from '@/api/surveys'
    import "@/assets/svg/radio-active.svg"
    import "@/assets/svg/radio.svg"
    import "@/assets/svg/checkbox-active.svg"
    import "@/assets/svg/checkbox.svg"

    export default {
        name: "surveysDetail",
        data() {
            return {
                id: '',
                status: 1,
                startOrEnd: 0,
                title: '',
                note: '',
                questions: [],
                checked: [],
                showTips: false,
                notice: '',
            }
        },
        components: {
            [Radio.name]: Radio,
            [CheckList.name]: CheckList,
            [InputItem.name]: InputItem,
            [Field.name]: Field,
            [Button.name]: Button,
        },
        created() {
            this.getInfo()
        },
        watch: {
            questions: {
                handler(newQuestion, oldQuestion) {
                    this.showTips = newQuestion.some(i =>
                        i.result === undefined || i.result === null || i.result.length === 0
                    )
                },
                deep: true
            }
        },
        methods: {
            async getInfo() {
                Toast.loading("正在加载...")
                try {
                    let res = await detail({id: this.$route.params.id})
                    Toast.hide();
                    let data = res.data
                    this.id = data.id
                    this.title = data.title
                    this.note = data.note
                    this.status = data.status
                    this.startOrEnd = data.startOrEnd
                    this.questions = data.questions
                    this.questions.forEach((k, i) => {
                        if (this.status === 1 && k.type === 1) {
                            k.options.forEach((kk, ii) => {
                                this.questions[i].options[ii]['disabled'] = true
                            })
                        }
                    });
                    if (this.startOrEnd === 0) {
                        this.notice = '调查未开始'
                    } else if (this.startOrEnd === 1) {
                        this.notice = '调查已结束'
                    }
                    Toast.hide()
                } catch (e) {
                    Toast.info(e);
                }
            },
            async submitAnswer() {
                if (this.showTips) {
                    Toast.info('问卷题目需全部填写，才能提交')
                    return
                }
                let answers = this.questions.map(i => (
                    {
                        questionId: i.questionId,
                        answer: Array.isArray(i.result) ? i.result : [i.result],
                        type: i.type
                    }
                ))
                try {
                    let res = await submit(answers)
                    Toast.succeed('提交成功')
                    setTimeout(_ =>
                            this.$router.back(),
                        3000)
                } catch (e) {
                    console.log(e);
                }
            },
        },
    }
</script>
<style rel="stylesheet/scss" lang="scss">
    .surveysDetail-container {
        .md-radio .md-field .md-field-item.md-radio-item.selected {
            color: #ff4602;
        }

        .md-check-list .md-check-list-item.is-selected {
            color: #ff4602;
        }

        .md-button.primary {
            height: 80px;
            line-height: 80px;
            background-color: #ff4602;
            box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);

            &:disabled {
                background-color: #ccc;
            }
        }
    }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
    .surveysDetail-container {
        width: 100%;
        height: 100%;
        /*padding-bottom: 100px;*/
        /*box-sizing: border-box;*/
        /*background-color: #ECEFF5;*/
        overflow: hidden;

        .surveysDetail-inner {
            width: 100%;
            height: 100%;
            background-color: #fff;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
        }

        .surveysDetail-intro {
            padding: 30px;
            text-align: left;
        }

        .surveys-title {
            font-size: 26px;
            font-weight: normal;
            font-stretch: normal;
            line-height: 48px;
            letter-spacing: 0px;
            color: #333333;
            text-align: left;
        }

        .surveys-note {
            font-size: 26px;
            font-weight: normal;
            letter-spacing: 0px;
            line-height: 1.5;
            color: #998e8a;
        }

        .surveysDetail-list {
            padding-bottom: 120px;

            li {
                .questionName {
                    padding: 20px 30px;
                    box-sizing: border-box;
                    line-height: 1.5;
                    font-size: 26px;
                    color: #111111;
                    font-weight: bold;
                    text-align: left;
                    background-color: #f5f5f5;
                }
            }
        }

        .textarea-out {
            width: 100%;
            padding: 30px 32px;
            box-sizing: border-box;

            textarea {
                display: block;
                width: 100%;
                height: 180px;
                padding: 20px;
                box-sizing: border-box;
                font-size: 26px;
                line-height: 1.5;
                outline: none;
                border-radius: 8px;
                border: solid 1px #c4c7cc;
                resize: none;
            }
        }

        .surveysDetail-submit {
            position: absolute;
            bottom: 20px;
            left: 0;
            width: 100%;
            padding: 0 30px;
            box-sizing: border-box;
        }
    }
</style>
<style lang="stylus" scoped>

    .title
        line-height 50px
        text-align left
        text-indent 45px
        font-weight bold
        font-size 30px
        margin-bottom 20px

    .note
        line-height 50px
        text-align left
        font-size 30px
        text-indent 45px
        margin-bottom 30px

    .tips
        width 100%
        position fixed
        bottom 70px
        margin 10px auto
        height 60px
        line-height 60px
        color #f60000
        font-size 27px

    /*border: none;*/
    .modal
        background-color rgba(255, 255, 255, 0.5)
        position fixed
        left 0
        right 0
        top 0
        bottom 0
        z-index 2

        .notice
            font-size 30px
            line-height 180px
            color #fff
            position fixed
            top 50%
            left 50%
            transform translate(-50%, -50%)
            background-color #7b7b7b
            width 220px
            height 180px

</style>