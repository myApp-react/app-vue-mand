<template>
    <div class="mineService-container">
        <div class="mineService-main" @click="viewiImgHandle">
            <ul ref="scroll_div">
                <div
                        v-for="(item, index) in recordlist"
                        :key="index"
                >
                    <div v-if="item.type === 1">
                        <li class="chart-system">
                            <span>{{item.sendTime}}</span>
                        </li>
                        <li class="chart-mine">
                            <div class="chart-user">
                                <img :src="item.headImg ? item.headImg : defaultImg" alt="">
                                <!--<span class="userName">我</span>-->
                            </div>
                            <div class="chart-text">
                                <img :src="item.content" title="Img" v-if="item.contentType === 2" alt="">
                                <p v-else>{{item.content}}</p>
                            </div>
                        </li>
                    </div>
                    <div v-else-if="item.type === 2">
                        <li class="chart-system">
                            <span>{{item.sendTime}}</span>
                        </li>
                        <li>
                            <div class="chart-user">
                                <img src="@/assets/system-avatars.png" class="system-img" alt="">
                                <!--<span class="userName">系统</span>-->
                            </div>
                            <div class="chart-text">
                                <img :src="item.content" title="Img" v-if="item.contentType === 2" alt="">
                                <p v-else>{{item.content}}</p>
                            </div>
                        </li>
                    </div>
                </div>

            </ul>
        </div>
        <div class="mineService-btn">
            <md-action-bar :actions="isEmpty" @click="onBtnClick" v-if="type">
                <md-field>
                    <md-input-item
                            ref="input11"
                            placeholder="请输入"
                            v-model="userText"
                            @focus="userInputfocus"
                    >
                        <md-icon name="icon-camera" v-if="btnStatus" size="lg" slot="left"
                                 @click="chooseImage"></md-icon>
                    </md-input-item>
                </md-field>
            </md-action-bar>
            <div class="user-comment" v-else>
                <div class="user-input-hold">
                    <div class="input-holder" @click="showPopUp('bottom')">请输入你的问题</div>
                </div>
                <div class="user-input-icon" v-if="btnStatus">
                    <md-icon name="icon-camera" size="lg" color="#ff4602" @click="chooseImage"></md-icon>
                </div>
            </div>
        </div>
        <md-popup
                v-model="isPopupShow.bottom"
                :has-mask="true"
                position="bottom"
        >
            <div class="comment-popup-fix-div">
                <div class="comment-popup">
                    <div class="comment-popup-inner">
                        <div class="user-text">
                            <textarea v-model="userText" placeholder="请输入你的问题..."></textarea>
                        </div>
                        <div class="comment-btn">
                            <div class="comment-btn-item">
                                <md-button type="ghost-primary" :disabled="commentBtn" size="small"
                                           @click="submitComment">留言
                                </md-button>
                            </div>
                            <div class="comment-btn-item">
                                <md-button type="ghost" size="small" @click="hidePopUp('bottom')">取消</md-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </md-popup>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import Vue from "vue";
    import {
        Picker,
        Field,
        FieldItem,
        Icon,
        Dialog,
        InputItem,
        Switch,
        DatePicker,
        Popup,
        Toast,
        Button,
        ActionBar,
        ImageViewer
    } from "mand-mobile";
    import "@/assets/camera.svg";
    import {jssdk} from "@/api/smallVotePoints";
    import {getRecordlist, replyMessage} from "@/api/mine";
    import wx from "weixin-js-sdk";
    import dayjs from 'dayjs';

    export default {
        name: "mineService",
        inject: ['reload'], // 引入方法
        components: {
            [Dialog.name]: Dialog,
            [Field.name]: Field,
            [FieldItem.name]: FieldItem,
            [InputItem.name]: InputItem,
            [Switch.name]: Switch,
            [DatePicker.name]: DatePicker,
            [ActionBar.name]: ActionBar,
            [Icon.name]: Icon,
            [ImageViewer.name]: ImageViewer,
            [Picker.name]: Picker,
            [Popup.name]: Popup,
            [Button.name]: Button,
        },
        data() {
            return {
                btnData: [
                    {
                        text: "留言",
                        disabled: false,
                    }
                ],
                isViewerShow: false,
                viewerIndex: 0,
                btnStatus: false,
                recordlist: [],
                userText: '',
                localId: '',
                serverId: '',
                defaultImg: require("@/assets/avatars.png"),
                type: false,
                isPopupShow: {},
                // commentBtn: false,
            };
        },
        computed: {
            filterEmoji() {
                return this.isEmojiCharacter(this.userText)
            },
            commentBtn() {
                let init = true
                if (this.userText) {
                    init = false
                }
                return init
            },
            isEmpty() {
                let initBtn = [
                    {
                        text: "留言",
                        disabled: false,
                    }
                ]
                if (!this.userText) {
                    initBtn = [
                        {
                            text: "留言",
                            disabled: true,
                        }
                    ]
                }
                return initBtn
            }
        },
        created() {
            // this.wxConfig();
            // this.$nextTick(() => {
            //     const obj = this.$refs.scroll_div
            //     obj.scrollTop = obj.scrollHeight;
            // })
            // if (this.recordlist.length === 0) {
            //     this.getRecordlist();
            // }
        },
        activated() {
            //初始化
            this.isPopupShow = {}
            this.userText = '';

            this.wxConfig();
            this.$nextTick(() => {
                const obj = this.$refs.scroll_div
                obj.scrollTop = obj.scrollHeight;
            })
            this.getRecordlist();
        },
        updated() {
            this.$nextTick(() => {
                const obj = this.$refs.scroll_div
                obj.scrollTop = obj.scrollHeight;
            })
        },
        methods: {
            async getRecordlist() {
                try {
                    const res = await getRecordlist();
                    console.log(res)
                    const {code, data} = res;
                    if (code === '200') {
                        data.forEach(item => {
                            item.sendTime = dayjs(item.sendTime).format(
                                "YYYY-MM-DD HH:mm"
                            );
                        });
                        this.recordlist = data;
                    }
                } catch (e) {
                    console.log(e)
                }
            },
            async replyMessage(contentType, content) {
                let postData = {contentType, content};
                Toast.loading('留言中...');
                try {
                    const res = await replyMessage(postData);
                    const {code, data} = res;
                    if (code === '200') {
                        Toast.hide();
                        this.reload();
                    }
                } catch (e) {
                    console.log(e)
                    Toast.failed("留言失败");
                }
            },
            async wxConfig() {
                try {
                    const res = await jssdk();
                    const {appid, nonceStr, signature, timestamp} = res.data;
                    console.log(res);
                    wx.config({
                        debug: false,
                        appId: appid,
                        timestamp: timestamp,
                        nonceStr: nonceStr,
                        signature: signature,
                        jsApiList: ["chooseImage", "uploadImage"]
                    });
                    wx.ready(_ => {
                        this.btnStatus = true;
                    });
                    wx.error(res => {
                        console.log(res);
                    });
                } catch (err) {
                    console.log(err);
                }
            },
            chooseImage() {
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: res => {
                        const localIds = res.localIds[0].toString(); // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                        console.log("localIds 没有只吃饭：", localIds)
                        this.localId = res.localIds.toString()
                        this.wxuploadImage()
                    }
                });
            },
            wxuploadImage() {
                wx.uploadImage({
                    localId: this.localId, // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: res => {
                        this.serverId = res.serverId; // 返回图片的服务器端ID
                        this.replyMessage(2, res.serverId);
                    }, fail: _ => {
                        console.log('uploadImage fail');
                    },
                });
            },
            viewiImgHandle(e) {
                console.log("获取到的图片地址：：：：：", e)
                console.log("获取到的图片地址：：：：：", e.target.title)
                let urls = [];
                if (e.target.title === "Img") {
                    const src = e.target.getAttribute("src");
                    urls.push(src)
                    wx.previewImage({
                        current: src, // 当前显示图片的http链接
                        urls: urls // 需要预览的图片http链接列表
                    });
                }
            },
            isEmojiCharacter(substring) {
                for (let i = 0; i < substring.length; i++) {
                    const hs = substring.charCodeAt(i);
                    if (0xd800 <= hs && hs <= 0xdbff) {
                        if (substring.length > 1) {
                            const ls = substring.charCodeAt(i + 1);
                            const uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                            if (0x1d000 <= uc && uc <= 0x1f77f) {
                                return true;
                            }
                        }
                    } else if (substring.length > 1) {
                        const ls = substring.charCodeAt(i + 1);
                        if (ls == 0x20e3) {
                            return true;
                        }
                    } else {
                        if (0x2100 <= hs && hs <= 0x27ff) {
                            return true;
                        } else if (0x2B05 <= hs && hs <= 0x2b07) {
                            return true;
                        } else if (0x2934 <= hs && hs <= 0x2935) {
                            return true;
                        } else if (0x3297 <= hs && hs <= 0x3299) {
                            return true;
                        } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                            || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
                            || hs == 0x2b50) {
                            return true;
                        }
                    }
                }
            },

            onBtnClick(event, action) {
                if (this.isEmojiCharacter(this.userText)) {
                    Toast.failed('暂不支持表情输入哦！')
                    return
                }
                this.replyMessage(1, this.userText);
            },
            userInputfocus(e) {
                const obj = this.$refs.scroll_div
                obj.scrollTop = obj.scrollHeight;

                setTimeout(() => {
                    document.body.scrollTop = document.body.scrollHeight;
                }, 300);

                setTimeout(() => {
                    e.srcElement.scrollIntoView();
                }, 500);

            },
            showPopUp(type) {
                this.$set(this.isPopupShow, type, true)
            },
            hidePopUp(type) {
                this.$set(this.isPopupShow, type, false)
            },
            submitComment() {
                console.warn("检测是否含有表情：", this.isEmojiCharacter(this.userText))
                if (this.isEmojiCharacter(this.userText)) {
                    Toast.failed('暂不支持表情输入哦！')
                    return
                }
                this.replyMessage(1, this.userText);
            },
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .mineService-container {
        .md-action-bar {
            position: relative;
        }

        .md-action-bar.with-text.multi-action .md-action-bar-text {
            width: 70%;
            padding: 0;
        }

        .md-field {
            width: 100%;
        }

        .md-image-viewer .viewer-item-wrap .item {
            left: 0;
        }

        .md-action-bar .md-action-bar-button .button-item:last-of-type {
            background: #e8541e;
        }
        .md-popup.bottom .md-popup-box{
            height: 100%;
        }
        .md-button.ghost-primary {
            background-color: #ff6933;
            color: #eceff5;
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    .mineService-container {
        /*display: -webkit-box;*/
        /*display: -ms-flexbox;*/
        /*display: flex;*/
        /*-webkit-box-flex: 1;*/
        /*-ms-flex: 1;*/
        /*flex: 1;*/
        /*position: relative;*/
        /*overflow: hidden;*/
        /*height: 100%;*/
        /*width: 100%;*/
        /*webkit-box-orient: vertical;*/
        /*-webkit-box-direction: normal;*/
        /*-ms-flex-direction: column;*/
        /*flex-direction: column;*/
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        .mineService-main {
            position: relative;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex: 1;
            -ms-touch-action: pan-x pan-y;
            touch-action: pan-x pan-y;
            background-color: #ECEFF5;

            ul {
                width: 100%;
                padding: 30px;
                box-sizing: border-box;
                overflow-x: hidden;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;

                li {
                    position: relative;
                    font-size: 0;
                    padding-bottom: 30px;
                    padding-left: 100px;
                    min-height: 80px;
                    text-align: left;
                }

                .chart-system {
                    margin-bottom: 30px;
                    padding: 0;
                    min-height: 0;
                    text-align: center;

                    span {
                        display: inline-block;
                        line-height: 46px;
                        padding: 0 16px;
                        border-radius: 24px;
                        background-color: rgba(0, 0, 0, .1);
                        color: #fff;
                        font-size: 24px;
                        cursor: pointer;
                    }
                }

                .chart-mine {
                    text-align: right;
                    padding-left: 0;
                    padding-right: 108px;

                    .chart-user {
                        left: auto;
                        right: 3px;

                        .userName {
                            left: auto;
                            right: 100px;
                            text-align: right;
                        }
                    }

                    .chart-text {
                        margin-left: 0;
                        text-align: left;
                        background-color: #ff6933;
                        color: #eceff5;

                        &:after {
                            left: auto;
                            right: -18px;
                            transform: rotate(270deg);
                            border-top-color: #ff6933;
                            /*border-top-color: forestgreen;*/
                        }
                    }
                }

                .chart-user {
                    position: absolute;
                    left: 3px;
                    width: 80px;
                    height: 80px;
                    background-color: #fff;
                    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
                    border-radius: 8px;
                    display: inline-block;
                    vertical-align: top;
                    font-size: 26px;
                    text-align: center;
                    overflow: hidden;

                    &:after {
                        content: '';
                        display: inline-block;
                        vertical-align: middle;
                        width: 0;
                        height: 100%;
                    }

                    img {
                        display: block;
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }

                    img.system-img {
                        width: 44px;
                        height: 49px;
                        display: inline-block;
                        vertical-align: middle;
                    }

                    .userName {
                        position: absolute;
                        left: 100px;
                        top: -2px;
                        width: 500px;
                        line-height: 36px;
                        font-size: 26px;
                        white-space: nowrap;
                        color: #999;
                        text-align: left;
                        font-style: normal;
                    }
                }

                .chart-text {
                    position: relative;
                    display: inline-block;
                    min-height: 36px;
                    line-height: 1.5;
                    /*margin-top: 50px;*/
                    padding: 20px 20px;
                    vertical-align: top;
                    font-size: 30px;
                    background-color: #fff;
                    border-radius: 10px;
                    color: #333;
                    word-break: break-all;
                    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);

                    &:after {
                        content: "";
                        position: absolute;
                        left: -18px;
                        top: 30px;
                        /*transform: rotate(270deg);*/
                        transform: rotate(90deg);
                        width: 0;
                        height: 0;
                        border-style: solid dashed dashed;
                        border-color: #fff transparent transparent;
                        /*border-color: forestgreen transparent transparent;*/
                        overflow: hidden;
                        border-width: 10px;
                    }

                    img {
                        width: 100%;
                        max-width: 150px;
                        vertical-align: middle;
                    }
                }
            }
        }

        .mineService-btn {
            -ms-flex-negative: 0;
            flex-shrink: 0;
            border-top: 1px solid #eee;
            background-color: #fff;

            .camera-icon {
                position: relative;
                width: 80px;
                height: 100px;
                padding: 0 12px;
                box-sizing: border-box;

                &:after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            }

            .user-comment {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
                overflow: hidden;

                .user-input-hold {
                    flex: 1;
                    height: 110px;
                    padding: 16px 30px;
                    box-sizing: border-box;

                    .input-holder {
                        width: 100%;
                        height: 100%;
                        padding-left: 30px;
                        box-sizing: border-box;
                        line-height: 78px;
                        font-size: 30px;
                        border-radius: 39px;
                        border: solid 1px #cccccc;
                        color: #999;
                        text-align: left;
                    }
                }
                .user-input-icon {
                    position: relative;
                    width: 80px;
                    height: 1.1rem;
                    .md-icon {
                        position: absolute;
                        top: 50%;
                        left: 0;
                        transform: translateY(-50%);
                        display: inline-block;
                        /*vertical-align: middle;*/
                    }
                }
            }
        }
        .comment-popup-fix-div{
            width: 100%;
            height: 100%;
            background-color: #fff;
        }
        .user-comment{
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            .user-input-hold{
                flex: 1;
                height: 110px;
                padding: 16px 30px;
                box-sizing: border-box;
            }

            .user-text {
                border: 1PX solid #8a8a8a;
                border-radius: 10px;
                overflow: hidden;

                textarea {
                    width: 100%;
                    height: 300px;
                    padding: 30px;
                    box-sizing: border-box;
                    max-height: 300px;
                    resize: none;
                    border: none;
                    outline: none;
                    font-size: 30px;
                    line-height: 1.5;

                }
            }
            .user-input-icon{
                position: relative;
                width: 80px;
                height: 1.1rem;
                /*padding-right: 20px;*/
                text-align: center;
                &:after{
                    content: '';
                    display: inline-block;
                    vertical-align: middle;
                    width: 0;
                    height: 100%;
                }
                .md-icon{
                    position: absolute;
                    top: 50%;
                    left: 0;
                    transform: translateY(-50%);
                    display: inline-block;
                    /*vertical-align: middle;*/
                }
            }
        }
    }
    .comment-popup-fix-div{
        width: 100%;
        height: 100%;
        background-color: #fff;
    }
    .comment-popup{
        /*position: fixed;*/
        /*top: 0;*/
        /*left: 0;*/
        /*right: 0;*/
        /*bottom: 0;*/
        width: 100%;
        height: 100%;
        color: #ddd;
        z-index: 99;
        background-color: #fff;
        .comment-popup-inner{
            padding: 30px;
            box-sizing: border-box;
        }
        .user-text{
            border: 1PX solid #8a8a8a;
            border-radius: 10px;
            overflow: hidden;
            textarea{
                width: 100%;
                height: 300px;
                padding: 30px;
                box-sizing: border-box;
                font-size: 30px;
                line-height: 1.5;
                border: none;
                outline: none;
            }
        }
        .comment-btn {
            margin-top: 30px;
            text-align: right;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: flex-end;
            .comment-btn-item {
                margin: 0 20px;
                display: inline-block;
            }
        }
    }
</style>
