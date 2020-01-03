<template>
  <div class="container-my-info">
    <h3>플레이어 정보</h3>
    <div class="div-account-detail about">
      <h2>필수 정보</h2>
      <div>ID : {{userInfo.userId}}</div>
      <div>이름 : {{userInfo.userName}}</div>
      <div>배틀넷 아이디 : {{userInfo.bNetId}}</div>
      <div>아프리카 TV 아이디 : {{userInfo.afreecaId}}</div>
      <div>별명 : {{userInfo.nickName}}</div>
      <div>종족 : {{userInfo.tribe}}</div>
      <div>가입일 : {{userInfo.created_date | moment(mDateFormat)}} </div>
    </div>
    <br>
    <div class="div-account-detail about">
      <h2>선택 정보</h2>
      <div>평균 APM : {{optionalInfo.apm | checkValue}}</div>
      <div>래더 등급 : {{optionalInfo.grade | checkValue}}</div>
      <div>소개 : {{optionalInfo.comment | checkValue}}</div>
    </div>
    <br>
    <div class="div-account-detail about">
      <h2>평가 정보</h2>
      <div style="display: flex; flex-direction: row; justify-content: space-around; align-items: center; height: 300px; padding: 15px;">
        <apexchart type=radar height="100%" :options="chartOptionsStats" :series="chartSeriesStats"></apexchart>
        <apexchart type=radar height="100%" :options="chartOptionsVS" :series="chartSeriesVS"></apexchart>
      </div>
    </div>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
export default {
  name: 'MyInfo',

  data () {
    return {
      userInfo: null,
      optionalInfo: null,
      mDateFormat: 'YYYY-MM-DD',

      ability: '',
      vsRecords: '',

      chartOptionsVS: {
        title: { text: '종족별 승률', align: 'center', },
        labels: ['Terran', 'Zerg', 'Protoss'],
        yaxis: { min: 0, max: 100, tickAmount: 2 },
        chart: { toolbar: {  show: false }},
        theme: { palette: 'palette8' } // upto palette10
      },
    }
  },
  methods: {
    getUserInfo () {
      this.$lcordAPI.user.getInfo(this.userId)
        .then(resp => {
          this.userInfo = resp
          this.optionalInfo = resp.optionalInfo
        })
    },
    getUserAbilities () {
      this.$lcordAPI.ability.getAbilityOfUser(this.userDBIndex)
        .then(resp => {
          this.ability = resp
        })
    },
    getWinRateOfUser () {
      this.$lcordAPI.record.getWinRateOfUser(this.userDBIndex)
        .then(resp => {
          this.vsRecords = resp
        })
    }
  },
  mounted() {
    if (this.$commAPI.isAuth() == false) {
      this.$router.push({name: 'Login'})
    }
    this.getUserInfo()
    this.getUserAbilities()
    this.getWinRateOfUser()
  },
  computed: {
    ...mapGetters({
      userId: 'getUserId',
      userDBIndex: 'getUserDBIndex',
    }),
    chartOptionsStats: function() {
      let retObj = {
        title: { text: 'Total 능력치 : ' + this.ability.totalScore, align: 'center', },
        labels: ['빌드', '컨트롤', '판단', '자원 관리', '확장능력'],
        yaxis: { min: 0, max: 5, tickAmount: 4 },
        chart: { toolbar: {  show: false }},
        theme: { palette: 'palette7' } // upto palette10
      }
      return retObj
    },
    chartSeriesStats: function () {
      let retObj = [{ name: "",
        data: this.ability.summary
      }]

      return retObj
    },
    chartSeriesVS: function () {
      let retObj = [{ name: "종족별 승률(%)",
        data: this.vsRecords.summary
      }]
      return retObj
    },
  },
  filters: {
    checkValue: function (val) {
      if (val == '' || val == 0) {
        return '정보 없음'
      } else {
        return val
      }
    }
  }
}
</script>

<style scoped>

</style>
