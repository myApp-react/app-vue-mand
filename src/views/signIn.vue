<template>
  <div class="sign-container">
    <div v-if="info.startDate>info.currentTime||is_activity" class="sign-mask">
        <md-activity-indicator
        v-show="loading"
        class="md-activity-indicator-css"
        type="spinner"
        :size="100"
        :text-size="60"
        color="light"
      >加载中...</md-activity-indicator>
        <div v-if="is_activity" class="error">{{error_tips}}</div>
        <div v-if="info.startDate" class="countdown">
          <countdown
            v-if="this.info.length !== 0"
            v-on:start_callback="countDownS_cb(1)"
            v-on:end_callback="countDownE_cb(1)"
            :currentTime="Number(info.currentTime)"
            :startTime="Number(info.startDate)"
            :endTime="Number(info.endDate)"
            :tipText="'活动开始倒计时'"
            :tipTextEnd="'活动结束倒计时'"
            :endText="'活动已结束'"
            :dayTxt="'天'"
            :hourTxt="'时'"
            :minutesTxt="'分'"
            :secondsTxt="'秒'"
          ></countdown>
        </div>
    </div>
    <div class="sign-header">
      <div class="sign-header-date">
        <div class="title"></div>
        <div class="countdown">
          <countdown
            v-if="this.info.length !== 0"
            v-on:start_callback="countDownS_cb(1)"
            v-on:end_callback="countDownE_cb(1)"
            :currentTime="Number(info.currentTime)"
            :startTime="Number(info.startDate)"
            :endTime="Number(info.endDate)"
            :tipText="'活动开始倒计时'"
            :tipTextEnd="'活动结束倒计时'"
            :endText="'活动已结束'"
            :dayTxt="'天'"
            :hourTxt="'时'"
            :minutesTxt="'分'"
            :secondsTxt="'秒'"
          ></countdown>
        </div>
      </div>
      <div class="sign-header-sign">
        <div class="sign-btn" @click="signIn">
          <span class="point">+{{info.point}}</span>
          <span class="btn">{{info.isSign==0?'签到':'已签到'}}</span>
        </div>
      </div>
      <div class="sign-header-total">
        <div class="sign-total-left">
          <span class="add-up-time">累计签到次数</span>
          <span class="add-up-point">{{info.record.signCount}}</span>
        </div>
        <div class="sign-total-right">
          <span class="add-up-time">累计积分数</span>
          <span class="add-up-point">{{info.record.pointCount}}</span>
        </div>
      </div>
    </div>
    <div class="sign-content">
      <span class="title">
        <md-icon name="icon-sign-explain" size="sm"></md-icon>
        <strong>签到说明</strong>
      </span>
      <span class="content">{{info.note}}</span>
    </div>
    <div class="sign-footer">
      <span class="title">
        <md-icon name="icon-sign-records" size="sm"></md-icon>
        <strong>签到记录</strong>
      </span>
      <div class="content">
        <ul>
          <li v-for="(item, index) in info.record.record" :key="index">
            <md-icon name="icon-sign-day" size="sm"></md-icon>
            <span class="sign-date">签到时间 :</span>
            <span>{{Timer(item)}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="tel-footer">活动热线 : {{hotline}}</div>
  </div>
</template>

<script>
import { signDetail, signIn } from "@/api/signIn";
import { Icon, Toast,ActivityIndicator } from "mand-mobile";
import "@/assets/svg/sign-explain.svg";
import "@/assets/svg/sign-records.svg";
import "@/assets/svg/sign-day.svg";
import dayjs from "dayjs";

export default {
  name: "signIn",
  inject: ["reload"], // 引入方法
  data() {
    return {
      resData: [],
      info: {
        id: "",
        name: "",
        note: "",
        point: "",
        isSign: "",
        startDate: "",
        endDate: "",
        currentTime: "",
        record: {
          pointCount: "",
          signCount: "",
          record: []
        }
      },
      is_activity: true, // 有无活动
      loading:true,
      error_tips: '',
      hotline: "10086" // 热线电话
    };
  },
  methods: {
    async getInfo() {
      try {
        let res = await signDetail();
        let {
          endDate,
          currentTime,
          isSign,
          point,
          id,
          name,
          note,
          startDate,
          record
        } = res.data;
        this.info = {
          endDate,
          currentTime,
          isSign,
          point,
          id,
          name,
          note,
          startDate,
          record
        };
        this.is_activity = false;
        this.loading = false;
      } catch (e) {
        this.error_tips = e;
        this.loading = false;
        console.log(e);
      }
    },
    async signIn() {
      try {
        let res = await signIn({ id: this.info.id });
        
        this.reload();
      } catch (e) {
        console.log(e);
        Toast.failed(e);
      }
    },
    countDownS_cb(x) {
      console.log("哈哈", x);
    },
    countDownE_cb(x) {
      console.log("123123", x);
    },
    
  },
  computed: {
    Timer(){
        return (obj) => dayjs(obj).format("YYYY-MM-DD HH:mm")
    }
  },
  components: {
    [Icon.name]: Icon,
    [ActivityIndicator.name]: ActivityIndicator,
  },
  created () {
    this.getInfo();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.sign-container {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  background-color: #eceff5;
  overflow: hidden;
  
  .sign-mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 998;
    background-color: rgba(0, 0, 0, 0.9);
    .error{
      font-family: PingFang-SC-Medium;
	font-size: 30px;
	font-weight: normal;
	font-stretch: normal;
	line-height: 40px;
	letter-spacing: 0px;
	color: #fff;
    }
    .countdown{
    font-family: PingFang-SC-Medium;
	font-size: 30px;
	font-weight: normal;
	font-stretch: normal;
	line-height: 40px;
	letter-spacing: 0px;
	color: #fff;
    }
  }
  .sign-header {
    margin-top: 20px;
    width: 100%;
    height: 620px;
    display: flex;
    flex-direction: column;
    background: url(../assets/signIn.png) no-repeat center center;
    background-size: 100% auto;
    border-radius: 8px;
    .sign-header-date {
      display: flex;
      flex-direction: column;
      height: 125px;

      .title {
        height: 65px;
        text-align: center;
        font-family: PingFang-SC-Medium;
        font-size: 24px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 65px;
        letter-spacing: 0px;
        color: #ffffff;
      }
      .countdown {
        height: 60px;
        font-family: PingFang-SC-Medium;
        font-size: 24px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 40px;
        letter-spacing: 0px;
        color: #ffffff;
      }
    }
    .sign-header-sign {
      display: flex;
      height: 307px;
      justify-content: center;
      align-items: center;
      .sign-btn {
        display: flex;
        flex-direction: column;
        width: 200px;
        height: 200px;
        background-image: linear-gradient(249deg, #ffffff 0%, #ffd8cc 100%),
          linear-gradient(#ffffff, #ffffff);
        background-blend-mode: normal, normal;
        box-shadow: 0px 0px 20px 0px rgba(255, 70, 2, 0.5),
          inset 0px 0px 20px 0px #ffffff;
        border: solid 4px #ff8655;
        border-radius: 50%;
        .point {
          height: 80px;
          text-align: center;
          font-family: PingFang-SC-Medium;
          font-size: 30px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 80px;
          letter-spacing: 0px;
          color: #ff4602;
        }
        .btn {
          height: 100px;
          text-align: center;
          font-family: PingFang-SC-Medium;
          font-size: 60px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 60px;
          letter-spacing: 0px;
          color: #ff4602;
        }
      }
    }
    .sign-header-total {
      display: flex;
      height: 188px;
      @mixin time() {
        height: 100px;
        text-align: center;
        font-family: PingFang-SC-Medium;
        font-size: 26px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 150px;
        letter-spacing: -1px;
        color: #666666;
      }
      @mixin point() {
        height: 100px;
        text-align: center;
        font-family: PingFang-SC-Bold;
        font-size: 60px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 60px;
        letter-spacing: -3px;
        color: #ff4602;
      }
      .sign-total-left {
        display: flex;
        flex-direction: column;
        flex: 1;

        .add-up-time {
          @include time();
        }
        .add-up-point {
          @include point();
        }
      }
      .sign-total-right {
        display: flex;
        flex-direction: column;
        flex: 1;
        .add-up-time {
          @include time();
        }
        .add-up-point {
          @include point();
        }
      }
    }
  }
  .sign-content {
    display: flex;
    flex-direction: column;
    margin-top: 22px;
    width: 100%;
    min-height: 220px;
    background-color: #fffbfa;
    border-radius: 10px;
    .title {
      height: 81px;
      box-sizing: border-box;
      padding: 24px 31px;
      text-align: left;
      font-family: PingFang-SC-Medium;
      font-size: 30px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #333333;
      strong {
        margin-left: 10px;
      }
    }
    .content {
      box-sizing: border-box;
      padding: 0 31px 31px;
      font-family: PingFang-SC-Medium;
      font-size: 26px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 40px;
      letter-spacing: 0px;
      color: #666666;
      text-align: left;
    }
  }
  .sign-footer {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    width: 709px;
    min-height: 384px;
    background-color: #fffbfa;
    border-radius: 10px;
    .title {
      height: 81px;
      box-sizing: border-box;
      padding: 24px 31px;
      text-align: left;
      font-family: PingFang-SC-Medium;
      font-size: 30px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #333333;
      strong {
        margin-left: 10px;
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 0 31px 31px;
      font-family: PingFang-SC-Medium;
      font-size: 26px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 40px;
      letter-spacing: 0px;
      color: #666666;
      text-align: left;
      ul li {
        height: 50px;
        line-height: 50px;
        .sign-date {
          margin-left: 10px;
        }
      }
    }
  }
  .tel-footer {
    height: 67px;
    font-family: PingFang-SC-Medium;
    font-size: 24px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 67px;
    letter-spacing: 0px;
    color: #ff4602;
  }
}
</style>
