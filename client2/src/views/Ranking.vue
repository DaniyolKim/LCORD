<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-container fluid>
        <v-layout justify-center>
            <v-flex xs12 lg6>
                <v-card>
                    <v-card-text>
                        <v-layout justify-end row dense>
                            <v-flex xs3 lg2 class="pa-0">
                                <v-select class="mx-2 pa-0" v-model="selTribe" :items="tribes" single-line></v-select>
                            </v-flex>
                            <v-flex xs3 lg2 class="pa-0">
                                <v-select class="mx-2 pa-0" v-model="dataSelTier" :items="tierList" single-line></v-select>
                            </v-flex>
                            <v-flex xs3 class="pa-0">
                                <v-text-field
                                        class="mx-2 pa-0"
                                        v-model="search"
                                        append-icon="mdi-magnify"
                                        label="검색"
                                        single-line
                                ></v-text-field>
                            </v-flex>
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
        </v-layout>
    </v-container>
</template>



<script>
    import { mapGetters } from 'vuex'
    import ChartColumnRecord from '../components/dashAll/chartColumnRecord'
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
                    { text: '종족', value: 'tribe', filterable: false, sortable: false },
                    { text: '이름', value: 'userName' },
                    { text: 'B.Net ID', value: 'bNetId' },
                    { text: '티어', value: 'tier', filterable: false,  sortable: false },
                    { text: 'ELO', value: 'eloScore', filterable: false, },
                    { text: '', value: 'data-table-expand' },
                ],
                search: '',
                tribes: [{ text: '모든 종족', value: 'all' }, ...this.$defs.tribes],
                tierList: [{ text: '모든 티어', value: 0 }, ...this.$defs.tierList],
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

                    if (_selTribe != 'all') {
                        retList = retList.filter(x => x.tribe === _selTribe)
                    }

                    if (_selTierNum == 0) {
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