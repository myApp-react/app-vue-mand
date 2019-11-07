<template>
    <div class="mineCollect-container">
        <md-result-page
                :img-url="error"
                text="服务器错误，请稍后再试"
                v-if="isShowType === 2"
        >
        </md-result-page>
        <md-result-page
                :img-url="noData"
                text="您还没有收藏信息"
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
                <cellswipe
                        :index="String(item.storeId)"
                        :key="index"
                        :btns="btns"
                        :data-id="item.storeId"
                        @skip="skip(item.storeId,item.enabled)"
                >
                    <div class="Collect-item">
                        <div class="item-img">
                            <img :src="item.cover">
                        </div>
                        <div class="item-text">
                            <div class="item-text-name">{{item.name}}</div>
                            <div class="item-text-time">收藏时间：{{item.createOn}}</div>
                        </div>
                    </div>
                </cellswipe>
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
    import {Toast, ScrollView, ResultPage, ScrollViewMore} from "mand-mobile";
    import {getCollect, CancelCollect} from "@/api/mine";
    import dayjs from "dayjs";

    export default {
        name: "mineCollect",
        components: {
            [ScrollView.name]: ScrollView,
            [ResultPage.name]: ResultPage,
            [ScrollViewMore.name]: ScrollViewMore
        },
        inject: ['reload'], // 引入方法
        data() {
            return {
                isFinished: false,
                resData: [],
                pageIndex: 1,
                btns: [
                    {
                        text: "取消收藏",
                        handler: index => {
                            console.log("我触发了操作", index);
                            console.log("我触发了操作", this);
                            this.cancelCollect(index);
                        }
                    }
                ],
                noData: require("@/assets/noData.png"),
                error: require("@/assets/error.png"),
                isShowType: "", // 1显示无数据， 2显示系统错误， '' 显示数据
            };
        },
        computed: {},
        created() {
            // Toast.loading("载入中...");
            // console.log(this.resData);
            // if (this.resData.length === 0) {
            //     this.getData();
            // }
        },
        activated() {
            Toast.loading('加载中...');
            this.pageIndex = 1;
            this.resData = [];
            this.getData();
        },
        methods: {
            async getData() {
                try {
                    const res = await getCollect(this.pageIndex, 10);
                    const {total, rows, page, currentPage, totalPage} = res.data;
                    Toast.hide();
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

                        this.isShowType = "";

                        this.$refs.scrollView.finishLoadMore();
                    }
                } catch (err) {
                    console.log(err);
                    Toast.hide();
                    if (err.code === 500) {
                        this.isShowType = 2;
                    }
                }
            },
            async cancelCollect(storeId) {
                Toast.loading("正在取消");
                try {
                    const res = await CancelCollect(storeId);
                    const {code} = res;
                    if (code === "200") {

                        Toast.succeed("已取消", 1500);
                        this.resData = this.resData.filter(item => item.storeId !== storeId);
                        if (this.resData.length === 0) {
                            this.isShowType = 1;
                        }
                    }
                } catch (err) {
                    console.log(err);
                    Toast.failed("取消失败", 1500);
                }
            },
            $_onEndReached() {
                if (this.isFinished) {
                    return;
                }
                // async data
                this.getData();
            },
            skip(storeId, enabled) {
                if (enabled === 'N') {
                    Toast.info('抱歉，该商铺已经下线')
                } else {
                    this.$router.push({name: 'shopsDetail', params: {id: storeId}});
                }
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .mineCollect-container {
        .list-item {
            height: 180px;
        }

        .list-box {
            padding: 20px;
        }

        .list-item .swipe-btn-handle {
            background: #ff4602;
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    .mineCollect-container {
        width: 100%;
        height: 100%;

        .scroll-view-list {
            padding: 30px 30px 0;
        }

        .md-scroll-view {
            background: #eceff5;
        }

        .cell-swipe-cont {
            background-color: #fff;
            box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
        }

        .scroll-view-item {
            padding: 30px 0;
            text-align: center;
            font-size: 32px;
            font-family: DINAlternate-Bold;
            border-bottom: 0.5px solid #efefef;
        }

        .Collect-item {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            font-size: 30px;

            .item-img {
                width: 140px;
                height: 140px;

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
                        background-color: #eee;
                    }
                }
            }

            .item-text {
                flex: 1;
                padding-left: 20px;
                box-sizing: border-box;
                line-height: 1.5;
                text-align: left;

                .item-text-name {
                    margin-bottom: 26px;
                    font-size: 30px;
                    font-family: DINAlternate-Bold;
                    color: #111;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    word-break: break-all;
                }

                .item-text-time {
                    font-size: 20px;
                    color: #666;
                }
            }
        }
    }
</style>
