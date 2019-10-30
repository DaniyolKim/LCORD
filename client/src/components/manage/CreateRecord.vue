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
          <div>
            <select v-model="recordData.leagueId">
              <option v-for="league in leagueList" :value="league._id">{{league.name}}</option>
            </select>
          </div>
        </td>
        <td>
          <div>
            <select v-model="recordData.map">
              <option v-for="map in mapList" :value="map._id">{{map.name}}</option>
            </select>
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
          <div>
            <vue-multiselect v-model="recordData.winners" tag-placeholder="Add this as new tag" placeholder="Search or add a tag" label="userName" track-by="userName" :options="userList" :multiple="true" :taggable="true" @select="addWinners"></vue-multiselect>
          </div>
        </td>
        <td>
          <div>
            <vue-multiselect v-model="recordData.losers" tag-placeholder="Add this as new tag" placeholder="Search or add a tag" label="userName" track-by="userName" :options="userList" :multiple="true" :taggable="true" @select="addLosers"></vue-multiselect>
          </div>
        </td>
        <td>
          <div>
            <input type="url" v-model="recordData.videoLink" placeholder="방송 링크 url 입력">
          </div>
        </td>
        <td>
          <button @click="addRecord">전송</button>
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
          <td><label v-for="user in record.winners" class="user-label">{{user.userName}}</label></td>
          <td><label v-for="user in record.losers" class="user-label">{{user.userName}}</label></td>
          <td>{{record.videoLink}}</td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
  import Datepicker from 'vuejs-datepicker'
  import {en, ko} from 'vuejs-datepicker/dist/locale'
  import VueMultiselect from "vue-multiselect/src/Multiselect";
  export default {
    name: "CreateRecord",
    components: {VueMultiselect, Datepicker},
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
        recordData: { leagueId: '', battleType: 0, winners: [], losers: [], date: new Date(), map: '', videoLink: '' },
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
        this.$lcordAPI.map.create(this.mapName)
          .then(() => {
            this.getMapList()
          })
      },

      addWinners (newTag) {
        if (this.recordData.winners.length > this.recordData.battleType) {
          this.recordData.winners.splice(0, 1)
        }
      },
      addLosers (newTag) {
        if (this.recordData.losers.length > this.recordData.battleType) {
          this.recordData.losers.splice(0, 1)
        }
      },

      addRecord() {
        if (this.recordData.leagueId == '' || this.recordData.winners.length == 0 || this.recordData.losers.length == 0 || this.recordData.map == '') {
          alert('필수 항목 확인 바랍니다.')
        } else {
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

  .user-label {
    margin: 5px;
  }

  .vdp-datepicker {
    position: relative;
    text-align: center;
    width: 100%;
  }
</style>
