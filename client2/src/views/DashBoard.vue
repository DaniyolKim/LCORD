<template>
    <v-container>
        <v-row class="text-center">
            <chart-donut-tribe-count :player-list="allPlayerList"></chart-donut-tribe-count>
        </v-row>
        <v-row class="text-center">
            <chart-bar-tier-count :player-list="allPlayerList"></chart-bar-tier-count>
        </v-row>
    </v-container>
</template>

<script>
    import ChartDonutTribeCount from '../components/chartDonutTribeCount'
    import ChartBarTierCount from '../components/chartBarTierCount'
    export default {
        name: "DashBoard",
        components: { ChartDonutTribeCount, ChartBarTierCount, },
        data () {
            return {
                allPlayerList: [],
            }
        },

        methods: {
            getAllPlayers() {
                this.$lcordAPI.user.getAllUsers()
                    .then(resp => {
                        this.allPlayerList = resp

                    })
            },
        },

        beforeMount() {
            this.getAllPlayers()
        },
    }
</script>

<style scoped>

</style>