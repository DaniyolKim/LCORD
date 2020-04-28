<template>
  <div class="container-table">
    <table>
      <thead>
      <tr>
        <th v-if="needEdit == true">작성자</th>
        <th>경기 날짜</th>
        <th v-if="showBattleName">배틀 이름</th><th>배틀 타입</th><th>맵</th>
        <th><label>승자</label></th><th><label>패자</label></th>
        <th v-if="needEdit == true">방송 URL</th>
        <th v-if="needEdit == true">편집</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="record in sortedRecords">
        <td v-if="needEdit == true">{{record.writer.userName}}</td>
        <td>{{record.date | moment(mDateFormat)}}</td>
        <td v-if="showBattleName">{{record.battleId |getBattleName}}</td>
        <td>{{$defs.gameTypeList[record.battleType].name}}</td>
        <td>{{record.map.name}}</td>
        <td><label v-for="user in record.winners" class="user-label" :class="user.tribe">{{user.userName}}({{user.tribe | cvtTribe}})</label></td>
        <td><label v-for="user in record.losers" class="user-label" :class="user.tribe">{{user.userName}}({{user.tribe | cvtTribe}})</label></td>
        <td v-if="needEdit == true"><a v-if="record.videoLink != ''" :href="record.videoLink" target="_blank">click to move</a></td>
        <td v-if="needEdit == true"><button @click="editRecord(record)">편집</button></td>
      </tr>
      </tbody>
    </table>
    <modals-container v-if="needEdit == true"></modals-container>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import modalEditRecord from "./modalEditRecord";
  export default {
    name: "vueRecordList",
    props: {
      recordList: Array,
      showBattleName:{
        type: Boolean,
        default: false
      },
      needEdit: {
        type: Boolean,
        default: true
      }
    },
    components: { modalEditRecord},
    data () {
      return {
        mDateFormat: 'YYYY-MM-DD',
      }
    },
    computed: {
      ...mapGetters({
        userDBIndex: 'getUserDBIndex',
      }),
      sortedRecords: function () {
        let retList = this.recordList
        return retList
      },
    },
    methods: {
      editRecord (record) {
        if (this.userDBIndex == '') {
          this.$toast.info('로그인 한 뒤 본인이 작성한 전적만 편집 가능합니다.', {position: 'top'})
        } else {
          if (record.writer._id == this.userDBIndex || this.isAdmin(record.battleId.managers)) {
            this.$modal.show(modalEditRecord,
              { record: record },
              {
                width: '700px',
                height: '470px',
                clickToClose: false,
                root: this.$root
              }
            )
          } else {
            this.$toast.info('관리자 또는 본인이 작성한 전적만 편집 가능합니다.', {position: 'top'})
          }
        }
      },
      isAdmin (managers) {
        let myUserId = this.userDBIndex
        let index = managers.findIndex(x => x == myUserId)
        return (index == -1) ? false : true
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
      },
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
</style>
