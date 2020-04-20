<template>
  <div class="container-table">
    <table>
      <thead>
      <tr>
        <th :class="{ active: sortKey === 'writer'}" @click="sortRecordList('writer')">
          <div>작성자<span class="arrow" :class="sortOrder['writer'] > 0 ? 'asc' : 'dsc'"/>
            <br><input v-model="ft_writer" type="search" v-on:click.stop="sortRecordList" placeholder="데이터의">
          </div>
        </th>
        <th :class="{ active: sortKey === 'date'}" @click="sortRecordList('date')">
          <div>경기 날짜<span class="arrow" :class="sortOrder['date'] > 0 ? 'asc' : 'dsc'"/>
            <br><input v-model="ft_date" type="search" v-on:click.stop="sortRecordList" placeholder="값을">
          </div>
        </th>
        <th v-if="showBattleName" :class="{ active: sortKey === 'battleName'}" @click="sortRecordList('battleName')">
          <div>배틀 이름<span class="arrow" :class="sortOrder['battleName'] > 0 ? 'asc' : 'dsc'"/>
            <br><input v-model="ft_battleName" type="search" v-on:click.stop="sortRecordList" placeholder="~~">
          </div>

        </th>
        <th :class="{ active: sortKey === 'battleType'}" @click="sortRecordList('battleType')">
          <div>배틀 타입<span class="arrow" :class="sortOrder['battleType'] > 0 ? 'asc' : 'dsc'"/>
            <br><input v-model="ft_battleType" type="search" v-on:click.stop="sortRecordList" placeholder="클릭하면">
          </div>

        </th>
        <th :class="{ active: sortKey === 'map'}" @click="sortRecordList('map')">
          <div>맵<span class="arrow" :class="sortOrder['map'] > 0 ? 'asc' : 'dsc'"/>
            <br><input v-model="ft_map" type="search" v-on:click.stop="sortRecordList" placeholder="필터링">
          </div>

        </th>
        <th :class="{ active: sortKey === 'winner'}" @click="sortRecordList('winner')">
          <div>승자<span class="arrow" :class="sortOrder['winner'] > 0 ? 'asc' : 'dsc'"/>
            <br><input v-model="ft_winner" type="search" v-on:click.stop="sortRecordList" placeholder="적용">
          </div>

        </th>
        <th :class="{ active: sortKey === 'loser'}" @click="sortRecordList('loser')">
          <div>패자<span class="arrow" :class="sortOrder['loser'] > 0 ? 'asc' : 'dsc'"/>
            <br><input v-model="ft_loser" type="search" v-on:click.stop="sortRecordList" placeholder="됩니다^^">
          </div>
        </th>
        <th :class="{ active: sortKey === 'videoLink'}" @click="sortRecordList('videoLink')">
          <div>방송 URL<span class="arrow" :class="sortOrder['videoLink'] > 0 ? 'asc' : 'dsc'"/>
          </div>
        </th>
        <th>편집</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="record in sortedRecords">
        <td @click="setFilter('writer', record.writer)">{{record.writer}}</td>
        <td @click="setFilter('date', record.date)">{{record.date}}</td>
        <td v-if="showBattleName" @click="setFilter('battleName', record.battleName)">{{record.battleName}}</td>
        <td @click="setFilter('battleType', record.battleType)">{{record.battleType}}</td>
        <td @click="setFilter('map', record.map)">{{record.map}}</td>
        <td @click="setFilter('winner', record.winner)"><label class="user-label" >{{record.winner}}</label></td>
        <td @click="setFilter('loser', record.loser)"><label class="user-label" >{{record.loser}}</label></td>
        <td><a v-if="record.videoLink != ''" :href="record.videoLink" target="_blank">click to move</a></td>
        <td><button @click="editRecord(record)">편집</button></td>
      </tr>
      </tbody>
    </table>
    <modals-container></modals-container>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import modalEditRecord from "./modalEditRecord";
  export default {
    name: "vueRecordList",
    props: ['recordList', 'showBattleName'],
    components: { modalEditRecord},
    data () {
      return {
        mDateFormat: 'YYYY-MM-DD',
        sortKeyList: ['writer', 'date', 'battleName', 'battleType', 'map', 'winner', 'loser', 'videoLink'],
        sortKey: '',
        sortOrder: { writer: 1, date: 1, battleName: 1, battleType: 1, map: 1, winner: 1, loser: 1, videoLink: 1 },
        ft_writer: '', ft_date: '', ft_battleName: '', ft_battleType: '', ft_map: '', ft_winner: '', ft_loser: '',
      }
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
            a = a[sortKey].toString()
            b = b[sortKey].toString()

            return (a.length - b.length) * order || (a.localeCompare(b)) * order
            /*if (sortKey == 'writer' || sortKey == 'battleName' || sortKey == 'map' || sortKey == 'winner' || sortKey == 'loser') {
              return (a.length - b.length) * order || (a.localeCompare(b)) * order
            } else {
              return (a > b ? -1 : a < b ? 1 : 0) * order
            }*/
          })
        }
      },

      setFilter (filter, value) {
        if (filter == 'writer') {
          this.ft_writer = value
        } else if (filter == 'date') {
          this.ft_date = value
        } else if (filter == 'battleType') {
          this.ft_battleType = value
        } else if (filter == 'map') {
          this.ft_map = value
        } else if (filter == 'winner') {
          this.ft_winner = value
        } else if (filter == 'loser') {
          this.ft_loser = value
        } else {
          this.ft_battleName = value
        }
      },

      parseRecordList () {
        let retList = []
        this.recordList.forEach(record => {
          let pushObj = {
            writer: record.writer.userName,
            date: this.$moment(record.date).format(this.mDateFormat),
            battleName: record.battleId.name,
            battleType: this.$defs.gameTypeList[record.battleType].name,
            map: record.map.name,
            winner: this.parseUserName(record.winners),
            loser: this.parseUserName(record.losers),
            videoLink: record.videoLink
          }
          retList.push(pushObj)
        })
        return retList
      },

      parseUserName (userList) {
        let retString = ''
        userList.forEach(user => {
          retString += user.userName + '(' + user.tribe.substring(0, 1).toUpperCase() + ') '
        })
        return retString
      }
    },

    computed: {
      ...mapGetters({
        userDBIndex: 'getUserDBIndex',
      }),
      sortedRecords: function () {
        let retList = this.parseRecordList()

        let filter = {}
        if (this.ft_writer != '') filter.writer = this.ft_writer
        if (this.ft_date != '') filter.date = this.ft_date
        if (this.ft_battleName != '') filter.battleName = this.ft_battleName
        if (this.ft_battleType != '') filter.battleType = this.ft_battleType
        if (this.ft_map != '') filter.map = this.ft_map
        if (this.ft_winner != '') filter.winner = this.ft_winner
        if (this.ft_loser != '') filter.loser = this.ft_loser

        retList = retList.filter(function(item) {
          for (let key in filter) {
            if (item[key] != filter[key]) {
              return false
            }
          }
          return true
        })

        let sortKey = this.sortKey
        let order = this.sortOrder[sortKey] || 1
        this.recordListCompare(sortKey, order, retList)

        return retList
      },
    },
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

  input[type=search] { font-size: 12px; padding: 5px; width: 90px; border: solid 1px #e8e8e8; border-radius: 5px; margin: 3px 0;}
</style>
