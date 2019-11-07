<template>
    <div class="activityDetails-container">
        <md-result-page
                :img-url="error"
                text="服务器错误，请稍后再试"
                v-if="isShowType === 2"
        >
        </md-result-page>
        <md-result-page
                :img-url="noData"
                text="活动详情获取失败"
                v-else-if="isShowType === 1"
        >
        </md-result-page>
        <div class="activityDetails-info" v-else>
            <div class="" v-if="resData.length !== 0">
                <div class="Details-cover-img">
                    <img :src="resData.cover" alt="">
                </div>
                <div class="Count-down-cont" v-if="isShow">
                    <countdown
                            v-if="this.resData.length !== 0"
                            v-on:start_callback="countDownS_cb(1)"
                            v-on:end_callback="countDownE_cb(1)"
                            :currentTime="Number(resData.currentTime)"
                            :startTime="Number(resData.startTime)"
                            :endTime="Number(resData.endTime)"
                            :tipText="'活动开始倒计时'"
                            :tipTextEnd="'活动结束倒计时'"
                            :endText="'活动已结束'"
                            :dayTxt="'天'"
                            :hourTxt="'时'"
                            :minutesTxt="'分'"
                            :secondsTxt="'秒'"
                    >
                    </countdown>
                </div>
                <div class="Details-title">
                    <p class="Details-title-text">{{resData.activityName}}</p>
                </div>
                <div class="Details-intro" >
                    <div class="intro-title">活动信息</div>
                    <div class="intro-extra">
                        <div class="Column-name">活动时间:</div>
                        <div class="Column-info-text">{{activityTimer}}</div>
                    </div>
                    <div class="intro-extra">
                        <div class="Column-name">活动热线:</div>
                        <div class="Column-info-text">{{resData.hotLine}}</div>
                    </div>
                    <div class="intro-title">活动详情</div>
                    <div class="intro-extra intro-details-html">
                        <div class="Column-info-text" v-html="resData.activityExplain"></div>
                    </div>
                </div>
            </div>

        </div>
        <md-action-bar :actions="btnStatus" v-if="isShow"  @click.native="onSignUpClick">
            {{resData.applyCount}}人已报名
        </md-action-bar>
    </div>
</template>

<script>
    import {
        Dialog,
        Popup,
        PopupTitleBar,
        ActionBar,
        ResultPage,
        Toast
    } from "mand-mobile";
    import dayjs from "dayjs";
    import {
        getActivity,
        getActivityDetails,
        ActivitySignUp
    } from "@/api/activity";

    export default {
        name: "activityDetails",
        inject: ['reload'], // 引入方法
        data() {
            return {
                resData: [],
                isFinished: false,
                pageIndex: 1,
                actionBtn: [
                    {
                        text: "立即报名",
                        disabled: false
                    }
                ],
                noData: require("@/assets/noData.png"),
                error: require("@/assets/error.png"),
                isShowType: "", // 1显示无数据， 2显示系统错误， '' 显示数据
            };
        },
        components: {
            [Popup.name]: Popup,
            [PopupTitleBar.name]: PopupTitleBar,
            [ActionBar.name]: ActionBar,
            [ResultPage.name]: ResultPage
        },
        computed: {
            activityTimer() {
                return (
                    dayjs(this.resData.startTime).format("YYYY-MM-DD") +
                    " 至 " +
                    dayjs(this.resData.endTime).format("YYYY-MM-DD")
                );
            },
            isShow() {
                return this.resData.apply === 1;
            },
            nowDate() {
                return dayjs().valueOf()
            },
            countdownRender() {
                return this.resData.length !== 0
            },
            btnStatus() {
                const LimitTime = this.resData.applyLimitTime;
                const endTime = this.resData.endTime;
                const nowTime = this.resData.currentTime;
                const isapply = this.resData.isapply;
                if(nowTime > endTime){
                    this.actionBtn = [
                        {
                            text: "活动已结束",
                            disabled: true
                        }
                    ]
                }else {
                    if(nowTime > LimitTime){
                        this.actionBtn = [
                            {
                                text: "报名已结束",
                                disabled: true
                            }
                        ]
                    }else {
                        if(isapply === 0){
                            this.actionBtn = [
                                {
                                    text: "已报名",
                                    disabled: true
                                }
                            ]
                        }
                    }
                }

                return this.actionBtn
            }

        },

        created() {
            if (this.resData.length === 0) {
                Toast.loading("加载中...");
                this.getData();
            }
        },
        mounted() {},
        methods: {
            async getData() {
                try {
                    const res = await getActivityDetails(this.$route.params.id);
                    Toast.hide();
                    const { code, data } = res;
                    if (code === "200" && data !== null) {
                        this.resData = data;
                        this.isShowType = '';
                    } else {
                        this.isShowType = 1;
                    }
                } catch (err) {
                    if (err.code === 500) {
                        Toast.hide();
                        this.isShowType = 2;
                    }
                }
            },
            async ActivitySignUp() {
                this.actionBtn = [
                    {
                        text: "正在报名",
                        disabled: true
                    }
                ];
                const id = this.resData.id;
                console.log("this.resData",this.resData)

                try {
                    const res = await ActivitySignUp(id);
                    console.log(res);

                    if(res.code === '200'){
                        // this.reload();
                        Toast.succeed('报名成功！');
                        this.actionBtn = [
                            {
                                text: "已报名",
                                disabled: true
                            }
                        ];
                        // console.log()
                    }
                } catch (err) {
                    Toast.failed(err);
                    this.actionBtn = [
                        {
                            text: "立即报名",
                            disabled: false
                        }
                    ];
                }
            },
            onSignUpClick(event, action) {
                console.log("按钮是否已禁用：", this.actionBtn[0].disabled)
                const isdisabled = this.actionBtn[0].disabled;
                const deductPoint = this.resData.deductPoint;
                if(!isdisabled){
                    Dialog.confirm({
                        title: '',
                        content: `本次报名所需积分${deductPoint}，是否确认报名?`,
                        confirmText: '确定',
                        onConfirm: () => {
                            console.log("this.resData",this.resData)
                            this.ActivitySignUp()
                        },
                    });
                }



            },
            countDownS_cb(x) {
                // 活动开始事件
                // console.log('哈哈',x)
            },
            countDownE_cb(x) {
                // 活动结束事件
                // console.log('1212',x)
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .activityDetails-container {
        .Count-down-cont {
            font-size: 30px;
            line-height: 80px;
            color: #ffffff;
            background-color: #ff4602;
            span {
                display: inline-block;
                margin: 0 6px;
                padding: 0 10px;
                min-width: 20px;
                height: 40px;
                line-height: 40px;
                color: #ff4602;
                border-radius: 6px;
                background-color: #fff;
            }
            .no-bg{
                padding: 0;
                margin: 0;
                color: #fff;
                background-color: #ff4602;
            }
        }
        .md-action-bar .md-action-bar-text {
            padding: 0;
            font-size: 30px;
            color: #ff4602;
            border-top: 1px solid;
            justify-content: center;
        }
        .md-action-bar .md-action-bar-button .button-item:last-of-type {
            font-size: 30px;
            background: #ff4602;
        }
        .Column-info-text{
            img{
                display: block;
                width: 100%;
            }
            p{
                font-size: 26px!important;
            }
            span{
                font-size: 26px!important;
            }
            a{
                font-size: 26px!important;
            }
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    .activityDetails-container {
        position: relative;
        width: 100%;
        height: 100%;
        padding-bottom: 120px;
        box-sizing: border-box;
        background-color: #eceff5;
        .activityDetails-info {
            width: 100%;
            height: 100%;
        }
        .Details-cover-img {
            width: 100%;
            height: 390px;
            img {
                display: block;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        .Details-title {
            padding: 30px;
            background-color: #fff;
            .Details-title-text {
                font-size: 30px;
                font-weight: normal;
                font-stretch: normal;
                line-height: 37px;
                letter-spacing: 0px;
                color: #111111;
                text-align: left;
            }
        }
        .Details-intro {
            margin-top: 20px;
            padding: 30px;
            text-align: left;
            background-color: #fff;
            .intro-title {
                margin-top: 24px;
                font-size: 30px;
                font-weight: normal;
                font-stretch: normal;
                line-height: 1.5;
                letter-spacing: 0;
                color: #111111;
                &:first-child {
                    margin: 0;
                }
            }
            .intro-extra {
                margin-top: 12px;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
                font-size: 26px;
                font-weight: normal;
                font-stretch: normal;
                line-height: 1.5;
                letter-spacing: 0px;
                color: #666666;
                .Column-name {
                    margin-right: 12px;
                }
                .Column-info-text {
                    flex: 1;
                }
            }
            .intro-details-html {
                padding-bottom: 200px;
            }
        }
    }
</style>
