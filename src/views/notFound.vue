<template>
    <div class="result-page">
        <md-result-page
                type="lost">
        </md-result-page>
    </div>
</template>

<script>
    import {ResultPage} from 'mand-mobile'
    export default {
        name: "notFound",
        components: {
            [ResultPage.name]: ResultPage,
        },
    }
</script>

<style scoped>
    .result-page{
        width: 100%;
        height: 100%;
        background-color: #ECEFF5;
    }
</style>