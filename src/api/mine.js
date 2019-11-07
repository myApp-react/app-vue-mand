import axios from "./base";

//获取用户信息
export const getUserInfo = () =>
    axios({
        url: `/api//aggregation/data`,
        method: "get",
    });

//获取会员权益
export const getVipRights = () =>
    axios({
        url: `/api/member/rights`,
        method: "get",
    });

//获取小票记录
export const getTicket = (pageIndex, pageSize) =>
    axios({
        url: `/api/ticket/record?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        method: "get",
        withoutLoading: true
    });

//获取会员卡信息
export const getCard = () =>
    axios({
        url: `/api/member/card`,
        method: "get",
        withoutLoading: true
    });

//获取积分信息
export const getPoints = () =>
    axios({
        url: `/api/member/points`,
        method: "get",
        withoutLoading: true
    });

//上传个人头像
export const uploadHeadImg = data =>
    axios({
        url: `/api/headImg/upload`,
        method: "POST",
        data
    });

//获取个人资料
export const getUserinfo = () =>
    axios({
        url: `/api/account/information`,
        method: "get",
    });

//编辑个人资料
export const editUserinfo = data =>
    axios({
        url: `/api/account/edit`,
        method: "POST",
        data
    });
//获取收藏
export const getCollect = (pageIndex, pageSize) =>
    axios({
        url: `/api/collect/list?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        method: "GET",
    });

//取消收藏
export const CancelCollect = storeId =>
    axios({
        url: `/api/collect/cancel?storeId=${storeId}`,
        method: "GET",
    });

//获取优惠卷
export const getCouponList = (status, pageIndex, pageSize) =>
    axios({
        url: `/api/coupon/mycouponlist?status=${status}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
        method: "GET",
    });


//获取我的活动
export const getActivity = (pageIndex, pageSize) =>
    axios({
        url: `/api/member/myactivity?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        method: "GET",
    });

//取消活动报名
export const cancelactivity = id =>
    axios({
        url: `/api/member/cancelactivity/${id}`,
        method: "GET",
    });

//取消活动报名
export const deleteactivity = id =>
    axios({
        url: `/api/member/deleteactivity/${id}`,
        method: "DELETE",
    });

//获取我的礼品
export const getMineGift = (status, pageIndex, pageSize) =>
    axios({
        url: `/api/gift/membergift?status=${status}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
        method: "GET",
    });

//获取我的积分信息
export const getPointsInfo = () =>
    axios({
        url: `/api/member/pointstatistics`,
        method: "GET",
    });

//获取我的积分信息列表
export const getPointlist = (pageIndex, pageSize) =>
    axios({
        url: `/api/member/pointlist?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        method: "GET",
    });

//获取我的客服 消息记录
export const getRecordlist = () =>
    axios({
        url: `/api/message/record`,
        method: "GET",
    });

//回复 消息记录
export const replyMessage = data =>
    axios({
        url: `/api/message/reply`,
        method: "POST",
        data
    });

export const jscardsdk = _ =>
    axios({
        url: '/api/weixin/apiticket/sign',
    });


export const activeCard = _ =>
    axios({
        url: `/api/card/membercard/activate`,
        method: "POST",
    });