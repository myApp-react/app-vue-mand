<template>
    <div class="pointDetail-container">
        <div class="pointDetail-inner">
            <div v-if="isHasData">
                <div class="back-image-div">
                    <div class="back-image">
                        <img :src="info.src" alt="">
                    </div>
                </div>
                <div class="pointDetail-info">
                    <h3>{{info.name}}</h3>
                    <div class="pointDetail-info-other">
                        <span class="points">{{info.points}} <i class="normal">积分</i></span>
                        <span class="soldCount">已售：{{info.soldCount}}</span>
                    </div>
                </div>
                <div class="pointDetail-Describe">
                    <h3 class="title">兑礼说明</h3>
                    <div class="Describe-text">
                        <p>{{info.elaboration}}</p>
                    </div>
                    <h3 class="title">兑礼性情</h3>
                    <div class="Describe-text" v-html="info.note"></div>
                </div>
            </div>

            <!--<div class="description">-->
            <!--{{info.name}}-->
            <!--</div>-->
            <!--<div class="text">-->
            <!--<div>-->
            <!--<span class="points">{{info.points}} 积分</span>-->
            <!--<span>-->
            <!--已售：{{info.soldCount}}-->
            <!--</span>-->
            <!--</div>-->
            <!--<div class="redeem-text">-->
            <!--<p>兑礼说明：</p>-->
            <!--<p>{{info.elaboration}}</p>-->
            <!--</div>-->
            <!--<div class="gift-detail">-->
            <!--<p>礼品详情：</p>-->
            <!--<p v-html="info.note"></p>-->
            <!--</div>-->
            <!--</div>-->
        </div>
        <div class="pointDetail-btn">
            <md-button :disabled="info.repertory === 0" @click="goToRedeem">
                立即兑换
            </md-button>
        </div>

        <md-popup v-model="info.repertory===0" :mask-closable="false">
            <div class="sell-out">已售完</div>
        </md-popup>
    </div>
</template>

<script>
    import {Button, Popup, Toast} from 'mand-mobile'
    import {redeemDetail} from '@/api/pointsMall'

    export default {
        name: "detail",
        data() {
            return {
                info: {
                    src: '',
                    name: '',
                    elaboration: '',
                    soldCount: 0,
                    points: 0,
                    repertory: 0,
                    note: '',
                    enableExchangeNum: 0,
                },
                isHasData: false
            }
        },
        methods: {
            async getDetail() {
                Toast.loading('正在获取商品详情...')
                try {
                    let res = await redeemDetail({id: this.$route.params.id})
                    let {detailImg: src, name, exchangeTips: elaboration, soldCount, needPoints: points, repertory, note, enableExchangeNum} = res.data
                    this.info = {
                        src, name, elaboration, soldCount, points, repertory, note, enableExchangeNum
                    }
                    this.isHasData = true
                    Toast.hide()
                } catch (e) {
                    console.log(e);
                    Toast.failed(e)
                    this.isHasData = false
                }
            },
            goToRedeem() {
                if (this.info.enableExchangeNum > 0) {
                    this.$router.push({name: 'confirmRedeem', params: {id: this.$route.params.id}})
                } else {
                    Toast.info('您没有可兑换数量')
                }
            }
        },
        components: {
            [Button.name]: Button,
            [Popup.name]: Popup,
        },
        created() {
            this.getDetail()
        }
    }
</script>
<style lang="stylus">
    .pointDetail-container
        .pointDetail-btn
            background-color #fff

            .md-button.primary
                height 80px
                line-height 80px
                background-color #ff4602

                &:disabled
                    background-color #ddd

        .Describe-text {
            img {
                display: block;
                width: 100%;
            }

            p {
                font-size: 26px !important;
            }

            span {
                font-size: 26px !important;
            }

            a {
                font-size: 26px !important;
            }
        }
</style>
<style lang="stylus" scoped>
    /*.md-button.primary*/
    .pointDetail-container
        position relative
        width 100%
        height 100%
        padding-bottom 120px
        box-sizing border-box

        .pointDetail-inner
            width 100%
            height 100%
            overflow auto
            -webkit-overflow-scrolling touch
            background-color #EBEEF4

        .pointDetail-btn
            position absolute
            bottom 0
            left 0
            width 100%
            padding 20px 30px
            box-sizing border-box

            a
                position: relative
                display: block
                width 100%

                &:after
                    content ''
                    position absolute
                    top 0
                    left 0
                    width 100%
                    height 100%

    .back-image-div
        position relative

    .pointDetail-info
        padding 30px
        background-color #fff
        text-align left
        font-size 30px
        color #111
        line-height 1.5

        h3
            margin-bottom 12px
            overflow hidden
            display -webkit-box
            -webkit-line-clamp 2
            -webkit-box-orient vertical
            word-break break-all

        .pointDetail-info-other
        .points
            margin-right 30px
            font-size 40px
            color #ff4602

            .normal
                font-size 24px
                color #111

        .soldCount
            font-size 24px
            color #111

    .pointDetail-Describe
        margin-top 20px
        padding 30px
        text-align left
        background-color #fff

        .title
            margin-bottom 20px
            font-size 30px
            font-weight normal
            font-stretch normal
            line-height 37px
            letter-spacing 0
            color #111

        .Describe-text
            margin-bottom 20px
            font-size 26px
            font-weight normal
            font-stretch normal
            line-height 37px
            letter-spacing 0
            color #666


    .back-image
        height 390px

        img
            display block
            width 100%
            height 100%
            object-fit cover

    .description
        text-overflow: ellipsis;
        overflow hidden
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        padding 20px 30px
        font-size 30px
        line-height 1.5
        position relative
        text-align left
        top -80px
        background-color rgba(74, 74, 74, 0.4)
        color #fff

    /*background-color #4a4a4a*/
    /*z-index 1*/
    /*opacity 0.8*/
    .text
        margin-top -70px
        height calc(100% - 465px)
        overflow hidden
        text-align left
        font-size 30px
        line-height 60px

    .text div:first-child span:nth-child(2)
        float right
        margin-right 40px

    .button .md-button
        position fixed
        bottom 0
        line-height 80px
        height 80px

    .sell-out
        border-radius 100px
        display table-cell
        vertical-align middle
        height 200px
        width 200px
        background-color: #2093fd
        font-size: 40px
        color #fff

    .redeem-text, .gift-detail
        padding 0 30px
        color #909090

        p:nth-child(1)
            font-size 30px

        p:nth-child(2)
            text-indent 30px
            font-size 22px

    .gift-detail
        background-color: #fff
        height 2000px
</style>