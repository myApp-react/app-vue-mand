import axios from "./base";

//活动列表展示
export const getActivity = (pageIndex, pageSize) =>
    axios({
        url: `/api/activity/list?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        method: "GET"
    });

//活动列表详情
export const getActivityDetails = id =>
    axios({
        url: `/api/activity/info/${id}`,
        method: "GET"
    });

//活动报名
export const ActivitySignUp = id =>
    axios({
        url: `/api/member/activity/apply/${id}`,
        method: "GET"
    });

//活动签到
export const signinActivity = activityId =>
    axios({
        url: `/api/member/signinactivity?activityId=${activityId}`,
        method: "GET"
    });

