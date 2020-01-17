<template>
  <div class="container-create-record">
    <div class="create-record-article">
      <div>
        <h3>맵 추가</h3>
        <h4>경기 하신 맵이 없다면 추가해주세요.</h4>
        <div>
          <input type="text" v-model="mapName" placeholder="맵이름만 입력"><button class="header-button" @click="addMap">add map</button>
        </div>
      </div>
      <hr>
      <div>
        <h3>전적 입력<button class="header-button" @click="getAllUserList">User refresh</button></h3>
        <label>(진행 중인 리그만 입력 가능)</label>
        <div class="contents-container">
          <div class="input-area">
            <div class="container-info">
              <label>경기 날짜</label>
              <div class="info-input">
                <datepicker v-model="recordData.date" :language="languages[1]" :format="dateFormat"></datepicker>
              </div>
            </div>
            <div class="container-info">
              <label>배틀 선택</label>
              <div class="info-input">
                <vue-multiselect v-model="recordData.battleId" placeholder="배틀 검색" label="name" track-by="name" selectLabel="선택" selectedLabel="선택 됨" deselectLabel="제거" :options="battleList" :multiple="false"></vue-multiselect>
              </div>
            </div>
            <div class="container-info">
              <label>맵 선택</label>
              <div class="info-input">
                <vue-multiselect v-model="recordData.map" placeholder="맵 검색" label="name" track-by="name" selectLabel="선택" selectedLabel="선택 됨" deselectLabel="제거" :options="mapList" :multiple="false"></vue-multiselect>
              </div>
            </div>
            <div class="container-info">
              <label>배틀 타입</label>
              <select v-model="recordData.battleType">
                <option v-for="type in $defs.gameTypeList" :value="type.type">{{type.name}}</option>
              </select>
            </div>
            <div class="container-info">
              <label>승자</label>
              <div class="info-input">
                <vue-multiselect v-model="recordData.winners" placeholder="이름 검색" track-by="userName" selectLabel="추가" selectedLabel="선택 됨" deselectLabel="제거"
                                 :options="userList" :multiple="true" :taggable="true" @select="addWinners" :custom-label="userSearchLabel" :show-labels="false"></vue-multiselect>
              </div>
            </div>
            <div class="container-info">
              <label>패자</label>
              <div class="info-input">
                <vue-multiselect v-model="recordData.losers" placeholder="이름 검색" label="userName" track-by="userName" selectLabel="추가" selectedLabel="선택 됨" deselectLabel="제거"
                                 :options="userList" :multiple="true" :taggable="true" @select="addLosers" :custom-label="userSearchLabel" :show-labels="false"></vue-multiselect>
              </div>
            </div>
            <div class="container-info">
              <label>방송 URL</label>
              <div class="info-input">
                <input type="url" v-model="recordData.videoLink" placeholder="방송 링크 url 입력">
              </div>
            </div>
          </div>
        </div>
        <button style="width: 51%" @click="addRecord">전적 추가</button>
      </div>
    </div>

    <div class="create-record-article">
      <div>
        <h3>최근 입력 된 전적(최근 추가 된 50개)<button class="header-button" @click="getAllRecords">Refresh</button></h3>
        <label>(Refresh로 중복 확인한 뒤 입력 할 것!)</label>
        <vue-record-list :record-list="recordList" :show-battle-name="true" style="height: 770px;"></vue-record-list>
      </div>
    </div>
    <modals-container/>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Datepicker from 'vuejs-datepicker'
  import {en, ko} from 'vuejs-datepicker/dist/locale'
  import VueRecordList from '../module/vueRecordList'
  export default {
    name: "CreateRecord",
    components: {Datepicker, VueRecordList},
    data () {
      return {
        languages: [en, ko],
        dateFormat: 'yyyy-MM-dd',
        mDateFormat: 'YYYY-MM-DD',
        mapName: '',
        battleList: [],
        userList: [],
        mapList: [],
        recordList: [],
        recordData: { battleId: '', battleType: 0, roundNum: 0, winners: [], losers: [], date: new Date(), map: '', videoLink: '', writer: '' },
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
      getBattleList () {
        this.$lcordAPI.battle.getListByProgress(true) //진행중인 리그에만 입력 가능
          .then((resp) => {
            this.battleList = resp
          })
      },
      getAllRecords () {
        this.$modal.show('loading-modal')
        this.$lcordAPI.record.getAllRecords()
          .then((resp) => {
            this.$modal.hide('loading-modal')
            this.recordList = resp
          })
      },

      addMap () {
        if (this.mapName != '') {
          this.$lcordAPI.map.create(this.mapName)
            .then(() => {
              this.getMapList()
              this.$toast.info('맵 추가 완료', {position: 'top'})
            })
        } else {
          this.$toast.warning('맵 이름을 입력해 주세요.', {position: 'top'})
        }
      },

      userSearchLabel ({userName, bNetId, tribe}) {
        //return `${userName}(${bNetId.split(' ')[0]})`
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
        if (this.recordData.battleId == '' || this.recordData.winners.length == 0 || this.recordData.losers.length == 0 || this.recordData.map == '') {
          this.$toast.warning('필수 항목 확인 바랍니다.', {position: 'top'})
        } else {
          if (this.userDBIndex == '') {
            this.$toast.info('로그인이 필요한 서비스입니다. 로그인 화면으로 이동합니다.', {position: 'top'})
            this.$router.push({name: 'Login'})
          } else {
            this.$modal.show('loading-modal')

            this.recordData.writer = this.userDBIndex
            this.$lcordAPI.record.create(this.recordData)
              .then((resp) => {
                this.$modal.hide('loading-modal')

                if (resp.isAxiosError) {
                  this.$toast.warning('필수 항목 확인 바랍니다.', {position: 'top'})
                } else {
                  this.recordData.map = ''
                  this.recordData.battleType = 0
                  this.recordData.winners = []
                  this.recordData.losers = []
                  this.getAllRecords()
                }
              })
          }
        }
      },
    },
    mounted() {
      this.getMapList()
      this.getAllUserList()
      this.getBattleList()
      this.getAllRecords()

      this.recordData.battleType = 0

      this.$EventBus.$on('refRecordList', () => {
        this.getAllRecords()
      })
    },
    computed: {
      roundList: function () {
        let retArray = []
        if (this.recordData.battleId != null) {
          if (this.recordData.battleId.isRound) {
            for (let i = 0; i < this.recordData.battleId.roundCount; i++) {
              retArray.push(i + 1)
            }
          }
        }
        return retArray
      },
      ...mapGetters({
        userDBIndex: 'getUserDBIndex',
      })
    },
    filters: {
      getBattleName(battleInfo) {
        if (battleInfo != undefined) {
          return battleInfo.name
        } else {
          return ''
        }
      }
    }
  }
</script>

<style scoped>
  button { padding: 5px 10px; }
  .header-button { margin-left: 15px; }
  .contents-container { height: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: center; }
  .container-info { display: flex; flex-direction: row; align-items: center; justify-content: center; height: 45px; }
  .info-input { width: 310px; }
  .input-area { display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 20px;}
  label { width: 150px; text-align: right; margin-right: 15px; }
  input { font-size: 16px; padding: 10px; border: solid 1px #e8e8e8; border-radius: 5px; width: 288px;}
  select { font-size: 16px; padding: 10px; border: solid 1px #e8e8e8; border-radius: 5px; width: 310px;}
  /*.user-container {
    width: 200px;
    margin: auto;
  }

  .user-label {
    margin: 5px;
  }

  .btn-record-page { max-width: 150px; padding: 6px }*/
</style>
