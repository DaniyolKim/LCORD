<template>
    <v-container grid-list-md>
        <v-layout row>
            <v-flex xs12 sm12 md12 lg4 xl4>
                <chart-tribe-info></chart-tribe-info>
            </v-flex>
            <v-flex xs12 sm12 md12 lg8 xl8>
                <player-rank></player-rank>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import ChartTribeInfo from '../components/chartTribeInfo'
    import PlayerRank from '../components/playerRank'
    export default {
        name: "DashBoard",
        components: { ChartTribeInfo, PlayerRank, },
    }
</script>

<style scoped>

</style>