<template>
    <keep-alive include="surveysList">
        <router-view />
    </keep-alive>
</template>

<script>
    export default {
        name: "surveyLayout",
        data() {
            return {}
        },
    }
</script>

<style scoped>

</style>