<template>
  <div>
    <div style="height: 100%; width: 40%; overflow-y: auto">
      <table style="width: 100%">
        <thead>
        <tr>
          <th>이름</th><th>베넷 아이디</th><th>별명</th><th>티어</th><th>스타 능력치</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="player in playerList">
          <td>{{player.userName}}</td>
          <td>{{player.bNetId}}</td>
          <td>{{player.nickName}}</td>
          <td>{{player.tier}}</td>
          <td>{{player.abilityScore}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div>

    </div>
  </div>
</template>

<script>
  export default {
    name: "userList",
    data () {
      return {
        sortArg: { key: 'abilityScore', order: 'desc' },
        playerList: []
      }
    },
    methods: {
      getAllPlayers () {
        this.$lcordAPI.user.getSortedAllUsers(this.sortArg)
          .then(resp => {
            this.playerList = resp
          })
      }
    },
    mounted() {
      this.getAllPlayers()
    }
  }
</script>

<style scoped>

</style>
