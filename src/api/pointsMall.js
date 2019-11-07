import axios from "./base";

export const classify = _ =>
    axios({
        url: '/api/gift/type',
    });
export const lists = params =>
    axios({
        url: '/api/gift/list',
        params
    });
export const redeemDetail = params =>
    axios({
        url: '/api/gift/detail',
        params
    });
export const confirmRedeem = data =>
    axios({
        url: '/api/gift/exchange',
        method: 'post',
        data
    });