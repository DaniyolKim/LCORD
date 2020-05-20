<template>
  <div class="container-user-compare">
    <div class="user-compare-section">
      <h4>플레이어 비교</h4>
      <div style="width: 100%">
        <div style="display: flex; flex-direction: row; justify-content: center; align-items: center">
          <h5 style="width: 20%;text-align: right; margin-right: 15px;">기준 플레이어</h5>
          <vue-multiselect style="width: 75%;" v-model="detPlayers" placeholder="이름 검색" label="userName" track-by="userId" selectLabel="추가" selectedLabel="선택 됨" deselectLabel="제거"
                           :options="userList" :multiple="false" :taggable="true" :custom-label="userSearchLabel" :show-labels="false" @select="selectPlayer"></vue-multiselect>
        </div>

        <div style="display: flex; flex-direction: row; justify-content: center; align-items: center">
          <h5 style="width: 20%;text-align: right; margin-right: 15px;">비교 플레이어</h5>
          <vue-multiselect style="width: 75%;" v-model="compPlayers" placeholder="이름 검색" label="userName" track-by="userId" selectLabel="추가" selectedLabel="선택 됨" deselectLabel="제거"
                           :options="userList" :multiple="true" :taggable="true" :custom-label="userSearchLabel" :show-labels="false" @select="selectPlayer"></vue-multiselect>
        </div>

        <div v-if="detPlayers != ''" style="display: flex;flex-direction: column;align-items: center; justify-content: flex-start;">
          <table style="margin-bottom: 15px;width: 98%;"
                 v-for="cmp in compPlayers">
            <thead>
            <tr>
              <th rowspan="2">구분</th><th rowspan="2">이름</th><th colspan="4">승률</th><th colspan="6">능력치</th><th colspan="3">ELO</th>
            </tr>
            <tr>
              <th>전체</th><th>vs 테란</th><th>vs 저그</th><th>vs 플토</th>
              <th>총점</th><th>빌드</th><th>컨트롤</th><th>판단</th><th>자원 관리</th><th>확장능력</th>
              <th>현재</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>기준</td>
              <td>{{detPlayers.userName}}</td>
              <td>{{detPlayers.winRate | calTotalWinRate}}</td>
              <td v-for="rate in detPlayers.winRate">{{rate}}%</td>
              <td>{{detPlayers.abilityScore}}</td>
              <td v-for="score in detAbilityScore">{{score}}</td>
              <td>{{detPlayers.eloScore}}</td>
            </tr>
            <tr>
              <td>비교</td>
              <td>{{cmp.userName}}</td>
              <td>{{cmp.winRate | calTotalWinRate}}</td>
              <td v-for="rate in cmp.winRate">{{rate}}%</td>
              <td>{{cmp.abilityScore}}</td>
              <td v-for="score in cmpAbilityScore(cmp._id)">{{score}}</td>
              <td>{{cmp.eloScore}}</td>
            </tr>
            </tbody>
          </table>

          <h3>전적 리스트</h3>
          <div v-if="vsRecordList.length == 0">상대 전적이 없습니다.</div>
          <div v-else style="width: 98%;">
            <div v-if="compPlayers.length > 0">
              <label>승률(%)</label><label>{{winRate}}</label>
              <label>-</label>
              <label>{{winCount}}</label><label>승</label>
              <label>{{loseCount}}</label><label>패</label>
            </div>
            <vue-record-list :record-list="vsRecordList" style="width: 100%;"></vue-record-list>
          </div>
        </div>
      </div>
    </div>

    <div class="user-compare-section">
      <h4>상세 정보</h4>
      <div v-if="compPlayers.length == 0">플레이어를 선택해 주세요.</div>
      <div v-else>
        <h3>능력 / 종족별 승률 그래프</h3>
        <div class="container-chart2">
          <apexchart type=radar width="600px" :options="chartOptionsStats" :series="abilityList"></apexchart>
          <apexchart type=radar width="600px" :options="chartOptionsVS" :series="winRateList"></apexchart>
        </div>
      </div>
    </div>
    <modals-container></modals-container>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import VueRecordList from '../module/vueRecordList'

  export default {
    name: "userCompare",
    components: {VueRecordList},
    data () {
      return {
        detPlayers: '',
        compPlayers: [],
        userList: [],
        abilityList: [],
        winRateList: [],
        recordList: [],
        winCount: 0,
        loseCount: 0,
        winRate: 0.0,
        chartOptionsStats: {
          title: { text: '스타 능력치', align: 'center', },
          labels: ['빌드', '컨트롤', '판단', '자원 관리', '확장능력'],
          yaxis: { min: 0, max: 5, tickAmount: 5 },
          chart: { toolbar: {  show: false }},
          theme: { palette: 'palette7' } // upto palette10
        },
        chartOptionsVS: {
          title: { text: '종족별 승률', align: 'center', },
          labels: ['Terran', 'Zerg', 'Protoss'],
          yaxis: { min: 0, max: 100, tickAmount: 2 },
          chart: { toolbar: {  show: false }},
          theme: { palette: 'palette7' } // upto palette10
        },
      }
    },
    methods: {
      getAllPlayers () {
        this.$modal.show('loading-modal')
        this.$lcordAPI.user.getAllUsers()
          .then(resp => {
            this.userList = resp
            this.$modal.hide('loading-modal')
          })
      },
      userSearchLabel ({userName, bNetId, tribe}) {
        //return `${userName}(${bNetId.split(' ')[0]})`
        let cvtTribe = `${tribe}`.slice(0,1).toUpperCase()
        return `${userName} `+ cvtTribe + ` (${bNetId})`
      },

      selectPlayer (player) {
        this.getDetails(player)
      },

      removePlayer (player) {
        let aIndex = this.abilityList.findIndex(x => x._id == player._id)
        this.abilityList.splice(aIndex, 1)

        let wIndex = this.winRateList.findIndex(x => x._id == player._id)
        this.winRateList.splice(wIndex, 1)
      },

      async getDetails (player) {
        await this.getWinRateOfUser(player)
        await this.getUserAbilities(player)
      },

      async getUserAbilities (player) {
        this.$modal.show('loading-modal')
        await this.$lcordAPI.ability.getAbilityOfUser(player._id)
          .then(resp => {
            player.abilitySummary = resp.summary
            this.abilityList.push({_id: player._id, name: player.userName, data: resp.summary})
            this.$modal.hide('loading-modal')
          })
      },

      async getWinRateOfUser (player) {
        this.$modal.show('loading-modal')
        await this.$lcordAPI.record.getWinRateOfUser(player._id)
          .then(resp => {
            player.winRate = resp.summary
            this.winRateList.push( {_id: player._id, name: player.userName, data: resp.summary})
            this.$modal.hide('loading-modal')
          })
      },

      cmpAbilityScore (id) {
        let index = this.abilityList.findIndex(x => x._id == id)

        if (this.abilityList[index] == undefined) return []
        else  return this.abilityList[index].data
      },

      async getAllRecordsOfUser (userId) {
        this.$modal.show('loading-modal')
        await this.$lcordAPI.record.getAllRecordsOfUser(userId)
          .then(resp => {
            this.recordList = resp

            this.$modal.hide('loading-modal')
          })
      },
    },
    mounted() {
      this.getAllPlayers()
    },
    computed: {
      ...mapGetters({
        userDBIndex: 'getUserDBIndex',
      }),

      detAbilityScore: function () {
        if (this.abilityList[0] == undefined) return []
        else  return this.abilityList[0].data
      },

      vsRecordList: function () {
        let retList = []
        if (this.recordList != null && this.recordList != '') {
          if (this.compPlayers != null && this.compPlayers.length == 0) {
            retList = this.recordList
          } else {
            this.winCount = 0;
            this.loseCount = 0;
            for (let i in this.recordList) {
              let winners = this.recordList[i].winners
              let losers = this.recordList[i].losers

              let winIndex = winners.findIndex(x => x._id === this.compPlayers[0]._id)
              let loseIndex = losers.findIndex(x => x._id === this.compPlayers[0]._id)

              if (winIndex != -1 || loseIndex != -1) {
                if (winIndex > -1) this.loseCount += 1
                else this.winCount += 1
                retList.push(this.recordList[i])
              }
            }
            this.winRate = (this.winCount / retList.length * 100).toFixed(2)
          }
        }
        return retList
      }
    },
    watch: {

      detPlayers: function () {
        if (this.detPlayers == '' || this.detPlayers == null) {
          this.abilityList.splice(0,1)
          this.winRateList.splice(0,1)
          this.recordList = []
        } else {
            this.getAllRecordsOfUser(this.detPlayers._id)
        }
      },

      compPlayers: function () {
        if (this.compPlayers.length > 1) {
          this.compPlayers.splice(0,1)
          this.abilityList.splice(1,1)
          this.winRateList.splice(1,1)
        }
      }
    },
    filters: {
      cvtTribe: function (val) {
        if (val == 'terran') {
          return 'T'
        } else if (val == 'protoss') {
          return 'P'
        } else if (val == 'zerg') {
          return 'Z'
        } else {
          return 'R'
        }
      },
      cvtTier: function (val) {
        let tierList = [ { name: 'NONE', type: 0}, { name: 'AMOEBA', type: 1}, { name: 'ANIMAL', type: 2}, { name: 'HUMAN', type: 3}, { name: 'GOD', type: 4} ]
        return tierList[val].name
      },

      calTotalWinRate: function (rateList) {
        if (rateList > 0 || rateList != undefined) {
          let retVal = 0
          for (let i in rateList){
            retVal += parseFloat(rateList[i])
          }
          return (retVal / rateList.length).toFixed(2) + '%'
        } else {
          return ''
        }
      }
    }
  }
</script>

<style scoped>

</style>
