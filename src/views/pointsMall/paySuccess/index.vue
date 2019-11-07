<template>
    <div class="paySuccess-container">
        <div class="payStatus-icon">
            <md-icon name="circle-right" size="lg" color="#ff4602"></md-icon>
        </div>
        <div class="payStatus-text">支付成功</div>
        <div class="payStatus-num">{{$route.params.points}}</div>
        <div class="pay-info">
            <md-field>
                <md-field-item
                        name="item0"
                        title="支付方式"
                        value="积分支付"
                        align="right"
                >
                </md-field-item>
            </md-field>
        </div>
        <div class="pay-extra-btn">
            <router-link to="/mine/mygift" class="pay-extra-btn-list">
                <md-button type="ghost-primary">查看订单</md-button>
            </router-link>
            <router-link to="/pointsMall" class="pay-extra-btn-list">
                <md-button class="mark">继续购物</md-button>
            </router-link>
        </div>

        <!--<div class="back-image"-->
             <!--:style="{backgroundImage:'url(' + src + ')',backgroundSize:'100% 100%',backgroundRepeat:'no-repeat'}">-->
        <!--</div>-->
        <!--<div class="text">-->
            <!--<p><span>支付成功，欢迎下次光临</span></p>-->
            <!--<p>积分支付：<span>{{$route.params.points}}</span></p>-->
        <!--</div>-->
        <!--<div class="btns">-->
            <!--<router-link to="/mine/mygift">-->
                <!--<md-button type="ghost" class="btn">查看订单</md-button>-->
            <!--</router-link>-->
            <!--<router-link to="/pointsMall">-->
                <!--<md-button type="ghost" class="btn">继续购物</md-button>-->
            <!--</router-link>-->
        <!--</div>-->
    </div>
</template>

<script>
    import { Button, Icon, Field, FieldItem } from 'mand-mobile'

    export default {
        name: "paySuccess",
        data() {
            return {
                src: require('@/assets/pics/paySuccess.png'),
            }
        },
        components: {
            [Button.name]: Button,
            [Icon.name]: Icon,
            [Field.name]: Field,
            [FieldItem.name]: FieldItem,
        },
    }
</script>
<style lang="stylus">
    .paySuccess-container
        .md-field
            background-color transparent
        .md-field-item
            background-color transparent
        .pay-extra-btn-list
            .md-button.primary
                height 80px
                line-height 80px
                font-size 30px
                background-color #ff4602
                /*color #ff4602*/
            .md-button.ghost-primary
                width 100%
                height 80px
                line-height 80px
                font-size 30px
                color #ff4602
                &:after
                    border-color #ff4602

</style>
<style lang="stylus" scoped>
    .paySuccess-container
        width 100%
        height 100%
        padding-top 60px
        box-sizing border-box
        background-color #ECEFF5
        overflow auto
        .payStatus-icon
            font-size 20px
            .md-icon.lg
                width 80px
                height 80px
        .payStatus-text
            margin-top 20px
            font-size 24px
            font-weight normal
            font-stretch normal
            line-height 40px
            letter-spacing 0
            color #111
        .payStatus-num
            margin-top 60px
            font-size 80px
            color #111
        .pay-info
            margin-top 90px
            width 100%
            box-sizing border-box
        .pay-extra-btn
            margin-top 80px
            padding 0 30px
            .pay-extra-btn-list
                margin-bottom 30px
                position relative
                display block
                &:after
                    content ''
                    position absolute
                    top 0
                    left 0
                    width 100%
                    height 100%
    .template-div
        background-color #f0f0f0
        height 100%
        padding-top 200px
        box-sizing border-box

    .back-image
        margin 0 auto
        width 300px
        height 300px

    .text
        font-size 30px
        line-height 2
        margin-bottom 60px
        span
            color #ff3300

    .btns
        padding 0 150px
        display flex
        justify-content space-around
        .btn
            background-color #fff
</style>