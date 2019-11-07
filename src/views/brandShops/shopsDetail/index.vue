<template>
    <div class="shopsDetail-container">
        <md-result-page
                :img-url="error"
                text="服务器错误，请稍后再试"
                v-if="isShowType === 2"
        >
        </md-result-page>
        <md-result-page
                :img-url="noData"
                text="暂无记录"
                v-else-if="isShowType === 1"
        >
        </md-result-page>

        <div class="shopsDetail-container-inner" v-else>
            <div v-if="isHasData">
                <div class="back-image-div">
                    <div class="back-image"
                         :style="{background:'#ddd url(' + info.generalizeImg + ')',backgroundSize:'100% 100%',backgroundRepeat:'no-repeat'}">
                    </div>
                </div>
                <div class="shopsDetail-info">
                    <div class="shopsDetail-info-title">
                        <div class="title-name">
                            <p class="title-name-blod">{{info.name}}</p>
                            <p class="title-name-floor">{{info.building}} {{info.floor}}</p>
                        </div>
                        <div class="statistics">
                            <div class="statistics-icon">
                                <md-icon v-if="info.collect" name="icon-Collection-active" color="#ff4602" size="lg" @click="callDislike"></md-icon>
                                <md-icon v-else name="icon-Collection" size="lg" color="#666" @click="callLike"></md-icon>
                            </div>
                            <p class="statistics-num">{{info.collectCount}} 人</p>
                        </div>
                    </div>
                    <div class="shopsDetail-info-list">
                        <md-field>
                            <md-field-item
                                    name="item0"
                                    title="经营品类:"
                                    :value="info.brand ? info.brand : '未知'"
                                    align="left"
                            >
                            </md-field-item>
                            <md-field-item
                                    name="item0"
                                    title="业态:"
                                    :value="info.operation ? info.operation : '未知'"
                                    align="left"
                            >
                            </md-field-item>
                            <md-field-item
                                    name="item0"
                                    title="联系电话:"
                                    :value="info.tel ? info.tel : '未知'"
                                    align="left"
                            >
                            </md-field-item>
                        </md-field>
                    </div>
                    <div class="shopsDetail-info-story">
                        <div class="story-name">品牌故事</div>
                        <div class="story-html" v-html="info.brandInfo"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { Icon, Field, FieldItem, Toast, ResultPage} from 'mand-mobile'
    import {storeDetail, like, dislike} from '@/api/brandShops'
    import '@/assets/svg/Collection.svg'
    import '@/assets/svg/Collection-active.svg'

    export default {
        name: "shopsDetail",
        data() {
            return {
                isHasData: false,
                info: {
                    id: '',
                    generalizeImg: '',
                    name: '',
                    building: '',
                    floor: '',
                    brand: '',
                    operation: '',
                    tel: '',
                    brandInfo: '',
                    collectCount: 0,
                    collect: false
                },
                noData: require("@/assets/noData.png"),
                error: require("@/assets/error.png"),
                isShowType: "", // 1显示无数据， 2显示系统错误， '' 显示数据
            }
        },
        created() {
            Toast.loading('正在获取商铺详情...')
            this.getInfo()
        },
        components: {
            [Icon.name]: Icon,
            [Field.name]: Field,
            [FieldItem.name]: FieldItem,
            [ResultPage.name]: ResultPage,
        },
        methods: {
            async getInfo() {

                try {
                    let res = await storeDetail({id: this.$route.params.id})
                    let {id, generalizeImg, name, building, floor, brand, operation, tel, brandInfo, collectCount, collect} = res.data
                    Toast.hide();
                    this.isHasData = true;
                    this.info = {
                        id,
                        generalizeImg,
                        name,
                        building,
                        floor,
                        brand,
                        operation,
                        tel,
                        brandInfo,
                        collectCount,
                        collect
                    }
                    this.isShowType = ""
                } catch (e) {
                    Toast.hide()
                    this.isShowType = 2
                    console.log(e);
                }
            },
            async callLike() {
                try {
                    let res = await like({storeId: this.info.id})
                    this.getInfo()
                } catch (e) {
                    console.log(e);
                }
            },
            async callDislike() {
                try {
                    let res = await dislike({storeId: this.info.id})
                    this.getInfo()

                } catch (e) {
                    console.log(e);
                }
            },
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" >
    .shopsDetail-container{
        .story-html{
            text-align: left;
            img{
                display: block;
                width: 100%;
            }
            p{
                font-size: 26px!important;
            }
            span{
                font-size: 26px!important;
            }
            a{
                font-size: 26px!important;
            }
        }
        .md-field-item .md-field-item-content.left{
            color: #666;
        }
    }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
    .shopsDetail-container{
        width: 100%;
        height: 100%;
        .shopsDetail-container-inner{
            width: 100%;
            height: 100%;
            background-color: #ECEFF5;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
        }
        .back-image-div{
            width: 100%;
            .back-image{
                height: 390px;
            }
        }
        .shopsDetail-info{

        }
        .shopsDetail-info-title{
            margin-bottom: 20px;
            width: 100%;
            height: 130px;
            padding: 0 60px 0 30px;
            box-sizing: border-box;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            font-size: 30px;
            background-color: #fff;
            .title-name{
                text-align: left;
            }
            .title-name-blod{
                font-size: 30px;
                font-weight: normal;
                font-stretch: normal;
                line-height: 1.5;
                letter-spacing: 0;
                color: #111;
            }
            .title-name-floor{
                margin-top: 10px;
                font-size: 20px;
                font-weight: normal;
                font-stretch: normal;
                line-height: 1.5;
                letter-spacing: 0;
                color: #666;
            }
            .statistics-icon{
                .md-icon.lg{
                    width: 30px;
                    height: 29px;
                }
            }
            .statistics-num{
                font-size: 20px;
                font-weight: normal;
                font-stretch: normal;
                line-height: 1.5;
                letter-spacing: 0;
                color: #666;
            }
        }
        .shopsDetail-info-list{
            margin-bottom: 20px;
        }
        .shopsDetail-info-story{
            width: 100%;
            padding: 30px;
            box-sizing: border-box;
            background-color: #fff;
            .story-name{
                margin-bottom: 20px;
                font-size: 30px;
                font-weight: normal;
                font-stretch: normal;
                line-height: 37px;
                letter-spacing: 0;
                color: #111;
                text-align: left;
            }
            .story-html{
                width: 100%;
                padding-bottom: 200px;
            }
        }
    }
</style>