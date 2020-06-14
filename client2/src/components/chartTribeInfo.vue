<template>
    <v-container>
        <v-layout column>
            <v-flex cols="12">
                <chart-donut-tribe-count :player-list="playerList" :loading="loading"></chart-donut-tribe-count>
            </v-flex>
            <br>
            <v-flex cols="12">
                <chart-bar-tier-count :player-list="playerList"  :loading="loading"></chart-bar-tier-count>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex'
    import ChartDonutTribeCount from './chartDonutTribeCount'
    import ChartBarTierCount from './chartBarTierCount'
    export default {
        name: "chartTribeInfo",
        components: { ChartDonutTribeCount, ChartBarTierCount },
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