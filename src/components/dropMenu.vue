<template>
    <div class="cascade" :style="{height:height}">
        <div class="title-flex">
            <div class="title-flex-inner">
                <div class="title" @click="showOptions1" :class="{'title-active':titleActive1}">
                    <div class="title-text">
                        <span>{{title1}}</span>
                        <md-icon v-if="show1" name="arrow-up" size="lg" class="icon"></md-icon>
                        <md-icon v-else name="arrow-down" size="lg" class="icon"></md-icon>
                    </div>
                </div>
                <div class="title" @click="showOptions2" :class="{'title-active':titleActive2}">
                    <div class="title-text">
                        <span>{{title2}}</span>
                        <md-icon v-if="show2" name="arrow-up" size="lg" class="icon"></md-icon>
                        <md-icon v-else name="arrow-down" size="lg" class="icon"></md-icon>
                    </div>
                </div>
            </div>
        </div>
        <transition enter-active-class="animated slideInDown faster" leave-active-class="animated slideOutUp faster">
            <div v-show="show1" class="panel">
                <div class="formats">
                    <p
                        v-for="(item,index) in options1" :key="item.id"
                        class="choose-list"
                       @click="changeOption1(item.name,item.id)"
                       :class="{'option-active':item.id && item.id===id}">{{item.name}}</p>
                </div>
            </div>
        </transition>
        <transition enter-active-class="animated slideInDown faster" leave-active-class="animated slideOutUp faster">
            <div v-show="show2" class="panel">
                <div class="formats">
                    <p v-for="(item,index) in options2" :key="item.id"
                       @click="changeOption2(item.name,item.id)"
                       class="choose-list"
                       :class="{'option-active':item.id && item.id===id}">{{item.name}}</p>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import {floors, formats} from '@/api/brandShops'
    import {Toast, Icon} from "mand-mobile";

    export default {
        name: "dropMenu",
        data() {
            return {
                height: '.8rem',
                show1: false,
                show2: false,
                titleActive1: false,
                titleActive2: false,
                firstId: '',
                secondId: '',
                id: '',
                title1: this.titles1,
                title2: this.titles2,
                setTimeout1:0,
                setTimeout2:0,
            }
        },
        props: {
            titles1: String,
            titles2: String,
            options1: Array,
            options2: Array,
        },
        components: {
            [Icon.name]: Icon,
        },
        methods: {
            showOptions1() {
                if(this.setTimeout1>0){
                    clearTimeout(this.setTimeout1)
                }
                if (this.show2 === false) {
                    this.show1 = !this.show1
                    if (!this.show1) {
                        setTimeout(_ =>
                                this.height = '.8rem'
                            , 510)
                    } else {
                        this.height = '100%'
                    }
                }
            },
            showOptions2() {
                if(this.setTimeout1>0){
                    clearTimeout(this.setTimeout1)
                }
                if (this.show1 === false) {
                    this.show2 = !this.show2
                    if (!this.show2) {
                        setTimeout(_ =>
                                this.height = '.8rem'
                            , 510)
                    } else {
                        this.height = '100%'
                    }
                }
            },
            changeOption1(name, id) {
                this.id = id
                this.showOptions1()
                if (this.title1 === name) {
                    this.title1 = this.titles1
                    this.$emit('update:typeId', '')
                    this.titleActive1 = false
                    this.firstId = ''
                } else {
                    this.title1 = name
                    this.firstId = id
                    this.$emit('update:typeId', id)
                    this.titleActive1 = true
                }
            },
            changeOption2(name, id) {
                this.id = id
                this.showOptions2()
                if (this.title2 === name) {
                    this.title2 = this.titles2
                    this.$emit('update:pointRange', '')
                    this.titleActive2 = false
                    this.secondId = ''
                } else {
                    this.title2 = name
                    this.secondId = id
                    this.$emit('update:pointRange', id)
                    this.titleActive2 = true
                }
            },
        },
    }
</script>

<style lang="stylus" scoped>
    @import '../../node_modules/animate.css/animate.css'
    .cascade
        /*background-color: #fff666*/
        letter-spacing 4px
        display flex
        flex-direction column

        .panel
            position: absolute
            top 0
            left 0
            width 100%
            height 100%
            padding-top 80px
            box-sizing border-box
            .formats
                position: relative
                width 100%
                height 100%
                overflow auto
                background-color: #fff
                p.choose-list
                    width 100%
                    height 80px
                    display block
                    position relative
                    padding 0 20px
                    line-height 80px
                    font-size 26px
                    box-sizing border-box
                    overflow hidden
                    display -webkit-box
                    -webkit-line-clamp 1
                    -webkit-box-orient vertical
                    word-break break-all
                    &:after
                        content ""
                        position absolute
                        z-index 1
                        pointer-events none
                        background-color #d9d9d9
                        height 1px
                        left 0
                        right 0
                        bottom 0
                        transform: scaleY(.5);
    .title-flex
        position: relative
        width 100%
        .title-flex-inner
            position relative
            display flex
            flex-wrap wrap
            align-items center
            justify-content center
            &:after
                content ""
                position absolute
                z-index 1
                pointer-events none
                background-color #d9d9d9
                height 1px
                left 0
                right 0
                bottom 0
                transform: scaleY(.5);


    .title
        width 50%
        height 80px
        line-height 80px
        font-size 28px
        position relative
        z-index 1
        background-color: #fff
        .title-text
            width 100%
            height 80px
            padding 0 40px 0 30px
            box-sizing border-box
            overflow hidden
            display -webkit-box
            -webkit-line-clamp 1
            -webkit-box-orient vertical
            word-break break-all
        .icon
            margin-left -40px
            position absolute
            top 50%
            transform translateY(-50%)
            display inline-block
        span
            position relative
            width auto
            height 80px
            display inline-block
            padding-left 20px
            padding-right 50px
            border-bottom 1px solid #fff
            overflow hidden

    .title-active
        border-color #ff4602
        color #ff4602
        span:after
            content ''
            position: absolute
            bottom 0
            left 0
            width 100%
            height: 4px;
            background-color #ff4602

    .option-active
        color #ff4602

</style>dropMenu