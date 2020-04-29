<template>
  <div class="container-table">
    <table>
      <thead>
      <tr>
        <th v-if="needEdit == true" :class="{ active: sortKey === 'writer'}" @click="sortRecordList('writer')">
          <div>작성자<span class="arrow" :class="sortOrder['writer'] > 0 ? 'asc' : 'dsc'"/>
          </div>
        </th>
        <th :class="{ active: sortKey === 'date'}" @click="sortRecordList('date')">
          <div>경기 날짜<span class="arrow" :class="sortOrder['date'] > 0 ? 'asc' : 'dsc'"/>
          </div>
        </th>
        <th v-if="showBattleName" :class="{ active: sortKey === 'battleId'}" @click="sortRecordList('battleId')">
          <div>배틀 이름<span class="arrow" :class="sortOrder['battleId'] > 0 ? 'asc' : 'dsc'"/>
          </div>
        </th>
        <th :class="{ active: sortKey === 'battleType'}" @click="sortRecordList('battleType')">
          <div>배틀 타입<span class="arrow" :class="sortOrder['battleType'] > 0 ? 'asc' : 'dsc'"/>
          </div>
        </th>
        <th :class="{ active: sortKey === 'map'}" @click="sortRecordList('map')">
          <div>맵<span class="arrow" :class="sortOrder['map'] > 0 ? 'asc' : 'dsc'"/>
          </div>
        </th>
        <th :class="{ active: sortKey === 'winners'}" @click="sortRecordList('winners')">
          <div>승자<span class="arrow" :class="sortOrder['winners'] > 0 ? 'asc' : 'dsc'"/>
          </div>
        </th>
        <th :class="{ active: sortKey === 'losers'}" @click="sortRecordList('losers')">
          <div>패자<span class="arrow" :class="sortOrder['losers'] > 0 ? 'asc' : 'dsc'"/>
          </div>
        </th>
        <th v-if="needEdit == true" :class="{ active: sortKey === 'videoLink'}" @click="sortRecordList('videoLink')">
          <div>방송 URL<span class="arrow" :class="sortOrder['videoLink'] > 0 ? 'asc' : 'dsc'"/>
          </div>
        </th>
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
        default: true
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
        sortKeyList: ['writer', 'date', 'battleId', 'battleType', 'map', 'winners', 'losers', 'videoLink'],
        sortKey: 'date',
        sortOrder: { writer: -1, date: 1, battleId: -1, battleType: -1, map: -1, winners: -1, losers: -1, videoLink: -1 },
      }
    },
    computed: {
      ...mapGetters({
        userDBIndex: 'getUserDBIndex',
      }),
      sortedRecords: function () {
        let retList = this.recordList

        let sortKey = this.sortKey
        let order = this.sortOrder[sortKey] || 1
        this.recordListCompare(sortKey, order, retList)

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
      },

      sortRecordList(key) {
        this.sortOrder[key] = this.sortOrder[key] * -1
        this.sortKey = key
      },

      recordListCompare (sortKey, order, retList) {
        if (sortKey != '' && sortKey.type == undefined) {
          retList.sort((a, b) => {
            if (sortKey == 'writer') {
              a = a[sortKey].userName
              b = b[sortKey].userName
            } else if (sortKey == 'battleId' || sortKey == 'map') {
              a = a[sortKey].name
              b = b[sortKey].name
            } else if (sortKey == 'winners' || sortKey == 'losers') {
              a = a[sortKey][0].userName
              b = b[sortKey][0].userName
            } else {
              a = a[sortKey].toString()
              b = b[sortKey].toString()
            }

            //return (a.length - b.length) * order || (a.localeCompare(b)) * order
            if (sortKey == 'writer' || sortKey == 'battleId' || sortKey == 'map' || sortKey == 'winners' || sortKey == 'losers') {
              return (a.length - b.length) * order || (a.localeCompare(b)) * order
            } else {
              return (a > b ? -1 : a < b ? 1 : 0) * order
            }
          })
        }
      },
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
  th.active { color: crimson; text-shadow: 0 0 1px #fff; }
  th.active .arrow { opacity: 1; }

  .arrow {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;
    margin-left: 5px;
    opacity: 0.66;
  }

  .arrow.dsc {
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid crimson;
  }

  .arrow.asc {
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid crimson;
  }
</style>
