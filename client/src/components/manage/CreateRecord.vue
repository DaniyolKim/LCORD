<template>
  <div class="container-create-record">
    <div class="create-record-article">
      <div>
        <h2>전적 입력 (진행 중인 리그만 입력 가능)</h2>
        <div class="contents-common">
          <div>
            <label>배틀 선택</label>
            <div>
              <vue-multiselect v-model="inputRecordCommon.battleId" placeholder="배틀 검색" label="name" track-by="name" selectLabel="선택" selectedLabel="선택 됨" deselectLabel="제거" :options="battleList" :multiple="false"></vue-multiselect>
            </div>
          </div>

          <div>
            <label>경기 날짜</label>
            <div style="display: flex; justify-content: center">
              <datepicker v-model="inputRecordCommon.date" :language="languages[1]" :format="dateFormat"></datepicker>
            </div>
          </div>

          <div>
            <label>방송 URL</label>
            <div>
              <input class="info-input-url" type="url" v-model="inputRecordCommon.videoLink" placeholder="방송 링크 url 입력">
            </div>
          </div>
        </div>

        <hr>
        <button @click="cloneRecord"><i class="far fa-clone"></i> 작성 중인 내용 복제</button>

        <div style="margin-top: 5px;">
          <table style="width: 100%">
            <thead>
            <tr>
              <th>타입</th><th>맵</th><th>승자</th><th>승/패</th><th>패자</th><th>삭제</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(recordData, index) in inputRecordDataList">
              <td>
                <select v-model="recordData.battleType">
                  <option v-for="type in $defs.gameTypeList" :value="type.type">{{type.name}}</option>
                </select>
              </td>
              <td>
                <div>
                  <vue-multiselect v-model="recordData.map" placeholder="맵 검색" label="name" track-by="name" selectLabel="선택" selectedLabel="선택 됨" deselectLabel="제거" :options="mapList" :multiple="false"></vue-multiselect>
                </div>
              </td>
              <td>
                <div>
                  <vue-multiselect v-model="recordData.winners" placeholder="이름 검색" track-by="userName" selectLabel="추가" selectedLabel="선택 됨" deselectLabel="제거"
                                   :options="userList" :multiple="true" :taggable="true" @select="addWinners(recordData)" :custom-label="userSearchLabel" :show-labels="false"></vue-multiselect>
                </div>
              </td>
              <td>
                <button @click="changeResult(recordData)"><i class="fas fa-exchange-alt"></i>변경</button>
              </td>
              <td>
                <div>
                  <vue-multiselect v-model="recordData.losers" placeholder="이름 검색" label="userName" track-by="userName" selectLabel="추가" selectedLabel="선택 됨" deselectLabel="제거"
                                   :options="userList" :multiple="true" :taggable="true" @select="addLosers(recordData)" :custom-label="userSearchLabel" :show-labels="false"></vue-multiselect>
                </div>
              </td>
              <td>
                <button @click="delRecord(index)">DEL</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <br>

        <button style="width: 100%;background-color: #4285f4; margin-top: 15px;" @click="uploadRecord">
          <i class="fas fa-file-upload"/> 전적 업로드
        </button>
      </div>

      <hr>
      <div>
        <h2>맵 추가</h2>
        <h4>경기 하신 맵이 없다면 추가해주세요.</h4>
        <div>
          <input type="text" v-model="mapName" placeholder="맵이름만 입력"><button class="header-button" @click="addMap">add map</button>
        </div>
      </div>
    </div>

    <div class="create-record-article">
      <h2>최근 입력 한 50개 전적 (Refresh로 중복 확인!)</h2>
      <button style="margin: 2px; width: 100%; background-color: #4285f4" @click="getAllRecords"><i class="fas fa-sync-alt"/> Refresh</button>
      <div class="create-record-list-container">
        <vue-record-list :record-list="recordList"></vue-record-list>
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
        inputRecordDataList: [],
        inputRecordCommon: { battleId: '', date: new Date(), videoLink: '', writer: '' },
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
        let cvtTribe = `${tribe}`.slice(0,1).toUpperCase()
        return `${userName} `+ cvtTribe + ` (${bNetId})`
      },

      addWinners (recordData) {
        if (recordData.winners.length > recordData.battleType) {
          recordData.winners.splice(0, 1)
        }
      },

      addLosers (recordData) {
        if (recordData.losers.length > recordData.battleType) {
          recordData.losers.splice(0, 1)
        }
      },

      uploadRecord() {
        if (this.inputRecordCommon.battleId == '') {
          this.$toast.warning('배틀을 선택하지 않으셨습니다.', {position: 'top'})
        } else {
          if (this.userDBIndex == '') {
            this.$toast.info('로그인이 필요한 서비스입니다. 로그인 화면으로 이동합니다.', {position: 'top'})
            this.$router.push({name: 'Login'})
          } else {
            this.inputRecordDataList.reverse()
            for (let i = this.inputRecordDataList.length - 1; i > -1; i--) {
              let record = this.inputRecordDataList[i]
              if (record.winners.length == 0 || record.losers.length == 0 || record.map == '') {
                this.$toast.warning('필수 항목(맵, 승/패자) 확인 바랍니다.', {position: 'top'})
                break
              } else {
                let recordData = { ...record, ...this.inputRecordCommon }

                this.$modal.show('loading-modal')

                this.$lcordAPI.record.create(recordData)
                  .then((resp) => {
                    this.$modal.hide('loading-modal')

                    if (resp.isAxiosError) {
                      this.$toast.warning('입력 오류 발생', {position: 'top'})
                    } else {
                      this.inputRecordDataList.splice(this.inputRecordDataList.length -1, 1)
                      if (this.inputRecordDataList.length == 0) {
                        this.getAllRecords()
                        this.initRecord()
                      }
                    }
                  })
              }
            }
          }
        }
      },

      initRecord() {
        this.inputRecordCommon.writer = this.userDBIndex
        let template = { battleType: 0, map: '', winners: [], losers: [], roundNum: 0, }
        this.inputRecordDataList.push(template)
      },

      cloneRecord() {
        let lastIndex = this.inputRecordDataList.length - 1
        let clonedObj = JSON.parse(JSON.stringify(this.inputRecordDataList[lastIndex]))
        this.inputRecordDataList.push(clonedObj)
      },

      delRecord(index) {
        if (this.inputRecordDataList.length > 1) {
          this.inputRecordDataList.splice(index, 1)
        } else {
          this.$toast.info('입력 건이 최소 1개는 있어야 합니다.', {position: 'top'})
        }
      },

      changeResult(recordData) {
        let tempWinners = JSON.parse(JSON.stringify(recordData.winners))
        let tempLosers = JSON.parse(JSON.stringify(recordData.losers))

        recordData.winners = tempLosers
        recordData.losers = tempWinners
      }
    },
    mounted() {
      this.getMapList()
      this.getAllUserList()
      this.getBattleList()
      this.getAllRecords()

      this.initRecord()

      this.$EventBus.$on('refRecordList', () => {
        this.getAllRecords()
      })
    },
    beforeDestroy() {
        /*this.$EventBus.$off('refRecordList')*/
    },
    computed: {
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
  /*.contents-container { height: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: center; }*/
  .contents-common { display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%; margin: 10px 0px;}
  .contents-common > div { width: 30%; }
  .container-info { display: flex; flex-direction: row; align-items: center; justify-content: center; height: 45px; }
  .input-area { display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 20px;}
</style>
