<template>
    <keep-alive include="shopsList" exclude="shopsDetail">
        <router-view />
    </keep-alive>
</template>

<script>
    export default {
        name: "brandShopsLayout",
        data() {
            return {}
        },
    }
</script>

<style scoped>

</style>