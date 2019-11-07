import axios from "./base";

export const noticeServer = data =>
    axios({
        url: '/api/receipt/upload',
        method: 'post',
        data
    });

export const jssdk = _ =>
    axios({
        url: '/api/weixin/jssdk/sign',
    });

export const iflogined = _ =>
    axios({
        url: '/api/account/loggedIn',
    });
export const explanation = _ =>
    axios({
        url: '/api/ticket/explain',
    });
