<template>
  <div style="text-align: center">
    <h2>전적 편집</h2>
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

      <div class="footer">
        <button @click="cancelEdit">취소</button>
        <button @click="delRecord">삭제</button>
        <button @click="updateRecord">확인</button>
      </div>
    </div>
  <v-dialog/>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Datepicker from 'vuejs-datepicker'
  import {en, ko} from 'vuejs-datepicker/dist/locale'
  export default {
    name: "modal_editRecord",
    props: ['record'],
    components: {Datepicker},
      data () {
      return {
        languages: [en, ko],
        dateFormat: 'yyyy-MM-dd',
        mDateFormat: 'YYYY-MM-DD',
        mapName: '',
        battleList: [],
        userList: [],
        mapList: [],
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
      userSearchLabel ({userName, bNetId, tribe}) {
        //return `${userName}(${bNetId.split(' ')[0]})`
        let cvtTribe = `${tribe}`.slice(0,1).toUpperCase()
        return `${userName} `+ cvtTribe + ` (${bNetId})`
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

      closeModal () {
        this.$modal.hide('loading-modal')
        this.$EventBus.$emit('refRecordList')
        this.$emit('close')
      },
      cancelEdit () {
        this.$emit('close')
      },
      delRecord () {
        this.$lcordAPI.record.delete(this.record._id)
        this.$modal.show('dialog', {
          title: '전적 삭제',
          text: '해당 전적을 삭제하시겠습니까?',
          buttons: [
            {
              title: '취소',
              handler: () => {
                this.$modal.hide('dialog')
              }
            },
            {
              title: '확인',
              handler: () => {
                this.$lcordAPI.record.delete(this.record._id)
                  .then(() => {
                    this.$modal.hide('dialog')
                    this.closeModal()
                  })
              }
            }
          ]
        })
      },
      updateRecord () {
        this.$modal.show('loading-modal')
        this.$lcordAPI.record.update(this.recordData)
          .then(() => {
            this.$toast.success('업데이트 완료', {position: 'top'})
            this.closeModal()
          })
      },
    },
    mounted() {
      this.getMapList()
      this.getAllUserList()
      this.getBattleList()
      //this.getAllRecords()
    },
    computed: {
      ...mapGetters({
        userDBIndex: 'getUserDBIndex',
      }),
      recordData: function () {
        return this.record
      }
    }
  }
</script>

<style scoped>
  .contents-container { height: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: center; }
  .container-info { display: flex; flex-direction: row; align-items: center; justify-content: center; height: 45px; }
  .info-input { width: 310px; }
  .input-area { display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 20px;}
  .footer { width: 100%; display: flex; flex-direction: row; justify-content: space-around; align-items: center;}
  button { width: 200px; }
  label { width: 150px; text-align: right; margin-right: 15px; }
  input { font-size: 12px; padding: 10px; border: solid 1px #e8e8e8; border-radius: 5px; width: 288px;}
  select { font-size: 12px; padding: 10px; border: solid 1px #e8e8e8; border-radius: 5px; width: 310px;}
</style>
