<template>
    <div class="home-container">
        <div class="home-container-inner" >
            <div class="scroll_warp" >
                <div class="banner" ref="home_scroll_div">
                    <md-swiper
                            :autoplay="3000"
                            :is-prevent="false"
                            v-if="banners.length !== 0"
                    >
                        <md-swiper-item
                                v-for="(item, $index) in banners"

                                :key="$index"
                        >
                            <img :src="item.imgPath" class="banner-img" @click="goToUrl(item.url)">
                        </md-swiper-item>
                    </md-swiper>
                    <md-swiper
                            :autoplay="3000"
                            :is-prevent="false"
                            v-else
                    >
                        <md-swiper-item
                                v-for="(item, $index) in defaultBanners"
                                :key="$index"
                        >
                            <img :src="item.imgPath" class="banner-img">
                        </md-swiper-item>
                    </md-swiper>
                </div>
                <div class="nav-out">
                    <div class="nav">
                        <div class="item">
                            <router-link to="/smallVotePoints">
                                <div class="circle">
                                    <img src="@/assets/smallVotePoints.png" alt="">
                                </div>
                                <span class="item-text">小票积分</span>
                            </router-link>
                        </div>
                        <div class="item">
                            <router-link to="/floorNav">
                                <div class="circle">
                                    <img src="@/assets/floorNav.png" alt="">
                                </div>
                                <span class="item-text">楼层导航</span>
                            </router-link>
                        </div>
                        <div class="item">
                            <router-link to="/brandShops">
                                <div class="circle">
                                    <img src="@/assets/brandShops.png" alt="">
                                </div>
                                <span class="item-text">品牌商铺</span>
                            </router-link>
                        </div>
                        <div class="item">
                            <router-link to="/carPayment">
                                <div class="circle">
                                    <img src="@/assets/carPayment.png" alt="">
                                </div>
                                <span class="item-text">寻车缴费</span>
                            </router-link>
                        </div>
                        <div class="item">
                            <router-link to="/signIn">
                                <div class="circle">
                                    <img src="../assets/signIn.png" alt="">
                                </div>
                                <span class="item-text">签到</span>
                            </router-link>
                        </div>
                        <div class="item">
                            <router-link to="/coupon">
                                <div class="circle">
                                    <img src="@/assets/coupon.png" alt="">
                                </div>
                                <span class="item-text">优惠券</span>
                            </router-link>
                        </div>
                        <div class="item">
                            <router-link to="/surveys">
                                <div class="circle">
                                    <img src="@/assets/surveys.png" alt="">
                                </div>
                                <span class="item-text">问卷调查</span>
                            </router-link>
                        </div>
                        <div class="item">
                            <router-link to="/mine">
                                <div class="circle">
                                    <img src="@/assets/mine-center.png" alt="">
                                </div>
                                <span class="item-text">个人中心</span>
                            </router-link>
                        </div>
                    </div>
                </div>

                <div class="hot-brands-out">
                    <div class="home-common-title">
                        <span class="common-title-text">热门品牌</span>
                    </div>
                    <div class="hot-brands" v-if="hotBrands.length !== 0">
                        <div class="hot-brands-img"
                             v-for="(item, index) in hotBrands"
                             :key="index"
                        >
                            <div class="hot-brands-inner">
                                <img :src="item.cover" @click="goToshopsDetail(item.id)">
                            </div>
                        </div>
                    </div>
                    <div class="hot-brands"  v-else>
                        <div class="hot-brands-hold">
                            <content-placeholders :animated="false">
                                <content-placeholders-img />
                            </content-placeholders>
                            <content-placeholders :animated="false">
                                <content-placeholders-img />
                            </content-placeholders>
                            <content-placeholders :animated="false">
                                <content-placeholders-img />
                            </content-placeholders>
                            <content-placeholders :animated="false">
                                <content-placeholders-img />
                            </content-placeholders>
                            <content-placeholders :animated="false">
                                <content-placeholders-img />
                            </content-placeholders>
                        </div>
                    </div>
                </div>
                <div class="recommend-events-out">
                    <div class="recommend-events-inner">
                        <div class="home-common-title">
                            <span class="common-title-text">推荐活动</span>
                        </div>
                        <div class="recommend-events" v-if="recommends.length !== 0">
                            <div class="recommend-events-img" v-for="(item, index) in recommends" :key="index">
                                <router-link :to="'/activity/details/'+ item.id">
                                    <div class="events-img-out">
                                        <img :src="item.cover" @click="goToactivityDetails(item.id)">
                                    </div>
                                    <div class="events-img-text">
                                        <span>{{item.activityName}}</span>
                                    </div>
                                </router-link>
                            </div>
                        </div>
                        <div class="recommend-events-hold" v-else>
                            <content-placeholders :rounded="true" :animated="false">
                                <content-placeholders-img />
                                <content-placeholders-text :lines="1" />
                            </content-placeholders>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <tabbar :routeId='0'/>
    </div>
</template>


<script>
    import Vue from "vue"
    import {Swiper, SwiperItem, Icon,Toast} from 'mand-mobile'
    import {aggregateApi} from "@/api/home";
    import tabbar from '@/components/tabbar'
    import "@/assets/svg/smallVotePoints-svg.svg";
    import VueContentPlaceholders from 'vue-content-placeholders'
    Vue.use(VueContentPlaceholders);

    export default {
        name: 'home',
        components: {
            [Swiper.name]: Swiper,
            [SwiperItem.name]: SwiperItem,
            [Icon.name]: Icon,
            tabbar
        },
        data() {
            return {
                banners: [],
                defaultBanners: [
                    {
                        "imgPath": require("@/assets/home-hold-img.png"),    //图片地址
                        "url": "http://www.baidu.com",    //链接地址
                    }
                ],
                hotBrands: [],
                recommends: [],
            }
        },
        methods: {
            goToUrl(url) {
                location.assign(url)
            },
            async getAllPics() {
                try {
                    let res = await aggregateApi({
                        banners: '/banner',
                        hotBrands: '/store/recommend',
                        recommends: '/activity/recommend',
                        mode: 'loose'
                    });

                    this.banners = res.data.banners
                    this.hotBrands = res.data.hotBrands
                    this.recommends = res.data.recommends
                } catch (e) {
                    Toast.info(e);
                }
            },
            goToshopsDetail(id) {
                this.$router.push({name: 'shopsDetail', params: {id}})
            },
            goToactivityDetails(id) {
                this.$router.push({name: 'details', params: {id}})
            },
        },
        created() {
            // this.getAllPics()
        },
        activated() {
            this.getAllPics()
        },
    }

</script>

<style lang="stylus">
    .home-container
        .recommend-events-hold
            .vue-content-placeholders-heading__title
                height 26px
            .vue-content-placeholders-heading__subtitle
                height 26px
            .vue-content-placeholders-text__line
                height 26px

</style>

<style lang="stylus" scoped>
    .home-container
        width 100%
        height 100%
        padding-bottom 110px
        box-sizing border-box
        background-color #F2F3F4
        overflow hidden
    .home-container-inner
        width 100%
        height 100%
        padding 0 20px
        box-sizing border-box
        overflow auto
        -webkit-overflow-scrolling touch;
        .scroll_warp
            width 100%
    img
        vertical-align middle

    .banner
        padding-top 30px
        height 390px
        box-sizing border-box

        .md-swiper
            box-shadow 0 0 10px 0  rgba(0, 0, 0, 0.1)
            border-radius 4px
            overflow hidden

        .banner-img
            width 100%
            height 100%
            object-fit cover
    .nav-out
        padding-top 20px

    .nav
        padding 30px 0
        display flex
        flex-wrap wrap
        align-items center
        justify-content center
        font-size 25px
        box-shadow 0px 0px 10px 0px  rgba(0, 0, 0, 0.1)
        border-radius 4px
        background-color #fff

        .item
            position relative
            width 25%
            height 140px
            &:after
                content ''
                display inline-block
                vertical-align middle
                width: 0;
                height: 100%;
            a
                display inline-block
                vertical-align middle

                &:after
                    content ''
                    position absolute
                    top 0
                    left 0
                    width 100%
                    height 100%

            .circle
                margin auto
                width 50px
                height 50px
                /*background #ddd*/
                border-radius 4px
                overflow hidden
                img
                    display: block
                    width 100%
            .item-text
                margin-top 22px
                display inline-block
                font-size 24px
                color #494a4d
    .hot-brands-out
        margin-top 20px
        padding-bottom 26px
        width 100%
        background-color #ffffff
        box-shadow 0px 0px 10px 0px  rgba(0, 0, 0, 0.1)
        border-radius 8px

    .home-common-title
        font-size 26px
        color #ff4602
        line-height 80px
        .common-title-text
            position relative
            font-size 26px
            &:after
                content ''
                position absolute
                left -30px
                top 50%
                transform translateY(-50%)
                width 20px
                height 24px
                background url(../assets/home-title-mark-1.png) no-repeat center
                background-size 100% 100%
            &:before
                content ''
                position absolute
                right -30px
                top 50%
                transform translateY(-50%)
                width 20px
                height 24px
                background url(../assets/home-title-mark-2.png) no-repeat
                background-size 100% 100%

    .imgs-title
        font-size 40px
        color #f60000

    .hot-brands
        min-height 126px
        display flex
        flex-wrap wrap
        justify-content flex-start
        align-items center
        .hot-brands-img
            width 20%
            padding 20px 0
            .hot-brands-inner
                margin auto
                width 100px
                height 100px
                background-color #ddd
                border-radius 50px
                border solid 1px #e5e4e3
                overflow hidden
            img
                display: block
                width 100%
                height 100%
                object-fit cover
        .hot-brands-hold
            flex 1
            width 100%
            display flex
            flex-wrap wrap
            justify-content flex-start
            align-items center
        .vue-content-placeholders
            width 20%
            padding 20px 0
            .vue-content-placeholders-img
                margin auto
                width 100px
                height 100px
                border-radius 50%

    .recommend-events-out
        margin-top 20px
        padding-bottom 100px
        width 100%

    .recommend-events-inner{
        background-color #ffffff
        box-shadow 0 0 10px 0  rgba(0, 0, 0, 0.1)
        border-radius 8px
    }
    .recommend-events
        padding 20px
        min-height 100px
        .recommend-events-img
            margin-bottom: 30px;
            border-bottom 1PX solid #aaaaaa
            &:last-child
                margin 0
                border none
            a
                position: relative
                display: block
                width 100%
                &:before
                    content ''
                    position absolute
                    left 0
                    top 0
                    width 100%
                    height 100%

            .events-img-out
                width 100%
                height 240px
            img
                display: block
                width 100%
                height 100%
                object-fit cover
        .events-img-text
            padding 20px 0
            font-size 26px
            line-height 1.5
            text-align left
            overflow hidden
            display -webkit-box
            -webkit-line-clamp 2
            -webkit-box-orient: vertical
            word-break break-all
    .recommend-events-hold
        padding 20px
        .vue-content-placeholders-img
            height 240px

</style>
