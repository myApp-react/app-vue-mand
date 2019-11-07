import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import "reset-css";
import './utils/routerhooks'
import VueLazyLoad from 'vue-lazyload'
import VueWechatTitle from 'vue-wechat-title'
import FastClick from 'fastclick'

FastClick.attach(document.body);


Vue.use(VueLazyLoad, {
    error: './assets/error.png',
    loading: './assets/loading.png'
})

Vue.use(VueWechatTitle)

Vue.config.productionTip = false;

//对导入的组件进行全局组件注册
import components from './views/index'

Object.keys(components).forEach((key) => {
    Vue.component(key, components[key])
});

// 定义全局点击函数
Vue.prototype.globalClick = (callback) => {
    document.getElementById('app').onclick = () => {
        callback();
    };
};

new Vue({
    router,
    store,
    saveScrollPosition: true,
    render: h => h(App)
}).$mount("#app");
