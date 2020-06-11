<template>
    <div>
        <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script>
    export default {
        name: "chartBarTierCount",
        props: [ 'playerList' ],
        data () {
            return {
                chartOptions: {
                    chart: {
                        type: 'bar',
                        height: 350,
                        toolbar: { show: false }
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '55%',
                            endingShape: 'rounded'
                        },
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        show: true,
                        width: 2,
                        colors: ['transparent']
                    },
                    xaxis: {
                        categories: ['-', '아메바', '애니멀', '휴먼', '갓'],
                    },

                    fill: {
                        opacity: 1
                    },
                    tooltip: {
                        y: {
                            formatter: function (val) {
                                return val + "명"
                            }
                        }
                    }
                },
            }
        },

        methods: {
        },

        computed: {
            series () {
                let retData = []

                if (this.playerList.length > -1) {
                    for (let i = 0; i < this.$defs.tribes.length; i++) {
                        let tribeName = this.$defs.tribes[i].value
                        let tribeList = this.playerList.filter(x => x.tribe === tribeName)

                        let pushObj = { name: tribeName.toUpperCase(), data: [] }
                        this.$defs.tierList.forEach(tier => {
                            let count = tribeList.filter(x => x.tier === tier.value).length
                            pushObj.data.push(count)
                        })
                        retData.push(pushObj)
                    }
                }

                return retData
            }
        }
    }
</script>

<style scoped>

</style>