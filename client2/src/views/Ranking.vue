<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-container fluid>
        <v-row align="start" justify="center">
            <v-flex xs12 sm12 md12 lg6 xl6>
                <v-card>
                    <v-card-text>
                        <v-layout justify-end row dense>
                            <v-col cols="2" class="pa-0">
                                <v-select class="mx-2 pa-0" v-model="selTribe" :items="tribes" single-line></v-select>
                            </v-col>
                            <v-col cols="2" class="pa-0">
                                <v-select class="mx-2 pa-0" v-model="dataSelTier" :items="tierList" single-line></v-select>
                            </v-col>
                            <v-col cols="3" class="pa-0">
                                <v-text-field
                                        class="mx-2 pa-0"
                                        v-model="search"
                                        append-icon="mdi-magnify"
                                        label="Search"
                                        single-line
                                ></v-text-field>
                            </v-col>
                        </v-layout>
                        <v-data-table
                                :headers="headers"
                                :items="clonedPlayerList"
                                :items-per-page="15"
                                :search="search"
                                class="elevation-1"
                                multi-sort
                                show-expand
                                single-expand
                                item-key="_id"
                                :loading="loading"
                                loading-text="Loading... Please wait"
                        >
                            <template v-slot:item.tribe="{ item }">
                                <v-avatar :color="cvtTribeColor(item.tribe)" size="20px">
                                    <span class="white--text">{{item.tribe | cvtTribe}}</span>
                                </v-avatar>
                            </template>
                            <template v-slot:item.eloScore="{ item }">
                                <v-chip
                                        color="red lighten-4"
                                        class="ml-0 mr-2 black;text"
                                        label
                                        small
                                >
                                    {{ item.eloScore }}
                                </v-chip>
                            </template>
                            <template v-slot:item.tier="{ item }">
                                <div>{{cvtTier(item.tier)}}</div>
                            </template>
                            <template v-slot:expanded-item="{ headers, item }">
                                <td :colspan="headers.length">
                                    <v-card-text v-text="`최근 입력 10일 승률(%) 그래프`"></v-card-text>
                                    <chart-column-record :player="item"></chart-column-record>
                                </td>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-row>
    </v-container>
</template>



<script>
    import { mapGetters } from 'vuex'
    import ChartColumnRecord from '../components/chartColumnRecord'
    export default {
        name: "Ranking",

        components: { ChartColumnRecord },
        /*
        sortBy > tier or tribe, filter
        filter >
        * */
        props: [ 'selTribe', 'selTier' ],

        data () {
            return {
                dataSelTier: parseInt(this.selTier),
                headers: [
                    { text: '종족', value: 'tribe', filterable: false, },
                    { text: '이름', value: 'userName' },
                    { text: 'B.Net ID', value: 'bNetId' },
                    { text: '티어', value: 'tier', filterable: false, },
                    { text: 'ELO', value: 'eloScore', filterable: false, },
                    { text: '', value: 'data-table-expand' },
                ],
                search: '',
                tribes: this.$defs.tribes,
                tierList: this.$defs.tierList,
            }
        },

        methods: {
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
            },

            cvtTier: function (tier) {
                return this.$defs.tierList[tier-1].text
            }
        },

        computed: {
            ...mapGetters({
                playerList: 'getPlayerList',
            }),
            clonedPlayerList () {
                if (this.playerList.length > 0) {
                    let retList = JSON.parse(JSON.stringify(this.playerList))
                    let _selTribe = this.selTribe
                    let _selTierNum = this.dataSelTier

                    if (_selTribe === 'all') {
                        return retList
                    } else {
                        retList = retList.filter(x => x.tribe === _selTribe)
                    }

                    if (isNaN(_selTierNum)) {
                        return retList
                    } else {
                        return retList.filter(x => x.tier === _selTierNum)
                    }
                }
            },
            loading () {
                if (this.clonedPlayerList.length <= 0) return 'primary'
                else  return false
            },
            selTierNum: {
                get() {
                    return parseInt(this.selTier)
                },
                set(newVal) {
                    return parseInt(newVal)
                }
            }
        },

        filters: {
            cvtTribe: function (val) {
                return val.substring(0,1).toUpperCase()
            },
        },
    }
</script>

<style scoped>

</style>