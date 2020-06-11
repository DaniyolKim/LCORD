<template>
    <div>
        <apexchart type="donut" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script>
    export default {
        name: "chartDonutTribeCount",
        props: [ 'playerList' ],
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
                        }
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
                                width: 200
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
                if (this.playerList.length > -1) {
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