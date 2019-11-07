<template>
    <div>
        <button @click="test" style="height: 100px;width: 200px;font-size: 30px;">授权测试</button>
        <br>
        <button @click="test1" style="height: 100px;width: 200px;font-size: 30px;">通知服务器测试</button>
        <br>
        <button @click="test2" style="height: 100px;width: 200px;font-size: 30px;">轮播图测试</button>
        <br>
        <button @click="test3" style="height: 100px;width: 200px;font-size: 30px;">推荐活动测试</button>
        <br>
        <button @click="test4" style="height: 100px;width: 200px;font-size: 30px;">热门品牌测试</button>
    </div>
</template>

<script>
    import {test, banner, activiteis,hotbrands} from "@/api/test";
    import {noticeServer} from "@/api/smallVotePoints";

    export default {
        name: "test",
        methods: {
            test() {
                test()
            },
            test1() {
                noticeServer({
                    mediaId: '1237378768e7q8e7r8qwesafdasdfasdfaxss111',
                    event: 'event_integral'
                })
            },
            test2() {
                banner()
            },
            test3() {
                activiteis()
            },
            test4() {
                hotbrands()
            },
        },
    }
</script>

<style scoped>

</style>