<template>
  <div class="container-battle-info">
    <!--왼쪽-->
    <div class="battle-info-article">
      <div class="battle-selector-container">
        <div style="width: 99%;">
          <h4>{{selectedBattle.name}}</h4>
        </div>
      </div>
      <hr>
      <div class="battle-rank-container2">
        <div>
          <div><label>설명 :</label>{{selectedBattle.description}}</div>
          <div><label>대상 티어 :</label>{{$defs.tierList[selectedBattle.tierMin].name}} ~ {{$defs.tierList[selectedBattle.tierMax].name}}</div>
          <div><label>진행 방식 :</label>{{$defs.battleTypeList[selectedBattle.type].name}}</div>
        </div>

        <hr>
        <!--개인 전-->
        <div v-if="selectedBattle.type == 0" class="container-table">
          <table>
            <thead>
            <tr>
              <th rowspan="2" class="double-bottom">순서</th>
              <th rowspan="2" class="double-left double-bottom" :class="{ active: rankerSortKey === 'name'}" @click="sortRankerList('name')">이름
                <span class="arrow" :class="rankerOrder['name'] > 0 ? 'asc' : 'dsc'"></span>
              </th>
              <th rowspan="2" class="double-bottom">
                <div>종족</div>
                <div>
                  <select v-model="tribeFilterKey">
                    <option v-for="tribe in tribeList" :value="tribe.value">{{tribe.name}}</option>
                  </select>
                </div>
              </th>
              <th colspan="5" class="double-left">전체</th>
              <th colspan="3" class="double-left bg-terran">vs 테란</th>
              <th colspan="3" class="double-left bg-protoss">vs 프로토스</th>
              <th colspan="3" class="double-left bg-zerg">vs 저그</th>
            </tr>
            <tr class="double-bottom">
              <th class="double-left" :class="{ active: rankerSortKey === 'totWin'}" @click="sortRankerList('totWin')">승
                <span class="arrow" :class="rankerOrder['totWin'] > 0 ? 'asc' : 'dsc'"></span>
              </th>
              <th :class="{ active: rankerSortKey === 'totLose'}" @click="sortRankerList('totLose')">패
                <span class="arrow" :class="rankerOrder['totLose'] > 0 ? 'asc' : 'dsc'"></span>
              </th>
              <th :class="{ active: rankerSortKey === 'totRate'}" @click="sortRankerList('totRate')">승률(%)
                <span class="arrow" :class="rankerOrder['totRate'] > 0 ? 'asc' : 'dsc'"></span>
              </th>
              <th style="background-color: rgb(57, 173, 57)" :class="{ active: rankerSortKey === 'totScore'}" @click="sortRankerList('totScore')">승점
                <span class="arrow" :class="rankerOrder['totScore'] > 0 ? 'asc' : 'dsc'"></span>
              </th>
              <th :class="{ active: rankerSortKey === 'eloScore'}" @click="sortRankerList('eloScore')">ELO
                <span class="arrow" :class="rankerOrder['eloScore'] > 0 ? 'asc' : 'dsc'"></span>
              </th>
              <th class="double-left bg-terran" :class="{ active: rankerSortKey === 'vsTWin'}" @click="sortRankerList('vsTWin')">승
                <span class="arrow" :class="rankerOrder['vsTWin'] > 0 ? 'asc' : 'dsc'"></span>
              </th>
              <th class="bg-terran" :class="{ active: rankerSortKey === 'vsTLose'}" @click="sortRankerList('vsTLose')">패
                <span class="arrow" :class="rankerOrder['vsTLose'] > 0 ? 'asc' : 'dsc'"></span>
              </th>
              <th class="bg-terran" :class="{ active: rankerSortKey === 'vsTRate'}" @click="sortRankerList('vsTRate')">승률(%)
                <span class="arrow" :class="rankerOrder['vsTRate'] > 0 ? 'asc' : 'dsc'"></span>
              </th>
              <th class="double-left bg-protoss" :class="{ active: rankerSortKey === 'vsPWin'}" @click="sortRankerList('vsPWin')">승
                <span class="arrow" :class="rankerOrder['vsPWin'] > 0 ? 'asc' : 'dsc'"></span>
              </th>
              <th class="bg-protoss" :class="{ active: rankerSortKey === 'vsPLose'}" @click="sortRankerList('vsPLose')">패
                <span class="arrow" :class="rankerOrder['vsPLose'] > 0 ? 'asc' : 'dsc'"></span>
              </th>
              <th class="bg-protoss" :class="{ active: rankerSortKey === 'vsPRate'}" @click="sortRankerList('vsPRate')">승률(%)
                <span class="arrow" :class="rankerOrder['vsPRate'] > 0 ? 'asc' : 'dsc'"></span>
              </th>
              <th class="double-left bg-zerg" :class="{ active: rankerSortKey === 'vsZWin'}" @click="sortRankerList('vsZWin')">승
                <span class="arrow" :class="rankerOrder['vsZWin'] > 0 ? 'asc' : 'dsc'"></span>
              </th>
              <th class="bg-zerg" :class="{ active: rankerSortKey === 'vsZLose'}" @click="sortRankerList('vsZLose')">패
                <span class="arrow" :class="rankerOrder['vsZLose'] > 0 ? 'asc' : 'dsc'"></span>
              </th>
              <th class="bg-zerg" :class="{ active: rankerSortKey === 'vsZRate'}" @click="sortRankerList('vsZRate')">승률(%)
                <span class="arrow" :class="rankerOrder['vsZRate'] > 0 ? 'asc' : 'dsc'"></span>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(ranker, index) in sortedRanking" @click="getAllRecordsOfUser(ranker)">
              <td>{{index + 1}}</td>
              <td class="double-left">{{ranker.user.userName}}</td>
              <td class="double-left">{{ranker.user.tribe | cvtTribe}}</td>
              <td class="double-left">{{ranker.total.winCount}}</td>
              <td>{{ranker.total.loseCount}}</td>
              <td class="td-winRate-total">{{ranker.total.winRate}}</td>
              <td class="td-winScore" :class="{ topRanker : index < 5 && rankerSortKey == 'totScore'}">{{ranker.total.winScore}}</td>
              <td class="td-winRate-total">{{ranker.user.eloScore}}</td>
              <td class="double-left">{{ranker.vsTerran.winCount}}</td>
              <td>{{ranker.vsTerran.loseCount}}</td>
              <td class="td-winRate-vsTerran">{{ranker.vsTerran.winRate}}</td>
              <td class="double-left">{{ranker.vsProtoss.winCount}}</td>
              <td>{{ranker.vsProtoss.loseCount}}</td>
              <td class="td-winRate-vsProtoss">{{ranker.vsProtoss.winRate}}</td>
              <td class="double-left">{{ranker.vsZerg.winCount}}</td>
              <td>{{ranker.vsZerg.loseCount}}</td>
              <td class="td-winRate-vsZerg">{{ranker.vsZerg.winRate}}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <!--팀 전-->
        <div v-else-if="selectedBattle.type == 1">
          <a download="LG-SC-TeamList.png" :href="outPut">download</a>
          <div ref="printTarget">
            <VueTeamList :player-list="playerList" :team-list="selectedBattle.teamList"
                         :tier-min="selectedBattle.tierMin" :tier-max="selectedBattle.tierMax"
            ></VueTeamList>
          </div>
        </div>

        <!--이벤트 전-->
        <div v-else>
          이벤트 전
        </div>
      </div>

    </div>

    <!--오른쪽-->
    <div v-if="isMobile === false" class="battle-info-article record-container">
      <h4 @click="refreshRecord">전적 리스트 (Click To Refresh)</h4>
      <hr>
      <div class="record-list-container">
        <vue-record-list :record-list="recordList" :show-battle-name="false" @reqRefresh="refreshRecord"></vue-record-list>
      </div>
    </div>
    <modals-container/>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import VueRecordList from '../module/vueRecordList'
  import VueTeamList from '../module/vueTeamList'
  import ModalRecordSummary from './modalRecordSummary'
  export default {
    name: "BattleDetail",
    props: ['battleId'],
    components: {VueRecordList, VueTeamList, ModalRecordSummary, },
    data () {
      return {
        mDateFormat: 'YYYY-MM-DD',
        sortArg: { key: 'userName', order: 'asc' },
        playerList: [],

        selectedBattle: '',

        rankerList: [],
        rankerSortKeys: ['name', 'totWin', 'totLose', 'totRate', 'totScore', 'eloScore', 'vsTWin', 'vsTLose', 'vsTRate', 'vsPWin', 'vsPLose', 'vsPRate', 'vsZWin', 'vsZLose', 'vsZRate'],
        rankerSortKey: 'totScore',
        rankerOrder: { name: -1, totWin: -1, totLose: -1, totRate: -1, totScore: 1, eloScore: -1,
          vsTWin: -1, vsTLose: -1, vsTRate: -1, vsPWin: -1, vsPLose: -1, vsPRate: -1,
          vsZWin: -1, vsZLose: -1, vsZRate: -1 },
        tribeFilterKey: '',
        tribeList: [{value:'', name:'All'}, {value:'zerg', name:'Z'}, {value:'terran', name:'T'}, {value:'protoss', name:'P'}, {value:'random', name:'R'}],
        recordList: [],

        outPut: null
      }
    },
    methods: {
      async getPngTeamList () {
        const options = {
          type: 'dataURL'
        }
        this.outPut = await this.$html2canvas(this.$refs.printTarget, options)
      },

      async getBattle () {
        this.$lcordAPI.battle.getBattleById(this.battleId)
          .then((resp) => {
            this.selectedBattle = resp
          })
      },

      getAllPlayers () {
        this.$lcordAPI.user.getSortedAllUsers(this.sortArg)
          .then(resp => {
            this.playerList = resp
          })
      },

      getRecordListByBattleId () {
        this.$modal.show('loading-modal')
        this.$lcordAPI.record.getAllRecordsByBattleId(this.battleId)
          .then(resp => {
            this.$modal.hide('loading-modal')
            this.recordList = resp
        })
      },

      getRankerListByBattleId () {
        this.$modal.show('loading-modal')
        this.$lcordAPI.record.getRankersByBattleId(this.battleId)
          .then(resp => {
            this.$modal.hide('loading-modal')
            this.rankerList = resp
          })
      },

      getAllRecordsOfUser (ranker) {
        this.$modal.show('loading-modal')
        this.$lcordAPI.record.getAllRecordsOfUser(ranker.user._id)
          .then(resp => {
            let respRecords = []
            let battleId = this.battleId
            resp.forEach(function (rec) {
              if (battleId == rec.battleId._id) {
                respRecords.push(rec)
              }
            })

            this.$modal.hide('loading-modal')

            if (this.isMobile == false) {
              this.recordList = respRecords
            } else {
              this.showRecordSummary(respRecords, ranker)
            }
          })
      },

      showRecordSummary (recordList, ranker) {
        this.$modal.show(ModalRecordSummary,
          { user: ranker.user, recordList: recordList, summary: ranker },
          {
            width: '75%',
            height: '85%',
            clickToClose: false,
            root: this.$refs.myModal
          }
        )
      },

      refreshRecord () {
        this.getBattle()
        this.getRecordListByBattleId()
        this.getRankerListByBattleId()
      },

      sortRankerList(key) {
        this.rankerOrder[key] = this.rankerOrder[key] * -1
        this.rankerSortKey = key
      },
      rankerListCompare (sortKey, order, retList) {
        if (sortKey != '') {
          retList.sort((a, b) => {
            if (sortKey == 'name') {
              a = a['user'].userName
              b = b['user'].userName
            } else if (sortKey == 'totScore') {
              a = a['total'].winScore
              b = b['total'].winScore
            } else if (sortKey == 'eloScore') {
              a = a['user'].eloScore
              b = b['user'].eloScore
            } else {
              let targets = this.getSortTarget(sortKey, a, b)
              a = targets[0]
              b = targets[1]
            }

            if (sortKey == 'name') {
              return (a.length - b.length) * order || (a.localeCompare(b)) * order
            } else {
              return (a > b ? -1 : a < b ? 1 : 0) * order
            }
          })
        }
      },
      getSortTarget(sortKey, a, b) {
        if (sortKey.indexOf('tot') != -1) {
          a = a['total']
          b = b['total']
        } else if (sortKey.indexOf('vsT') != -1) {
          a = a['vsTerran']
          b = b['vsTerran']
        } else if (sortKey.indexOf('vsP') != -1) {
          a = a['vsProtoss']
          b = b['vsProtoss']
        } else if (sortKey.indexOf('vsZ') != -1) {
          a = a['vsZerg']
          b = b['vsZerg']
        }

        if (sortKey.indexOf('Win') != -1) {
          a = a.winCount
          b = b.winCount
        } else if (sortKey.indexOf('Lose') != -1) {
          a = a.loseCount
          b = b.loseCount
        } else if (sortKey.indexOf('Rate') != -1) {
          a = a.winRate
          b = b.winRate
        }
        return [a, b]
      },
    },
    beforeMount() {
      this.getAllPlayers()
      this.refreshRecord()
      this.$EventBus.$on('refRecordList', () => {
        this.refreshRecord()
      })
      this.$EventBus.$on('cmpOrderTeamMember', () => {
        this.getPngTeamList()
      })
    },
    beforeDestroy() {
      /*this.$EventBus.$off('refRecordList')*/
      this.$EventBus.$off('cmpOrderTeamMember')
    },
    computed: {
      ...mapGetters({
        userDBIndex: 'getUserDBIndex',
      }),
      isMobile: function () {
        let touchDevice = (navigator.maxTouchPoints || 'ontouchstart' in document.documentElement)
        if (touchDevice != false) return true
        else return false
      },
      sortedRanking: function () {
        let retList = this.rankerList

        let filter = {}
        if (this.tribeFilterKey != '') filter.tribe = this.tribeFilterKey

        retList = retList.filter(function(item) {
          for (let key in filter) {
            if (item.user[key] != filter[key]) {
              return false
            }
          }
          return true
        })

        let sortKey = this.rankerSortKey
        let order = this.rankerOrder[sortKey] || 1
        this.rankerListCompare(sortKey, order, retList)

        return retList
      },
    },
    watch: {
      battleId: function (newVal) {
        if (newVal != null) {
          this.refreshRecord()
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
      }
    }
  }
</script>

<style scoped>
  .topRanker { color: crimson; font-weight: bold; }
  th.active { color: crimson; text-shadow: 0 0 1px #fff; }
  th.active .arrow { opacity: 1; }

  .arrow {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;
    margin-left: 5px;
    opacity: 0.66;
  }

  .arrow.dsc {
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid crimson;
  }

  .arrow.asc {
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid crimson;
  }

  button { padding: 5px 10px; }
</style>
