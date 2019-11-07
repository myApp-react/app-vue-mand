import axios from "./base";

export const test = _ =>
    axios({
        url: '/api/bs/index',
    });
export const banner = _ =>
    axios({
        url: '/api/banner',
        withoutLoading: true
    });
export const activiteis = _ =>
    axios({
        url: '/api/activity/recommend',
        loadingText: '加载中'
    });
export const hotbrands = _ =>
    axios({
        url: '/api/store/recommend',
    });
