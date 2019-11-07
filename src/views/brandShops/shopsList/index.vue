<template>
    <div class="template-div shopsList-container">
        <div class="search-bar-cont">
            <md-field class="search-bar">
                <md-input-item
                        v-model="searchForm.name"
                        align="left"
                        placeholder="请输入店铺名称"
                        :clearable="true"
                >
                    <md-button type="link" style="margin-right:15px;padding: 0 20px" slot="right"
                               @click="search">搜 索
                    </md-button>
                </md-input-item>
            </md-field>
        </div>
        <div class="drop-menu-cont">
            <cascade-drop-menu
                    class="cascade-drop-menu"
                    :foo="searchForm.floorId"
                    @update:foo="changeFloorId"
                    @update:fof="changeOperationTypeId"
            ></cascade-drop-menu>
        </div>
        <md-result-page
                :img-url="noData"
                text="怎么找也没有了 X﹏X"
                v-if="showNoData===1"
        >
        </md-result-page>
        <div v-if="lists.length>0" class="list">
            <md-scroll-view
                    ref="scrollView"
                    :autoReflow="true"
                    :scrolling-x="false"
                    @endReached="$_onEndReached"
            >
                <div class="scroll-view-item" v-for="(item, index) in lists" :key="index">
                    <div class="view-item-inner">
                        <router-link :to="{name: 'shopsDetail', params: {id:item.id}}">
                            <div class="store-img">
                                <img :src="item.cover">
                            </div>
                            <div class="store-info">
                                <p class="title">{{item.name}}</p>
                                <p class="label-text">业态：{{item.operation}}</p>
                                <p class="label-text">楼层：{{item.floor}} </p>
                                <p class="label-text">电话：{{item.tel}}</p>
                            </div>
                        </router-link>
                        <div class="user-handle" @click="callLikeOrDislike(item.id, item.collect, index)">
                            <!--<md-icon @click="callLikeOrDislike(item.id, item.collect, index)"-->
                            <!--:name="item.collect?'icon-Collection-active':'icon-Collection'"-->
                            <!--size="lg">-->
                            <!--</md-icon>-->
                            <md-icon v-if="item.collect"
                                     color="#ff4602"
                                     :name="item.collect?'icon-Collection-active':'icon-Collection'"
                                     size="md"
                            >
                            </md-icon>
                            <md-icon v-else
                                     color="#666"
                                     :name="item.collect?'icon-Collection-active':'icon-Collection'"
                                     size="md"
                            >
                            </md-icon>
                        </div>
                    </div>



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
    import {InputItem, Field, Button, Icon, ScrollView, ScrollViewMore, Toast, ResultPage} from 'mand-mobile'
    import {lists, like, dislike} from '@/api/brandShops'
    import cascadeDropMenu from '@/components/cascadeDropMenu'
    import '@/assets/svg/unlight.svg'
    import '@/assets/svg/light.svg'
    import '@/assets/svg/Collection.svg'
    import '@/assets/svg/Collection-active.svg'

    export default {
        name: "shopsList",
        data() {
            return {
                searchForm: {
                    name: '',
                    floorId: '',
                    operationTypeId: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                lists: [],
                isFinished: false,
                noData: require("@/assets/noData.png"),
                showNoData: 0
            };
        },
        components: {
            [InputItem.name]: InputItem,
            [Field.name]: Field,
            [Button.name]: Button,
            [Icon.name]: Icon,
            [ScrollView.name]: ScrollView,
            [ScrollViewMore.name]: ScrollViewMore,
            [ResultPage.name]: ResultPage,
            cascadeDropMenu,
        },
        methods: {
            changeFloorId(val) {
                this.searchForm.floorId = val
                this.search()
            },
            changeOperationTypeId(val) {
                this.searchForm.operationTypeId = val
                this.search()
            },
            search() {
                this.lists = []
                this.searchForm.pageIndex = 1
                this.fetchLists()
            },
            async fetchLists() {
                Toast.loading("正在加载...")
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
                    Toast.info(e);
                }
            },
            async callLikeOrDislike(id, collect, index) {
                try {
                    if (collect) {
                        let res = await dislike({storeId: id})
                        Toast.info('已取消收藏', 1500)
                    } else {
                        let res = await like({storeId: id})
                        Toast.info('已收藏', 1500)
                    }
                    this.$set(this.lists[index], 'collect', !collect)
                } catch (e) {
                    Toast.info(e);
                }
            },
            $_onEndReached() {
                if (this.isFinished) {
                    return
                }
                setTimeout(() => {
                    this.fetchLists()
                    this.$refs.scrollView.finishLoadMore()
                }, 1000)
            },
        },
        async created() {

        },
        activated() {
            console.log("12触发了")

            this.fetchLists()
        }

    }
</script>
<style lang="stylus">
    .shopsList-container
        .md-field .md-field-content .md-field-item .md-field-item-inner::before,
        .md-field .md-field-content .md-input-item-container::before
            display none
            background-color transparent
        .md-input-item .md-input-item-control .md-input-item-clear
            height 60px
            right 120px
        .md-button.link:active::before
            background-color transparent
        .md-field .md-field-content .md-input-item
            padding 0
        .md-input-item
            min-height 60px
            .md-input-item-control
                padding-right 120px!important
                box-sizing border-box
                min-height 60px
                .md-input-item-input
                    width 100%
                    height: 60px;
                    padding 0 60px 0 30px
                    border-radius 10px
                    overflow hidden
                    background-color #F3F5F9
                .md-input-item-right
                    width auto
                    height 60px
        .md-button.link
            font-size 28px
            color #ff4602
            background-color transparent
        .md-scroll-view
            background #ECEFF5
</style>
<style lang="stylus" scoped>
    .shopsList-container
        position relative
        height 100%
        padding-top 180px
        box-sizing border-box
        background-color #ECEFF5
    .search-bar-cont
        position: absolute
        top 0
        left 0
        width 100%
        height 100px
        padding 20px 30px 20px 30px
        box-sizing border-box
        background-color #fff
        z-index 999
        border-bottom .5px solid #e5e5e5
    .drop-menu-cont
        position: absolute
        top 100px
        left 0
        width 100%
    .search-bar
        width 100%
        height 60px
        line-height 60px

    .cascade-drop-menu
        position fixed
        z-index 1
        width 100%
        top 100px
        left 0

    /*.drop-menu >>> .md-popup.top .md-popup-box*/
    /*top: 100px*/

    .list
        width 100%
        height 100%
        font-size 26px
        background-color #ECEFF5
        overflow auto
        .scroll-view-item
            padding 20px 20px 0
            position relative
            width 100%
            box-sizing border-box
            .view-item-inner
                width 100%
                padding 30px
                box-sizing border-box
                display flex
                flex-wrap wrap
                align-items center
                justify-content center
                background-color #fff
                box-shadow: 0 0 20px 0  rgba(0, 0, 0, 0.1);
                border-radius 10px
            a
                position relative
                flex 1
                box-sizing border-box
                display flex
                flex-wrap wrap
                align-items center
                justify-content center
                &:after
                    content ''
                    position: absolute
                    top 0
                    left 0
                    width 100%
                    height 100%
                    z-index 10
                .store-img
                    width 160px
                    height 160px
                    img
                        display: block
                        width 100%
                        height 100%
                        object-fit cover
                .store-info
                    flex 1
                    padding-left 20px
                    text-align left
                    .title
                        margin-bottom 12px
                        font-size 30px
                        font-weight normal
                        font-stretch normal
                        line-height 36px
                        letter-spacing 0
                        color #111
                        overflow hidden
                        display -webkit-box
                        -webkit-line-clamp 1
                        -webkit-box-orient vertical
                        word-break break-all
                    .label-text
                        font-size 20px
                        font-weight normal
                        font-stretch normal
                        line-height 36px
                        letter-spacing 0
                        color #666
            .user-handle
                position relative
                width 100px
                height 120px
                z-index 99
                border-left 1px solid #e1e1e6
                &:before
                    content ''
                    position absolute
                    top 0
                    left 0
                    width 100%
                    height 100%
                &:after
                    content ''
                    display inline-block
                    vertical-align middle
                    width 0
                    height 100%
                .md-icon
                    display inline-block
                    vertical-align middle

</style>