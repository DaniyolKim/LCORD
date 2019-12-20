<template>
  <div class="root">
    <div style="display: flex; flex-direction: column;align-items: center;justify-content: center">
      <div style="width: 99%; margin: 10px 0px">
        <h2 v-if="isProgressing == 'true'">진행 중인 배틀</h2>
        <h2 v-else>종료 된 배틀</h2>
      </div>
      <div style="width: 99%;">
        <vue-multiselect v-model="selectedBattle" placeholder="배틀 선택" label="name" track-by="name" selectLabel="선택" selectedLabel="선택 됨" deselectLabel="제거" :options="battleList" :multiple="false" :taggable="true"></vue-multiselect>
      </div>
    </div>

    <hr>
    <div v-if="selectedBattle != null">
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
            <th rowspan="2">순위</th><th rowspan="2">이름</th>
            <th colspan="4">전체</th>
            <th colspan="3" style="background-color: #4285f4">vs 테란</th>
            <th colspan="3" style="background-color: darkorange">vs 프로토스</th>
            <th colspan="3" style="background-color: blueviolet">vs 저그</th>
          </tr>
          <tr>
            <th>승</th><th>패</th><th>승률%)</th><th title="(승 X 3) - 패">승점</th>
            <th style="background-color: #4285f4">승</th><th style="background-color: #4285f4">패</th><th style="background-color: #4285f4">승률%)</th>
            <th style="background-color: darkorange">승</th><th style="background-color: darkorange">패</th><th style="background-color: darkorange">승률%)</th>
            <th style="background-color: blueviolet">승</th><th style="background-color: blueviolet">패</th><th style="background-color: blueviolet">승률%)</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(ranker, index) in sortedRanking">
            <td>{{index + 1}}</td>
            <td>{{ranker.user.userName}}({{ranker.user.tribe | cvtTribe}})</td>
            <td>{{ranker.total.winCount}}</td>
            <td>{{ranker.total.loseCount}}</td>
            <td>{{ranker.total.winRate}}</td>
            <td>{{ranker.total.winScore}}</td>
            <td>{{ranker.vsTerran.winCount}}</td>
            <td>{{ranker.vsTerran.loseCount}}</td>
            <td>{{ranker.vsTerran.winRate}}</td>
            <td>{{ranker.vsProtoss.winCount}}</td>
            <td>{{ranker.vsProtoss.loseCount}}</td>
            <td>{{ranker.vsProtoss.winRate}}</td>
            <td>{{ranker.vsZerg.winCount}}</td>
            <td>{{ranker.vsZerg.loseCount}}</td>
            <td>{{ranker.vsZerg.winRate}}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!--팀 전-->
      <div v-else-if="selectedBattle.type == 1">
        팀 전
      </div>

      <!--이벤트 전-->
      <div v-else>
        이벤트 전
      </div>

      <div class="container-table">
        <div>
          <button class="btn" @click="refreshRecord">refresh</button>
        </div>

        <table>
          <thead>
          <tr>
            <th>경기 날짜</th>
            <th>맵</th><th>Battle Type</th>
            <th><label>승자</label></th>
            <th><label>패자</label></th>
            <th>방송 URL</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="record in recordList">
            <td>{{record.date | moment(mDateFormat)}}</td>
            <td>{{record.map.name}}</td>
            <td>{{$defs.gameTypeList[record.battleType].name}}</td>
            <td><label v-for="user in record.winners" class="user-label" :class="user.tribe">{{user.userName}}({{user.tribe | cvtTribe}})</label></td>
            <td><label v-for="user in record.losers" class="user-label" :class="user.tribe">{{user.userName}}({{user.tribe | cvtTribe}})</label></td>
            <td>{{record.videoLink}}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!--<hr>
      <div>
        <div>순위</div>
        <div>
          <table>
            <thead>
            <tr>
              <th>순위</th><th>점수</th><th>팀명</th><td></td>
              <th>승리</th><th>패배</th>
              <th>세트 승</th><th>세트 패</th><th>득실</th>
              <th>에결 횟수</th><th>경기 횟수</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(team, index) in teamList">
              <td>{{index + 1}}</td>
              <td>{{team.score.cntWin * 3}}</td>
              <td>{{team.name}}</td>
              <td></td>
              <td>{{team.score.cntWin}}</td><td>{{team.score.cntLose}}</td>
              <td>{{team.score.cntWinSet}}</td><td>{{team.score.cntLoseSet}}</td><td>{{team.score.cntWinSet - team.score.cntLoseSet}}</td>
              <td>{{team.score.cntAceMatch}}</td><td>{{team.score.cntWin + team.score.cntLose}}</td>
            </tr>
            </tbody>
          </table>

          <table>
            <thead>
            <tr>

            </tr>
            </thead>
            <tbody>
            <tr v-for="team in teamList">

            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <hr>
      <div>
        <div>진행 현황</div>
        <div v-for="round in roundList">
          <table>
            <thead>
            &lt;!&ndash;<tr>
              <th colspan="8">{{round.name}}</th>
            </tr>&ndash;&gt;
            <tr>
              <th></th><th>날짜</th><th>Home team</th><th>Away team</th><th>Winner</th><th>Score</th><th>MVP</th><th>방송국</th>
              <th>상세</th><th>업데이트</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(match, index) in round.matchList">
              <td v-show="index === 0" rowspan="5" style="transform: rotate(-90deg)">{{round.name}}</td>
              <td>{{match.matchTime}}</td>
              <td :class="convertWinner(match.winner, match.home)">{{match.home}}</td>
              <td :class="convertWinner(match.winner, match.away)">{{match.away}}</td>
              <td>{{match.winner}}</td>
              <td>{{match.score}}</td>
              <td>{{match.mvp}}</td>
              <td>{{match.link}}</td>
              <td><button @click="showModalDetail(round.name, match, false)">DETAILS</button></td>
              <td><button @click="showModalDetail(round.name, match, true)">EDIT</button></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <hr>
      <div>
        <label>Team List</label>
        <label>
          (<label>구분 : </label>
          <label class="leader1">팀장</label>
          <label class="leader2">주장</label>
          <label> | </label>
          <label class="terran">테란</label>
          <label class="zerg">저그</label>
          <label class="protoss">플토</label>
          <label class="random">랜덤</label>
          )
        </label>

        <div class="container-team-list">
          <div v-for="team in teamList">
            <table>
              <thead>
              <th colspan="2">{{team.name}}</th>
              </thead>
              <tbody>
              <tr v-for="member in team.members">
                <td>{{convertTearName(member.tear)}}</td>
                <td>
                  <div v-for="user in member.users" :class="convertLeaderType(team, user.name)">
                    <label :class="user.tribe">{{user.name}}</label>
                    (<label>{{user.id}}</label>)
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <hr>-->
    </div>

    <modals-container/>
  </div>
</template>

<script>
  import DemoSizeModal from './modalDetail'
  export default {
    name: "BattleInfo",
    props: ['isProgressing'],
    components: { DemoSizeModal, },
    data () {
      return {
        mDateFormat: 'YYYY-MM-DD',
        battleList: [],
        selectedBattle: null,
        recordList: [],
        //userList: [],
        rankerList: [],

        roundList: [
          {name: 'Round 1', matchList: [
              { matchTime: '2019-09-09 21 PM', home: '1팀', away: '2팀', link: '항드래곤', winner: '1팀', mvp: 'A', score: '4:3'},
              { matchTime: '2019-09-09 21 PM', home: '3팀', away: '4팀', link: '갓홍', winner: '4팀', mvp: 'B', score: '4:3' },
              { matchTime: '2019-09-09 21 PM', home: '5팀', away: '6팀', link: '소소', winner: '5팀', mvp: 'C', score: '4:3' },
              { matchTime: '2019-09-09 21 PM', home: '7팀', away: '8팀', link: '캐노', winner: '8팀', mvp: 'D', score: '4:3' },
            ]},
          {name: 'Round 2', matchList: [
              { matchTime: '2019-09-09 21 PM', home: '1팀', away: '2팀', link: '항드래곤', winner: '2팀', mvp: 'A', score: '4:3'},
              { matchTime: '2019-09-09 21 PM', home: '3팀', away: '4팀', link: '갓홍', winner: '3팀', mvp: 'B', score: '4:3' },
              { matchTime: '2019-09-09 21 PM', home: '5팀', away: '6팀', link: '소소', winner: '6팀', mvp: 'C', score: '4:3' },
              { matchTime: '2019-09-09 21 PM', home: '7팀', away: '8팀', link: '캐노', winner: '7팀', mvp: 'D', score: '4:3' },
            ]},
          ],
        teamList: [
          { name: '1팀', leader1: 'A', leader2: 'B',
            score: { cntWin: 10, cntLose: 0, cntWinSet: 60, cntLoseSet: 0,  cntAceMatch: 0 },
            members: [
              { tear: '1', users: [{id: 'test', name: 'A', tribe: 'terran'}, {id: 'test1', name: 'B', tribe: 'zerg'}]},
              { tear: '2', users: [{id: 'test2', name: 'C', tribe: 'protoss'}, {id: 'test5', name: 'F', tribe: 'zerg'}]},
              { tear: '3', users: [{id: 'test3', name: 'D', tribe: 'terran'}, {id: 'test6', name: 'G', tribe: 'zerg'}]},
              { tear: '4', users: [{id: 'test4', name: 'E', tribe: 'terran'}, {id: 'test7', name: 'H', tribe: 'zerg'}]},
          ]},
          { name: '2팀', leader1: 'B', leader2: 'A',
            score: { cntWin: 9, cntLose: 1, cntWinSet: 50, cntLoseSet: 10,  cntAceMatch: 0 },
            members: [
              { tear: '1', users: [{id: 'test', name: 'A', tribe: 'terran'}, {id: 'test1', name: 'B', tribe: 'zerg'}]},
              { tear: '2', users: [{id: 'test2', name: 'C', tribe: 'protoss'}, {id: 'test5', name: 'F', tribe: 'zerg'}]},
              { tear: '3', users: [{id: 'test3', name: 'D', tribe: 'terran'}, {id: 'test6', name: 'G', tribe: 'zerg'}]},
              { tear: '4', users: [{id: 'test4', name: 'E', tribe: 'terran'}, {id: 'test7', name: 'H', tribe: 'zerg'}]},
            ]},
          { name: '3팀', leader1: 'C', leader2: 'D',
            score: { cntWin: 8, cntLose: 2, cntWinSet: 40, cntLoseSet: 10,  cntAceMatch: 5 },
            members: [
              { tear: '1', users: [{id: 'test', name: 'A', tribe: 'terran'}, {id: 'test1', name: 'B', tribe: 'zerg'}]},
              { tear: '2', users: [{id: 'test2', name: 'C', tribe: 'protoss'}, {id: 'test5', name: 'F', tribe: 'zerg'}]},
              { tear: '3', users: [{id: 'test3', name: 'D', tribe: 'terran'}, {id: 'test6', name: 'G', tribe: 'zerg'}]},
              { tear: '4', users: [{id: 'test4', name: 'E', tribe: 'terran'}, {id: 'test7', name: 'H', tribe: 'zerg'}]},
            ]},
          { name: '4팀', leader1: 'E', leader2: 'F',
            score: { cntWin: 7, cntLose: 3, cntWinSet: 10, cntLoseSet: 10,  cntAceMatch: 5 },
            members: [
              { tear: '1', users: [{id: 'test', name: 'A', tribe: 'terran'}, {id: 'test1', name: 'B', tribe: 'zerg'}]},
              { tear: '2', users: [{id: 'test2', name: 'C', tribe: 'protoss'}, {id: 'test5', name: 'F', tribe: 'zerg'}]},
              { tear: '3', users: [{id: 'test3', name: 'D', tribe: 'terran'}, {id: 'test6', name: 'G', tribe: 'zerg'}]},
              { tear: '4', users: [{id: 'test4', name: 'E', tribe: 'terran'}, {id: 'test7', name: 'H', tribe: 'zerg'}]},
            ]},
          { name: '5팀', leader1: 'G', leader2: 'H',
            score: { cntWin: 6, cntLose: 4, cntWinSet: 10, cntLoseSet: 10,  cntAceMatch: 5 },
            members: [
              { tear: '1', users: [{id: 'test', name: 'A', tribe: 'terran'}, {id: 'test1', name: 'B', tribe: 'zerg'}]},
              { tear: '2', users: [{id: 'test2', name: 'C', tribe: 'protoss'}, {id: 'test5', name: 'F', tribe: 'zerg'}]},
              { tear: '3', users: [{id: 'test3', name: 'D', tribe: 'terran'}, {id: 'test6', name: 'G', tribe: 'zerg'}]},
              { tear: '4', users: [{id: 'test4', name: 'E', tribe: 'terran'}, {id: 'test7', name: 'H', tribe: 'zerg'}]},
            ]},
          { name: '6팀', leader1: 'A', leader2: 'B',
            score: { cntWin: 5, cntLose: 5, cntWinSet: 10, cntLoseSet: 10,  cntAceMatch: 5 },
            members: [
              { tear: '1', users: [{id: 'test', name: 'A', tribe: 'terran'}, {id: 'test1', name: 'B', tribe: 'zerg'}]},
              { tear: '2', users: [{id: 'test2', name: 'C', tribe: 'protoss'}, {id: 'test5', name: 'F', tribe: 'zerg'}]},
              { tear: '3', users: [{id: 'test3', name: 'D', tribe: 'terran'}, {id: 'test6', name: 'G', tribe: 'zerg'}]},
              { tear: '4', users: [{id: 'test4', name: 'E', tribe: 'terran'}, {id: 'test7', name: 'H', tribe: 'zerg'}]},
            ]},
          { name: '7팀', leader1: 'C', leader2: 'D',
            score: { cntWin: 4, cntLose: 6, cntWinSet: 10, cntLoseSet: 10,  cntAceMatch: 5 },
            members: [
              { tear: '1', users: [{id: 'test', name: 'A', tribe: 'terran'}, {id: 'test1', name: 'B', tribe: 'zerg'}]},
              { tear: '2', users: [{id: 'test2', name: 'C', tribe: 'protoss'}, {id: 'test5', name: 'F', tribe: 'zerg'}]},
              { tear: '3', users: [{id: 'test3', name: 'D', tribe: 'terran'}, {id: 'test6', name: 'G', tribe: 'zerg'}]},
              { tear: '4', users: [{id: 'test4', name: 'E', tribe: 'terran'}, {id: 'test7', name: 'H', tribe: 'zerg'}]},
            ]},
          { name: '8팀', leader1: 'E', leader2: 'F',
            score: { cntWin: 3, cntLose: 7, cntWinSet: 10, cntLoseSet: 10,  cntAceMatch: 5 },
            members: [
              { tear: '1', users: [{id: 'test', name: 'A', tribe: 'terran'}, {id: 'test1', name: 'B', tribe: 'zerg'}]},
              { tear: '2', users: [{id: 'test2', name: 'C', tribe: 'protoss'}, {id: 'test5', name: 'F', tribe: 'zerg'}]},
              { tear: '3', users: [{id: 'test3', name: 'D', tribe: 'terran'}, {id: 'test6', name: 'G', tribe: 'zerg'}]},
              { tear: '4', users: [{id: 'test4', name: 'E', tribe: 'terran'}, {id: 'test7', name: 'H', tribe: 'zerg'}]},
            ]},
        ],
      }
    },
    methods: {
      /*async getAllUserList () {
        await this.$lcordAPI.user.getAllUsers()
          .then((resp) => {
            this.userList = resp
          })
      },*/
      /*convertTearName(level) {
        if (level == '1') {
          return 'GOD'
        } else if (level == '2') {
          return 'HUMAN'
        } else if (level == '3') {
          return 'Animal'
        } else if (level == '4') {
          return 'Amoeba'
        } else  {
          return 'None'
        }
      },
      convertLeaderType(team, name) {
        if (team.leader1 == name) {
          return 'leader1'
        } else if (team.leader2 == name) {
          return 'leader2'
        } else {
          return ''
        }
      },
      convertWinner(winner, team) {
        if (winner == team) {
          return 'winner'
        } else {
          return ''
        }
      },*/

      /*showModalDetail (name, match, isEdit) {
        this.$modal.show(DemoSizeModal,
          { title: name + ' ' + match.home + ' vs ' + match.away,
            match: match,
            membersAway: this.getMembers(match.away),
            membersHome: this.getMembers(match.home),
            isEdit: isEdit,
          },
          {
            clickToClose: !isEdit,
          }
          )
      },*/

      /*getMembers (teamName) {
        let index = this.teamList.findIndex( x => x.name === teamName)
        let members = this.teamList[index].members
        let userList = []
        for (let i = 0; i < members.length; i++) {
          let users = members[i].users
          for (let j = 0; j < users.length; j++) {
            userList.push(users[j])
          }
        }
        return userList
      },*/

      getBattleList () {
        this.selectedBattle = null
        this.$lcordAPI.battle.getListByProgress(this.isProgressing)
          .then((resp) => {
            this.battleList = resp
          })
      },

      getRecordListByBattleId (battleId) {
        this.$lcordAPI.record.getAllRecordsByBattleId(battleId)
          .then(resp => {
            this.recordList = resp
        })
      },

      getRankerListByBattleId (battleId) {
        this.$lcordAPI.record.getRankersByBattleId(battleId)
          .then(resp => {
            this.rankerList = resp
          })
      },
      refreshRecord () {
        this.getRecordListByBattleId(this.selectedBattle._id)
        this.getRankerListByBattleId(this.selectedBattle._id)
      }
    },
    beforeMount() {
      this.getBattleList()
    },
    computed: {
      sortedRanking: function () {
        let retList = this.rankerList

        retList.sort(function (a, b) {
          return a.total.winScore > b.total.winScore ? -1 : a.total.winScore < b.total.winScore ? 1 : 0
        })

        return retList
      }
    },
    watch: {
      isProgressing: function () {
        this.getBattleList()
      },
      selectedBattle: function (newVal) {
        if (newVal != null) {
          this.getRecordListByBattleId(newVal._id)
          this.getRankerListByBattleId(newVal._id)
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
  /*.root > div {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .leader1 {
    border: solid red 1px;
  }
  .leader2 {
    border: solid blue 1px;
  }
  .winner {
    color: white;
    font-weight: bold;
    background: #00B7FF;
    margin: 0px;
  }
  .rankArea {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .container-team-list {
    display: flex; flex-direction: row; align-items: center; justify-content: space-around;
    flex-wrap: wrap; margin-bottom: 50px;
  }
  .container-team-list > div { width: 12%}

  .btn { max-width: 150px; padding: 6px }*/
</style>
