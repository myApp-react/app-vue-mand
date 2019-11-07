<template>
    <div class="mineVoucher-container">
        <md-tabs
                :titles="titles"
                :ink-bar-length="40"
                show-ink-bar
                @change="TabsChange"
        >
            <div v-for="(title, index) of titles" :key="index" class="tab-scrollView-inner">
                <md-result-page
                        :img-url="error"
                        text="服务器错误，请稍后再试"
                        v-if="isShowType === 2"
                >
                </md-result-page>
                <md-result-page
                        :img-url="noData"
                        text="暂无记录"
                        v-else-if="isShowType === 1"
                >
                </md-result-page>
                <md-scroll-view
                        ref="scrollView"
                        :scrolling-x="false"
                        v-else
                        @refreshing="$_onRefresh"
                        @endReached="$_EndReached"
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
                            <div :class="classSatus(item.type)">
                                <div class="coupon-item-img">
                                    <img :src="item.image" alt="">
                                </div>
                                <div class="coupon-item-info">
                                    <div class="coupon-item-info-inner">
                                        <div class="item-info-text">
                                            <div class="title">
                                                <tag size="small" shape="circle" type="fill" fill-color="#ff4400"
                                                     font-color="#fff">{{tagText(item.type)}}
                                                </tag>
                                                <span class="title-text">{{item.couponName}}</span>
                                            </div>
                                            <div class="coupon-money">
                                                <span class="coupon-money-amount">{{item.faceValue}}</span>
                                                <span class="coupon-money-limit" v-if="item.limitValue"> (满{{item.limitValue}}可用)</span>
                                            </div>
                                            <div class="range-date">有效期: {{!item.startTime || !item.endTime ? '永久有效' :
                                                `${item.startTime} - ${item.endTime}`}}
                                            </div>
                                        </div>
                                        <div class="coupon-item-btn">
                                            <md-button
                                                    type="ghost-primary"
                                                    size="small"
                                                    :disabled="SatusDis"
                                                    @click="showPopUp('center', item.couponCode, item.qrCode)"
                                            >{{Satustext}}
                                            </md-button>
                                        </div>
                                    </div>
                                </div>
                                <div class="Expired-tips" v-if="isshowTag(item.currentTime, item.endTime)">即将过期</div>
                            </div>
                            <div class="coupon-item-describe">
                                <p class="describe-text hide">使用详情：{{item.detail || "无"}}</p>
                                <div class="view-more">
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

        </md-tabs>

        <md-popup v-model="isPopupShow.center">
            <div class="mine-index-popup">
                <div class="userCard-Num">{{isPopupShow.couponCode}}</div>
                <div class="silde-circle"></div>
                <div class="userCard-img">
                    <img :src="isPopupShow.qrCode" alt="">
                </div>
            </div>
        </md-popup>
    </div>
</template>

<script>
    import dayjs from "dayjs";
    import {
        Tabs,
        Field,
        Button,
        FieldItem,
        Dialog,
        InputItem,
        Switch,
        DatePicker,
        TabBar,
        Toast,
        Icon,
        Tag,
        ScrollView,
        ScrollViewMore,
        ScrollViewRefresh,
        ResultPage,
        Popup,
        PopupTitleBar
    } from "mand-mobile";
    import {getCouponList} from "@/api/mine";

    export default {
        name: "mineVoucher",
        components: {
            [Dialog.name]: Dialog,
            [Field.name]: Field,
            [FieldItem.name]: FieldItem,
            [InputItem.name]: InputItem,
            [Switch.name]: Switch,
            [DatePicker.name]: DatePicker,
            [Tabs.name]: Tabs,
            [Icon.name]: Icon,
            [ScrollView.name]: ScrollView,
            [ScrollViewMore.name]: ScrollViewMore,
            [TabBar.name]: TabBar,
            [ScrollViewRefresh.name]: ScrollViewRefresh,
            [Button.name]: Button,
            [ResultPage.name]: ResultPage,
            [Popup.name]: Popup,
            [PopupTitleBar.name]: PopupTitleBar,
            Tag
        },
        data() {
            return {
                titles: ["未使用", "已使用", "已失效"],
                list: 15,
                status: 0,
                scrollTop: 0,
                resData: [],
                pageIndex: 1,
                isFinished: false,
                isPopupShow: {},
                noData: require("@/assets/noData.png"),
                error: require("@/assets/error.png"),
                isShowType: "", // 1显示无数据， 2显示系统错误， '' 显示数据
            };
        },
        computed: {
            tagText() {
                return (type) => {
                    let typeStr = "现金券";
                    if (type === 1) {
                        typeStr = "领物券"
                    } else if (type === 2) {
                        typeStr = "停车券"
                    }
                    return typeStr
                }
            },
            classSatus() {
                return (type) => {
                    let typeStr = "coupon-item-inner";
                    if (type === 0) {
                        typeStr = "coupon-item-inner cash"
                    } else if (type === 1) {
                        typeStr = "coupon-item-inner car"
                    } else if (type === 2) {
                        typeStr = "coupon-item-inner car"
                    }
                    return typeStr
                }
            },
            Satustext() {
                return this.status === 0 ? "使用" : this.status === 1 ? "已使用" : "已失效"
            },
            SatusDis() {
                // return this.status !== 0
                return this.status !== 0
            },
            isshowTag() {
                return (current, end) => {
                    let init = false;
                    if (end) {
                        const Remaining = end - current;
                        if (Remaining > 0) {
                            const Day = Remaining / (24 * 60 * 60 * 1000)
                            console.log("Day===", Day)
                            if (Day <= 5) {
                                init = true
                            }
                        }
                    }
                    return init
                }
            },


        },
        created() {
            // Toast.loading("载入中...");
            // console.log(this.resData);
            // if (this.resData.length === 0) {
            //     this.getData();
            // }
        },
        activated() {
            console.assert(112);
            console.log(this.$route.meta.keepAlive);

            Toast.loading('加载中...');
            this.getData();
        },
        mounted() {
            window.ScrollViewTrigger1 = () => {
                this.$refs.scrollView.triggerRefresh();
            };
        },
        methods: {
            async getData() {
                try {
                    const res = await getCouponList(this.status, this.pageIndex, 10);
                    const {total, rows, page, currentPage, totalPage} = res.data;
                    Toast.hide();
                    if (total === 0) {
                        this.isShowType = 1;
                    } else {
                        rows.forEach(item => {
                            item.startTime = item.startTime === null || !item.startTime ? '' : dayjs(item.startTime).format(
                                "YYYY-MM-DD"
                            );
                            item.endTime = item.endTime === null || !item.endTime ? '' : dayjs(item.endTime).format(
                                "YYYY-MM-DD"
                            );
                        });

                        this.resData = [...this.resData, ...rows];
                        this.pageIndex++;
                        this.isFinished = currentPage >= totalPage;

                        this.isShowType = "";

                        this.$refs.scrollView[this.status].finishRefresh();
                        this.$refs.scrollView[this.status].finishLoadMore();
                    }

                } catch (err) {
                    Toast.hide();
                    this.isShowType = 2;
                }
            },
            showPopUp(type, couponCode, qrCode) {
                console.log(type)
                console.log(couponCode)
                console.log(qrCode)
                this.$set(this.isPopupShow, type, true);
                this.$set(this.isPopupShow, 'couponCode', couponCode);
                this.$set(this.isPopupShow, 'qrCode', qrCode);
                console.log(this.isPopupShow)
            },
            TabsChange(index, preIndex) {
                Toast.loading("载入中...");
                console.log(index);
                this.status = index;
                this.resData = [];
                this.pageIndex = 1;
                this.isShowType = "";
                this.isFinished = false;
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
            $_onRefresh() {//未使用
                // async data
                // setTimeout(() => {
                //     this.list += 5;
                //     this.$refs.scrollView[this.status].finishRefresh();
                // }, 2000);
                this.resData = [];
                this.pageIndex = 1;
                this.isFinished = false;
                this.getData();

            },
            $_EndReached() {
                if (this.isFinished) {
                    return;
                }
                // async data
                this.getData();
            },

        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .mineVoucher-container {
        .md-tabs {
            .md-tab-bar {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
            }
        }

        .md-tabs .md-tab-content-wrapper {
            height: 100%;
        }

        .md-tab-bar .md-tab-title.active {
            color: #e8541e;
        }

        .md-tab-bar .ink-bar {
            height: 4px;
            background: #e8541e;
        }

        .md-tag {
            margin-right: 6px;
            font-size: 18px;
            vertical-align: middle;

            .default {
                padding: 0 10px !important;
                font-size: 18px !important;
                line-height: 1.5 !important;
            }
        }

        .md-button.ghost-primary:disabled {
            color: #b3b1b1 !important;
            background-color: #e5e4e3 !important;

            &:after {
                border-color: #e5e4e3 !important;
            }
        }

        .goods {
            .md-tag {
                .default {
                    background-color: #108ee9 !important;
                }
            }

            .md-button.ghost-primary {
                color: #108ee9;

                &:after {
                    border-color: #108ee9;
                }

                &:active:before {
                    background-color: rgba(16, 142, 233, 0.2);
                }
            }
        }

        .cash {
            .md-tag {
                .default {
                    background-color: #ff4602 !important;
                }
            }

            .md-button.ghost-primary {
                color: #ff4602;

                &:after {
                    border-color: #ff4602;
                }

                &:active:before {
                    background-color: rgba(255, 70, 2, 0.21);
                }
            }
        }

        .car {
            .md-tag {
                .default {
                    background-color: #ffa22e !important;
                }
            }

            .md-button.ghost-primary {
                color: #ffa22e;

                &:after {
                    border-color: #ffa22e;
                }

                &:active:before {
                    background-color: rgba(255, 162, 46, 0.2);
                }
            }
        }


    }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    .mineVoucher-container {
        width: 100%;
        height: 100%;

        .md-scroll-view {
            background-color: #ECEFF5;
        }

        .md-tabs {
            position: relative;
            height: 100%;
            padding-top: 80px;
            box-sizing: border-box;
        }

        .tab-scrollView-inner {
            width: 100%;
            height: 100%;
        }

        .scroll-view-list {
            padding: 20px 20px 0;
        }

        .coupon-item {
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            background-color: #fff;

            .coupon-item-inner {
                position: relative;
                padding: 30px 30px 0;
                width: 100%;
                box-sizing: border-box;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
                font-size: 30px;
                overflow: hidden;

                .Expired-tips {
                    position: absolute;
                    top: 16px;
                    left: -30px;
                    transform: rotate(-45deg);
                    padding: 0 30px;
                    font-size: 18px;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 36px;
                    color: #ffffff;
                    background-color: #E8541E;
                }
            }

            .goods {
                .coupon-item-info {
                    .coupon-money {
                        color: #108ee9;
                    }

                    .coupon-money-limit {
                        color: #108ee9;
                        background-color: rgba(16, 142, 233, .1);
                    }
                }

            }

            .cash {
                .coupon-item-info {
                    .coupon-money {
                        color: #ff4602;
                    }

                    .coupon-money-limit {
                        color: #ff4602;
                        background-color: rgba(255, 70, 2, 0.1);
                    }
                }
            }

            .car {
                .coupon-item-info {
                    .coupon-money {
                        color: #ffa22e;
                    }

                    .coupon-money-limit {
                        color: #ffa22e;
                        background-color: rgba(255, 162, 46, 0.1);
                    }
                }
            }

            .coupon-item-img {
                width: 140px;
                height: 140px;
                overflow: hidden;
                background: #eee url(../../../assets/img_error.png) no-repeat center center;
                background-size: 75px auto;

                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
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
                    padding: 6px 0;
                    box-sizing: border-box;
                    display: flex;
                    flex-wrap: wrap;
                    line-height: 1.5;
                    border-bottom: solid 1px #e5e5e5;
                }

                .item-info-text {
                    flex: 1;
                    text-align: left;
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: row;
                    align-content: space-between;
                }

                .coupon-item-btn {
                    width: 150px;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;

                    .recipNum {
                        margin-top: 16px;
                        font-size: 18px;
                        line-height: 1.5;
                        color: #666;
                    }
                }

                .title {
                    width: 100%;
                    font-size: 24px;
                    color: #111;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    word-break: break-all;

                    .title-text {
                        display: inline-block;
                        vertical-align: middle;
                    }
                }

                .coupon-money {
                    width: 100%;
                    font-size: 50px;
                    line-height: 1;
                    color: #cccbca;
                }

                .range-date {
                    width: 100%;
                    font-size: 18px;
                    color: #666;
                }

                .coupon-money-amount {
                    margin-right: 6px;
                    display: inline-block;
                }

                .coupon-money-limit {
                    display: inline-block;
                    padding: 4px 6px;
                    font-size: 18px;
                    color: #999897;
                    background-color: rgba(153, 152, 151, .2);
                }
            }

            .coupon-item-describe {
                position: relative;
                padding: 20px 80px 20px 30px;
                text-align: left;

                .describe-text {
                    font-size: 24px;
                    line-height: 1.5;
                    white-space: normal;
                    word-break: break-all;
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

        .mine-index-popup {
            width: 540px;
            font-size: 30px;
            line-height: 1.5; /* background-color: #fff; */
            border-radius: 10px;
            overflow: hidden;

            .userCard-Num {
                margin-bottom: -2px;
                position: relative;
                width: 100%;
                height: 150px;
                font-size: 40px;
                font-weight: normal;
                font-stretch: normal;
                line-height: 150px;
                letter-spacing: 0px;
                color: #666666;
                text-align: center;
                background-color: #fff;
            }

            .silde-circle {
                position: relative;
                width: 100%;
                height: 30px;
                font-size: 0;
                background: url(../../../assets/silde-circle.png) no-repeat center center;
                background-size: 100% 100%;
            }

            .userCard-img {
                margin-top: -2px;
                width: 100%;
                padding: 60px 0 70px;
                background-color: #fff;

                img {
                    position: relative;
                    display: block;
                    margin: auto;
                    width: 400px;
                    height: 400px;
                }
            }

            .card-num {
                margin-top: 20px;
                font-weight: bolder;
            }
        }
    }
</style>
