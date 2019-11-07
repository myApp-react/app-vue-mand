<template>
    <div class="template-div goodsList-container">
        <div class="top-nav-bar">
            <drop-menu
                    class="drop-menu"
                    :titles1="`分类`"
                    :titles2="`积分值`"
                    :options1="options1"
                    :options2="options2"
                    @update:typeId="changeTypeId"
                    @update:pointRange="changePointRange"
            ></drop-menu>
        </div>
        <md-result-page
                :img-url="noData"
                text="怎么找也没有了 X﹏X"
                v-if="showNoData === 1"
        >
        </md-result-page>
        <md-result-page
                :img-url="error"
                text="服务器错误，请稍后再试"
                v-else-if="showNoData === 2"
        >
        </md-result-page>
        <div v-else class="content">
            <md-scroll-view
                    ref="scrollView"
                    :scrolling-x="false"
                    :autoReflow="true"
                    @endReached="$_onEndReached"
            >
                <div
                        v-for="(item,key) in lists"
                        :key="key"
                        class="scroll-view-list"
                >
                    <router-link :to="{name: 'detail', params: {id:item.id}}">
                        <div class="scroll-view-item">
                            <div class="view-item-img">
                                <img :src="item.cover">
                            </div>
                            <div class="view-item-info">
                                <p class="name">{{item.name}}</p>
                                <div class="extra">
                                    <p class="count">已售：{{item.soldCount}}</p>
                                    <p class="points">{{item.needPoints}} <span class="normal">积分</span></p>
                                    <md-button
                                            type="ghost-primary"
                                            :disabled="item.repertory === 0"
                                            @click.prevent="redeemImmediately(item.id)"
                                            class="btn"
                                    >立即兑换</md-button>
                                </div>
                            </div>


                        </div>
                    </router-link>
                </div>
                <md-scroll-view-more
                        slot="more"
                        :is-finished="isFinished"
                >
                </md-scroll-view-more>
            </md-scroll-view>
        </div>
    </div>
</template>

<script>
    import {ScrollView, ScrollViewMore, Button, ResultPage, Toast} from 'mand-mobile'
    import {classify, lists} from '@/api/pointsMall'
    import dropMenu from '@/components/dropMenu'

    export default {
        name: "goodsList",
        data() {
            return {
                lists: [],
                isFinished: false,
                searchForm: {
                    typeId: '',
                    pointRange: '',
                    pageIndex: 1,
                    pageSize: 10,
                },
                options1: [],
                options2:
                    [
                        {
                            id: '1',
                            name: '可兑换礼品',
                        },
                        {
                            id: '2',
                            name: '0~3000',
                        },
                        {
                            id: '3',
                            name: '3000~10000',
                        },
                        {
                            id: '4',
                            name: '10000以上',
                        },
                    ],
                noData: require("@/assets/noData.png"),
                error: require("@/assets/error.png"),
                showNoData: 0
            }
        },
        components: {
            [ScrollView.name]: ScrollView,
            [ScrollViewMore.name]: ScrollViewMore,
            [Button.name]: Button,
            [ResultPage.name]: ResultPage,
            dropMenu
        },
        methods: {
            changeTypeId(val) {
                this.searchForm.typeId = val
                this.search()
            },
            changePointRange(val) {
                this.searchForm.pointRange = val
                this.search()
            },
            search() {
                this.lists = []
                this.searchForm.pageIndex = 1
                this.fetchLists()
            },
            async fetchClassify() {
                try {
                    let res = await classify()
                    this.options1 = res.data.map((i) => ({id: i.id, name: i.name}))
                } catch (e) {
                    Toast.info(e);
                }
            },
            redeemImmediately(id) {
                this.$router.push({name: 'confirmRedeem', params: {id}})
            },
            async fetchLists() {
                Toast.loading("载入中...");
                try {
                    let res = await lists(this.searchForm)
                    let {rows, currentPage, totalPage} = res.data
                    this.lists.push(...rows)
                    this.showNoData = this.lists.length > 0 ? 0 : 1
                    this.searchForm.pageIndex = currentPage + 1
                    if (currentPage === totalPage) {
                        this.isFinished = true
                    }
                    Toast.hide()
                } catch (e) {
                    this.showNoData = 2
                    Toast.info(e);
                }
            },
            $_onEndReached() {
                if (this.isFinished) {
                    return
                }
                // async data
                setTimeout(() => {
                    this.fetchLists()
                    this.$refs.scrollView.finishLoadMore()
                }, 1000)
            },
        },
        created() {

        },
        activated() {
            this.fetchClassify()
            this.fetchLists()
        }
    }

</script>
<style lang="stylus">
    .goodsList-container
        .top-nav-bar
            .title-flex
                height 80px
            .drop-menu
                top 0
        .md-button.ghost-primary
            color #ff4602
            &:after
                border-color #ff4602
</style>
<style lang="stylus" scoped>
    .template-div
        position relative
        width 100%
        height 100%
        padding-top 80px
        background-color #f0f0f0
        box-sizing border-box
        .top-nav-bar
            position absolute
            top 0
            left 0
            width 100%

        .md-scroll-view
            background-color #EBEEF4

    .drop-menu
        position fixed
        width 100%
        z-index 1

    .content
        /*position fixed*/
        /*top 120px*/
        width 100%
        height 100%
        /*box-sizing border-box*/
        .scroll-view-list
            padding 20px 20px 0
            a
                position: relative
                display block
                width 100%
                padding 20px
                box-sizing border-box
                box-shadow 0 0 20px 0 rgba(0, 0, 0, 0.1)
                border-radius 10px
                overflow hidden
                background-color #fff

        .scroll-view-item
            position relative
            width 100%
            text-align center
            font-size 28px
            display: flex
            flex-wrap wrap
            align-items center
            justify-content center
            .view-item-img
                height 180px
                width 180px
                img
                    display: block
                    width 100%
                    height 100%
                    object-fit cover
            .view-item-info
                flex 1
                padding-left 20px
                text-align left
                line-height 1.5
            .name
                margin-bottom 12px
                font-size 30px
                color #111
                overflow hidden;
                display -webkit-box
                -webkit-line-clamp 2
                -webkit-box-orient vertical
                word-break break-all
            .extra
                position relative
                padding-right 140px
                box-sizing border-box
                display flex
                flex-wrap wrap
                align-items center
                justify-content center

            .count
                margin-bottom 6px
                width 100%
                color #666
                font-size 26px

            .points
                width 100%
                color #ff4602
                font-size 30px
                .normal
                    color #666
                    font-size 26px
            .btn
                z-index 20
                position absolute
                right 0
                bottom 0
                padding 0
                height 50px
                width 120px
</style>