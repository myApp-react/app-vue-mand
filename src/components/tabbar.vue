<template>
    <div class="tabbar">
        <div class="tabbar-nav">
            <router-link to="/home">
                <div class="tabbar-item__icon">
                    <md-icon :name="homeIcon" size="lg"></md-icon>
                </div>
                <div class="tabbar-item__text">
                    <span>首页</span>
                </div>
            </router-link>
        </div>
        <div class="tabbar-nav">
            <router-link to="/pointsMall">
                <div class="tabbar-item__icon shopping">
                    <md-icon name="icon-shopping" size="lg"></md-icon>
                </div>
                <div class="tabbar-item__text">
                    <span>积分商城</span>
                </div>
            </router-link>
        </div>
        <div class="tabbar-nav">
            <router-link to="/activity">
                <div class="tabbar-item__icon">
                    <md-icon name="icon-activity" size="lg"></md-icon>
                </div>
                <div class="tabbar-item__text">
                    <span>活动中心</span>
                </div>
            </router-link>
        </div>
        <div class="tabbar-nav">
            <router-link to="/mine">
                <div class="tabbar-item__icon">
                    <md-icon :name="mineIcon" size="lg"></md-icon>
                </div>
                <div class="tabbar-item__text">
                    <span>个人中心</span>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script>
    import Icon from "mand-mobile/lib-vw/icon";
    import "@/assets/svg/home.svg"
    import "@/assets/svg/home-active.svg"
    import "@/assets/svg/shopping.svg"
    import "@/assets/svg/activity.svg"
    import "@/assets/svg/mine.svg"
    import "@/assets/svg/mine-active.svg"


    export default {
        name: "tabbar",
        props: ['routeId'],
        components: {
            [Icon.name]: Icon,
        },
        computed: {
            homeIcon() {
                const name = this.routeId;
                return name === 0 ? "icon-home-active" : "icon-home"
            },
            shoppingIcon() {
                const name = this.routeId;
                return name === 1 ? "icon-shopping" : "icon-shopping"
            },
            activityIcon() {
                const name = this.routeId;
                return name === 2 ? "icon-activity" : "icon-activity"
            },
            mineIcon() {
                const name = this.routeId;
                return name === 3 ? "icon-mine-active" : "icon-mine"
            },
        }



    }
</script>

<style lang="stylus" scoped>
    .tabbar
        height 110px
        position fixed
        z-index 2000
        bottom 0
        left 0
        right 0
        background-color #fff
        display flex
        justify-content space-around
        align-items center
        font-size 30px
        box-shadow 0 0 35px 0 rgba(3, 0, 0, 0.14)
        .tabbar-nav
            width 25%
            height 100%
            a
                position relative
                width 100%
                height 100%
                display flex
                align-items center
                flex-direction column
                justify-content center
                text-decoration none
                color #333
                :after
                    content ''
                    position absolute
                    top 0
                    left 0
                    width 100%
                    height 100%
            a.router-link-active
                color #ff4400
        .tabbar-item__icon
            margin-bottom 10px

        .md-icon
            display block
            width 38px
            height 38px
        /*.shopping*/
            /*margin-bottom 12px*/
        /*.shopping .md-icon*/
            /*width 32px*/
            /*height 32px*/

        .tabbar-item__text
            font-size 24px
</style>