<template>
    <div class="mineTicket-container">
        <md-result-page
                :img-url="error"
                text="服务器错误，请稍后再试"
                v-if="isShowType === 2"
        >
        </md-result-page>
        <md-result-page
                :img-url="noData"
                text="暂无小票积分记录"
                v-else-if="isShowType === 1"
        >
        </md-result-page>

        <md-scroll-view
                ref="scrollView"
                :autoReflow="true"
                :scrolling-x="false"
                @endReached="$_onEndReached"
                v-else
        >
            <div
                    v-for="(item, index) in resData"
                    :key="index"
                    class="scroll-view-list"
            >
                <div class="Ticket-list">
                    <div class="list-main">
                        <div class="list-main-img">
                            <img :src="item.imageUrl" alt="" @click="viewImg">
                        </div>
                        <div class="list-main-info">
                            <div class="main-info-text title" v-show="item.state === 0">{{stateText(item.state)}}</div>
                            <div class="main-info-text title" v-show="item.state !== 0">小票号：{{item.receiptCode}}</div>
                            <div class="main-info-text">上传日期：{{item.createOn}}</div>
                            <div class="main-info-text" v-show="item.state !== 0">{{item.point}}积分</div>
                        </div>
                        <div :class="item.state === 1 ? 'list-main-state yes' : item.state === 2 ? 'list-main-state  no' : 'list-main-state'"
                             v-show="item.state !== 0">
                            <div class="main-state-tag">{{stateText(item.state)}}</div>
                        </div>
                    </div>
                    <div class="list-footer" v-show="item.state === 2">
                        <p class="list-footer-text">驳回理由：{{item.reason!==null?rejectReason[item.reason]:""}}</p>
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
    import {ResultPage, Toast, ScrollView, ScrollViewMore} from "mand-mobile";

    import {getTicket} from "@/api/mine";
    import dayjs from "dayjs";
    import wx from "weixin-js-sdk";

    export default {
        name: "ticket",
        components: {
            [ScrollView.name]: ScrollView,
            [ScrollViewMore.name]: ScrollViewMore,
            [ResultPage.name]: ResultPage
        },
        data() {
            return {
                rejectReason: ['已积分', '已过期', '无效商铺'],
                noData: require("@/assets/noData.png"),
                error: require("@/assets/error.png"),
                isShowType: "", // 1显示无数据， 2显示系统错误， '' 显示数据
                resData: [],
                pageIndex: 1,
                isFinished: false,
            };
        },
        computed: {},
        watch: {},
        created() {
            // Toast.loading("载入中...");
            // if (this.resData.length === 0) {
            //     this.getTicket();
            // }
        },
        activated() {
            Toast.loading('加载中...');
            this.getTicket();
        },
        methods: {
            async getTicket() {
                try {
                    const res = await getTicket(this.pageIndex, 10);
                    Toast.hide();
                    console.log(res.data);
                    const {total, rows, page, currentPage, totalPage} = res.data;
                    if (total === 0) {
                        this.isShowType = 1;
                    } else {
                        rows.forEach(item => {
                            item.createOn = dayjs(item.createOn).format(
                                "YYYY-MM-DD HH:mm"
                            );
                        });

                        this.resData = [...this.resData, ...rows];
                        this.pageIndex++;
                        this.isFinished = currentPage >= totalPage;

                        this.isShowType = '';

                        this.$refs.scrollView.finishLoadMore();
                    }
                } catch (err) {
                    console.log(err);
                    Toast.hide();
                    this.isShowType = 2;
                    if (err.code === 500) {
                        this.isShowType = 2;
                    }
                }
            },
            $_onEndReached() {
                if (this.isFinished) {
                    return;
                }
                // async data
                this.getTicket();
            },
            viewImg(e) {
                const src = e.target.src;
                wx.previewImage({
                    current: src, // 当前显示图片的http链接
                    urls: [src] // 需要预览的图片http链接列表
                });
            },
            stateText(state) {
                return state === 0 ? "待审核" : state === 1 ? "已通过" : "已驳回";
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .mineTicket-container {
        .md-scroll-view {
            background: #eceff5;
        }

        .md-scroll-view .scroll-view-container {
            background: #eceff5;
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    .mineTicket-container {
        width: 100%;
        height: 100%;

        .scroll-view-list {
            width: 100%;
            padding: 20px 20px 0;
            box-sizing: border-box;
        }

        .Ticket-list {
            font-size: 28px;
            background: #fff;
            box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
            border-radius: 10px;

            .list-main {
                padding: 30px;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
                border-bottom: 1px solid #eee;

                .list-main-img {
                    width: 120px;
                    height: 120px;
                    border-radius: 8px;
                    overflow: hidden;

                    img {
                        position: relative;
                        display: block;
                        width: 100%;
                        height: 100%;
                        object-fit: cover;

                        &:after {
                            content: "";
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: #eee;
                        }
                    }
                }

                .list-main-info {
                    padding-left: 30px;
                    box-sizing: border-box;
                    flex: 1;
                    line-height: 1.5;
                    text-align: left;

                    .main-info-text {
                        font-size: 20px;
                        color: #666;
                    }

                    .title {
                        font-size: 30px;
                        color: #111111;
                    }
                }

                .list-main-state {
                    padding-left: 10px;

                    .main-state-tag {
                        padding: 0 20px;
                        height: 50px;
                        line-height: 50px;
                        font-size: 24px;
                        border-radius: 4px;
                        border: solid 1px;
                    }
                }

                .yes {
                    .main-state-tag {
                        color: #ff4602;
                        border-color: #ff4602;
                    }
                }

                .no {
                    .main-state-tag {
                        color: #999;
                        border: solid 1px #ccc;
                    }
                }
            }

            .list-footer {
                padding: 20px;
                line-height: 1.5;
                text-align: left;

                .list-footer-text {
                    font-size: 26px;
                    color: #666;
                }
            }
        }

        .scroll-view-item {
            padding: 30px 0;
            text-align: center;
            font-size: 32px;
            font-family: DINAlternate-Bold;
            border-bottom: 0.5px solid #efefef;
        }
    }
</style>
