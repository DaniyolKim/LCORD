<template>
    <v-container grid-list-md>
        <v-layout row>
            <v-flex cols="12">
                <v-card
                        raised
                        :loading="loading"
                >
                    <v-card-title>플레이어 순위</v-card-title>
                    <v-card-subtitle>4월 1일 전적 부터 계산한 ELO 순위 입니다.</v-card-subtitle>
                    <v-container fluid>
                        <v-row justify="center">
                            <v-flex xs12 sm6 md6 lg6 xl6>
                                <v-flex class="primary text-center">
                                    <span class="white--text">티어</span>
                                </v-flex>
                                <v-flex cols="12" v-for="(rankers, i) in rankerTier" :key="i">
                                    <v-flex class="text-center">{{setTierText(i)}}</v-flex>
                                    <panel-player-list :rankers="rankers"></panel-player-list>
                                </v-flex>

                            </v-flex>
                            <v-flex xs12 sm6 md6 lg6 xl6>
                                <v-flex class="primary text-center">
                                    <span class="white--text">종족</span>
                                </v-flex>
                                <v-flex cols="12" v-for="(rankers, i) in rankerTribe" :key="i">
                                    <v-flex class="text-center">{{setTribeText(i)}}</v-flex>
                                    <panel-player-list :rankers="rankers"></panel-player-list>
                                </v-flex>

                            </v-flex>

                        </v-row>
                    </v-container>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex'
    import PanelPlayerList from './panelPlayerList'
    export default {
        name: "playerRank",

        components: { PanelPlayerList, },

        data: () => ({
            messages: [
                {
                    avatar: 'https://avatars0.githubusercontent.com/u/9064066?v=4&s=460',
                    name: 'John Leider',
                    title: 'Welcome to Vuetify.js!',
                    excerpt: 'Thank you for joining our community...',
                },
                {
                    color: 'red',
                    icon: 'people',
                    name: 'Social',
                    new: 1,
                    total: 3,
                    title: 'Twitter',
                },
                {
                    color: 'teal',
                    icon: 'local_offer',
                    name: 'Promos',
                    new: 2,
                    total: 4,
                    title: 'Shop your way',
                    exceprt: 'New deals available, Join Today',
                },
            ],
        }),

        methods: {
            setTierText: function (index) {
                let cnt = this.$defs.tierList.length - 1
                let i = Math.abs(index - cnt)
                return this.$defs.tierList[i].text
            },

            setTribeText: function (index) {
                return this.$defs.tribes[index].text
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