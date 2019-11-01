<template>
  <div>
    <h3>전적 입력</h3>
    <h4>(진행 중인 리그만 입력 가능)</h4>

    <table>
      <thead>
      <tr>
        <th>경기 날짜</th>
        <th>리그 선택</th><th>맵 선택</th><th>Battle Type</th>
        <th><label>승자</label></th>
        <th><label>패자</label></th>
        <th>방송 URL(필수아님)</th>
        <th>입력</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td><datepicker v-model="recordData.date" :language="languages[1]" :format="dateFormat"></datepicker></td>
        <td>
          <div class="user-container">
            <vue-multiselect v-model="recordData.leagueList" placeholder="리그 검색" label="name" track-by="name" selectLabel="선택" selectedLabel="선택 됨" deselectLabel="제거" :options="leagueList" :multiple="false"></vue-multiselect>
          </div>
        </td>
        <td>
          <div class="user-container">
            <vue-multiselect v-model="recordData.map" placeholder="맵 이름 검색" label="name" track-by="name" selectLabel="선택" selectedLabel="선택 됨" deselectLabel="제거" :options="mapList" :multiple="false"></vue-multiselect>
          </div>
        </td>
        <td>
          <div>
            <select v-model="recordData.battleType">
              <option v-for="type in $defs.battleTypeList" :value="type.type">{{type.name}}</option>
            </select>
          </div>
        </td>
        <td>
          <div class="user-container">
            <vue-multiselect v-model="recordData.winners" placeholder="이름 검색" track-by="userName" selectLabel="추가" selectedLabel="선택 됨" deselectLabel="제거"
                             :options="userList" :multiple="true" :taggable="true" @select="addWinners" :custom-label="userSearchLabel" :show-labels="false"></vue-multiselect>
          </div>
        </td>
        <td>
          <div class="user-container">
            <vue-multiselect v-model="recordData.losers" placeholder="이름 검색" label="userName" track-by="userName" selectLabel="추가" selectedLabel="선택 됨" deselectLabel="제거"
                             :options="userList" :multiple="true" :taggable="true" @select="addLosers" :custom-label="userSearchLabel" :show-labels="false"></vue-multiselect>
          </div>
        </td>
        <td>
          <div>
            <input type="url" v-model="recordData.videoLink" placeholder="방송 링크 url 입력">
          </div>
        </td>
        <td>
          <div>
            <button @click="addRecord">전송</button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>

    <hr style="border-color: rgba(0, 0, 0, 0.1); margin: 10px;">

    <h3>맵 추가</h3>
    <h4>경기 하신 맵이 없다면 추가해주세요.</h4>
    <div>
      <input type="text" v-model="mapName" placeholder="맵이름만 입력"><button @click="addMap">add map</button>
    </div>

    <hr style="border-color: rgba(0, 0, 0, 0.1); margin: 10px;">

    <div>
      <h3>최근 입력 된 전적 <button @click="getAllRecords">refresh</button></h3>
      <h4>(Refresh로 확인 하고 중복 확인한 뒤 입력 할 것!)</h4>
      <label>
        (<label>구분 : </label>
        <label class="terran">테란</label>
        <label class="zerg">저그</label>
        <label class="protoss">플토</label>
        <label class="random">랜덤</label>
        )
      </label>
      <table>
        <thead>
        <tr>
          <th>경기 날짜</th>
          <th>리그</th><th>맵</th><th>Battle Type</th>
          <th><label>승자</label></th>
          <th><label>패자</label></th>
          <th>방송 URL</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="record in recordList">
          <td>{{record.date | moment(mDateFormat)}}</td>
          <td>{{record.leagueId.name}}</td>
          <td>{{record.map.name}}</td>
          <td>{{setBattleType(record.battleType)}}</td>
          <td><label v-for="user in record.winners" class="user-label" :class="user.tribe">{{user.userName}}</label></td>
          <td><label v-for="user in record.losers" class="user-label" :class="user.tribe">{{user.userName}}</label></td>
          <td>{{record.videoLink}}</td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Datepicker from 'vuejs-datepicker'
  import {en, ko} from 'vuejs-datepicker/dist/locale'
  export default {
    name: "CreateRecord",
    components: {Datepicker},
    data () {
      return {
        languages: [en, ko],
        dateFormat: 'yyyy-MM-dd',
        mDateFormat: 'YYYY-MM-DD',
        mapName: '',
        leagueList: [],
        userList: [],
        mapList: [],
        recordList: [],
        recordData: { leagueId: '', battleType: 0, winners: [], losers: [], date: new Date(), map: '', videoLink: '', writer: '' },
        //battleType: '',
      }
    },
    methods: {
      getMapList () {
        this.$lcordAPI.map.getAllMaps()
          .then((resp) => {
            this.mapList = resp
          })
      },
      getAllUserList () {
        this.$lcordAPI.user.getAllUsers()
          .then((resp) => {
            this.userList = resp
          })
      },
      getLeagueList () {
        this.$lcordAPI.league.getListByProgress(true) //진행중인 리그에만 입력 가능
          .then((resp) => {
            this.leagueList = resp
          })
      },
      getAllRecords () {
        this.recordList = []
        this.$lcordAPI.record.getAllRecords()
          .then((resp) => {
            this.recordList = resp
          })
      },

      addMap () {
        if (this.mapName != '') {
          this.$lcordAPI.map.create(this.mapName)
            .then(() => {
              this.getMapList()
              alert('맵 추가 완료!')
            })
        } else {
          alert('맵 이름을 입력해 주세요. -_-')
        }
      },

      userSearchLabel ({userName, bNetId, tribe}) {
        return `${userName}(${bNetId})`
      },

      addWinners () {
        if (this.recordData.winners.length > this.recordData.battleType) {
          this.recordData.winners.splice(0, 1)
        }
      },
      addLosers () {
        if (this.recordData.losers.length > this.recordData.battleType) {
          this.recordData.losers.splice(0, 1)
        }
      },

      addRecord() {
        if (this.recordData.leagueId == '' || this.recordData.winners.length == 0 || this.recordData.losers.length == 0 || this.recordData.map == '') {
          alert('필수 항목 확인 바랍니다.')
        } else {
          this.recordData.writer = this.userDBIndex
          this.$lcordAPI.record.create(this.recordData)
            .then((resp) => {
              if (resp.isAxiosError) {
                alert('필수 항목 확인 바랍니다.')
              } else {
                this.recordData.map = ''
                this.recordData.battleType = 0
                this.recordData.winners = []
                this.recordData.losers = []
                this.getAllRecords()
              }
            })
        }
      },

      setBattleType (index) {
        return this.$defs.battleTypeList[index].name
      },
    },
    mounted() {
      this.getMapList()
      this.getAllUserList()
      this.getLeagueList()
      this.getAllRecords()

      this.recordData.battleType = 0
    },
    computed: {
      ...mapGetters({
        userDBIndex: 'getUserDBIndex',
      })
    }
  }
</script>

<style scoped>
  .user-container {
    width: 200px;
    margin: auto;
  }

  .user-label {
    margin: 5px;
  }

  .vdp-datepicker {
    position: relative;
    text-align: center;
    width: 100%;
  }

  .container-btn {
    margin: 0px;
    width: 100px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
</style>
