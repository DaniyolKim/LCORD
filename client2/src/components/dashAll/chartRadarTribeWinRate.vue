<template>
    <v-card :loading="loading">
        <v-card-title>종족별 승률</v-card-title>
        <v-card-text>
            <apexchart type="radar" :options="chartOptions" :series="series"></apexchart>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        name: "chartRadarTribeWinRate"
    }
</script>

<style scoped>

</style>