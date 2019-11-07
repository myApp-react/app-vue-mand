<template>
  <div class="floorNav-container" >
      <md-result-page
              :img-url="error"
              text="未有楼层信息"
              v-if="isShowType === 1"
      >
      </md-result-page>
      <md-result-page
              :img-url="noData"
              text="服务器错误，请稍后再试"
              v-else-if="isShowType === 2"
      >
      </md-result-page>
      <md-result-page
              :img-url="noData"
              text="搜索楼层信息"
              v-else-if="isShowType === 3"
      >
      </md-result-page>

      <div class="floorNav-list" v-else @click="viewImg">
          <img :src="floorImg" title="img" alt="">
      </div>
      <div class="floorNav-btn">
          <div class="btn-icon" @click="isPickerShow1 = true">
              <md-icon name="icon-searchIcon" size="lg"></md-icon>
          </div>
      </div>
      <md-picker
              ref="picker1"
              v-if="pickerData1"
              :cols="2"
              v-model="isPickerShow1"
              :data="pickerData1"
              is-cascade
              title="选择栋数/楼层"
              @confirm="onPickerConfirm(1)"
      ></md-picker>
      <md-popup
              v-model="isPopupShow.top"
              :hasMask="false"
              position="top"
      >
          <div class="md-example-popup md-example-popup-top">
              点击右下角搜索按钮查询楼层图
              <md-icon
                      name="cross"
                      @click.native="hidePopUp('top')"
              ></md-icon>
          </div>
      </md-popup>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Vue from "vue";
import { Toast, ScrollView, Popup, CheckList, Picker, PopupTitleBar, ResultPage, ActionBar, ScrollViewMore, DropMenu, TabPicker, ScrollViewRefresh, Icon, Button, Amount } from "mand-mobile";
import { getfloorList, getfloorMap } from "@/api/floorNav";
import "@/assets/searchIcon.svg"

import wx from "weixin-js-sdk";



export default {
    name: "floorNav",
    components: {
        [ScrollView.name]: ScrollView,
        [ResultPage.name]: ResultPage,
        [Button.name]: Button,
        [Amount.name]: Amount,
        [Icon.name]: Icon,
        [DropMenu.name]: DropMenu,
        [TabPicker.name]: TabPicker,
        [ScrollViewMore.name]: ScrollViewMore,
        [Popup.name]: Popup,
        [PopupTitleBar.name]: PopupTitleBar,
        [CheckList.name]: CheckList,
        [ActionBar.name]: ActionBar,
        [Picker.name]: Picker,
        [ScrollViewRefresh.name]:  ScrollViewRefresh,

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
            isTabPickerShow: false,
            title: '请选择',
            isPopupShow: {},
            isPickerShow1: false,
            pickerData1: [],
            pickerValue1: '',
            floorImg: '',

        };
    },
    computed: {

    },
    created() {
        // Toast.loading("载入中...");
        this.showPopUp('top')
        if (this.resData.length === 0) {
            this.getData();
        }
    },
    methods: {
        showPopUp(type) {
            this.$set(this.isPopupShow, type, true)
        },
        hidePopUp(type) {
            this.$set(this.isPopupShow, type, false)
        },
        async getData() {
            try {
                const res = await getfloorList();
                // console.log('获取的结果：',res)
                const { code, data } = res;
                if(code === '200'){
                    this.resData = data;

                    const template = JSON.parse(JSON.stringify(data).replace(/floors/g, "children"));
                    const template1 = JSON.parse(JSON.stringify(template).replace(/buildingName/g, "text"));
                    const template2 = JSON.parse(JSON.stringify(template1).replace(/buildingId/g, "value"));
                    const template3 = JSON.parse(JSON.stringify(template2).replace(/floorId/g, "value"));
                    const template4 = JSON.parse(JSON.stringify(template3).replace(/floorName/g, "text"));

                    this.pickerData1 = [template4]
                }
            } catch (err) {
                console.log("错误信息？：",err);
                // Toast.failed(err);
                // Toast.hide();
                this.isShowType = 2;
                Toast.failed('数据获取失败');

            }
        },
        async getfloorMap(buildingId, floorId) {
            Toast.loading('获取中...')
            try {
                const res = await getfloorMap(buildingId, floorId);
                console.log(res)
                const { code, data } = res;
                if(code === '200'){
                    Toast.hide();
                    this.floorImg = data.plan
                    this.isShowType = "";
                    // this.reload() // 调用方法
                }
            }catch (err) {
                console.log("错误信息？：",err);
                this.isShowType = 2;
                Toast.failed('数据获取失败');


                console.log(this.isShowType)
            }

        },
        onPickerConfirm(index) {
            const values = this.$refs[`picker${index}`].getColumnValues()

            let res = ''
            values.forEach(value => {
                value && (res += `${value.text || value.label} `)
            })
            this[`pickerValue${index}`] = res

            const buildingId = values[0].value
            const floorId = values[1].value;

            this.getfloorMap(buildingId, floorId)
        },
        viewImg(e) {
            console.log(e.target.title)
            let urls = [];
            const src = e.target.getAttribute("src");
            urls.push(src)
            wx.previewImage({
                current: src, // 当前显示图片的http链接
                urls: urls // 需要预览的图片http链接列表
            });
        }

    }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.floorNav-container {
    .md-popup-box{
        width: 80%;
        background-color: #ECEFF5;
    }
    .md-action-bar{
        position: absolute;
    }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.floorNav-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .floorNav-btn{
        position: absolute;
        right: 40px;
        bottom: 120px;
        .btn-icon{
            position: relative;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background-color: #ff4602;
            box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
            &:after{
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
        }
        .md-icon{
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
    }
    .floorNav-list{
        width: 100%;
        height: 100%;
        overflow: auto;
        img{
            display: block;
            width: 100%;
            vertical-align: top;
        }
    }

    .popup-floor-cont{
        position: relative;
        width: 100%;
        height: 100%;
        padding-bottom: 100px;
        box-sizing: border-box;
        .popup-floor-list{
            width: 100%;
            height: 100%;
            overflow-y: auto;
        }
        .floor-list{

        }
        .floor-list-fa-inner{
            input{
                display: none;
            }
            input + label{
                position: relative;
                display: inline-block;
                padding-left: .3rem;
                cursor: pointer;
                vertical-align: middle;
            }
            input:checked + label{
                color: #ee755f;
            }
        }
        .floor-list-fa{
            position: relative;
            width: 100%;
            height: 80px;
            line-height: 80px;
            .fa-label{
                position: absolute;
                left: 0;
                display: inline-block;
                padding: 0 20px;
                text-align: left;
                font-size: 28px;
                background-color: #fff;

                p{
                    font-size: 28px;
                }
            }
        }
        .floor-list-child{
            display: none;
            position: absolute;
            font-size: 30px;
        }
    }
    .md-example-popup{
        position: relative;
        font-size: 24px;
        background: #fff;
        box-sizing: border-box;
        text-align: center;
    }
    .md-example-popup-top{
        width: 100%;
        height: 75px;
        line-height: 75px;
        background: #4a4c5b;
        color: #fff;
    }
    .md-icon{
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
    }

}
</style>
