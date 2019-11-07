<template>
  <div class="mineActivity-container" >
      <div class="Activity-item-cont">
          <md-result-page
                  :img-url="error"
                  text="服务器错误，请稍后再试"
                  v-if="isShowType === 2"
          >
          </md-result-page>
          <md-result-page
                  :img-url="noData"
                  text="您还没有参加活动哦"
                  v-else-if="isShowType === 1"
          >
          </md-result-page>
          <md-scroll-view
                  ref="scrollView"
                  :scrolling-x="false"
                  :autoReflow="true"
                  :bouncing="false"
                  @endReached="$_onEndReached"
                  v-else
          >
              <div v-for="(item, index) in resData"
                   :key="index"
                   class="scroll-view-list"
              >
                  <cellswipe
                          :index="item.id"
                          :key="index"
                          :LocationNum="index"
                          :btns="btnType(item.status)"
                          :data-id="item.id"
                          @skip="skip"
                  >
                      <div class="Collect-item">
                          <div class="item-img">
                              <img :src="item.cover" alt="">
                          </div>
                          <div class="item-text">
                              <div class="item-text-name">{{item.activityName}}</div>
                              <div class="item-text-time">有效期：{{`${item.startTime} - ${item.endTime}`}}</div>
                              <div class="item-text-time">报名日期：{{item.applyTime}}</div>
                          </div>
                          <div class="item-status">
                              <div :class="statusText(item.status)">{{item.status}}</div>
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
      <div class="Activity-btn">
          <md-button :disabled="scanBtnStatus" icon="icon-Scan" size="small" @click="ScanCheckIn">活动签到</md-button>
      </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Vue from "vue";
import {
    Button,
    ScrollView,
    ScrollViewMore,
    Dialog,
    Toast,
    ResultPage
} from "mand-mobile";
import { jssdk } from "@/api/smallVotePoints";
import { getActivity, cancelactivity, deleteactivity } from "@/api/mine";
import { signinActivity } from "@/api/activity";
import wx from "weixin-js-sdk";
import dayjs from "dayjs";
import "@/assets/Scan.svg";

export default {
    name: "mineActivity",
    components: {
        [Dialog.name]: Dialog,
        [ScrollView.name]: ScrollView,
        [ScrollViewMore.name]: ScrollViewMore,
        [Button.name]: Button,
        [ResultPage.name]: ResultPage,
    },
    data() {
        return {
            isFinished: false,
            resData: [],
            pageIndex: 1,
            btnStatus: true,
            noData: require("@/assets/noData.png"),
            error: require("@/assets/error.png"),
            isShowType: "", // 1显示无数据， 2显示系统错误， '' 显示数据
        };
    },
    computed: {
        btnType() {
            return (status) => {
                let btnData = [];
                if(status === '未开始'){
                    btnData = [
                        {
                            text: "取消报名",
                            handler: index => {
                                console.log("我触发了操作", index);
                                this.cancelActivity(index)
                            }
                        }
                    ]
                }else if (status === '已结束' || status === '已取消'){
                    btnData = [
                        {
                            text: "删除报名",
                            handler: index => {
                                this.deleteActivity(index)
                            }
                        }
                    ]
                }
                return btnData
            }
        },
        statusText() {
            return (status) => {
                let initClass = 'item-text-name';
                if(status === '已结束' || status === '已取消'){
                    initClass = 'item-text-name text-gray'
                }
                return initClass
            }
        },
        scanBtnStatus() {
            let initStatus = true;
            if(!this.btnStatus){// jdk 准备好了
                if(this.resData.length !== 0){ //不为空数据
                    // const filiterData = this.resData.filter(item => item.status === "未开始");
                    const filiterData = this.resData.filter(item => item.status === "已开始");
                    console.log("filiterData",filiterData)
                    if(filiterData.length > 0){//未开始活动 > 0
                        initStatus = false;
                    }
                }
            }
            return initStatus
        }
    },
    created() {
        // this.wxConfig();
        // if (this.resData.length === 0) {
        //     Toast.loading("载入中...");
        //     this.getData();
        // }
    },
    activated() {
        Toast.loading('加载中...');
        this.wxConfig();

        this.getData();
    },
    methods: {
        async getData() {
            try {
                const res = await getActivity(this.pageIndex, 10);
                console.log(res)
                const { total, rows, page, currentPage, totalPage } = res.data;
                Toast.hide();
                if (total === 0) {
                    this.isShowType = 1;
                } else {
                    rows.forEach(item => {
                        item.startTime = dayjs(item.startTime).format(
                            "YYYY.MM.DD"
                        );
                        item.endTime = dayjs(item.endTime).format(
                            "YYYY.MM.DD"
                        );
                        item.applyTime = dayjs(item.applyTime).format(
                            "YYYY.MM.DD HH:mm"
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
                this.isShowType = 2;
                if (err.code === 500) {
                    Toast.hide();
                    this.isShowType = 2;
                }
            }
        },
        async wxConfig() {
            try {
                const res = await jssdk();
                const { appid, nonceStr, signature, timestamp } = res.data;
                console.log(res);
                wx.config({
                    debug: false,
                    appId: appid,
                    timestamp: timestamp,
                    nonceStr: nonceStr,
                    signature: signature,
                    jsApiList: ["scanQRCode"]
                });
                wx.ready(_ => {
                    this.btnStatus = false;
                });
                wx.error(res => {
                    console.log(res);
                });
            } catch (err) {
                console.log(err);
            }
        },
        $_onEndReached() {
            if (this.isFinished) {
                return;
            }
            // async data
            this.getData()
        },
        ScanCheckIn() {
            const _self = this;
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function(res) {
                    const { resultStr } = res;
                    console.log('resultStr',resultStr)
                    _self.SigninActivity(resultStr)
                }
            });
        },
        async SigninActivity(activityId) {
            console.log('activityId', activityId)
            Toast.loading('正在签到...');
            try {
                const res = await signinActivity(activityId);
                console.log(res)
                const { code, msg } = res;
                if(code === '200'){
                    Toast.succeed('签到成功！');
                    this.pageIndex = 1;
                    this.resData = [];
                    this.getData();
                    // this.resData = this.resData.filter(item => item.id !== activityId)

                }else {
                    Toast.failed(msg);
                }
            }catch (err) {
                console.log("失败结果", err);
                Toast.failed(err)
            }
        },
        async cancelActivity(id) {//取消报名
            Toast.loading('取消报名中...');
            try {
                const res = await cancelactivity(id);
                console.log(res);
                const { code, msg } = res;
                if(code === '200'){
                    Toast.succeed('已取消');
                    console.log("this.pageIndex===", this.pageIndex)
                    this.pageIndex = 1;
                    this.resData = [];
                    this.getData();
                }
            }catch (err) {
                console.log("错误信息：", err)
                if(err){
                    Toast.failed(err);
                    return
                }
                Toast.failed('取消报名失败')
            }
        },
        async deleteActivity(id) {//删除报名
            Toast.loading('删除中...');
            try {
                const res = await deleteactivity(id);
                console.log("删除结果：", res);
                const { code, msg } = res;
                if(code === '200'){
                    Toast.succeed('已删除');
                    this.pageIndex = 1;
                    this.resData = [];
                    this.getData();
                }
            }catch (err) {
                console.log("错误信息：", err)
                if(err){
                    Toast.failed(err);
                    return
                }
                Toast.failed('删除失败')
            }
        },
        skip(index) {
            console.log("skip", index);
            this.$router.push(`/activity/details/${index}`);
        }

    }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.mineActivity-container {
    .list-item {
        height: 180px;
        .swipe-btn-handle {
            background: #ff4602;
        }
    }
    .md-scroll-view {
        background: #eceff5;
    }
    .list-box {
        padding: 0;
    }
    .md-button.primary{
        height: 80px;
        line-height: 80px;
        font-size: 30px;
        background-color: #ff4602;
    }
    .md-button.primary.small {
        height: 80px;
        line-height: 80px;
        font-size: 30px;
        background-color: #ff4602;
    }
    .md-button.primary:disabled {
        background-color: #ccc;
    }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.mineActivity-container {
    position: relative;
    width: 100%;
    height: 100%;
    padding-bottom: 120px;
    box-sizing: border-box;
    .Activity-item-cont {
        width: 100%;
        height: 100%;
        .scroll-view-item {
            padding: 30px 0;
            text-align: center;
            font-size: 32px;
            font-family: DINAlternate-Bold;
            border-bottom: 0.5px solid #efefef;
        }
    }
    .Activity-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        padding: 20px 30px;
        box-sizing: border-box;
        background: #fff;
        box-shadow: 0 0 35px 0 rgba(3, 0, 0, 0.14);
    }
    .scroll-view-list {
        /*margin-top: 20px;*/
        padding: 20px 20px 0;
        box-sizing: border-box;
    }
    .cell-swipe-cont {
        border-radius: 10px;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
        -webkit-appearance: none;
        -webkit-backface-visibility: hidden;
         -moz-backface-visibility: hidden;
         -webkit-transform: translate3d(0, 0, 0);
         -moz-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
    .Collect-item {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        background-color: #fff;
        .item-img {
            width: 180px;
            height: 180px;
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
                margin-bottom: 12px;
                font-size: 30px;
                font-family: DINAlternate-Bold;
                color: #111111;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                word-break: break-all;
            }
            .item-text-time {
                font-size: 20px;
                color: #666;
                opacity: 0.7;
            }
        }
        .item-status {
            width: 100px;
            padding: 0 10px;
            font-size: 24px;
            font-weight: normal;
            font-stretch: normal;
            line-height: 36px;
            letter-spacing: 0px;
            color: #ff4602;
            .text-gray{
                color: #666666;
                opacity: 0.7;
            }
        }
    }
}
</style>
