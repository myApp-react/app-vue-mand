import axios from "./base";

/*聚合数据接口*/
export const aggregateApi = params => {
    return axios({
        url: "/api/aggregation/data",
        params
    });
}
