<template>
  <div>
    <input type="text" v-model="delRT_Id" value="">
    <button @click="delTeamRecord">del</button>
    <br>
    <input type="text" v-model="getBattle_Id" value="">
    <button @click="getTeamRecord">get all space</button>

  </div>
</template>

<script>
  export default {
    name: "vueTeamRecordList",
    data () {
      return {
        delRT_Id: '',
        getBattle_Id: '',
        spaceList: []
      }
    },
    methods: {
      delTeamRecord () {
        this.$lcordAPI.recordTeam.delete(this.delRT_Id)
          .then((resp) => {

          })
      },
      getTeamRecord () {
        this.$lcordAPI.recordTeam.getByBattleId(this.getBattle_Id)
          .then((resp) => {

          })
      },

    }
  }
</script>

<style scoped>

</style>
