<template>
  <div class="container-create-record">
    <div class="create-record-article">
      <div>
        <h4>전적 입력</h4>
        <h5>진행 중인 배틀에만 입력 가능합니다.</h5>
        <div class="contents-common">
          <div>
            <label>배틀 선택</label>
            <div>
              <vue-multiselect v-model="inputRecordCommon.battleId" placeholder="배틀 검색" label="name" track-by="name" selectLabel="선택" selectedLabel="선택 됨" deselectLabel="제거"
                               :options="battleList" :multiple="false" @select="selectBattle"/>
            </div>
          </div>

          <div>
            <label>경기 날짜</label>
            <div style="display: flex; justify-content: center">
              <b-form-datepicker id="input-date" v-model="inputRecordCommon.date"></b-form-datepicker>
            </div>
          </div>

          <div>
            <label>방송 URL</label>
            <div>
              <b-form-input class="info-input-url" type="url" v-model="inputRecordCommon.videoLink" placeholder="방송 링크 url 입력"/>
            </div>
          </div>
        </div>

        <hr>
        <div v-if="inputRecordCommon.battleId.isRound === undefined">
          배틀을 선택해 주세요.
        </div>
        <!--팀 리그 방식 선택 하는 경우-->
        <div v-else-if="inputRecordCommon.battleId.isRound === true">
          <b-container>
            <b-row>
              <b-col>
                <b-form-group
                  label="라운드 선택"
                  label-cols-sm="4"
                  label-cols-lg="4"
                  label-for="input-round">
                  <b-form-select id="input-round" v-model="inputRecordCommon.battleId.roundCount" :options="$defs.roundOptions"></b-form-select>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group
                  label="LEFT 팀 선택"
                  label-cols-sm="4"
                  label-cols-lg="4"
                  label-for="input-round">
                  <b-form-select id="input-team-left" v-model="leftTeam" :options="teamList"></b-form-select>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group
                  label="RIGHT 팀 선택"
                  label-cols-sm="4"
                  label-cols-lg="4"
                  label-for="input-round">
                  <b-form-select id="input-team-right" v-model="rightTeam" :options="teamList"></b-form-select>
                </b-form-group>
              </b-col>
            </b-row>
          </b-container>

          <div v-show="leftTeam != null && rightTeam != null">
            <b-button size="sm" @click="cloneRecord"><i class="far fa-clone"></i> 작성 중인 내용 복제</b-button>

            <table style="width: 100%; margin-top: 5px;">
              <colgroup>
                <col span="1" style="width: 2%">
                <col span="1" style="width: 10%">
                <col span="1" style="width: 14%">
                <col span="1" style="width: 21%">
                <col span="1" style="width: 21%">
                <col span="1" style="width: 6%">
                <col span="1" style="width: 6%">
              </colgroup>
              <thead>
              <tr>
                <th></th><th>타입</th><th>맵</th><th>{{getTeamName(leftTeam)}}</th><th>{{getTeamName(rightTeam)}}</th><th>승리 팀</th><th>삭제</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(recordData, index) in inputRecordDataList">
                <td>{{index + 1}}</td>
                <td>
                  <b-form-select size="sm" v-model="recordData.battleType" :options="$defs.teamGameTypeList"></b-form-select>
                </td>
                <td>
                  <div>
                    <vue-multiselect v-model="recordData.map" placeholder="맵 검색" label="name" track-by="name" selectLabel="선택" selectedLabel="선택 됨" deselectLabel="제거" :options="mapList" :multiple="false"></vue-multiselect>
                  </div>
                </td>
                <td>
                  <div>
                    <vue-multiselect v-model="recordData.leftPlayers" placeholder="이름 검색" track-by="userName" selectLabel="추가" selectedLabel="선택 됨" deselectLabel="제거"
                                     :options="userList" :multiple="true" :taggable="true" @select="addLeftPlayers(recordData)" :custom-label="userSearchLabel" :show-labels="false"></vue-multiselect>
                  </div>
                </td>
                <td>
                  <div>
                    <vue-multiselect v-model="recordData.rightPlayers" placeholder="이름 검색" label="userName" track-by="userName" selectLabel="추가" selectedLabel="선택 됨" deselectLabel="제거"
                                     :options="userList" :multiple="true" :taggable="true" @select="addRightPlayers(recordData)" :custom-label="userSearchLabel" :show-labels="false"></vue-multiselect>
                  </div>
                </td>
                <td>
                  <b-form-select size="sm" v-model="recordData.winTeam" :options="teamLeftRight"></b-form-select>
                </td>
                <td>
                  <b-button size="sm" variant="danger" @click="delRecord(index)">DEL</b-button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <br>

          <b-button variant="success" class="btn-full-width" @click="uploadRecordTeam">
            <i class="fas fa-file-upload"/> 팀 전적 업로드
          </b-button>
        </div>
        <!--팀 리그 방식 아닌 경우-->
        <div v-else>
          <b-button size="sm" @click="cloneRecord"><i class="far fa-clone"></i> 작성 중인 내용 복제</b-button>

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
                  <b-form-select v-model="recordData.battleType" :options="$defs.gameTypeList"></b-form-select>
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
                  <b-button size="sm" @click="changeResult(recordData)"><i class="fas fa-exchange-alt"></i>변경</b-button>
                </td>
                <td>
                  <div>
                    <vue-multiselect v-model="recordData.losers" placeholder="이름 검색" label="userName" track-by="userName" selectLabel="추가" selectedLabel="선택 됨" deselectLabel="제거"
                                     :options="userList" :multiple="true" :taggable="true" @select="addLosers(recordData)" :custom-label="userSearchLabel" :show-labels="false"></vue-multiselect>
                  </div>
                </td>
                <td>
                  <b-button size="sm" variant="danger" @click="delRecord(index)">DEL</b-button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <br>

          <b-button variant="success" class="btn-full-width" @click="uploadRecord">
            <i class="fas fa-file-upload"/> 전적 업로드
          </b-button>
        </div>
      </div>

      <hr>
      <div>
        <h4>맵 추가</h4>
        <b-input-group prepend="경기 하신 맵이 없다면 추가해주세요." style="margin-top: 1rem">
          <b-form-input type="text" v-model="mapName" placeholder="맵이름만 입력"/>
        </b-input-group>
        <div>
          <b-button class="btn-full-width" @click="addMap"><i class="fas fa-file-upload"/> ADD MAP</b-button>
        </div>
      </div>
    </div>

    <div class="create-record-article">
      <h4>최근 입력 한 50개 전적 (Refresh로 중복 확인!)</h4>
      <b-button style="width: 100%;" @click="getAllRecords"><i class="fas fa-sync-alt"/> Refresh</b-button>
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
        leftTeam: null,
        rightTeam: null,
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

      selectBattle (battle) {
        if (battle.isRound) {
          this.initTeamBattleRecord()
        } else {
          this.initRecord()
        }
      },

      getTeamName (teamId) {
        let teamList = this.inputRecordCommon.battleId.teamList
        let index = teamList.findIndex(x => x._id === teamId)
        if (index > -1) return teamList[index].name
        else return ''
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

      addLeftPlayers (recordData) {
        if (recordData.leftPlayers.length > recordData.battleType) {
          recordData.leftPlayers.splice(0, 1)
        }
      },

      addRightPlayers (recordData) {
        if (recordData.rightPlayers.length > recordData.battleType) {
          recordData.rightPlayers.splice(0, 1)
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

      uploadRecordTeam() {
        if (this.inputRecordCommon.battleId == '') {
          this.$toast.warning('배틀을 선택하지 않으셨습니다.', {position: 'top'})
        } else {
          if (this.userDBIndex == '') {
            this.$toast.info('로그인이 필요한 서비스입니다. 로그인 화면으로 이동합니다.', {position: 'top'})
            this.$router.push({name: 'Login'})
          } else {
            let tempList = []
            this.inputRecordDataList.reverse()
            for (let i = this.inputRecordDataList.length - 1; i > -1; i--) {
              let record = this.inputRecordDataList[i]
              if (record.winners.length == 0 || record.losers.length == 0 || record.map == '') {
                this.$toast.warning('필수 항목(맵, 승/패자) 확인 바랍니다.', {position: 'top'})
                break
              } else {
                let recordData = { ...record, ...this.inputRecordCommon }
                tempList.push(recordData)
              }
            }
            this.$modal.show('loading-modal')

            this.$lcordAPI.record.createMany(tempList)
              .then((resp) => {
                this.$modal.hide('loading-modal')

                if (resp.isAxiosError) {
                  this.$toast.warning('입력 오류 발생', {position: 'top'})
                } else {
                  //recordTeam에 추가

                  let reqObj = {
                    battle: this.inputRecordCommon.battleId._id,
                    date: this.inputRecordCommon.date,
                    roundNum: this.inputRecordCommon.battleId.roundCount,
                    leftTeam: this.teamLeftRight[1],
                    rightTeam: this.teamLeftRight[2],
                    recordList: resp,
                    mvp: null,
                    videoLink: this.inputRecordCommon.videoLink,
                  }

                  this.$lcordAPI.recordTeam.create(reqObj)

                  this.inputRecordDataList = []
                  this.getAllRecords()
                  this.initRecord()
                }
              })
          }
        }
      },

      initRecord() {
        this.inputRecordDataList = []

        this.inputRecordCommon.writer = this.userDBIndex
        let template = { battleType: 0, map: '', winners: [], losers: [], roundNum: 0, }
        this.inputRecordDataList.push(template)
      },

      initTeamBattleRecord() {
        this.inputRecordDataList = []

        this.inputRecordCommon.writer = this.userDBIndex

        this.inputRecordDataList.push({ battleType: 12, map: '', leftPlayers: [], rightPlayers: [], winTeam: null })
        this.inputRecordDataList.push({ battleType: 10, map: '', leftPlayers: [], rightPlayers: [], winTeam: null })
        this.inputRecordDataList.push({ battleType: 14, map: '', leftPlayers: [], rightPlayers: [], winTeam: null })
        this.inputRecordDataList.push({ battleType: 11, map: '', leftPlayers: [], rightPlayers: [], winTeam: null })
        this.inputRecordDataList.push({ battleType: 13, map: '', leftPlayers: [], rightPlayers: [], winTeam: null })
        this.inputRecordDataList.push({ battleType: 14, map: '', leftPlayers: [], rightPlayers: [], winTeam: null })
        this.inputRecordDataList.push({ battleType: 15, map: '', leftPlayers: [], rightPlayers: [], winTeam: null })
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
          this.$toast.info('최소 1개의 입력 항목이 있어야 합니다.', {position: 'top'})
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
      }),

      teamList: function () {
        let retList = [{text:'선택', value:null}]
        if (this.inputRecordCommon.battleId != '') {
          let teamList = this.inputRecordCommon.battleId.teamList
          teamList.forEach(team => {
            retList.push({text:team.name, value:team._id})
          })
        }
        return retList
      },

      teamLeftRight: function () {
        let leftId = this.leftTeam
        let leftIndex = this.teamList.findIndex(x => x.value === leftId)

        let rightId = this.rightTeam
        let rightIndex = this.teamList.findIndex(x => x.value === rightId)

        return [this.teamList[0], this.teamList[leftIndex], this.teamList[rightIndex]]
      }
    },
    filters: {
    }
  }
</script>

<style scoped>
  .btn-full-width { width: 100%; margin: .75rem 0; }
  .contents-common { display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%; margin: 10px 0px;}
  .contents-common > div { width: 30%; }
</style>
