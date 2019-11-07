<template>
    <div class="mine-container">
        <md-popup
                v-model="sharePopup"
                position="bottom"
                :mask-closable="false"
        >
            <div class="share-popup">
                <div class="share-popup-text">
                    <img src="@/assets/point.png">
                </div>
                <div class="share-popup-btn" @click="hidePopUp"></div>
            </div>
        </md-popup>
        <div class="userInfo-top">
            <div class="user-vip-card">
                <img class="card-img" :src="userInfo.imgAddr" alt="">
                <div class="QR-code" v-show="userInfo.qrCode" @click="showPopUp('center')"></div>
                <div class="vip-card-info">
                    <div class="vip-num">{{userInfo.code | formatNum}}</div>
                </div>
                <router-link to="/mine/personal" class="userInfo">
                    <div class="Avatars">
                        <img src="@/assets/avatars.png" v-if="!userInfo.headImg" alt="">
                        <img v-else :src="userInfo.headImg" alt="">
                    </div>
                    <div class="userInfo-text">
                        <div class="name">{{userInfo.nickName}}</div>
                        <div class="card-type">{{userInfo.cardType}}</div>
                    </div>
                </router-link>
            </div>
            <div class="user-extra-info">
                <router-link to="/mine/mineIntegral" class="extra-info-item">
                    <div class="extra-info-name">积分</div>
                    <div class="extra-info-value">{{integral || 0}}</div>
                </router-link>
                <router-link to="/mine/mineVoucher" class="extra-info-item">
                    <div class="extra-info-name">代金券</div>
                    <div class="extra-info-value">
                        <md-icon name="icon-Voucher-icon" size="lg" color="#fff"></md-icon>
                    </div>
                </router-link>
            </div>
        </div>
        <div class="userHandle">
            <md-field title="" class="md-field-extra">
                <md-field-item
                        name="item0"
                        title="我的礼品"
                        arrow="arrow-right"
                        @click="$router.push({ path:'/mine/mygift'})">
                    <md-icon name="icon-mineGift" color="#108EE9" slot="left"></md-icon>
                </md-field-item>
                <md-field-item
                        name="item1"
                        title="小票记录"
                        arrow="arrow-right"
                        @click="$router.push({ path:'/mine/ticket'})">
                    <md-icon name="icon-mineTicket" color="#F49C2E" slot="left"></md-icon>
                </md-field-item>

                <md-field-item
                        name="item2"
                        title="会员权益"
                        arrow="arrow-right"
                        @click="$router.push({ path:'/mine/vipRights'})">
                    <md-icon name="icon-vipRights" color="#E8541E" slot="left"></md-icon>
                </md-field-item>
            </md-field>

            <md-field title="" class="md-field-extra">
                <md-field-item
                        name="item3"
                        title="我的活动"
                        arrow="arrow-right"
                        @click="$router.push({ path:'/mine/mineActivity'})">
                    <md-icon name="icon-mineActivity" color="#108EE9" slot="left"></md-icon>
                </md-field-item>
                <md-field-item
                        name="item4"
                        title="我的收藏"
                        arrow="arrow-right"
                        @click="$router.push({ path:'/mine/mineCollect'})">
                    <md-icon name="icon-mineCollect" color="#E8541E" slot="left"></md-icon>
                </md-field-item>
                <md-field-item
                        name="item5"
                        title="联系客服"
                        arrow="arrow-right"
                        align="right"
                        @click="$router.push({ path:'/mine/mineService'})">
                    <md-icon name="icon-mineService" color="#0BA194" slot="left"></md-icon>
                </md-field-item>
                <md-field-item
                        name="item6"
                        title="推荐好友"
                        arrow="arrow-right"
                        :disabled="shareBtn"
                        @click="shareReady"
                >
                    <md-icon name="icon-mineShare" color="#108EE9" slot="left"></md-icon>
                </md-field-item>
                <md-field-item
                        name="item7"
                        title="添加卡券"
                        arrow="arrow-right"
                        :disabled="shareBtn"
                        @click="addCard"
                >
                    <md-icon name="icon-add-card" color="#6d07ff" slot="left"></md-icon>
                </md-field-item>
            </md-field>
        </div>
        <md-popup v-model="isPopupShow.center">
            <div class="mine-index-popup">
                <div class="userCard-barCode">
                    <img :src="userInfo.barCode" alt="">
                </div>
                <div class="silde-circle"></div>
                <div class="userCard-img">
                    <img :src="userInfo.qrCode" alt="">
                    <div class="userCard-Num">{{userInfo.code | formatNum}}</div>
                </div>
            </div>
        </md-popup>
        <tabbar :routeId='3'/>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import {Field, FieldItem, Popup, PopupTitleBar, Icon, Toast} from "mand-mobile";
    import {aggregateApi} from "@/api/home";
    import {jssdk} from "@/api/smallVotePoints";
    import {jscardsdk, activeCard} from "@/api/mine";
    import {getStorage, setStorage} from "@/components/Storage";
    import tabbar from "@/components/tabbar";
    import wx from "weixin-js-sdk";
    import '@/assets/svg/mineGift.svg';
    import '@/assets/svg/mineTicket.svg';
    import '@/assets/svg/vipRights.svg';
    import '@/assets/svg/mineActivity.svg';
    import '@/assets/svg/mineCollect.svg';
    import '@/assets/svg/mineService.svg';
    import '@/assets/svg/mineShare.svg';
    import '@/assets/svg/Voucher-icon.svg';
    import '@/assets/svg/add-card.svg';

    export default {
        name: "mineCenter",
        filters: {
            formatNum(num) {
                return (
                    num && num.replace(/\s/g, "").replace(/(\d{4})(?=\d)/g, "$1 ")
                );
            }
        },
        data() {
            return {
                Avatars: "",
                isPopupShow: {},
                userCard: [],
                isHasData: false,
                shareIcon: require("@/assets/noData.png"),
                userInfo: {
                    id: '',
                    imgAddr: '',
                    headImg: '',
                    nickName: '未知',
                    cardType: '普通会员',
                    code: '0',
                    qrCode: '',
                    barCode: '',
                },
                btnStatus: true,
                sharePopup: false,
            };
        },
        components: {
            [Field.name]: Field,
            [FieldItem.name]: FieldItem,
            [Popup.name]: Popup,
            [Icon.name]: Icon,
            [PopupTitleBar.name]: PopupTitleBar,
            tabbar
        },
        computed: {
            ...mapGetters(["integral", "avatar"]),
            shareBtn() {
                let init = true;
                if (this.btnStatus === false && this.isHasData) {
                    init = false
                }
                return init
            }
        },
        methods: {
            async callActiveCard() {
                try {
                    let res = await activeCard()
                } catch (e) {
                    console.log(e);
                }
            },
            async getCard() {
                try {
                    const res = await aggregateApi({
                        userCard: "/member/card",
                        information: "/account/information",
                        mode: 'loose'
                    });

                    const {code, data} = res;
                    if (code === '200') {
                        let userInfoData = {
                            id: data.information.id,
                            headImg: data.information.headImg ? data.information.headImg : '',
                            nickName: data.information.nickName ? data.information.nickName : '未知',
                            cardType: data.userCard.cardType ? data.userCard.cardType : '',
                            code: data.userCard.code ? data.userCard.code : '0',
                            qrCode: data.userCard.qrCode ? data.userCard.qrCode : '',
                            barCode: data.userCard.barCode ? data.userCard.barCode : '',
                            imgAddr: data.userCard.imgAddr ? data.userCard.imgAddr : '',
                        }
                        this.isHasData = true;
                        this.userInfo = userInfoData;
                        setStorage("userInfo", JSON.stringify(userInfoData));
                    }
                } catch (err) {
                    Toast.info(err)
                }
            },
            async wxConfig() {
                try {
                    const res = await jssdk();
                    const {appid, nonceStr, signature, timestamp} = res.data;
                    wx.config({
                        debug: false,
                        appId: appid,
                        timestamp: timestamp,
                        nonceStr: nonceStr,
                        signature: signature,
                        jsApiList: ["updateAppMessageShareData", 'addCard', 'onMenuShareAppMessage']
                    });
                    wx.ready(_ => {
                        this.btnStatus = false;
                    });
                    wx.error(res => {
                        console.log('config 失败', res);
                    });
                } catch (err) {
                    Toast.info(err)
                }
            },
            async addCard() {
                try {
                    let res = await jscardsdk()
                    let {weixinCardId: cardId, code, openid, timestamp, nonceStr: nonce_str, signature} = res.data
                    wx.addCard({
                        cardList: [{
                            cardId: cardId,
                            cardExt: JSON.stringify({
                                code,
                                openid,
                                timestamp,
                                nonce_str,
                                signature,
                            }),
                        }], // 需要添加的卡券列表
                        success: function (res) {
                            // let cardList = res.cardList; // 添加的卡券列表信息
                            console.log('cardList success');
                            this.callActiveCard()
                        }
                    });
                } catch (e) {
                    Toast.info(e)
                }
            },
            shareReady() {
                const _self = this;
                wx.updateAppMessageShareData({
                    title: '推荐好友',
                    desc: '注册微网站会员，多重好礼享不停',
                    link: `http://${location.host}?id=${this.userInfo.id}&register=1`,
                    imgUrl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543493039769&di=a1dddf14ad2993641e5b84600679208f&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F12%2F07%2F42%2F81c58PICEi6.jpg",
                    success: () => {
                        _self.sharePopup = true;
                    },
                    cancel: () => {
                    }
                })
            },
            showPopUp(type) {
                this.$set(this.isPopupShow, type, true);
            },
            hidePopUp() {
                this.sharePopup = false;
            }
        },
        created() {
        },
        activated() {
            const userInfo = getStorage("userInfo");
            if (userInfo) {
                this.userInfo = JSON.parse(userInfo);
            }

            this.wxConfig();
            this.getCard();
            this.$store.dispatch("GetPoints")
        },
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .mine-container {
        .md-popup.bottom .md-popup-box {
            height: 100%;
        }

        .md-popup .md-popup-mask {
            background-color: rgba(0, 0, 0, 0.8);
        }
    }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    .share-popup {
        z-index: 3000;
        position: relative;
        width: 100%;
        height: 100%;

        .share-popup-text {
            position: absolute;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            margin-left: 40px;
            width: 560px;
            height: 374px;

            img {
                display: block;
                width: 100%;
                height: 100%;
            }
        }

        .share-popup-btn {
            position: absolute;
            bottom: 200px;
            left: 50%;
            transform: translateX(-50%);
            width: 236px;
            height: 100px;
            background: url(../../../assets/share-popup-btn.png) no-repeat;
            background-size: 100% 100%;
        }
    }

    .mine-container {
        width: 100%;
        height: 100%;
        background-color: #eceff5;
        overflow-y: auto;

        .userInfo-top {
            width: 100%;
            padding-top: 40px;
            background-color: #363740;

            .user-vip-card {
                position: relative;
                margin: 0 auto;
                width: 90%;
                height: 252px;
                padding: 40px 160px 40px 30px;
                box-sizing: border-box;
                border-radius: 12px 12px 0 0;
                background-color: #f0f0f0;
                overflow: hidden;

                .card-img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            .userInfo {
                position: relative;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: flex-start;
                text-decoration: none;
                z-index: 999;

                &:after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                .Avatars {
                    width: 90px;
                    height: 90px;
                    border-radius: 50%;
                    overflow: hidden;
                    /*background: url(../../../assets/avatars.png) no-repeat center center;*/
                    /*background-size: 100% 100%;*/
                    img {
                        position: relative;
                        display: block;
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }

                .userInfo-text {
                    flex: 1;
                    padding-left: 20px;
                    box-sizing: border-box;
                    font-size: 30px;
                    text-align: left;

                    .name {
                        margin-bottom: 12px;
                        font-size: 30px;
                        font-weight: normal;
                        font-stretch: normal;
                        letter-spacing: 0;
                        color: #28292d;
                        overflow: hidden;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                        word-break: break-all;
                        text-underline: none;
                    }

                    .card-type {
                        position: relative;
                        display: inline-block;
                        padding: 0 20px 0 40px;
                        font-size: 18px;
                        line-height: 26px;
                        color: #fff;
                        background-image: linear-gradient(
                                        45deg,
                                        #d29554 0%,
                                        #dba871 100%
                        ),
                        linear-gradient(#ffffff, #ffffff);
                        background-blend-mode: normal, normal;
                        border-radius: 12px;

                        &:after {
                            content: "";
                            position: absolute;
                            left: -2px;
                            top: 50%;
                            transform: translateY(-50%);
                            width: 32px;
                            height: 32px;
                            /* border: 2px solid #fff; */
                            border-radius: 50%;
                            background: url(../../../assets/vipIcon.png) no-repeat center center;
                            background-size: 100%;
                        }
                    }
                }
            }

            .vip-card-info {
                position: absolute;
                left: 0;
                bottom: 0;
                padding: 20px;
                box-sizing: border-box;
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
                font-size: 30px;
                text-align: center;
                color: #6d5728;
                z-index: 99;

                .vip-num {
                    width: 100%;
                    font-size: 60px;
                }
            }

            .QR-code {
                position: absolute;
                top: 40px;
                right: 70px;
                width: 80px;
                height: 80px;
                background: url(../../../assets/QR-code.png) no-repeat center;
                background-size: 100% 100%;
                z-index: 99;
            }

            .user-extra-info {
                width: 100%;
                height: 130px;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
                background-color: #454955;

                .extra-info-item {
                    position: relative;
                    display: block;
                    padding: 0 20px;
                    box-sizing: border-box;
                    flex: 1;
                    font-size: 28px;
                    line-height: 1;
                    text-decoration: none;
                    color: #fff;

                    &:after {
                        content: "";
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: transparent;
                    }

                    &:before {
                        content: "";
                        position: absolute;
                        right: 0;
                        top: 20px;
                        bottom: 20px;
                        width: 0;
                        border-right: 1px solid #fff;
                    }

                    &:last-child {
                        &:before {
                            border: none;
                        }
                    }

                    .extra-info-name {
                        margin-bottom: 12px;
                        font-size: 24px;
                        font-weight: normal;
                        font-stretch: normal;
                        letter-spacing: 0px;
                        color: #fff;
                    }

                    .extra-info-value {
                        font-size: 60px;
                        font-weight: normal;
                        font-stretch: normal;
                        letter-spacing: 0px;
                        color: #ffffff;

                        .md-icon.lg {
                            display: inline-block;
                            width: 60px;
                            height: 42px;
                        }
                    }
                }
            }
        }

        .userHandle {
            padding-bottom: 200px;

            .md-field-extra {
                margin-top: 20px;
            }

            .field-item-svg {
                width: 38px;
                height: 38px;
            }
        }

        .mine-index-popup {
            width: 540px;
            font-size: 30px;
            line-height: 1.5; /* background-color: #fff; */
            border-radius: 10px;
            overflow: hidden;

            .userCard-barCode {
                margin-bottom: -2px;
                width: 100%;
                padding: 40px 0 30px;
                background-color: #fff;

                img {
                    margin: auto;
                    display: block;
                    width: 400px;
                    height: 108px;
                }
            }

            .userCard-Num {
                position: relative;
                width: 100%;
                font-size: 40px;
                font-weight: normal;
                font-stretch: normal;
                line-height: 1.5;
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
                padding: 50px 0 60px;
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
