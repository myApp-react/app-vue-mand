import axios from "./base";

export const register = data =>
    axios({
        url: "/api/account/register",
        method: "post",
        data
    });
export const authorized = _ =>
    axios({
        url: "/api/weixin/jsoauth/check",
    });
export const login = data =>
    axios({
        url: "/api/account/login",
        method: "post",
        data
    });

export const getAuthCode = (data, url) =>
    axios({
        url: `/api/account/${url}`,
        method: "post",
        data
    });
