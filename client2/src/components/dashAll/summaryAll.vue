<template>
    <v-layout row wrap justify-center>
        <v-flex xs12 lg9>
            <v-card raised>
                <v-card-title>LG Craft</v-card-title>
                <v-card-text>
                    <v-layout row wrap justify-center>
                        <v-flex xs12 lg4>
                            <chart-tribe-info></chart-tribe-info>
                        </v-flex>
                        <v-flex xs12 lg8>
                            <player-rank></player-rank>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    import ChartTribeInfo from './chartTribeInfo'
    import PlayerRank from './playerRank'
    export default {
        name: "summaryAll",
        components: { ChartTribeInfo, PlayerRank },
    }
</script>

<style scoped>

</style>