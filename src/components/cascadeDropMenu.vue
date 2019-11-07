<template>
    <div class="cascade" :style="{height:height}">
        <div class="title-flex">
            <div class="title" @click="showMatchFirst" :class="{'title-active':titleActive1}">
                <div class="title-text">
                    <span>{{title1}}</span>
                    <md-icon v-if="showFirst" name="arrow-up" size="lg" class="icon"></md-icon>
                    <md-icon v-else name="arrow-down" size="lg" class="icon"></md-icon>
                </div>
            </div>
            <div class="title" @click="showFormatsOptions" :class="{'title-active':titleActive2}">
                <div class="title-text">
                    <span>{{title2}}</span>
                    <md-icon v-if="showFormats" name="arrow-up" size="lg" class="icon"></md-icon>
                    <md-icon v-else name="arrow-down" size="lg" class="icon"></md-icon>
                </div>
            </div>
        </div>
        <transition enter-active-class="animated slideInDown faster" leave-active-class="animated slideOutUp faster">
            <div v-show="showFirst" class="panel">
                <div class="first">
                    <p v-for="(item,index) in buildings" :key="item.buildingId"
                       @click="showMatchSecond(item.floors,item.buildingId)"
                       :class="{'option-active':item.buildingId && item.buildingId===firstId}">
                        {{item.buildingName}}
                    </p>
                </div>
                <div class="second">
                    <p v-for="($item,$index) in floors" :key="$item.floorId"
                       @click="changeFloor($item.floorName,$item.floorId)"
                       :class="{'option-active':$item.floorId && $item.floorId===secondId}">
                        {{$item.floorName}}</p>
                </div>
            </div>
        </transition>
        <transition enter-active-class="animated slideInDown faster" leave-active-class="animated slideOutUp faster">
            <div v-show="showFormats" class="panel">
                <div class="formats">
                    <p v-for="(item,index) in formats" :key="item.id"
                       @click="changeFormat(item.name,item.id)"
                       :class="{'option-active':item.id && item.id===id}">
                        {{item.name}}
                    </p>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import {floors, formats} from '@/api/brandShops'
    import {Toast, Icon} from "mand-mobile";

    export default {
        name: "cascadeDropMenu",
        data() {
            return {
                height: '.8rem',
                title1: '楼层',
                title2: '业态',
                buildings: [],
                floors: [],
                showFirst: false,
                showSecond: false,
                titleActive1: false,
                titleActive2: false,
                firstId: '',
                secondId: '',
                formats: [],
                showFormats: false,
                id: '',
                setTimeout1:0,
                setTimeout2:0,
            }
        },
        components: {
            [Icon.name]: Icon,
        },
        methods: {
            showMatchFirst() {
                if(this.setTimeout1>0){
                    clearTimeout(this.setTimeout1)
                }
                if (this.showFormats === false) {
                    this.showFirst = !this.showFirst
                    if(!this.showFirst){
                        setTimeout(_ =>
                                this.height = '.8rem'
                            , 510)
                    }else{
                        this.height='100%'
                    }
                }
            },
            showFormatsOptions() {
                if(this.setTimeout2>0){
                    clearTimeout(this.setTimeout1)
                }
                if (this.showFirst === false) {
                    this.showFormats = !this.showFormats
                    if(!this.showFormats){
                        setTimeout(_ =>
                                this.height = '.8rem'
                            , 510)
                    }else{
                        this.height='100%'
                    }
                }
            },
            showMatchSecond(floors, id) {
                this.showSecond = true
                this.floors = floors
                this.firstId = id
            },
            async getFloors() {
                try {
                    let res = await floors()
                    return res.data
                } catch (e) {
                    Toast.info(e);
                }
            },
            changeFloor(name, id) {
                this.showMatchFirst()
                if (this.title1 === name) {
                    this.title1 = '楼层'
                    this.$emit('update:foo', '')
                    this.titleActive1 = false
                    this.firstId = ''
                    this.secondId = ''
                } else {
                    this.title1 = name
                    this.secondId = id
                    this.$emit('update:foo', id)
                    this.titleActive1 = true
                }
            },
            async getFormats() {
                try {
                    let res = await formats()
                    return res.data.map(i =>
                        ({id: i.id, name: i.name})
                    )
                } catch (e) {
                    Toast.info(e);
                }
            },
            changeFormat(name, id) {
                this.showFormatsOptions()
                if (this.title2 === name) {
                    this.title2 = '业态'
                    this.$emit('update:fof', '')
                    this.titleActive2 = false
                    this.id = ''
                } else {
                    this.title2 = name
                    this.id = id
                    this.$emit('update:fof', id)
                    this.titleActive2 = true
                }
            }
        },
        async created() {
            let floors = this.getFloors()
            let formats = this.getFormats()
            this.buildings = await floors
            this.formats = await formats
        }
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
            padding-top 80px
            box-sizing border-box
            flex-grow 1
            background-color #d8d8d8
            display flex
            flex-direction row
            justify-content space-around

            .first, .second
                background-color: #fff
                width 50%
                font-size 26px
                overflow-y auto
                -webkit-overflow-scrolling: touch;
                p
                    position relative
                    padding 0 20px
                    height 80px
                    line-height 80px
                    overflow hidden;
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
            .second
                background-color: #f2f5fb
                p
                    &:after
                        background-color #b7b7b7
            .formats
                background-color: #fff
                width 100%
                line-height 80px
                font-size 26px
                p
                    position: relative
                    font-size 26px
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
        position absolute
        top 0
        left 0
        width 100%
        height 80px
        display flex
        flex-wrap wrap
        align-items center
        justify-content center
        background-color #fff
    .title
        position: relative
        flex 1
        height 80px
        line-height 80px
        font-size 28px
        z-index 1
        box-sizing border-box
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

</style>