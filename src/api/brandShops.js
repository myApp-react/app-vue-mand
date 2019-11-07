import axios from "./base";

/*列表页*/
export const floors = _ =>
    axios({
        url: '/api/floor/data',
    });
export const formats = _ =>
    axios({
        url: '/api/operationtype/data',
    });
export const lists = params =>
    axios({
        url: '/api/store/list',
        params
    });
export const like = params =>
    axios({
        url: '/api/collect/store',
        params
    });
export const dislike = params =>
    axios({
        url: '/api/collect/cancel',
        params
    });

/*详情页*/
export const storeDetail = params =>
    axios({
        url: '/api/store/getstore',
        params
    });
