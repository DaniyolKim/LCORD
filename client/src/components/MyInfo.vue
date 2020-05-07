<template>
  <div class="container-my-info">
    <h3>플레이어 정보</h3>
    <div class="div-account-detail about">
      <h2>필수 정보</h2>
      <div class="container-info"><label>ID</label><input type="text" v-model="accountParams.userId" required placeholder="로그인 ID"></div>
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
      <h2>배틀 불참 여부</h2>
      <div>멸망전 같은 팀 리그는 참여 여부를 기준으로 팀 빌딩을 합니다.</div>
      <div>부득이한 사정으로 불참하시게 되는 리그를 선택/추가해 주세요.</div>
      <div class="container-info"><label>배틀 목록</label>
        <div class="container-multiselect">
          <vue-multiselect v-model="accountParams.nonAttendanceBattles" placeholder="배틀 선택" label="name" track-by="name" selectLabel="선택" selectedLabel="선택 됨" deselectLabel="제거" :options="battleList" :multiple="true" :taggable="true"></vue-multiselect>
        </div>
      </div>
    </div>
    <br>
    <button class="myInfo-btn-update" @click="updateMyInfo">플레이어 정보 업데이트</button>
    <br>
    <div class="div-account-detail about">
      <h2>Password 변경</h2>
      <div class="container-info"><label>Password 입력</label><input type="text" v-model="pwd" required></div>
    </div>
    <br>
    <button class="myInfo-btn-update" @click="updatePassword">Password 업데이트</button>
    <br>

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
      pwd: '',

      ability: '',
      vsRecords: '',

      battleList: [],
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
    },
    updatePassword () {
      if (this.pwd == '') {
        this.$toast.error('Password를 입력해 주세요.', {position: 'top'})
      } else {
        let reqData = { pwd: this.pwd }
        this.$lcordAPI.user.updatePwd(this.userDBIndex, reqData)
          .then(() => {
            this.$toast.success('업데이트 성공', {position: 'top'})
          })
      }
    },
    getBattleList () {
      this.selectedBattle = null
      this.$lcordAPI.battle.getListByProgress(true)
        .then((resp) => {
          this.battleList = resp
        })
    },
  },
  mounted() {
    if (this.$commAPI.isAuth() == false) {
      this.$router.push({name: 'Login'})
    }
    this.getUserInfo()
    this.getUserAbilities()
    this.getWinRateOfUser()
    this.getBattleList()
  },
  computed: {
    ...mapGetters({
      userId: 'getUserId',
      userDBIndex: 'getUserDBIndex',
    }),
    cvtTribe: {
      get: function () {
        let index = this.$defs.tribes.findIndex(x => x.val == this.accountParams.tribe)
        return this.$defs.tribes[index]
      },
      set: function (newValue) {
        this.accountParams.tribe = newValue.val
      }
    },
    cvtGrade: {
      get: function () {
        let index = this.$defs.grades.findIndex(x => x.val == this.optionalInfo.grade)
        return this.$defs.grades[index]
      },
      set: function (newValue) {
        this.optionalInfo.grade = newValue.val
      }
    },
    cvtTier: {
      get: function () {
        let index = this.$defs.tierList.findIndex(x => x.type == this.accountParams.tier)
        return this.$defs.tierList[index]
      },
      set: function (newValue) {
        this.accountParams.tier = newValue.type
      }
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
