<template>
    <v-expansion-panels>
        <v-expansion-panel
                v-for="(ranker, i) in rankers"
                :key="i"
                hide-actions
        >
            <v-expansion-panel-header class="pa-1 pa-lg-4">
                <v-layout align-content-center justify-center row>
                    <v-flex xs1 align-self-center>
                        <v-icon :color="cvtMedalColor(i)">fas fa-medal</v-icon>
                    </v-flex>
                    <v-flex xs1 align-self-center>
                        <v-avatar :color="cvtTribeColor(ranker.tribe)" size="20px">
                            <span class="white--text">{{ranker.tribe | cvtTribe}}</span>
                        </v-avatar>
                    </v-flex>

                    <v-flex class="text-no-wrap" xs6 lg7 align-self-center>
                        <strong v-html="ranker.userName"></strong>
                        <div class="grey--text text-sm-start">({{ranker.bNetId}})</div>
                    </v-flex>
                    <v-flex class="text-no-wrap" xs4 lg3 align-self-center>
                        <v-chip color="red lighten-4" class="ml-0 mr-2 black;text" label small>
                            ELO : {{ ranker.eloScore }}
                        </v-chip>
                    </v-flex>
                </v-layout>
            </v-expansion-panel-header>

            <v-expansion-panel-content>
                <v-divider></v-divider>
                <v-card-text v-text="`최근 입력 10일 승률(%) 그래프`"></v-card-text>
                <chart-column-record :player="ranker"></chart-column-record>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>
    import ChartColumnRecord from './chartColumnRecord'
    export default {
        name: "panelPlayerList",
        props: ['rankers'],
        components: { ChartColumnRecord },
        methods: {
            cvtMedalColor: function (i) {
                if (i == 0) {
                    return 'amber accent-4'
                } else if (i == 2) {
                    return 'brown darken-1'
                }
            },

            cvtTribeColor: function (tribe) {
                if (tribe == 'terran') {
                    return 'light-blue accent-4'
                } else if (tribe == 'zerg') {
                    return 'teal accent-3'
                } else if (tribe == 'protoss') {
                    return 'amber darken-3'
                } else {
                    return 'red'
                }
            }
        },
        filters: {
            cvtTribe: function (val) {
                return val.substring(0,1).toUpperCase()
            },
        }
    }
</script>

<style scoped>

</style>