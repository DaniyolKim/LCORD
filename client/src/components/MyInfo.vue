<template>
  <div class="container-my-info">
    <h3>플레이어 정보 <button @click="updateMyInfo">업데이트</button></h3>
    <div class="div-account-detail about">
      <h2>필수 정보</h2>
      <div class="container-info"><label>ID</label><label style="text-align: center">{{accountParams.userId}}</label></div>
      <div class="container-info"><label>이름</label><input type="text" v-model="accountParams.userName" required placeholder="이름"></div>
      <div class="container-info"><label>배틀넷 아이디</label><input type="text" v-model="accountParams.bNetId" required placeholder="배틀넷 아이디"></div>
      <div class="container-info"><label>아프리카 TV 아이디</label><input type="text" v-model="accountParams.afreecaId" required placeholder="아프리카 TV 아이디"></div>
      <div class="container-info"><label>별명</label><input type="text" v-model="accountParams.nickName" required placeholder="별명"></div>
      <div class="container-info"><label>종족</label><div class="container-multiselect"><vue-multiselect v-model="cvtTribe" placeholder="종족 선택" :options="$defs.tribes" label="name" track-by="name" selectLabel="선택" selectedLabel="선택 됨" deselectLabel="제거"></vue-multiselect></div></div>
      <div class="container-info"><label>티어</label><div class="container-multiselect"><vue-multiselect v-model="cvtTier" placeholder="티어 선택" :options="$defs.tierList" label="name" track-by="name" selectLabel="선택" selectedLabel="선택 됨" deselectLabel="제거"></vue-multiselect></div></div>
      <div class="container-info"><label>가입일</label><label style="text-align: center">{{accountParams.created_date | moment(mDateFormat)}}</label></div>
    </div>
    <br>
    <div class="div-account-detail about">
      <h2>선택 정보</h2>
      <div class="container-info"><label>평균 APM</label><input type="number" v-model="optionalInfo.apm" required placeholder="평균 APM(숫자)"></div>
      <div class="container-info"><label>래더 등급</label><div class="container-multiselect"><vue-multiselect v-model="cvtGrade" placeholder="래더 등급(시즌 평균) 선택" :options="$defs.grades" label="name" track-by="name" selectLabel="선택" selectedLabel="선택 됨" deselectLabel="제거"></vue-multiselect></div></div>
      <div class="container-info"><label>소개</label><textarea style="width: 210px" v-model="optionalInfo.comment" placeholder="아이엠~ 그라운드~♬ 자기소개 하기!"></textarea></div>
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
      accountParams: null,
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
      this.$lcordAPI.user.getInfo(this.userDBIndex)
        .then(resp => {
          this.accountParams = resp
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
    },
    updateMyInfo () {
      this.accountParams.optionalInfo = this.optionalInfo
      this.$lcordAPI.user.update(this.accountParams)
        .then(() => {
          this.$toast.success('업데이트 성공', {position: 'top'})
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
        yaxis: { min: 0, max: 5, tickAmount: 5 },
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
    cvtTribe: function () {
      let index = this.$defs.tribes.findIndex(x => x.val == this.accountParams.tribe)
      return this.$defs.tribes[index]
    },
    cvtGrade: function () {
      let index = this.$defs.grades.findIndex(x => x.val == this.optionalInfo.grade)
      return this.$defs.grades[index]
    },
    cvtTier: function () {
      let index = this.$defs.tierList.findIndex(x => x.type == this.accountParams.tier)
      return this.$defs.tierList[index]
    }
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
  .container-info { display: flex; flex-direction: row; align-items: center; justify-content: center; height: 45px; }
  .container-multiselect { width: 217px; }
  button { padding: 5px 10px; }
  label { width: 150px; text-align: right; margin-right: 15px; }
</style>
