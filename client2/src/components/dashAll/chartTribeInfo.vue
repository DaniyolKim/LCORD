<template>
        <v-layout column>
            <v-flex xs12>
                <chart-donut-tribe-count :player-list="playerList" :loading="loading"></chart-donut-tribe-count>
            </v-flex>
            <v-flex xs12>
                <chart-bar-tier-count :player-list="playerList"  :loading="loading"></chart-bar-tier-count>
            </v-flex>
            <v-flex xs12>
                <chart-radar-tribe-win-rate></chart-radar-tribe-win-rate>
            </v-flex>
        </v-layout>
</template>

<script>
    import { mapGetters } from 'vuex'
    import ChartDonutTribeCount from './chartDonutTribeCount'
    import ChartBarTierCount from './chartBarTierCount'
    import ChartRadarTribeWinRate from './chartRadarTribeWinRate'
    export default {
        name: "chartTribeInfo",
        components: { ChartDonutTribeCount, ChartBarTierCount, ChartRadarTribeWinRate },
        computed: {
            ...mapGetters({
                playerList: 'getPlayerList',
            }),
            loading: function () {
                if (this.playerList.length > 0) return false
                return 'primary'
            }
        },
    }
</script>

<style scoped>

</style>