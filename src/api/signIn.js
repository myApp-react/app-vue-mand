import axios from "./base";

// 签到活动
export const signDetail = _ =>
    axios({
        url: "/api/sign/detail",
    });


// 签到
export const signIn = params =>
    axios({
        url: "/api/sign/signin",
        method: "post",
        params
    });

