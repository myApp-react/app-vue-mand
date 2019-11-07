<template>
    <div class="coupon-container">
        <md-result-page
                :img-url="error"
                text="服务器错误，请稍后再试"
                v-if="isShowType === 2"
        >
        </md-result-page>
        <md-result-page
                :img-url="noData"
                text="未有已发布优惠券"
                v-else-if="isShowType === 1"
        >
        </md-result-page>
        <md-scroll-view
                ref="scrollView"
                :autoReflow="true"
                :scrolling-x="false"
                @refreshing="$_onRefresh"
                @endReached="$_onEndReached"
                v-else
        >
            <md-scroll-view-refresh
                    slot="refresh"
                    slot-scope="{ scrollTop, isRefreshActive, isRefreshing }"
                    :scroll-top="scrollTop"
                    :is-refreshing="true"
                    :is-refresh-active="true"
            ></md-scroll-view-refresh>
            <div
                    v-for="(item, index) in resData"
                    :key="index"
                    class="scroll-view-list"
            >
                <div class="coupon-item">
                    <div class="coupon-item-inner">
                        <div class="coupon-item-img">
                            <img :src="item.image" alt="">
                        </div>
                        <div class="coupon-item-info">
                            <div class="coupon-item-info-inner">
                                <div class="item-info-text">
                                    <div class="title">{{item.couponName}}</div>
                                    <div class="coupon-money">
                                        <span class="coupon-money-amount">{{item.faceValue}}</span>
                                        <span class="coupon-money-limit">(满{{item.limitValue}}可用)</span>
                                    </div>
                                </div>
                                <div class="coupon-item-btn">
                                    <md-button type="ghost-primary" size="small"
                                               :disabled="IsBtnDisabled(item.receiveStatus)"
                                               @click="getCouponHandle(item.id)">{{btnStatus(item.receiveStatus)}}
                                    </md-button>
                                    <p class="recipNum">{{item.receiveNum}}人领取</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="coupon-item-describe">
                        <p class="describe-text hide">使用详情：{{item.detail || '无' }}</p>
                        <div class="view-more" v-if="item.detail">
                            <div class="Icon" title="view-more" @click="viewMoreHandle">
                                <div data-type="down" class="arrow active">
                                    <md-icon name="arrow-down" size="lg"></md-icon>
                                </div>
                                <div data-type="up" class="arrow">
                                    <md-icon name="arrow-up" size="lg"></md-icon>
                                </div>
                            </div>
                        </div>
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
</template>

<script>
    import {mapGetters} from "vuex";
    import Vue from "vue";
    import {Toast, ScrollView, ResultPage, ScrollViewMore, ScrollViewRefresh, Icon, Button, Amount} from "mand-mobile";
    import {getCouponList, getCoupon} from "@/api/coupon";
    import dayjs from "dayjs";

    export default {
        name: "coupon",
        components: {
            [ScrollView.name]: ScrollView,
            [ResultPage.name]: ResultPage,
            [Button.name]: Button,
            [Amount.name]: Amount,
            [Icon.name]: Icon,
            [ScrollViewMore.name]: ScrollViewMore,
            [ScrollViewRefresh.name]: ScrollViewRefresh,

        },
        inject: ['reload'], // 引入方法
        data() {
            return {
                list: 10,
                isFinished: false,
                resData: [],
                pageIndex: 1,
                noData: require("@/assets/noData.png"),
                error: require("@/assets/error.png"),
                isShowType: "", // 1显示无数据， 2显示系统错误， '' 显示数据
            };
        },
        computed: {
            btnStatus() {
                return (Status) => {
                    let btnStatusText = '立即领取';
                    if (Status === 1) {
                        btnStatusText = "已领取"
                    }
                    return btnStatusText
                }
            },
            IsBtnDisabled() {
                return (Status) => {
                    let btnStatus = false;
                    if (Status === 1) {
                        btnStatus = true
                    }
                    return btnStatus
                }
            }
        },
        created() {

        },
        activated() {
            this.pageIndex = 1;
            this.resData = [];

            Toast.loading("载入中...");
            this.getData()
        },
        methods: {
            async getData() {
                try {
                    const res = await getCouponList(this.pageIndex, 10);
                    console.log('获取的结果：', res)
                    const {total, rows, page, currentPage, totalPage} = res.data;
                    Toast.hide();

                    if (total === 0) {
                        this.isShowType = 1;
                    } else {

                        this.resData = [...this.resData, ...rows];
                        this.pageIndex++;
                        this.isFinished = currentPage >= totalPage;

                        this.isShowType = "";

                        this.$refs.scrollView.finishRefresh();
                        this.$refs.scrollView.finishLoadMore();
                    }
                } catch (err) {
                    console.log(err);
                    // Toast.failed(err);
                    Toast.hide();
                    this.isShowType = 2;
                    // if (err.code === 500) {
                    //     Toast.hide();
                    //     this.isShowType = 2;
                    // }
                }
            },
            async getCouponHandle(id) {
                Toast.loading('领取中...')
                try {
                    const res = await getCoupon(id);
                    console.log(res)
                    const {code} = res;
                    if (code === '200') {
                        Toast.hide();

                        this.reload() // 调用方法
                    }
                } catch (err) {
                    Toast.failed(err)
                }

            },
            $_onRefresh() {
                // async data
                this.reload() // 调用方法
            },
            $_onEndReached() {
                if (this.isFinished) {
                    return;
                }
                // async data
                this.getData();
            },
            viewMoreHandle(e) {
                const obj = e.target.parentNode.parentNode.parentNode.getElementsByClassName("describe-text")[0];
                if (e.target.getAttribute("data-type") === "down") {

                    e.target.className = "arrow";
                    e.target.nextSibling.className = "arrow active";
                    obj.className = "describe-text"

                } else {
                    e.target.className = "arrow";
                    e.target.previousSibling.className = "arrow active";
                    obj.className = "describe-text hide";
                }
            },
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .coupon-container {
        .md-scroll-view {
            background: #ECEFF5;
        }

        .md-button.ghost-primary {
            padding: 0;
            color: #ff4602;
        }

        .md-button.ghost-primary::after {
            border-color: #ff4602;
        }

        .md-button.ghost-primary:disabled {
            color: #b3b1b1;
        }

        .md-button.ghost-primary:disabled::after {
            border-color: #b3b1b1;
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    .coupon-container {
        width: 100%;
        height: 100%;

        .scroll-view-list {
            padding: 20px 20px 0;
        }

        .coupon-item {
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            background-color: #fff;

            .coupon-item-inner {
                padding: 30px 30px 0;
                width: 100%;
                box-sizing: border-box;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
                /*box-shadow: 0 2px 8px #f0f1f2;*/
                font-size: 30px;
            }

            .coupon-item-img {
                width: 140px;
                height: 140px;

                img {
                    position: relative;
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;

                    &:after {
                        content: '';
                        position: absolute;
                        top: 0;
                        right: 0;
                        left: 0;
                        bottom: 0;
                        width: 100%;
                        height: 100%;
                        background-color: #eee;
                    }
                }
            }

            .coupon-item-info {
                flex: 1;
                height: 140px;
                padding-left: 16px;
                box-sizing: border-box;

                .coupon-item-info-inner {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: center;
                    line-height: 1.5;
                    border-bottom: solid 1px #e5e5e5;
                }

                .item-info-text {
                    flex: 1;
                    text-align: left;
                }

                .coupon-item-btn {
                    width: 150px;

                    .recipNum {
                        margin-top: 16px;
                        font-size: 18px;
                        line-height: 1.5;
                        color: #666;
                    }
                }

                .title {
                    font-size: 24px;
                    color: #111;
                }

                .coupon-money {
                    font-size: 50px;
                    color: #ff4602;
                }

                .coupon-money-amount {
                    margin-right: 6px;
                    display: inline-block;
                }

                .coupon-money-limit {
                    display: inline-block;
                    padding: 0 6px;
                    font-size: 18px;
                    color: #ff4602;
                    background-color: rgba(255, 70, 2, .1);
                }
            }

            .coupon-item-describe {
                position: relative;
                padding: 20px 80px 20px 30px;
                text-align: left;

                .describe-text {
                    font-size: 24px;
                    line-height: 1.5;

                }

                .hide {
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    word-break: break-all;
                }

                .view-more {
                    position: absolute;
                    right: 0;
                    top: 0;
                    /*bottom: 0;*/
                    width: 80px;
                    height: 76px;
                    text-align: center;

                    .Icon {
                        position: relative;
                        width: 100%;
                        height: 100%;
                    }

                    .arrow {
                        display: none;
                        position: relative;
                        width: 100%;
                        height: 100%;
                        text-align: center;

                        &:after {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                        }

                        .md-icon {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            display: block;
                            margin: auto;
                        }
                    }

                    .active {
                        display: block;
                    }

                }
            }

        }
    }
</style>
