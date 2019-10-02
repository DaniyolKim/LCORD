<template>
  <div>
    <div>
      <label>진행 중인 리그</label>
      <select v-model="leagueName">
        <option v-for="league in leagueList" value="league">{{league}}</option>
      </select>
    </div>

    <hr style="border-color: rgba(0, 0, 0, 0.1); margin: 10px;">
    <div>
      <label>리그 Info</label>
      <div>
        {{leagueInfo}}
      </div>
    </div>

    <hr style="border-color: rgba(0, 0, 0, 0.1); margin: 10px;">
    <div>
      <div>현재 순위</div>
    </div>

    <hr style="border-color: rgba(0, 0, 0, 0.1); margin: 10px;">
    <div>
      <div>진행 현황</div>
      <div v-for="round in roundList">
        <table>
          <thead>
          <tr>
            <th colspan="7">{{round.name}}</th>
          </tr>
          <tr>
            <th>날짜</th><th>Home team</th><th>Away team</th><th>Winner</th><th>Score</th><th>MVP</th><th>방송국</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="match in round.matchList">
            <td>{{match.matchTime}}</td>
            <td>{{match.home}}</td>
            <td>{{match.away}}</td>
            <td>{{match.winner}}</td>
            <td>{{match.score}}</td>
            <td>{{match.mvp}}</td>
            <td>{{match.link}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <hr style="border-color: rgba(0, 0, 0, 0.1); margin: 10px;">
    <div>
      <label>Team List</label>
      <label>
        (<label>구분 : </label>
        <label class="leader1">팀장</label>
        <label class="leader2">주장</label>
        <label> | </label>
        <label class="Terran">테란</label>
        <label class="Zerg">저그</label>
        <label class="Protoss">플토</label>
        <label class="Random">랜덤</label>
        )
      </label>

      <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-around">
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
  </div>
</template>

<script>
  export default {
    name: "LeagueIng",
    data () {
      return {
        leagueList: ['멸망전 시즌2', '휴애리그', '아메바리그 시즌3'],
        leagueName: '',
        leagueInfo: { name: '멸망전 시즌2', desc: '설명 설명', tier: 'none', status: 'ing'},
        roundList: [
          {name: 'Round 1', matchList: [
              { matchTime: '2019-09-09 21 PM', home: '1팀', away: '2팀', link: '항드래곤', winner: '1팀', mvp: 'A', score: '4:3'},
              { matchTime: '2019-09-09 21 PM', home: '3팀', away: '4팀', link: '갓홍', winner: '3팀', mvp: 'B', score: '4:3' },
              { matchTime: '2019-09-09 21 PM', home: '5팀', away: '6팀', link: '소소', winner: '5팀', mvp: 'C', score: '4:3' },
              { matchTime: '2019-09-09 21 PM', home: '7팀', away: '8팀', link: '캐노', winner: '7팀', mvp: 'D', score: '4:3' },
            ]},
          ],
        teamList: [
          { name: '1팀', leader1: 'A', leader2: 'B',
            members: [
              { tear: '1', users: [{id: 'test', name: 'A', tribe: 'Terran'}, {id: 'test1', name: 'B', tribe: 'Zerg'}]},
              { tear: '2', users: [{id: 'test2', name: 'C', tribe: 'Protoss'}, {id: 'test5', name: 'F', tribe: 'Zerg'}]},
              { tear: '3', users: [{id: 'test3', name: 'D', tribe: 'Terran'}, {id: 'test6', name: 'G', tribe: 'Zerg'}]},
              { tear: '4', users: [{id: 'test4', name: 'E', tribe: 'Terran'}, {id: 'test7', name: 'H', tribe: 'Zerg'}]},
          ]},
          { name: '2팀', leader1: 'B', leader2: 'A',
            members: [
              { tear: '1', users: [{id: 'test', name: 'A', tribe: 'Terran'}, {id: 'test1', name: 'B', tribe: 'Zerg'}]},
              { tear: '2', users: [{id: 'test2', name: 'C', tribe: 'Protoss'}, {id: 'test5', name: 'F', tribe: 'Zerg'}]},
              { tear: '3', users: [{id: 'test3', name: 'D', tribe: 'Terran'}, {id: 'test6', name: 'G', tribe: 'Zerg'}]},
              { tear: '4', users: [{id: 'test4', name: 'E', tribe: 'Terran'}, {id: 'test7', name: 'H', tribe: 'Zerg'}]},
            ]},
          { name: '3팀', leader1: 'C', leader2: 'D',
            members: [
              { tear: '1', users: [{id: 'test', name: 'A', tribe: 'Terran'}, {id: 'test1', name: 'B', tribe: 'Zerg'}]},
              { tear: '2', users: [{id: 'test2', name: 'C', tribe: 'Protoss'}, {id: 'test5', name: 'F', tribe: 'Zerg'}]},
              { tear: '3', users: [{id: 'test3', name: 'D', tribe: 'Terran'}, {id: 'test6', name: 'G', tribe: 'Zerg'}]},
              { tear: '4', users: [{id: 'test4', name: 'E', tribe: 'Terran'}, {id: 'test7', name: 'H', tribe: 'Zerg'}]},
            ]},
          { name: '4팀', leader1: 'E', leader2: 'F',
            members: [
              { tear: '1', users: [{id: 'test', name: 'A', tribe: 'Terran'}, {id: 'test1', name: 'B', tribe: 'Zerg'}]},
              { tear: '2', users: [{id: 'test2', name: 'C', tribe: 'Protoss'}, {id: 'test5', name: 'F', tribe: 'Zerg'}]},
              { tear: '3', users: [{id: 'test3', name: 'D', tribe: 'Terran'}, {id: 'test6', name: 'G', tribe: 'Zerg'}]},
              { tear: '4', users: [{id: 'test4', name: 'E', tribe: 'Terran'}, {id: 'test7', name: 'H', tribe: 'Zerg'}]},
            ]},
          { name: '5팀', leader1: 'G', leader2: 'H',
            members: [
              { tear: '1', users: [{id: 'test', name: 'A', tribe: 'Terran'}, {id: 'test1', name: 'B', tribe: 'Zerg'}]},
              { tear: '2', users: [{id: 'test2', name: 'C', tribe: 'Protoss'}, {id: 'test5', name: 'F', tribe: 'Zerg'}]},
              { tear: '3', users: [{id: 'test3', name: 'D', tribe: 'Terran'}, {id: 'test6', name: 'G', tribe: 'Zerg'}]},
              { tear: '4', users: [{id: 'test4', name: 'E', tribe: 'Terran'}, {id: 'test7', name: 'H', tribe: 'Zerg'}]},
            ]},
          { name: '6팀', leader1: 'A', leader2: 'B',
            members: [
              { tear: '1', users: [{id: 'test', name: 'A', tribe: 'Terran'}, {id: 'test1', name: 'B', tribe: 'Zerg'}]},
              { tear: '2', users: [{id: 'test2', name: 'C', tribe: 'Protoss'}, {id: 'test5', name: 'F', tribe: 'Zerg'}]},
              { tear: '3', users: [{id: 'test3', name: 'D', tribe: 'Terran'}, {id: 'test6', name: 'G', tribe: 'Zerg'}]},
              { tear: '4', users: [{id: 'test4', name: 'E', tribe: 'Terran'}, {id: 'test7', name: 'H', tribe: 'Zerg'}]},
            ]},
          { name: '7팀', leader1: 'C', leader2: 'D',
            members: [
              { tear: '1', users: [{id: 'test', name: 'A', tribe: 'Terran'}, {id: 'test1', name: 'B', tribe: 'Zerg'}]},
              { tear: '2', users: [{id: 'test2', name: 'C', tribe: 'Protoss'}, {id: 'test5', name: 'F', tribe: 'Zerg'}]},
              { tear: '3', users: [{id: 'test3', name: 'D', tribe: 'Terran'}, {id: 'test6', name: 'G', tribe: 'Zerg'}]},
              { tear: '4', users: [{id: 'test4', name: 'E', tribe: 'Terran'}, {id: 'test7', name: 'H', tribe: 'Zerg'}]},
            ]},
          { name: '8팀', leader1: 'E', leader2: 'F',
            members: [
              { tear: '1', users: [{id: 'test', name: 'A', tribe: 'Terran'}, {id: 'test1', name: 'B', tribe: 'Zerg'}]},
              { tear: '2', users: [{id: 'test2', name: 'C', tribe: 'Protoss'}, {id: 'test5', name: 'F', tribe: 'Zerg'}]},
              { tear: '3', users: [{id: 'test3', name: 'D', tribe: 'Terran'}, {id: 'test6', name: 'G', tribe: 'Zerg'}]},
              { tear: '4', users: [{id: 'test4', name: 'E', tribe: 'Terran'}, {id: 'test7', name: 'H', tribe: 'Zerg'}]},
            ]},
        ]
      }
    },
    methods: {
      convertTearName(level) {
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
      }
    }
  }
</script>

<style scoped>
  table {
    width: 98%;
    margin: 1%;
    border-collapse: collapse;
  }

  th {
    background: #f8f8f9;
  }

  th, td {
    border: solid #e5e5e5 1px;
  }

  td > div {
    min-width: 120px;
    margin: 3px;
  }

  .Terran {
    color: white;
    background: #4285f4;
  }
  .Zerg {
    color: white;
    background: purple;
  }
  .Protoss {
    color: white;
    background: green;
  }
  .Random {
    color: white;
    background: black;
  }
  .leader1 {
    border: solid red 1px;
  }
  .leader2 {
    border: solid blue 1px;
  }
</style>
