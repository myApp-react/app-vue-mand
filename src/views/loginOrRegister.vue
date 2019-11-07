<template>
    <div class="template-div">
        <div class="area">
            <p>您还不是会员，请先注册会员</p>
            <div class="area-btn">
                <router-link to="/login" replace class="login">
                    <md-button>
                        直接登录
                    </md-button>
                </router-link>
                <router-link to="/register" replace class="register">
                    <md-button>
                        立即注册
                    </md-button>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import {Button} from 'mand-mobile'

    export default {
        name: "loginOrRegister",
        components: {
            [Button.name]: Button,
        },
    }
</script>

<style lang="stylus" scoped>
    .template-div
        background-color #767676
        height 100%
        width 100%

    .area
        border-radius 12px 12px 0 0
        position absolute
        left 50%
        top 40%
        transform translate(-50%, -50%);
        width 500px
        /*height 280px*/
        background-color #fff

        p
            line-height 140px
            font-size 32px
            margin-top 40px

    .area-btn
        position relative
        display: flex
        flex-wrap wrap
        align-items center
        justify-content center

    .md-button
        height 10px
        line-height 30px
        border-radius 0

    /*background-color #2a94cf*/

    .md-button.primary.large, .md-button.primary.small
        height 80px

    a
        position relative
        flex 1

    a:after
        content ''
        position absolute
        top 0
        left 0
        width 100%
        height 100%
</style>