import axios from "axios";
import qs from "qs";
import router from "@/router";

let configs = require("../devconfigs/index")

const instance = axios.create({
    // baseURL: "http://192.168.1.164:8080",
    // timeout: 6000,
    // withCredentials: true
    headers: process.env.NODE_ENV === 'development' ? configs.axiosHeaderConfig : {}
});

// Add a request interceptor
instance.interceptors.request.use(
    function (config) {
        if (config.formData === undefined) {
            config.formData = true
        }
        // Do something before request is sent
        if (config.formData === true && config.method.toLowerCase() !== "get") {
            config.data = qs.stringify(config.data);
        }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        let {data, headers} = response
        if (data.code === '200') {
            return data;
        } else if (data.code === '301') { //授权地址重定向
            let currentUrl = encodeURIComponent(`/${location.hash}`)
            let newUrl = headers.location.replace('{app_page_url}', currentUrl)
            location.assign(newUrl) //todo 可能换成replace
            return new Promise(_ => {
            })
        } else if (data.code === '401') { //需要登录
            if (location.hash !== '#/loginOrRegister') {
                sessionStorage.setItem('intention', location.hash)
            }
            router.replace('/loginOrRegister')
            return Promise.reject('需要登录或注册');
        } else if (data.code === '410') {
            setTimeout(_ => router.replace('/login'), 3000)
        }
        // Do something with response data
        return Promise.reject(data.msg);
    },
    function (error) {
        let errorStr = error + ''
        if (errorStr.includes('timeout')) {
            return Promise.reject('连接超时，请稍后重试');
        } else {
            let {response: {status, statusText}, message} = error
            if (status === 404 || status === 500) {
                message = '未能连接服务器，请稍后重试'
            }
            return Promise.reject(message);
        }
    }
);

export default instance;
