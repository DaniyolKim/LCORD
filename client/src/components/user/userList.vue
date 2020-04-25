<template>
  <div class="container-user-list">
    <div class="user-list-article">
      <!--<h2 @click="calELO">ELO 재계산</h2>-->
      <h2>플레이어 리스트 ({{playerList.length}}명)</h2>
      <div class="user-list-container">
        <table style="width: 100%">
          <thead>
          <tr>
            <th>이름</th><th>종족</th><th>베넷 아이디</th><th>별명</th><th>티어</th><th>스타 능력치</th><th>ELO Score</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="player in playerList" @click="getDetails(player)">
            <td>{{player.userName}}</td>
            <td>{{player.tribe | cvtTribe}}</td>
            <td>{{player.bNetId}}</td>
            <td>{{player.nickName}}</td>
            <td>{{player.tier | cvtTier}}</td>
            <td>{{player.abilityScore}}</td>
            <td>{{player.eloScore}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="user-list-article">
      <h2>{{selectedPlayer.userName}}님의 상세 정보</h2>
      <div style="height: 95%;overflow-y: auto;">
        <div v-if="selectedPlayer != ''">
          <h3>선택 정보</h3>
          <div>
            <div>
              <label>● 평균 APM : {{selectedPlayer.optionalInfo.apm}}</label>
              <label style="margin-left: 10px">● 래더 등급 : {{selectedPlayer.optionalInfo.grade}}</label>
            </div>
            <div>
              <label>● 소개 : {{selectedPlayer.optionalInfo.comment}}</label>
            </div>
          </div>

          <h3>능력 / 종족별 승률 그래프</h3>
          <div class="container-chart">
            <apexchart type=radar class="chart-style" :options="chartOptionsStats" :series="chartSeriesStats"></apexchart>
            <apexchart type=radar class="chart-style" :options="chartOptionsVS" :series="chartSeriesVS"></apexchart>
          </div>

          <h3>능력 평가 리스트 <button style="width: 60px; margin-left: 10px;padding: 3px;" @click="showModalAbility">+ 추가</button></h3>
          <div class="container-table">
            <table>
              <thead>
              <tr>
                <th>작성자</th>
                <th>빌드</th><th>컨트롤</th><th>판단</th><th>자원관리</th><th>확장능력</th>
                <th>총점</th><th>편집</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="score in ability.abilityList" v-if="score.writer != null">
                <td>{{score.writer.userName}}</td>
                <td>{{score.build}}</td><td>{{score.control}}</td><td>{{score.judgement}}</td><td>{{score.manageResource}}</td><td>{{score.manageMulti}}</td><td>{{score.totalScore}}</td>
                <td><button style="padding: 3px;" @click="editAbility(score.writer._id)">편집</button></td>
              </tr>
              </tbody>
            </table>
          </div>

          <h3>전적</h3>
          <vue-record-list :record-list="sortedRecords" :show-battle-name="true" @reqRefresh="updateData"></vue-record-list>
        </div>
        <div v-else>
          상세 정보를 보시려면 플레이어를 선택하세요.
        </div>
      </div>
    </div>
    <modals-container @close="updateData"></modals-container>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import modalCreateAbility from './modalCreateAbility'
  import VueRecordList from '../module/vueRecordList'
  export default {
    name: "userList",
    components: {VueRecordList, },
    data () {
      return {
        mDateFormat: 'YYYY-MM-DD',
        sortArg: { key: 'eloScore', order: 'desc' },
        playerList: [],
        selectedPlayer: '',
        ability: '',
        vsRecords: '',
        chartOptionsVS: {
          title: { text: '종족별 승률', align: 'center', },
          labels: ['Terran', 'Zerg', 'Protoss'],
          yaxis: { min: 0, max: 100, tickAmount: 2 },
          chart: { toolbar: {  show: false }},
          theme: { palette: 'palette8' } // upto palette10
        },
      }
    },
    methods: {
      getAllPlayers () {
        this.$lcordAPI.user.getSortedAllUsers(this.sortArg)
          .then(resp => {
            this.playerList = resp
          })
      },
      getDetails (player) {
        this.selectedPlayer = player
        this.getUserAbilities()
        this.getWinRateOfUser()
      },
      async getUserAbilities () {
        this.$modal.show('loading-modal')
        await this.$lcordAPI.ability.getAbilityOfUser(this.selectedPlayer._id)
          .then(resp => {
            this.ability = resp
            this.$modal.hide('loading-modal')
          })
      },
      getWinRateOfUser () {
        this.$modal.show('loading-modal')
        this.$lcordAPI.record.getWinRateOfUser(this.selectedPlayer._id)
          .then(resp => {
            this.vsRecords = resp
            this.$modal.hide('loading-modal')
          })
      },
      editAbility (writerId) {
        if (this.userDBIndex == writerId) {
          this.showModalAbility()
        } else {
          this.$toast.info('본인이 작성한 평가만 삭제할 수 있습니다.', {position: 'top'})
        }
      },
      showModalAbility () {
        let abilityCount = this.ability.abilityList.length
        let index = this.ability.abilityList.findIndex(x => x.writer._id == this.userDBIndex)
        this.$modal.show(modalCreateAbility,
          { player: this.selectedPlayer,
            oldData: this.ability.abilityList[index],
            abilityCount: abilityCount
          },
          {
            width: '700px',
            height: '470px',
            clickToClose: false,
          }
        )
      },
      updateData (isRefresh) {
        if (isRefresh) {
          this.getWinRateOfUser()
          this.getUserAbilities()
            .then(() => {
              this.getAllPlayers()
            })
        }
      },

      async calELO () {
        await this.$lcordAPI.user.initELO()

        for (let i = 0; i < 1091; i++) {
          await this.$lcordAPI.record.calELO(i)
        }
      }
    },
    mounted() {
      this.getAllPlayers()
      this.$EventBus.$on('refRecordList', () => {
        this.updateData(true)
      })
    },
    beforeDestroy() {
        this.$EventBus.$off('refRecordList')
    },
    computed: {
      ...mapGetters({
        userDBIndex: 'getUserDBIndex',
      }),
      chartOptionsStats: function() {
        let retObj = {
          title: { text: 'Total 능력치 : ' + this.ability.totalScore, align: 'center', },
          labels: ['빌드', '컨트롤', '판단', '자원 관리', '확장능력'],
          yaxis: { min: 0, max: 5, tickAmount: 5 },
          chart: { toolbar: {  show: false }},
          theme: { palette: 'palette7' } // upto palette10
        }
        return retObj
      },
      chartSeriesStats: function () {
        let retObj = [{ name: "",
          data: this.ability.summary
        }]

        return retObj
      },

      chartSeriesVS: function () {
        let retObj = [{ name: "종족별 승률(%)",
          data: this.vsRecords.summary
        }]
        return retObj
      },

      sortedRecords: function () {
        let retList = []
        if (this.vsRecords.recordList != undefined) {
          retList = this.vsRecords.recordList
        }
        return retList
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
      nullCheck: function (val) {
        if (val == undefined || val == null) return 'unknown'
        else return val
      }
    }
  }
</script>

<style scoped>

</style>
