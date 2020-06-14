<template>
    <v-expansion-panels popout>
        <v-expansion-panel
                v-for="(ranker, i) in rankers"
                :key="i"
                hide-actions
        >
            <v-expansion-panel-header class="pa-1 pa-lg-4 pa-xl-4">
                <v-row
                        align="center"
                        class="spacer"
                        no-gutters
                >
                    <v-col cols="1">
                        <v-icon :color="cvtMedalColor(i)">fas fa-medal</v-icon>
                    </v-col>
                    <v-col cols="1">
                        <v-avatar :color="cvtTribeColor(ranker.tribe)" size="20px">
                            <span class="white--text">{{ranker.tribe | cvtTribe}}</span>
                        </v-avatar>
                    </v-col>

                    <v-col
                            class="text-no-wrap"
                            xs="6"
                            sm="6"
                            md="6"
                            lg="7"
                            xl="7"
                    >
                        <strong v-html="ranker.userName"></strong>
                        <div class="grey--text">({{ranker.bNetId}})</div>
                    </v-col>
                    <v-col
                            class="text-no-wrap"
                            xs="4"
                            sm="4"
                            md="4"
                            lg="3"
                            xl="3"
                            align="end"
                    >
                        <v-chip
                                color="red lighten-4"
                                class="ml-0 mr-2 black;text"
                                label
                                small
                        >
                            ELO : {{ ranker.eloScore }}
                        </v-chip>
                    </v-col>

                </v-row>
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