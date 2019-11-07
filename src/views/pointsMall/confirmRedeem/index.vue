<template>
    <div class="confirmRedeem-container">
        <div class="confirmRedeem-inner">
            <div class="gift-details">
                <div class="gift-details-inner">
                    <div class="gift-details-info">
                        <div class="gift-img">
                            <img :src="info.src" alt="">
                        </div>
                        <div class="gift-info">
                            <div class="gift-info-name">{{info.name}}</div>
                            <div class="gift-info-extra">
                                <div class="integral">{{info.points}}<span class="sm">积分</span></div>
                                <div class="stepper-num">
                                    <md-stepper
                                            v-model="quantity"
                                            min="0"
                                            :max="maxQuantity"
                                            @change="verify"
                                    ></md-stepper>
                                </div>
                                <p class="notice" v-show="showNotice">您已到达当日兑换上限</p>
                            </div>
                        </div>
                    </div>
                    <div class="total-num">总计：<span class="mark">{{total}} 积分</span></div>
                </div>
            </div>
            <div class="pay-type-out">
                <div class="pay-type-inner">
                    <div class="title">支付方式</div>
                    <div class="pay-type-list-warp">
                        <md-radio
                                ref="radio"
                                :options="options"
                                v-model="optionValue"
                                icon="icon-pay-radio-active"
                                icon-inverse="icon-pay-radio"
                                icon-position="left"
                        >
                            <template slot-scope="{ option }">
                                <div class="md-radio-custom-title" v-text="option.text"></div>
                                <div class="md-radio-custom-brief" slot="right">{{total}} 积分</div>
                            </template>
                        </md-radio>
                    </div>
                </div>
            </div>
        </div>
        <div class="pay-btn">
            <md-button @click="confirmPayment" :disabled="btnPermission">确认支付</md-button>
        </div>
    </div>
</template>

<script>
    import {Stepper, Field, FieldItem, Radio, Button, Dialog, Toast} from 'mand-mobile'
    import {redeemDetail, confirmRedeem} from '@/api/pointsMall'
    import '@/assets/svg/pay-radio.svg'
    import '@/assets/svg/pay-radio-active.svg'

    export default {
        name: "confirmRedeem",
        data() {
            return {
                info: {
                    src: '',
                    name: '',
                    points: 0,
                    enableExchangeNum: 0,
                },
                maxQuantity: 0,
                quantity: 0,
                showNotice: false,
                optionValue: '积分支付',
                options: [
                    {text: '积分支付'},
                ],
                btnPermission: true
            }
        },
        computed: {
            total() {
                return this.quantity * this.info.points || 0
            }
        },
        components: {
            [Field.name]: Field,
            [FieldItem.name]: FieldItem,
            [Stepper.name]: Stepper,
            [Radio.name]: Radio,
            [Button.name]: Button,
            [Dialog.name]: Dialog,
        },
        methods: {
            verify(currentValue) {
                this.showNotice = currentValue === this.maxQuantity;
                this.btnPermission = currentValue === 0
            },
            async confirmPayment() {
                if (this.info.enableExchangeNum > 0) {
                    this.confirm()
                } else {
                    Toast.info('您没有可兑换数量')
                }
            },
            confirm() {
                Dialog.confirm({
                    content: `当前订单所需积分 ${this.total}，是否确认抵扣支付订单？`,
                    confirmText: '确认',
                    onConfirm: async () => {
                        try {
                            let res = await confirmRedeem({
                                giftId: this.$route.params.id,
                                num: this.quantity
                            })
                            this.$router.push(
                                {name: 'paySuccess', params: {points: this.total}}
                            )
                        } catch (e) {
                            Toast.info(e)
                        }
                    }
                })
            },
            async getDetail() {
                try {
                    let res = await redeemDetail({id: this.$route.params.id})
                    this.maxQuantity = res.data.enableExchangeNum
                    this.info = {
                        src: res.data.detailImg,
                        name: res.data.name,
                        points: res.data.needPoints,
                        enableExchangeNum: res.data.enableExchangeNum
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        },
        created() {
            this.getDetail()
        }
    }
</script>
<style lang="stylus">
    .confirmRedeem-container
        .pay-type-out
            .md-radio-content
                width 100%
                display flex
                flex-wrap wrap
                align-items center
                justify-content space-between

        .pay-btn
            .md-button.primary.large
                height 80px
                line-height 80px
                font-size 30px
                background-color #ff4602

                &:disabled
                    background-color #ddd

        .md-radio .md-field .md-field-item.md-radio-item.selected
            color #111
</style>
<style lang="stylus" scoped>
    .confirmRedeem-container
        position relative
        width 100%
        height 100%
        padding-bottom 120px
        box-sizing border-box
        overflow hidden

        .confirmRedeem-inner
            width 100%
            height 100%
            background-color #ECEFF5
            overflow auto

        .gift-details
            padding 30px 20px 0

        .gift-details-inner
            width 100%
            background-color #ffffff
            box-shadow 0 0 20px 0 rgba(0, 0, 0, 0.1)
            border-radius 10px


        .gift-details-info
            padding 30px
            display flex
            flex-wrap wrap
            align-items center
            justify-content center

            .gift-img
                width 140px
                height 140px
                background-color #ddd

                img
                    display block
                    width 100%
                    height 100%
                    object-fit cover

            .gift-info
                height 140px
                padding-left 20px
                box-sizing border-box
                flex 1
                font-size 30px
                display flex
                flex-wrap wrap
                align-content space-between

            .gift-info-name
                width 100%
                font-size 30px
                font-weight normal
                font-stretch normal
                line-height 36px
                letter-spacing 0
                color #111
                text-align left

            .gift-info-extra
                position relative
                width 100%
                display: flex
                flex-wrap wrap
                align-items center
                justify-content space-between

                .integral
                    font-size 40px
                    font-weight normal
                    font-stretch normal
                    line-height 36px
                    letter-spacing 0
                    color #ff4602

                .sm
                    margin-left 6px
                    font-size 26px
                    color #666

                .notice
                    position absolute
                    top -40px
                    right 0
                    font-size 20px
                    line-height 1.5
                    color #ff4602

        .total-num
            width 100%
            height 80px
            padding 0 24px
            box-sizing border-box
            line-height 80px
            text-align right
            font-size: 30px;
            border-top 1px solid #e5e5e5
            color #111

            .mark
                color #ff4602

        .pay-type-out
            padding 20px

            .pay-type-inner
                width 100%
                background-color #ffffff
                box-shadow 0 0 20px 0 rgba(0, 0, 0, 0.1)
                border-radius 10px
                overflow hidden

            .title
                width 100%
                height 74px
                padding 0 30px
                box-sizing border-box
                line-height 74px
                text-align left
                font-size 26px
                color #111
                border-bottom solid 1px #e5e5e5

        .pay-btn
            position absolute
            bottom 0
            left 0
            width 100%
            height 120px
            padding 20px 30px
            box-sizing border-box
            background-color #fff

    .md-radio-custom-title
        font-size 26px
        text-align left

    .md-radio-custom-brief
        font-size 26px
        color #111
        text-align right
</style>