<template>
    <div class="mineIntegral-container" >
        <div class="Integral-list-cont">

            <div class="Integral-list">
                <md-result-page
                        :img-url="error"
                        text="服务器错误，请稍后再试"
                        v-if="isShowType === 2"
                >
                </md-result-page>
                <md-result-page
                        :img-url="noData"
                        text="暂无积分记录"
                        v-else-if="isShowType === 1"
                >
                </md-result-page>
                <md-scroll-view
                        ref="scrollView"
                        :scrolling-x="false"
                        :autoReflow="true"
                        @scroll="$_onScroll"
                        @endReached="$_onEndReached"
                        v-else
                >
                    <div class="Integral-card" v-if="isHasData">
                        <div class="Integral-card-bg">
                            <div class="Integral-card-bg-bar"></div>
                        </div>
                        <div class="Integral-card-inner">
                            <div class="card-inner-out">
                                <div class="tips" @click="showPopUp('center')"></div>
                                <div class="card-inner-text">可用积分</div>
                                <div class="card-inner-Num">
                                    <md-amount
                                            :value="PointsInfo.useablePoint"
                                            :precision="2"
                                            has-separator
                                    ></md-amount>
                                </div>
                                <div class="card-inner-latest" v-if="PointsInfo.increasedPoint !== 0">最近新增积分<span class="mark">{{PointsInfo.increasedPoint}}分</span></div>
                                <div class="card-inner-latest" v-else>最近无新增积分</div>
                                <div class="card-inner-extra-text" v-if="PointsInfo.pastPoint !== 0">{{PointsInfo.pastPoint}}分将过期</div>
                                <div class="card-inner-extra-text" v-else>无积分将过期</div>
                                <div class="card-inner-extra-btn">
                                    <md-button @click="$router.push({ path:'/pointsMall/goodsList'})">积分商城</md-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                            v-for="(item, index) in resData"
                            :key="index"
                            class="scroll-view-list"
                    >
                        <div class="view-list-card">
                            <div class="list-card-date">{{item.date}}</div>

                            <div class="list-card-item" v-for="(ele, i) in item.children" :key="i">
                                <div class="card-item-info">
                                    <div class="name">{{typeText(ele.sourceType)}}</div>
                                    <div class="time">{{ele.createOn}}</div>
                                </div>
                                <div :class="pointsNumClass(ele.points)" >{{pointsNum(ele.points)}}</div>
                            </div>
                        </div>
                    </div>
                    <md-scroll-view-more
                            slot="more"
                            :is-finished="isFinished"
                    >
                    </md-scroll-view-more>
                </md-scroll-view>
            </div>
        </div>
        <md-popup v-model="isPopupShow.center">
            <div class="Integral-popup">
                <div class="title">如何获得积分：</div>
                <div class="content-text" style="margin-bottom: .3rem">
                    1.上传购物小票可获得积分<br>
                    2.签到可获得积分<br>
                    3.收藏及关注活动店铺可获得积分<br>
                    4.转发商铺及活动获得积分<br>
                    5.转发获得二次转发的可获得双倍积分
                </div>
                <div class="title">如何使用积分：</div>
                <div class="content-text">
                    1.积分商城兑换礼品<br>
                    2.积分抵扣停车费<br>
                    3.积分抵扣包装盒支付
                </div>
            </div>
        </md-popup>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import Vue from "vue";
    import {
        Picker,
        Field,
        Icon,
        FieldItem,
        Dialog,
        Amount,
        Popup,
        ScrollViewMore,
        ResultPage,
        Toast,
        ScrollView,
        Button
    } from "mand-mobile";

    import { getPointsInfo, getPointlist } from "@/api/mine";
    import dayjs from 'dayjs';
    export default {
        name: "mineIntegral",
        components: {
            [Dialog.name]: Dialog,
            [Field.name]: Field,
            [Popup.name]: Popup,
            [FieldItem.name]: FieldItem,
            [ResultPage.name]: ResultPage,
            [ScrollView.name]: ScrollView,
            [ScrollViewMore.name]: ScrollViewMore,
            [Icon.name]: Icon,
            [Button.name]: Button,
            [Amount.name]: Amount,
            [Picker.name]: Picker
        },
        data() {
            return {
                isFinished: false,
                category: 20,
                list: 5,
                dimensions: [],
                scrollY: 0,
                noData: require("@/assets/noData.png"),
                error: require("@/assets/error.png"),
                isShowType: "", // 1显示无数据， 2显示系统错误， '' 显示数据
                resData: [],
                pageIndex: 1,
                PointsInfo: {
                    increasedPoint: 0,
                    pastPoint: 0,
                    useablePoint: 0
                },
                isHasData: false,
                isPopupShow: {},

            };
        },
        computed: {
            ...mapGetters(["integral", "avatar"]),
            activeBlockIndex() {
                let activeIndex = -1
                this.dimensions.forEach((dimension, index) => {
                    if (this.scrollY >= dimension[0] && this.scrollY <= dimension[1]) {
                        activeIndex = index + 1
                    }
                })
                return activeIndex
            },
            typeText() {
                return (type) => {
                    let init = "";
                    switch (type){
                        case 1:
                            init = '消费积分';
                            break;
                        case 2:
                            init = '退货扣减积分';
                            break;
                        case 3:
                            init = '消费积分补录';
                            break;
                        case 4:
                            init = '交互积分';
                            break;
                        case 5:
                            init = '积分兑礼';
                            break;
                        case 6:
                            init = '积分消费支付';
                            break;
                        case 7:
                            init = '停车费用支付';
                            break;
                        case 8:
                            init = '手工操作';
                            break;
                        case 9:
                            init = '开卡赠送';
                            break;
                        case 10:
                            init = '活动积分';
                            break;
                        case 11:
                            init = '签到积分';
                            break;
                        case 12:
                            init = '推荐注册';
                            break;
                    }
                    return init
                }
            },
            pointsNumClass() {
                return (num) => {
                    let initClass = "card-item-Num"
                    if(num >= 0){
                        initClass = "card-item-Num add"
                    }
                    return initClass
                }
            },
            pointsNum() {
                return (num) => {
                    let initNum= num
                    if(num >= 0){
                        initNum = `+${num}`
                    }
                    return initNum
                }
            }
        },
        mounted() {
            // 如果内容发生变化，需重新初始化block和scroller
            this.$_initScrollBlock()
            this.$refs.scrollView.reflowScroller()
        },
        created() {
            //积分请求
            // if(this.resData.length === 0){
            //     // this.$store.dispatch("GetPoints")
            //     Toast.loading('加载中...');
            //     this.getPointsInfo();
            //     this.getData();
            // }
            // console.assert(2)
        },
        activated() {
            Toast.loading('加载中...');
            this.getPointsInfo();
            this.getData();
        },
        deactivated: function () {
            console.log(4)
        },
            methods: {
            async getData() {
                try {
                    const res = await getPointlist(this.pageIndex, 10);
                    const {total, rows, page, currentPage, totalPage} = res.data;
                    Toast.hide();
                    if (total === 0) {
                        this.isShowType = 1;
                    } else {
                        rows.forEach(item => {
                            item.children.forEach(ele => {
                                ele.createOn = ele.createOn ? dayjs(ele.createOn).format(
                                    "YYYY-MM-DD HH:mm"
                                ) : '未知';
                            })
                        });
                        this.isHasData = true;
                        this.resData = [...this.resData, ...rows];
                        this.pageIndex++;
                        this.isFinished = currentPage >= totalPage;

                        this.isShowType = '';

                        this.$refs.scrollView.finishLoadMore();
                    }
                }catch (err) {
                    console.log(err);
                    if (err.code === 500) {
                        Toast.hide();
                        this.isShowType = 2;
                    }
                }

            },
            async getPointsInfo() {
                try {
                    const res = await getPointsInfo();
                    const { code, data } = res;
                    console.log(res)
                    if(code === '200'){
                        this.PointsInfo = {
                            increasedPoint: data.increasedPoint ? data.increasedPoint : 0,
                            pastPoint: data.pastPoint ? data.pastPoint : 0,
                            useablePoint: data.useablePoint ? data.useablePoint : 0
                        };
                    }
                }catch (err) {
                    console.log(err);
                }
            },
            showPopUp(type) {
                this.$set(this.isPopupShow, type, true)
            },
            hidePopUp(type) {
                this.$set(this.isPopupShow, type, false)
            },
            $_onEndReached() {
                if (this.isFinished) {
                    return;
                }
                // async data
                this.getData()
            },
            $_initScrollBlock() {
                const blocks = this.$el.querySelectorAll('.scroll-view-category')
                let offset = 0
                Array.prototype.slice.call(blocks).forEach((block, index) => {
                    const innerHeight = block.clientHeight
                    this.$set(this.dimensions, index, [offset, offset + innerHeight])
                    offset += innerHeight
                })
            },
            $_onScroll({scrollTop}) {
                this.scrollY = scrollTop
            },

        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .mineIntegral-container{
        .Integral-card{
            position: relative;
            width: 100%;
            height: 460px;
        }
    }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    .mineIntegral-container {
        position: relative;
        width: 100%;
        height: 100%;


        .Integral-list-cont {
            position: relative;
            width: 100%;
            height: 100%;
            .md-scroll-view {
                background-color: #eceff5;
            }

            .Integral-list{
                width: 100%;
                height: 100%;

            }
            .Integral-card {
                .Integral-card-bg {
                    width: 100%;
                    height: 260px;
                    background-color: #2e2d33;
                }
                .Integral-card-bg-bar {
                    width: 100%;
                    height: 40px;
                    background-color: #2e2d33;
                    box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.39),
                    0 0 0 1px rgba(0, 0, 0, 0.13);
                }
                .Integral-card-inner {
                    position: absolute;
                    top: 40px;
                    left: 0;
                    right: 0;
                    width: 100%;
                    padding: 0 30px;
                    box-sizing: border-box;
                    font-size: 30px;
                    .card-inner-out {
                        position: relative;
                        width: 100%;
                        padding: 40px 30px 30px;
                        box-sizing: border-box;
                        background-color: #fff;
                        box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
                        border-radius: 8px;
                        text-align: left;
                    }
                    .tips{
                        position: absolute;
                        top: 40px;
                        right: 30px;
                        width: 40px;
                        height: 40px;
                        background-color: #eee;
                        z-index: 99;
                        background: url(../../../assets/Integral-tips.png) no-repeat;
                        background-size: 100% 100%;
                    }
                    .card-inner-text {
                        font-size: 30px;
                        font-weight: normal;
                        font-stretch: normal;
                        line-height: 36px;
                        letter-spacing: 0px;
                        color: #111111;
                        text-align: left;
                    }
                    .card-inner-Num {
                        text-align: left;
                        line-height: 1.5;
                        .md-amount.numerical {
                            font-size: 80px;
                            font-weight: normal;
                            font-stretch: normal;
                            letter-spacing: 0px;
                            color: #ff4602;
                        }
                    }
                    .card-inner-latest {
                        font-size: 26px;
                        font-weight: normal;
                        font-stretch: normal;
                        line-height: 28px;
                        letter-spacing: 0px;
                        color: #000000;
                        .mark {
                            color: #ff4602;
                        }
                    }
                    .card-inner-extra-text {
                        margin-top: 40px;
                        text-align: center;
                        font-size: 24px;
                        font-weight: normal;
                        font-stretch: normal;
                        line-height: 28px;
                        letter-spacing: 0px;
                        color: #666666;
                    }
                    .card-inner-extra-btn {
                        margin-top: 20px;
                        .md-button.primary {
                            height: 80px;
                            line-height: 80px;
                            font-size: 30px;
                            background-color: #ff4602;
                        }
                    }
                }
            }
            .scroll-view-list {
                padding: 30px 30px 0;
                .view-list-card {
                    font-size: 30px;
                    background-color: #fff;
                    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
                    border-radius: 8px;
                    .list-card-date {
                        padding: 0 30px;
                        font-size: 30px;
                        color: #999;
                        line-height: 86px;
                        text-align: left;
                        border-bottom: 1px solid #ededed;
                    }
                    .list-card-item {
                        width: 100%;
                        height: 120px;
                        padding: 0 30px;
                        box-sizing: border-box;
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;
                        justify-content: space-between;
                        border-bottom: 1px solid #ededed;
                        &:last-child {
                            border: none;
                        }
                    }
                    .name {
                        margin-bottom: 12px;
                        font-size: 30px;
                        line-height: 36px;
                        letter-spacing: 0px;
                        color: #111111;
                        text-align: left;
                    }
                    .time {
                        font-size: 28px;
                        font-weight: normal;
                        font-stretch: normal;
                        line-height: 36px;
                        letter-spacing: 0px;
                        color: #999999;
                    }
                    .card-item-Num {
                        color: #108ee9;
                    }
                    .add{
                        color: #ff4602;
                    }
                }
            }
        }
        .Integral-popup{
            padding: 40px 30px;
            width: 550px;
            box-sizing: border-box;
            background-color: #fff;
            text-align: left;
            line-height: 1.5;
            border-radius: 8px;
            .title{
                margin-bottom: 30px;
                font-size: 28px;
                color: #000;
            }
            .content-text{
                font-size: 24px;
                font-weight: normal;
                font-stretch: normal;
                line-height: 36px;
                letter-spacing: 0px;
                color: #000000;
            }
        }
    }
</style>
