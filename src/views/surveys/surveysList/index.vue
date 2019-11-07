<template>
    <div class="surveysList-container">
        <div class="surveysList-inner">
            <ul>
                <li v-for="(item,index) in list" :key=index @click="goToDetail(item.id)">
                    <div class="wrap-image">
                        <img :src="item.cover" class="image">
                        <p class="title">
                            {{item.title}}
                        </p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {lists} from '@/api/surveys'
    import { Toast } from 'mand-mobile';
    export default {
        name: "surveysList",
        data() {
            return {
                list: []
            };
        },
        methods: {
            async fetchList() {
                Toast.loading('获取中...')
                try {
                    let res = await lists()
                    Toast.hide()
                    this.list = res.data

                } catch (e) {
                    Toast.failed(e)
                    console.log(e);
                }
            },
            goToDetail(id) {
                this.$router.push({name: 'surveysDetail', params: {id}})
            }
        },
        created() {
            // this.fetchList()
        },
        activated() {
            this.fetchList()
        }
    }
</script>

<style lang="stylus" scoped>
    .surveysList-container
        width 100%
        height 100%
        background-color #ECEFF5
        overflow hidden
        .surveysList-inner
            width 100%
            height 100%
            overflow auto
            -webkit-overflow-scrolling touch

    ul li
        padding 30px 30px 0
        &:last-child
            padding-bottom 100px
        .wrap-image
            position relative
            height 320px
            border-radius 8px
            overflow hidden
            background-color #eee
            .image
                height 100%
                width 100%
                object-fit cover

        .title
            position absolute
            bottom 0
            left 0
            right 0
            padding 10px 24px
            text-align left
            background-color rgba(0, 0, 0, 0.5)
            font-size 30px
            line-height 1.5
            color #fff
            overflow hidden
            display -webkit-box
            -webkit-line-clamp 2
            -webkit-box-orient vertical
            word-break break-all
</style>