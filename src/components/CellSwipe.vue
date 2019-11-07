<template>
    <div class="cell-swipe-cont">
        <div class="list-item" data-type="0">
            <div class="list-box"
                 v-if="btns.length !== 0"
                 @touchstart.capture="touchStart"
                 @touchend.capture="touchEnd"
                 @click.prevent="skip(index)"
            >
                <slot></slot>
            </div>
            <div
                class="list-box"
                v-else
                @click.prevent="skip(index)"
            >
                <slot></slot>
            </div>
            <div
                    v-for="(item, i) in btns"
                    :key="i"
                    class="swipe-btn-handle"
            >
                <div class="btn" @click="item.handler(index)">{{item.text}}</div>
            </div>
            <!--<div class="delete" @click.prevent="deleteItem(index)" >删除</div>-->
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            index: String,
            btns: Array,
        },
        data() {
            return {
                startX : 0 ,
                endX : 0 ,
            }
        },
        mounted() { //DOM渲染完成阶段
            this.globalClick(this.restSlide);
        },
        methods: {
            //跳转
            skip(index){
                if( this.checkSlide() ){
                    // console.log("我被触发了：复位")
                    this.restSlide();
                }else{
                    // console.warn('跳转页面')
                    // alert('You click the slide!')
                    this.$emit('skip', index);
                }
            },
            //滑动开始
            touchStart(e){
                if( this.checkSlide() ){
                    this.restSlide();
                    return
                }
                // 记录初始位置
                this.startX = e.touches[0].clientX;
            },
            //滑动结束
            touchEnd(e){

                // console.log('我被触发了1212', e.changedTouches[0].clientX)
                // 当前滑动的父级元素
                let parentElement = e.currentTarget.parentElement;
                // 记录结束位置
                this.endX = e.changedTouches[0].clientX;

                // 左滑
                if( parentElement.dataset.type == 0 && this.startX - this.endX > 60 ){
                    this.restSlide();
                    parentElement.dataset.type = 1;
                }
                // 右滑
                if( parentElement.dataset.type == 1 && this.startX - this.endX < -60 ){
                    this.restSlide();
                    parentElement.dataset.type = 0;
                }
                this.startX = 0;
                this.endX = 0;
            },
            //判断当前是否有滑块处于滑动状态
            checkSlide(){
                let listItems = document.querySelectorAll('.list-item');

                for( let i = 0 ; i < listItems.length ; i++){
                    if( listItems[i].dataset.type == 1 ) {
                        return true;
                    }
                }
                return false;
            },
            //复位滑动状态
            restSlide(){
                let listItems = document.querySelectorAll('.list-item');
                // 复位
                for( let i = 0 ; i < listItems.length ; i++){
                    listItems[i].dataset.type = 0;
                }
            },
            //删除
            deleteItem(index){
                // 当前索引
                // let detail = e.currentTarget.dataset.detail;
                // 复位
                // this.restSlide();
                this.$emit('deleteItem', index);
            }




        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .cell-swipe-cont{
        width: 100%;
        overflow: hidden;
        -webkit-appearance: none;
        -webkit-backface-visibility: hidden;
         -moz-backface-visibility: hidden;
         -webkit-transform: translate3d(0, 0, 0);
         -moz-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
    .list-item{
        position: relative;
        height: 100px;
        -webkit-transition: all 0.2s;
        transition: all 0.2s;
    }
    .list-item[data-type="0"]{
        transform: translate3d(0,0,0);
    }
    .list-item[data-type="1"]{
        transform: translate3d(-2rem,0,0);
    }
    /*.list-item:after{*/
        /*content: " ";*/
        /*position: absolute;*/
        /*left: 0;*/
        /*bottom: 0;*/
        /*right: 0;*/
        /*height: 1px;*/
        /*border-bottom: 1px solid #ccc;*/
        /*color: #ccc;*/
        /*-webkit-transform-origin: 0 100%;*/
        /*transform-origin: 0 100%;*/
        /*-webkit-transform: scaleY(0.5);*/
        /*transform: scaleY(0.5);*/
        /*z-index: 2;*/
    /*}*/
    .list-box{
        padding: 0 30px;
        display: flex;
        align-items: center;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        justify-content: flex-end;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        /*font-size: 0;*/
    }
    .list-item {
        .list-content{
            position: relative;
            flex: 1;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            overflow: hidden;
        }
        .title{
            display: block;
            color: #333;
            overflow: hidden;
            font-size: 28px;
            /*font-weight: bold;*/
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .delete{
            display: none;
            width: 2rem;
            height: 100px;
            background: #fc9153;
            font-size: 30px;
            color: #fff;
            text-align: center;
            line-height: 100px;
            position: absolute;
            top:0;
            right: -2rem;
        }
        .swipe-btn-handle{
            position: absolute;
            top:0;
            right: -200px;
            width: 200px;
            height: 100%;
            background: #fc9153;
            font-size: 30px;
            color: #fff;
            text-align: center;
            &:after{
                content: '';
                display: inline-block;
                vertical-align: middle;
                width: 0;
                height: 100%;
            }
            .btn{
                display: inline-block;
                vertical-align: middle;
            }
        }
    }




</style>




