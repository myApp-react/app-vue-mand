<template>
    <div class="activity-container">
        <md-result-page
                :img-url="error"
                text="服务器错误，请稍后再试"
                v-if="isShowType === 2"
        >
        </md-result-page>
        <md-result-page
                :img-url="noData"
                text="现在没有活动哦"
                v-else-if="isShowType === 1"
        >
        </md-result-page>
        <md-scroll-view
                ref="scrollView"
                :scrolling-x="false"
                :autoReflow="true"
                @endReached="$_onEndReached"
                v-else
        >
            <div
                    v-for="(item, index) in ActivityList"
                    :key="index"
                    class="scroll-view-list"
            >
                <router-link class="activity-item" :to="{name: 'details', params: {id:item.id}}">
                    <img :src="item.cover" alt="">
                    <div class="activity-item-sign" v-if="isshowSign(index)">推荐</div>
                    <div class="activity-item-text">
                        <p class="label-text">{{item.activityName}}</p>
                    </div>
                </router-link>
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
    import {ScrollView, Toast, ResultPage, ScrollViewMore} from "mand-mobile";
    import {getActivity} from "@/api/activity";

    export default {
        name: "activity",
        data() {
            return {
                ActivityList: [],
                isFinished: false,
                pageIndex: 1,
                noData: require("@/assets/noData.png"),
                error: require("@/assets/error.png"),
                isShowType: "", // 1显示无数据， 2显示系统错误， '' 显示数据
            };
        },
        components: {
            [ScrollView.name]: ScrollView,
            [ScrollViewMore.name]: ScrollViewMore,
            [ResultPage.name]: ResultPage,
        },
        computed: {
            isshowSign() {
                return (index) => index <= 2
            }
        },
        created() {
            // if (this.ActivityList.length === 0) {
            //     Toast.loading("加载中...");
            //     this.getActivity();
            // }
        },
        activated() {
            console.log(121, this.$route.meta.keepAlive)
            Toast.loading("载入中...");
            this.getActivity();
        },
        methods: {
            async getActivity() {
                try {
                    const res = await getActivity(this.pageIndex, 10);
                    const {
                        code,
                        data: {currentPage, totalPage, total, rows}
                    } = res;
                    if (code === "200") {
                        Toast.hide();
                        if (total === 0) {
                            this.isShowType = 1;
                        } else {
                            this.ActivityList = [...this.ActivityList, ...rows];
                            this.pageIndex++;
                            this.isFinished = currentPage >= totalPage;

                            this.isShowType = '';

                            this.$refs.scrollView.finishLoadMore();
                        }
                    }
                } catch (err) {
                    if (err.code === 500) {
                        Toast.hide();
                        this.isShowType = 2;
                    }
                }
            },
            $_onEndReached() {
                if (this.isFinished) {
                    return;
                }
                // async data
                this.getActivity();
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .activity-container {
        .md-scroll-view {
            background-color: #eceff5;
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    .activity-container {
        width: 100%;
        height: 100%;
        padding: 0 30px;
        box-sizing: border-box;
        background-color: #eceff5;

        .scroll-view-list {
            padding-top: 30px;
        }

        .activity-item {
            position: relative;
            display: block;
            width: 100%;
            height: 320px;
            font-size: 30px;
            border-radius: 8px;
            background-color: #ffffff;
            overflow: hidden;

            img {
                display: block;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .activity-item-sign {
                position: absolute;
                top: 0;
                left: 0;
                padding: 0 30px;
                font-size: 26px;
                color: #fff;
                line-height: 40px;
                background-color: #ff4602;
                border-radius: 10px 0px 20px 0px;
                z-index: 99;
            }

            .activity-item-text {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 120px;
                padding: 26px;
                box-sizing: border-box;
                text-align: left;
                letter-spacing: 0px;
                color: #fff;
                background: linear-gradient(
                                to top,
                                rgba(0, 0, 0, 0.7) 0%,
                                rgba(0, 0, 0, 0.3) 70%,
                                rgba(0, 0, 0, 0) 100%
                );
                background-blend-mode: normal, normal;
                z-index: 99;

                .label-text {
                    width: 100%;
                    font-size: 30px;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 1.5;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    word-break: break-all;
                }
            }
        }
    }
</style>
