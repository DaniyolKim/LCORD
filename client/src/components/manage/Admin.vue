<template>
  <div>
    <div>
      <label>검색 : </label>
      <input type="text" v-model="filterString">
    </div>
    <div style="display: flex; flex-direction: row; justify-content: space-around">
      <div style="height: 85vh; width: 60vw; overflow-y: auto">
        <table style="width: 100%">
          <thead>
          <tr>
            <th style="width: 60px;">이름</th><th>LCORD ID</th><th>종족</th><th>ELO</th><th>bNetID</th><th>별명</th><th>티어</th><th>소개</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="player in filteredPlayerList" @click="selectPlayer(player)">
            <td>{{player.userName}}</td>
            <td>{{player.userId}}</td>
            <td>{{player.tribe}}</td>
            <td>{{player.eloScore}}</td>
            <td>{{player.bNetId}}</td>
            <td>{{player.nickName}}</td>
            <td>{{player.tier | cvtTier}}</td>
            <td>{{getComment(player)}}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <div style="height: 85vh; width: 45vw; overflow-y: auto">
        <div>Name : {{selectedPlayer.userName}}</div>
        <div>ID : {{selectedPlayer.userId}}</div>
        <div>bNetId : {{selectedPlayer.bNetId}}</div>
        <div>별명 : {{selectedPlayer.nickName}}</div>
        <div>종족 :
          <select v-model="selectedPlayer.tribe">
            <option v-for="tribe in tribeList" :value="tribe.value">{{tribe.name}}</option>
          </select>
        </div>
        <div>티어 :
          <select v-model="selectedPlayer.tier">
            <option v-for="tier in tierList" :value="tier.value">{{tier.name}}</option>
          </select>
        </div>
        <div>불참 배틀 리스트</div>
        <div>{{selectedPlayer.nonAttendanceBattles}}</div>
        <button @click="updatePlayerInfo">UPDATE INFO</button>
        <br>
        <button @click="resetPWD">RESET PWD</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Admin",
    data () {
      return {
        playerList: [],
        filterString: '',
        selectedPlayer: '',
        sortArg: { key: 'userName', order: 'asc' },
        tribeList: [
          {name: 'ZERG', value: 'zerg'},
          {name: 'PROTOSS', value: 'protoss'},
          {name: 'TERRAN', value: 'terran'},
          {name: 'RANDOM', value: 'random'},
        ],
        tierList: [
          {name: 'NONE', value: 0}, {name: '아메바', value: 1}, {name: '애니멀', value: 2}, {name: '휴먼', value: 3}, {name: '갓', value: 4}
        ]
      }
    },

    methods: {
      getAllPlayers() {
        this.$lcordAPI.user.getSortedAllUsers(this.sortArg)
          .then(resp => {
            this.playerList = resp
          })
      },

      selectPlayer(player) {
        this.selectedPlayer = player
      },

      updatePlayerInfo () {
        if (this.selectedPlayer != '') {
          this.$lcordAPI.user.update(this.selectedPlayer)
            .then(() => {
              this.$toast.success('업데이트 성공', {position: 'top'})
              this.getAllPlayers()
            })
        }
      },

      resetPWD () {
        let reqData = { pwd: '1234' }
        this.$lcordAPI.user.updatePwd(this.selectedPlayer._id, reqData)
          .then(() => {
            this.$toast.success('초기화 성공', {position: 'top'})
          })
      },

      getComment (player) {
        let retComment = ''
        if (player != undefined) {
          if (player.optionalInfo != undefined) {
            retComment = player.optionalInfo.comment
          }
        }
        return retComment
      }
    },

    computed: {
      filteredPlayerList: function () {
        let filterString = this.filterString && this.filterString.toLowerCase()
        let players = this.playerList
        if (filterString) {
          players = players.filter(function (row) {
            return Object.keys(row).some(function (key) {
              return String(row[key]).toLowerCase().indexOf(filterString) > -1
            })
          })
        }
        return players
      }
    },

    beforeMount() {
      this.getAllPlayers()
    },
    filters: {
      cvtTier: function (val) {
        let tierList = [{name: 'NONE', type: 0}, {name: 'AMOEBA', type: 1}, {name: 'ANIMAL', type: 2}, {name: 'HUMAN', type: 3}, {name: 'GOD', type: 4}]
        return tierList[val].name
      },
    }
  }
</script>

<style scoped>

</style>
