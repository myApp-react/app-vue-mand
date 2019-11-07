<template>
    <div id="app">
        <transition name="fade" mode="out-in">
            <keep-alive
                    include="home,coupon"
            >
                <router-view
                        v-wechat-title='$route.meta.title'
                        v-if="isRouterAlive"
                ></router-view>
            </keep-alive>
        </transition>
    </div>
</template>
<script>
    export default {
        name: 'App',
        provide() { // 注册一个方法
            return {
                reload: this.reload
            }
        },
        data() {
            return {
                isRouterAlive: true
            }
        },
        methods: {
            reload() {
                this.isRouterAlive = false
                this.$nextTick(function () {
                    this.isRouterAlive = true
                })
            }
        },
    }
</script>
<style>
    #app {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    a, a:link, a:visited, a:hover, a:active {
        text-decoration: none;
        color: inherit;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: all 0.2s ease;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }

    .md-field-item-inner {
        position: relative;
        z-index: 1000;
    }
    .md-button .md-button-inner{
        position: relative;
        z-index: 1000;
    }
</style>
