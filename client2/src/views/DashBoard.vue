<template>
    <v-container fluid grid-list-md>
        <summary-my></summary-my>
        <summary-all></summary-all>
    </v-container>
</template>

<script>
    import summaryMy from '../components/dashMy/summaryMy'
    import summaryAll from '../components/dashAll/summaryAll'
    export default {
        name: "DashBoard",
        components: { summaryMy, summaryAll },
    }
</script>

<style scoped>

</style>