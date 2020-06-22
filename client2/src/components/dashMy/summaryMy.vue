<template>
    <v-layout row wrap justify-center>
        <v-flex xs12 lg9>
            <v-card raised>
                <v-card-title>MY STATUS</v-card-title>
                <v-card-text>
                    <v-layout row>
                        <v-flex xs12 lg4>
                            <v-card>
                                <v-card-title>ELO Score</v-card-title>
                            </v-card>
                        </v-flex>
                        <v-flex xs12 lg4>
                            <v-card>
                                <v-card-title>10일간 승률</v-card-title>
                            </v-card>
                        </v-flex>
                        <v-flex xs12 lg4>
                            <v-card>
                                <v-card-title>종족별 승률</v-card-title>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: "summaryMy"
    }
</script>

<style scoped>

</style>