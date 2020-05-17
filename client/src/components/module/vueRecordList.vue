<template>
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
    components: { modalEditRecord },
    data () {
      return {

      }
    },
    computed: {
      ...mapGetters({
        userDBIndex: 'getUserDBIndex',
      }),

      columns: function () {
        let headers =[
          {
            label: '입력',
            field: 'writer',
            thClass: 'vgt-center-align',
            tdClass: 'vgt-center-align',
            width: '30px',
            filterOptions: {
              enabled: true, // enable filter for this column
              placeholder: '이름', // placeholder for filter input
              filterValue: '', // initial populated value for this filter
              trigger: 'enter', //only trigger on enter not on keyup
            },
          },
          {
            label: '입력 날짜',
            field: 'date',
            thClass: 'vgt-center-align',
            tdClass: 'vgt-center-align',
            type: 'date',
            dateInputFormat: 'yyyy-MM-dd hh:mm',
            dateOutputFormat: 'yyyy-MM-dd HH:mm',
            width: '85px',
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
            width: '80px',
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
    },
  }
</script>

<style scoped>

</style>
