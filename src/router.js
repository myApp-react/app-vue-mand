import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: "/test",
            name: "test",
            component: () => import("views/test"),
            meta: {
                title: '测试',
            }
        },
        {
            path: "/",
            name: "index",
            redirect: "/home",
            meta: {
                title: '会员中心',
            }
        },
        {
            path: "/home",
            name: "home",
            component: () => import("views/home"),
            meta: {
                title: '会员中心',
            }
        },
        {
            path: "/carPayment",
            name: "carPayment",
            component: () => import("views/carPayment"),
            meta: {
                title: '寻车缴费',
            }
        },
        {
            path: "/signIn",
            name: "signIn",
            component: () => import("views/signIn"),
            meta: {
                title: '签到活动',
            }
        },
        {
            path: "/coupon",
            name: "coupon",
            component: () => import("views/coupon"),
            meta: {
                title: '优惠券',
            }
        },
        {
            path: "/floorNav",
            name: "floorNav",
            component: () => import("views/floorNav"),
            meta: {
                title: '楼层导航',
            }
        },
        {
            path: "/loginOrRegister",
            name: "loginOrRegister",
            component: () => import("views/loginOrRegister"),
            meta: {
                title: '提示',
            }
        },
        {
            path: "/register",
            name: "register",
            component: () => import("views/register"),
            meta: {
                title: '注册',
            }
        },
        {
            path: "/login",
            name: "login",
            component: () => import("views/login"),
            meta: {
                title: '登录',
            }
        },
        {
            path: "/smallVotePoints",
            name: "smallVotePoints",
            component: () => import("views/smallVotePoints"),
            meta: {
                title: '上传小票积分'
            }
        },
        {
            path: "/mine",
            name: 'mine',
            meta: {
                title: "个人中心"
            },
            component: () => import("views/mine/layout"),
            redirect: '/mine/center',
            children: [
                {
                    path: "center",
                    name: "center",
                    meta: {
                        title: "个人中心"
                    },
                    component: () => import("views/mine/center")
                },
                {
                    path: "mineIntegral",
                    name: "mineIntegral",
                    meta: {
                        title: "积分明细",
                    },
                    component: () => import("views/mine/mineIntegral")
                },
                {
                    path: "personal",
                    name: "personal",
                    meta: {
                        title: "个人资料",
                    },
                    component: () => import("views/mine/personal")
                },
                {
                    path: "mygift",
                    name: "mygift",
                    meta: {
                        title: "我的礼品",
                    },
                    component: () => import("views/mine/mineGift")
                },
                {
                    path: "ticket",
                    name: "ticket",
                    meta: {
                        title: "小票积分",
                    },
                    component: () => import("views/mine/ticket")
                },
                {
                    path: "mineService",
                    name: "mineService",
                    meta: {
                        title: "联系客服",
                    },
                    component: () => import("views/mine/mineService")
                },
                {
                    path: "mineActivity",
                    name: "mineActivity",
                    meta: {
                        title: "我的活动",
                    },
                    component: () => import("views/mine/mineActivity")
                },
                {
                    path: "mineCollect",
                    name: "mineCollect",
                    meta: {
                        title: "我的收藏"
                    },
                    component: () => import("views/mine/mineCollect")
                },
                {
                    path: "vipRights",
                    name: "vipRights",
                    meta: {
                        title: "会员权益"
                    },
                    component: () => import("views/mine/vipRights")
                },
                {
                    path: "mineVoucher",
                    name: "mineVoucher",
                    meta: {
                        title: "我的代金券"
                    },
                    component: () => import("views/mine/mineVoucher")
                },
            ]
        },
        {
            path: "/pointsMall",
            name: "pointsMall",
            component: () => import("views/pointsMall/layout"),
            meta: {title: "积分商城"},
            redirect: '/pointsMall/goodsList',
            children: [
                {
                    path: "goodsList",
                    name: "goodsList",
                    component: () => import("views/pointsMall/goodsList"),
                    meta: {
                        title: "积分商城",
                    },
                },
                {
                    path: "detail/:id",
                    name: "detail",
                    component: () => import("views/pointsMall/detail"),
                    meta: {
                        title: "商品详情",
                    },
                },
                {
                    path: "confirmRedeem/:id",
                    name: "confirmRedeem",
                    component: () => import("views/pointsMall/confirmRedeem"),
                    meta: {
                        title: "确认兑礼",
                    },
                },
                {
                    path: "paySuccess:points",
                    name: "paySuccess",
                    component: () => import("views/pointsMall/paySuccess"),
                    meta: {
                        title: "支付成功",
                    },
                },
            ]
        },
        {
            path: "/activity",
            name: 'activity',
            meta: {title: "活动中心"},
            component: () => import("views/activity/layout"),
            redirect: '/activity/core',
            children: [
                {
                    path: "core",
                    name: "core",
                    meta: {
                        title: "活动中心",
                    },
                    component: () => import("views/activity/center")
                },
                {
                    path: "details/:id",
                    name: "details",
                    meta: {
                        title: "活动详情",
                    },
                    component: () => import("views/activity/details")
                },

            ]
        },
        {
            path: "/brandShops",
            name: "brandShops",
            component: () => import("views/brandShops/layout"),
            meta: {title: "品牌商铺"},
            redirect: '/brandShops/shopsList',
            children: [
                {
                    path: "shopsList",
                    name: "shopsList",
                    component: () => import("views/brandShops/shopsList/index"),
                    meta: {
                        title: "品牌商铺",

                    },
                },
                {
                    path: "shopsDetail/:id",
                    name: "shopsDetail",
                    component: () => import("views/brandShops/shopsDetail/index"),
                    meta: {
                        title: "商铺详情",

                    },
                },
            ]
        },
        {
            path: "/surveys",
            name: "surveys",
            component: () => import("views/surveys/layout"),
            meta: {title: "问卷调查"},
            redirect: '/surveys/surveysList',
            children: [
                {
                    path: "surveysList",
                    name: "surveysList",
                    component: () => import("views/surveys/surveysList/index"),
                    meta: {
                        title: "问卷调查",
                    },
                },
                {
                    path: "surveysDetail/:id",
                    name: "surveysDetail",
                    component: () => import("views/surveys/surveysDetail/index"),
                    meta: {
                        title: "问卷调查详情",
                    },
                },
            ]
        },
        {
            path: "/qrcode",
            name: "qrcode",
            meta: {
                title: "识别二维码",
            },
            component: () => import("views/qrcode"),
        },
        {
            path: "*",
            name: "notFound",
            meta: {
                title: "页面不见了",
            },
            component: () => import("views/notFound"),
        },
    ]
});
