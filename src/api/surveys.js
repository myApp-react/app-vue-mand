import axios from "./base";

export const lists = _ =>
    axios({
        url: '/api/questionnaire/list',
    });

export const detail = params =>
    axios({
        url: '/api/questionnaire/detail',
        params
    });
// export const detail = params =>
//     axios({
//         url: 'https://www.easy-mock.com/mock/5b766c0876a41b2c09dbf380/detail',
//         params
//     });

export const submit = data =>
    axios({
        formData: false,
        url: "/api/questionnaire/save",
        method: "post",
        data
    });