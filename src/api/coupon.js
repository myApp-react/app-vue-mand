import axios from "./base";

export const getCouponList = (pageIndex, pageSize) =>
    axios({
        url: `/api/coupon/list?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        method: "GET",
    });


export const getCoupon = id =>
    axios({
        url: `/api/coupon/get?id=${id}`,
        method: "GET",
    });



