<template>
    <v-layout row>
        <v-flex xs12>
            <v-card :loading="loading">
                <v-card-title>플레이어 순위</v-card-title>
                <v-card-subtitle>4월 1일 전적 부터 계산한 ELO 순위 입니다.</v-card-subtitle>
                <v-layout row justify="center">
                    <v-flex xs12 sm6>
                        <v-flex class="primary text-center">
                            <span class="white--text"><v-icon color="white">mdi-crown-outline</v-icon> 티어</span>
                        </v-flex>
                        <v-flex v-for="(rankers, i) in rankerTier" :key="i">
                            <v-flex class="text-center">{{setTierText(i)}}</v-flex>
                            <panel-player-list :rankers="rankers"></panel-player-list>
                            <v-layout row justify-end class="px-1">
                                <v-btn @click="moveToRankingTier(i)"><v-icon small>mdi-dots-horizontal</v-icon> more</v-btn>
                            </v-layout>
                        </v-flex>
                    </v-flex>

                    <v-flex xs12 sm6>
                        <v-flex class="primary text-center">
                            <span class="white--text"><v-icon color="white">mdi-account-group</v-icon> 종족</span>
                        </v-flex>
                        <v-flex v-for="(rankers, i) in rankerTribe" :key="i">
                            <v-flex class="text-center">{{setTribeText(i)}}</v-flex>
                            <panel-player-list :rankers="rankers"></panel-player-list>
                            <v-layout row justify-end class="px-1">
                                <v-btn @click="moveToRankingTribe(i)"><v-icon small>mdi-dots-horizontal</v-icon> more</v-btn>
                            </v-layout>
                        </v-flex>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    import { mapGetters } from 'vuex'
    import PanelPlayerList from './panelPlayerList'
    export default {
        name: "playerRank",

        components: { PanelPlayerList, },

        data: () => ({
        }),

        methods: {
            setTierText (index) {
                let cnt = this.$defs.tierList.length - 1
                let i = Math.abs(index - cnt)
                return this.$defs.tierList[i].text
            },

            setTribeText (index) {
                return this.$defs.tribes[index].text
            },

            moveToRankingTier (index) {
                let cloned = JSON.parse(JSON.stringify(this.$defs.tierList)).reverse()

                let tierVal = cloned[index].value
                this.$router.push({ name : 'Ranking', params: { selTribe: 'all', selTier: tierVal} })
            },

            moveToRankingTribe (index) {
                let cloned = JSON.parse(JSON.stringify(this.$defs.tribes))
                let tribeVal = cloned[index].value
                this.$router.push({ name : 'Ranking', params: { selTribe: tribeVal, selTier: 0} })
            }
        },

        computed: {
            ...mapGetters({
                playerList: 'getPlayerList',
            }),

            loading: function () {
                if (this.playerList.length > 0) return false
                return 'primary'
            },

            rankerTier: function () {
                let retData = []

                if (this.playerList.length > 0) {
                    for (let i = 0; i < this.$defs.tierList.length; i++) {
                        let tier = this.$defs.tierList[i].value
                        let players = this.playerList.filter(x => x.tier === tier)

                        retData.push(players.slice(0, 3))
                    }
                }

                return retData.reverse()
            },

            rankerTribe: function () {
                let retData = []

                if (this.playerList.length > 0) {
                    for (let i = 0; i < this.$defs.tribes.length; i++) {
                        let tribe = this.$defs.tribes[i].value
                        let players = this.playerList.filter(x => x.tribe === tribe)

                        retData.push(players.slice(0, 3))
                    }
                }

                return retData
            },

        },
    }
</script>

<style scoped>

</style>