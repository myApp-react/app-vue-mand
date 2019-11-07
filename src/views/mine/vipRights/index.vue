<template>
  <div class="vipRights-container" >
      <md-result-page
          :img-url="error"
          text="服务器错误，请稍后再试"
          v-if="isShowType === 2"
      >
      </md-result-page>
      <md-result-page
          :img-url="noData"
          text="还没有会员权益相关数据哦！"
          v-else-if="isShowType === 1"
      >
      </md-result-page>
      <div
          v-html="resData"
          v-else
          class="vipRights-text"
      ></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Vue from "vue";
import { Toast, ResultPage } from "mand-mobile";
import { getVipRights } from "@/api/mine";

export default {
    name: "vipRights",
    components: {
        [ResultPage.name]: ResultPage
    },
    data() {
        return {
            resData: "",
            noData: require("@/assets/noData.png"),
            error: require("@/assets/error.png"),
            isShowType: "", // 1显示无数据， 2显示系统错误， '' 显示数据
        };
    },
    computed: {},
    created() {

    },
    activated() {
        this.getData();
    },
    methods: {
        async getData() {
            Toast.loading("载入中...");
            try {
                const res = await getVipRights();
                const { rights } = res.data;
                Toast.hide();
                if (!rights) {
                    this.isShowType = 1;
                } else {
                    this.resData = rights;
                    this.isShowType = '';
                }
            } catch (err) {
                console.log('会员权益错误', err);
                Toast.hide();
                this.isShowType = 2;
            }
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.vipRights-container {
    width: 100%;
    height: 100%;
    padding: 30px;
    box-sizing: border-box;
    font-size: 30px;
    background-color: #fff;
    .vipRights-text {
        font-size: 28px !important;
        text-align: left;
        line-height: 1.5;
        p {
            font-size: 28px !important;
        }
        span {
            font-size: 28px !important;
        }
        strong {
            display: inline-block;
            font-weight: bold;
            margin-bottom: 10px !important;
        }
        img{
            display: block;
            padding: 20px 0;
            width: 100%;
        }
    }
}
</style>
