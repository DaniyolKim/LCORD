<template>
    <v-layout>
        <v-flex>
            <apexchart type="bar" :options="chartInfo.chartOptions" :series="chartInfo.series"></apexchart>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: "chartColumnRecord",

        props: [ 'player' ],

        data () {
            return {
                loading: 'primary',
                recordList: [],
            }
        },

        methods: {
            getRecord () {
                this.$lcordAPI.record.getAllRecordsOfUser(this.player._id)
                    .then(resp => {
                        this.recordList = resp
                        this.loading = false
                    })

            },
        },

        beforeMount() {
            this.getRecord()
        },

        computed: {
            chartInfo: function () {
                let categoyDate = []
                let moment = this.$moment

                /*options*/
                for (let i = 0; i < this.recordList.length; i++) {
                    let record = this.recordList[i]
                    let date = moment(record.date).format('YYYY-MM-DD')
                    let dateIndex = categoyDate.findIndex(x => x === date)
                    if (dateIndex == -1) categoyDate.push(date)

                    if (categoyDate.length == 10) break
                }

                let chartOptions = {
                    noData: { text: 'NO RECORD'},
                    colors: [ '#0091EA', '#E53935' ],
                    chart: {
                        type: 'bar',
                        height: 350,
                        stacked: true,
                        stackType: '100%',
                        toolbar: { show: false }
                    },
                    dataLabels: {
                        enabled: false,
                        /*formatter: function (val) {
                            return val.toFixed(0) + "%";
                        },*/
                    },
                    xaxis: {
                        type: 'category',
                        categories: categoyDate.reverse()
                    },
                    fill: {
                        opacity: 1
                    },
                    legend: {
                        position: 'bottom',
                    },
                    /*tooltip: { enabled: false }*/
                }

                /*seires*/
                let winDataArray = Array.apply(null, new Array(categoyDate.length)).map(Number.prototype.valueOf,0)
                let loseDataArray = Array.apply(null, new Array(categoyDate.length)).map(Number.prototype.valueOf,0)
                for (let i = 0; i < categoyDate.length; i++) {
                    let date = categoyDate[i]
                    let records = this.recordList.filter(x => moment(x.date).format('YYYY-MM-DD').indexOf(date) != -1)

                    let playerId = this.player._id
                    let index = i
                    records.forEach(record => {
                        let winIndex = record.winners.findIndex(x => x._id == playerId)
                        if (winIndex > -1) {
                            winDataArray[index] += 1
                        } else {
                            loseDataArray[index] += 1
                        }
                    })
                }

                let series = [
                    {
                        name: 'Win',
                        data: winDataArray
                    }, {
                        name: 'Lose',
                        data: loseDataArray
                    }
                ]

                return { chartOptions: chartOptions, series: series }
            }
        }
    }
</script>

<style scoped>

</style>