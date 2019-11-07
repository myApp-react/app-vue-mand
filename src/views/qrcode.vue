<template>
    <div class="template-div">
        <p>进入公众号查看会员更多权益</p>
        <div class="img">
            <img src="@/assets/pics/qrcode.png">
        </div>
        <p>
            识别二维码关注【公众号名称】，关注我们更多会员权益活动
        </p>
    </div>
</template>

<script>
    export default {
        name: "qrcode",
    }
</script>

<style lang="stylus" scoped>
    .template-div
        padding 300px 120px 0 120px
        font-size 30px
        background-color #5a5a5a
        box-sizing border-box
        width 100%
        height 100%
        color #fff

        p
            line-height 40px
            margin 40px auto

        .img
            resize both
            margin auto
            background-color #fff
            width 250px
            height 250px
            object-fit fill

            img
                width 100%
                height 100%

</style>