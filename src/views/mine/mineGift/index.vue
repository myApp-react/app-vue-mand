<template>
  <div class="mineGift-container" >
      <md-tabs
              :titles="titles"
              :ink-bar-length="40"
              show-ink-bar
              @change="TabsChange"
              :default-index="0"
      >
          <div  v-for="(title, index) of titles" :key="index" class="tab-scrollView-inner">
              <md-result-page
                  :img-url="error"
                  text="服务器错误，请稍后再试"
                  v-if="isShowType === 2"
              >
              </md-result-page>
              <md-result-page
                  :img-url="noData"
                  text="暂无礼品记录"
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
                      <div class="gift-item">
                          <div class="list-header">
                              <div class="header-item">订单号：{{item.code}}</div>
                              <div class="header-item-status">{{statusText}}</div>
                          </div>
                          <div class="list-main">
                              <div class="main-img">
                                  <img :src="item.cover" alt="" >
                              </div>
                              <div class="main-info-text">
                                  <div class="text-label title">{{item.name}}</div>
                                  <div class="text-label integral">{{item.needsPoints}} 积分</div>
                                  <div class="text-label">兑换时间：{{item.reserveDate}}</div>
                                  <div class="text-label" v-if="item.giveOutTime">领取时间：{{item.giveOutTime}}</div>
                              </div>
                              <div class="main-info-num">x{{item.num}}</div>
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Vue from "vue";
import {
    Tabs,
    Field,
    FieldItem,
    Dialog,
    Toast,
    InputItem,
    Switch,
    DatePicker,
    TabBar,
    ScrollView,
    ScrollViewMore,
    ResultPage
} from "mand-mobile";

import { getMineGift } from "@/api/mine";
import dayjs from 'dayjs';
export default {
    name: "mineGift",
    components: {
        [Dialog.name]: Dialog,
        [Field.name]: Field,
        [FieldItem.name]: FieldItem,
        [InputItem.name]: InputItem,
        [Switch.name]: Switch,
        [DatePicker.name]: DatePicker,
        [Tabs.name]: Tabs,
        [ScrollView.name]: ScrollView,
        [ScrollViewMore.name]: ScrollViewMore,
        [TabBar.name]: TabBar,
        [ResultPage.name]: ResultPage
    },
    data() {
        return {
            titles: ["未领取","已失效", "已领取"],
            resData: [],
            isFinished: false,
            status: 1,
            scrollTop: 0,
            pageIndex: 1,
            noData: require("@/assets/noData.png"),
            error: require("@/assets/error.png"),
            isShowType: "", // 1显示无数据， 2显示系统错误， '' 显示数据
        };
    },
    computed: {
        statusText() {
            return this.status === 0 ? "已失效" : this.status === 1 ? "未领取" : "已领取"
        }
    },
    created() {
        // Toast.loading("载入中...");
        // // console.log(this.resData);
        // if (this.resData.length === 0) {
        //     this.getData();
        // }
    },
    activated() {
        Toast.loading('加载中...');
        this.getData();
    },
    methods: {
        async getData() {
            try {
                const res = await getMineGift(this.status, this.pageIndex, 10);
                console.log("结果：", res)
                const { total, rows, page, currentPage, totalPage } = res.data;
                Toast.hide();
                if (total === 0) {
                    this.isShowType = 1;
                } else {
                    rows.forEach(item => {
                        item.reserveDate = item.reserveDate ? dayjs(item.reserveDate).format(
                            "YYYY-MM-DD"
                        ) : '';
                        item.giveOutTime = item.giveOutTime ? dayjs(item.giveOutTime).format(
                            "YYYY-MM-DD"
                        ) : '';
                    });

                    this.resData = [...this.resData, ...rows];
                    this.pageIndex++;
                    this.isFinished = currentPage >= totalPage;

                    this.isShowType = "";

                    this.$refs.scrollView[this.status].finishRefresh();
                    this.$refs.scrollView[this.status].finishLoadMore();
                }

            }catch (err) {
                console.log(err);
                Toast.hide();
                this.isShowType = 2;
            }
        },

        TabsChange(index, preIndex) {
            Toast.loading("载入中...");

            if(index === 0){
                this.status = 1
            }else if(index === 1){
                this.status = 0
            }else {
                this.status = index;
            }

            this.resData = [];
            this.pageIndex = 1;
            this.isShowType = "";
            this.isFinished = false;
            this.getData();
        },
        $_onEndReached() {
            if (this.isFinished) {
                return;
            }
            // async data
            this.getData();
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss">
    .mineGift-container{
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
        .md-tab-bar .md-tab-title.active{
            color: #e8541e;
        }
        .md-tab-bar .ink-bar{
            height: 4px;
            background: #e8541e;
        }
        .md-tag{
            margin-right: 6px;
            font-size: 18px;
            vertical-align: middle;
            .default{
                padding: 0 10px!important;
                font-size: 18px!important;
                line-height: 1.5!important;
            }
        }
        .md-button.ghost-primary:disabled{
            color: #b3b1b1;
            background-color: #e5e4e3;
            &:after{
                border-color: #e5e4e3;
            }
        }
        .md-scroll-view{
            background: #ECEFF5;
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.mineGift-container {
    width: 100%;
    height: 100%;
    .md-tabs {
        position: relative;
        height: 100%;
        padding-top: 80px;
        box-sizing: border-box;
    }
    .tab-scrollView-inner{
        width: 100%;
        height: 100%;
    }
    .scroll-view-list{
        padding: 20px 20px 0;
    }
    .gift-item{


        box-shadow: 0px 0px 10px 0px
        rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        background: #fff;
        .list-header{
            position: relative;
            padding: 0 30px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            font-size: 26px;
            line-height: 74px;
            &:after{
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 0;
                border-bottom: 1px solid #e5e5e5;
            }
            .header-item{
                color: #111;
            }
            .header-item-status{
                color: #ff4602;
            }
        }
        .list-main{
            padding: 30px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            .main-img{
                width: 138px;
                height: 138px;
                border-radius: 8px;
                border: solid 1px #e5e5e5;
                overflow: hidden;
                background: #eee url(../../../assets/img_error.png) no-repeat center center;
                background-size: 75px auto;
                img{
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
            .main-info-text{
                flex: 1;
                padding-left: 30px;
                text-align: left;
                line-height: 1.5;
                .text-label{
                    font-size: 24px;
                    color: #666666;
                }
                .title{
                    font-size: 30px;
                    color: #111111;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    word-break: break-all;
                }
                .integral{
                    font-size: 30px;
                    color: #ff4602;
                }
            }
        }
    }
}
</style>
