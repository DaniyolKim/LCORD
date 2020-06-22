<template>
    <v-card :loading="loading">
        <v-card-title>종족별 가입자 비율</v-card-title>
        <v-card-subtitle>테란({{series[0]}}명) 저그({{series[1]}}명) 프로토스({{series[2]}}명) 랜덤({{series[3]}}명)</v-card-subtitle>

        <apexchart type="donut" :options="chartOptions" :series="series"></apexchart>
        <br>

    </v-card>
</template>

<script>
    export default {
        name: "chartDonutTribeCount",
        props: [ 'playerList', 'loading' ],
        data () {
            return {
                chartOptions: {
                    chart: {
                        type: 'donut',
                        animations: {
                            enabled: true,
                            easing: 'easeinout',
                            speed: 800,
                            animateGradually: {
                                enabled: true,
                                delay: 150
                            },
                            dynamicAnimation: {
                                enabled: true,
                                speed: 350
                            }
                        },
                    },
                    legend: {
                        show: true,
                        showForSingleSeries: false,
                        showForNullSeries: true,
                        showForZeroSeries: true,
                        position: 'bottom',
                        horizontalAlign: 'center',
                    },
                    labels: ['TERRAN', 'ZERG', 'PROTOSS', 'RANDOM'],
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            chart: {
                                /*width: 200*/
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }],
                    plotOptions: {
                        pie: {
                            donut: {
                                size: '55%',
                                labels: {
                                    show: true,
                                    name: {
                                        show: true,
                                        formatter: function (val) {
                                            return val
                                        }
                                    },
                                    value: {
                                        show: true,
                                        formatter: function (val) {
                                            return val
                                        }
                                    },
                                    total: {
                                        show: true,
                                        showAlways: false,
                                    }
                                }
                            }
                        }
                    },
                    tooltip: {
                        enabled: false
                    }
                },
            }
        },

        computed: {
            series () {
                let retData = []
                if (this.playerList.length > 0) {
                    let zergList = this.playerList.filter(x => x.tribe === 'zerg')
                    let terranList = this.playerList.filter(x => x.tribe === 'terran')
                    let protossList = this.playerList.filter(x => x.tribe === 'protoss')
                    let randomList = this.playerList.filter(x => x.tribe === 'random')

                    retData.push(terranList.length)
                    retData.push(zergList.length)
                    retData.push(protossList.length)
                    retData.push(randomList.length)
                }
                return retData
            }
        }
    }
</script>

<style scoped>

</style>