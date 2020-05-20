<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="container-table">
    <vue-good-table
      style="text-align: center;"
      :columns="columns"
      :rows="clonedRecordList"
      :line-numbers="true"
      :sort-options="{
        enabled: true,
        initialSortBy: {field: 'date', type: 'desc'}
      }"
      @on-row-click="editRecord"
      :pagination-options="{
        enabled: true,
        perPage: 25,
        perPageDropdown: [10, 15, 20, 25, 30],
        mode: 'pages'
      }"
      theme="black-rhino">
    </vue-good-table>
    <b-modal id="bModalEditRecord" size="lg" title="전적 편집" scrollable centered no-close-on-backdrop="true"
             :header-bg-variant="'dark'"
             :header-text-variant="'light'">
      <div style="height: 45vh; display: flex; flex-direction: column; justify-content: center;">
        <b-form-group label-cols="4" label-cols-lg="2" label="경기 날짜" label-for="input-date" label-align="right">
          <b-form-datepicker id="input-date" v-model="selectedRecord.date"></b-form-datepicker>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="2" label="배틀 선택" label-for="input-battle" label-align="right">
          <b-form-select id="input-battle" v-model="selectedRecord.battleIndex" :options="battleList"></b-form-select>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="2" label="맵 선택" label-for="input-map" label-align="right">
          <b-form-select id="input-map" v-model="selectedRecord.mapId" :options="mapList"></b-form-select>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="2" label="배틀 타입" label-for="input-battle-type" label-align="right">
          <b-form-select id="input-battle-type" v-model="selectedRecord.battleType" :options="battleTypeList"></b-form-select>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="2" label="승자" label-for="input-winners" label-align="right">
          <vue-multiselect v-model="selectedRecord.winners" placeholder="이름 검색" track-by="userName" selectLabel="추가" selectedLabel="선택 됨" deselectLabel="제거"
                           :options="playerList" :multiple="true" :taggable="true" @select="addWinners" :custom-label="userSearchLabel" :show-labels="false"></vue-multiselect>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="2" label="패자" label-for="input-losers" label-align="right">
          <vue-multiselect v-model="selectedRecord.losers" placeholder="이름 검색" label="userName" track-by="userName" selectLabel="추가" selectedLabel="선택 됨" deselectLabel="제거"
                           :options="playerList" :multiple="true" :taggable="true" @select="addLosers" :custom-label="userSearchLabel" :show-labels="false"></vue-multiselect>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="2" label="방송 URL" label-for="input-video" label-align="right">
          <b-form-input id="input-video" type="text" v-model="selectedRecord.videoLink"></b-form-input>
        </b-form-group>
      </div>
      <template v-slot:modal-footer="{ ok, cancel, hide }">
        <!-- Button with custom close trigger value -->
        <b-button variant="danger" @click="delRecord()">삭제</b-button>
        <!-- Emulate built in modal footer ok and cancel button actions -->
        <b-button variant="outline-secondary" @click="cancel()">취소</b-button>
        <b-button variant="success" @click="updateRecord()">확인</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: "vueRecordList",
    props: {
      recordList: Array,
      showBattleName:{
        type: Boolean,
        default: true
      },
      needEdit: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        selectedRecord: '',
        playerList: Array,
        mapList: Array,
        battleList: Array,
        battleTypeList: [ { text: '개인리그', value: 0}, { text: '팀리그', value: 1}, { text: '이벤트', value: 2}],
      }
    },
    computed: {
      ...mapGetters({
        userDBIndex: 'getUserDBIndex',
      }),

      columns: function () {
        let headers =[
          {
            label: '작성자',
            field: 'writer',
            thClass: 'vgt-center-align',
            tdClass: 'vgt-center-align',
            //width: '80px',
            filterOptions: {
              enabled: true, // enable filter for this column
              placeholder: '이름', // placeholder for filter input
              filterValue: '', // initial populated value for this filter
              trigger: 'enter', //only trigger on enter not on keyup
            },
          },
          {
            label: '경기 날짜',
            field: 'date',
            thClass: 'vgt-center-align',
            tdClass: 'vgt-center-align',
            type: 'date',
            dateInputFormat: 'yyyy-MM-dd hh:mm',
            dateOutputFormat: 'yyyy-MM-dd',
            //width: '150px',
            filterOptions: {
              enabled: true, // enable filter for this column
              placeholder: '입력 후 엔터', // placeholder for filter input
              filterValue: '', // initial populated value for this filter
              trigger: 'enter', //only trigger on enter not on keyup
            },
          },
          {
            label: '맵',
            field: 'mapName',
            thClass: 'vgt-center-align',
            tdClass: 'vgt-center-align',
            //width: '100px',
            filterOptions: {
              enabled: true, // enable filter for this column
              placeholder: '입력 후 엔터', // placeholder for filter input
              filterValue: '', // initial populated value for this filter
              trigger: 'enter', //only trigger on enter not on keyup
            },
          },
          {
            label: '승자',
            field: 'winners',
            thClass: 'vgt-center-align',
            tdClass: 'vgt-center-align',
            filterOptions: {
              enabled: true, // enable filter for this column
              placeholder: '입력 후 엔터', // placeholder for filter input
              filterValue: '', // initial populated value for this filter
              trigger: 'enter', //only trigger on enter not on keyup
            },
          },
          {
            label: '패자',
            field: 'losers',
            thClass: 'vgt-center-align',
            tdClass: 'vgt-center-align',
            filterOptions: {
              enabled: true, // enable filter for this column
              placeholder: '입력 후 엔터', // placeholder for filter input
              filterValue: '', // initial populated value for this filter
              trigger: 'enter', //only trigger on enter not on keyup
            },
          },
        ]

        if (this.showBattleName) {
          let battleHeader = {
            label: '배틀 이름',
            field: 'battleName',
            thClass: 'vgt-center-align',
            tdClass: 'vgt-center-align',
            filterOptions: {
              enabled: true, // enable filter for this column
              placeholder: '입력 후 엔터', // placeholder for filter input
              filterValue: '', // initial populated value for this filter
              trigger: 'enter', //only trigger on enter not on keyup
            }
          }
          headers.splice(2, 0, battleHeader)
        }

        return headers
      },

      clonedRecordList: function () {
        let retList = []
        let recordList = JSON.parse(JSON.stringify(this.recordList))
        recordList.forEach((record, index) => {
          let recObj = {
            writer: record.writer.userName,
            date: this.$moment(record.date).format('YYYY-MM-DD hh:mm'),
            battleType: record.battleType,
            battleName: record.battleId.name,
            mapName: record.map.name,
            winners: this.getPlayersName(record.winners),
            losers: this.getPlayersName(record.losers),
            editIndex: index
          }
          retList.push(recObj)
        })
        return retList
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
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

      getPlayersName : function (userArray) {
        let retString = ''
        userArray.forEach(user => {
          retString += user.userName + '(' + this.cvtTribe(user.tribe) + ') '
        })
        return retString
      },

      editRecord (clickParam) {
        if (this.userDBIndex == '') {
          this.$toast.info('로그인 한 뒤 본인이 작성한 전적만 편집 가능합니다.', {position: 'top'})
        } else {
          let record = this.recordList[clickParam.row.editIndex]
          let index = this.battleList.findIndex(x => x.value == record.battleId._id)
          if (index < 0) {
            this.$toast.info('종료 된 배틀은 편집 할 수 없습니다.', {position: 'top'})
          } else {
            if (record.writer._id == this.userDBIndex || this.isAdmin(record.battleId.managers)) {
              this.selectedRecord = JSON.parse(JSON.stringify(record))
              this.selectedRecord.mapId = this.selectedRecord.map._id
              this.selectedRecord.battleIndex = this.selectedRecord.battleId._id
              this.$bvModal.show('bModalEditRecord')
            } else {
              this.$toast.info('관리자 또는 본인이 작성한 전적만 편집 가능합니다.', {position: 'top'})
            }
          }
        }
      },

      isAdmin (managers) {
        let myUserId = this.userDBIndex
        let index = managers.findIndex(x => x == myUserId)
        return (index == -1) ? false : true
      },

      /* modal 관련 */
      async getData() {
        this.$modal.show('loading-modal')
        this.getAllPlayerList()
        this.getMapList()
        this.getBattleList()
        this.$modal.hide('loading-modal')
      },

      async getAllPlayerList () {
        await this.$lcordAPI.user.getAllUsers()
          .then((resp) => {
            this.playerList = resp
          })
      },

      async getMapList () {
        await this.$lcordAPI.map.getAllMaps()
          .then((resp) => {
            let retList = []
            resp.forEach(map => {
              retList.push({value: map._id, text: map.name})
            })
            this.mapList = retList
          })
      },
      async getBattleList () {
        await this.$lcordAPI.battle.getListByProgress(true) //진행중인 리그에만 입력 가능
          .then((resp) => {
            let retList = []
            resp.forEach(battle => {
              retList.push({value: battle._id, text: battle.name})
            })
            this.battleList = retList
          })
      },

      userSearchLabel ({userName, bNetId, tribe}) {
        let cvtTribe = `${tribe}`.slice(0,1).toUpperCase()
        return `${userName} `+ cvtTribe + ` (${bNetId})`
      },

      addWinners () {
        if (this.selectedRecord.winners.length > this.selectedRecord.battleType) {
          this.selectedRecord.winners.splice(0, 1)
        }
      },
      addLosers () {
        if (this.selectedRecord.losers.length > this.selectedRecord.battleType) {
          this.selectedRecord.losers.splice(0, 1)
        }
      },

      //update 관련
      delRecord () {
        this.$bvModal.msgBoxConfirm('해당 전적을 정말로 삭제하시겠습니까?', {
          title: '알림',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: '확인',
          cancelTitle: '취소',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
          .then(value => {
            if (value == true) {
              this.$modal.show('loading-modal')
              this.$lcordAPI.record.delete(this.selectedRecord._id)
                .then(() => {
                  this.$modal.hide('loading-modal')
                  this.closeModal()
                })
            }
          })
      },

      updateRecord () {
        this.$modal.show('loading-modal')
        this.$lcordAPI.record.update(this.selectedRecord)
          .then(() => {
            this.$toast.success('업데이트 완료', {position: 'top'})
            this.closeModal()
          })
      },

      closeModal () {
        this.$modal.hide('loading-modal')
        this.$EventBus.$emit('refRecordList')
        this.$bvModal.hide('bModalEditRecord')
      },
      cancelEdit () {
        this.$bvModal.hide('bModalEditRecord')
      },
    },
  }
</script>

<style scoped>

</style>
