<template>
    <div>
        <div class="back-image-div">
            <div class="back-image"
                 :style="{backgroundImage:'url(' + src + ')',backgroundSize:'100% 100%',backgroundRepeat:'no-repeat'}">
            </div>
        </div>
        <div class="upload-pic">
            <md-button :disabled="btnStatus" icon="icon-Points-icon-btn" @click="chooseImage">上传小票照片</md-button>
        </div>
        <div class="tips">
            <p>
                {{note}}
            </p>
        </div>
    </div>
</template>

<script>
    import {ImageReader, Toast, Button} from 'mand-mobile'
    import {noticeServer, jssdk, iflogined, explanation} from "@/api/smallVotePoints";
    import wx from 'weixin-js-sdk';
    import "@/assets/svg/Points-icon-btn.svg"

    export default {
        name: "smallVotePoints",
        data() {
            return {
                defaultSrc: require('@/assets/smallticket.png'),
                btnStatus: true,
                localId: '',
                serverId: '',
                src: '',
                note: '',
            }
        },
        components: {
            [Button.name]: Button,
            [ImageReader.name]: ImageReader,
        },
        methods: {
            async wxConfig() {
                try {
                    let res = await jssdk()
                    let {appid, nonceStr, signature, timestamp} = res.data
                    wx.config({
                        debug: false,
                        appId: appid,
                        timestamp: timestamp,
                        nonceStr: nonceStr,
                        signature: signature,
                        jsApiList: [
                            'chooseImage',
                            'uploadImage',
                        ]
                    });
                    wx.ready(_ => {
                        this.btnStatus = false
                    });
                    wx.error(res => {
                        console.log(res);
                    });
                } catch (e) {
                    console.log(e);
                }
            },
            async callExplanation() {
                try {
                    let res = await explanation()
                    this.note = res.data.note
                    if (res.data.image.length > 0) {
                        this.src = res.data.image
                    } else {
                        this.src = this.defaultSrc
                    }
                } catch (e) {
                    Toast.info(e)
                }
            },
            chooseImage() {
                wx.chooseImage({
                    count: 1,
                    sizeType: ['original', 'compressed'],
                    sourceType: ['album', 'camera'],
                    success: res => {
                        this.localId = res.localIds
                        this.uploadImage()
                    },
                    fail: _ => {
                        console.log('chooseImage fail');
                    },
                });
            },
            uploadImage() {
                wx.uploadImage({
                    localId: this.localId.toString(),
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: res => {
                        this.serverId = res.serverId; // 返回图片的服务器端ID
                        this.noticeServer2downloadPic()
                    },
                    fail: _ => {
                        console.log('uploadImage fail');
                    },
                });
            },
            async noticeServer2downloadPic() {
                try {
                    let res = await noticeServer({mediaId: this.serverId})
                    Toast.succeed("上传成功")
                } catch (e) {
                    console.log(e);
                }
            },
            async init() {
                let res = await iflogined();
            }
        },
        async created() {
            let res1 = await this.init()
            let res2 = await this.wxConfig()
            let res3 = await this.callExplanation()
        }
    }
    // todo
</script>

<style lang="stylus" scoped>
    .input-file
        display none

    .back-image-div
        width: 100%;
        height 400px

        .back-image
            height 400px

    /*.add-pic img*/
    /*height auto*/
    /*max-width 100%*/

    .upload-pic
        margin-top 60px
        padding 0 30px

    .upload-pic .md-button
        margin auto
        width 400px
        height 120px
        line-height 120px
        background-color: #ff4602;

    .upload-pic .md-button:disabled {
        background-color: #ddd;
    }

    .tips
        padding 0 30px
        margin-top 60px
        font-size 30px;
        text-align left
        line-height 1.5
        color #666666
</style>