<template>
  <div class="container-account">
    <div class="div-account-detail">
      <h2>LCORD란?</h2>
      <div class="div-detail" style="text-align: left">● LCORD(LG Craft RecorD)는 엘크(범 LG그룹 스타크래프트 인포멀)에 가입한 스타크래프트 게이머들을 위한 전적 관리 시스템입니다.
      </div>
      <div class="div-detail" style="text-align: left">● 가입자들끼리 서로의 전적을 기록하다 보면 부등호 어그로(ex: 에로스>>>제리코)의 근거로 삼을 수 있습니다.
      </div>
    </div>

    <div class="div-account-detail">
      <h2>필수 정보 입력</h2>
      <div class="div-detail">
        <h3>계정 등록</h3>
        <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center">
          <input type="text" v-model="accountParams.userId" placeholder="아이디(영문/숫자 조합)">
          <button class="btn-dup-check" @click="checkDupUserId">중복확인</button>
        </div>
        <div>
          <input type="password" v-model="accountParams.pwd" required placeholder="비밀번호">
        </div>
        <div>
          <input type="password" v-model="accountParams.pwd_confirm" required placeholder="비밀번호 확인">
        </div>
        <h3>개인 정보<i class="far fa-question-circle" title="LCORD에서 수집한 개인 정보는 사용자 구별을 위한 부수적인 수단이며, 상업적으로 사용 및 악용하지 않습니다."></i></h3>
        <div>
          <input type="text" v-model="accountParams.userName" required placeholder="이름">
        </div>
        <div>
          <input type="text" v-model="accountParams.bNetId" required placeholder="배틀넷 아이디">
        </div>

        <div>
          <vue-multiselect v-model="accountParams.tribe" placeholder="종족 선택" :options="$defs.tribes" label="name" track-by="name" selectLabel="선택" selectedLabel="선택 됨" deselectLabel="제거"></vue-multiselect>
        </div>
      </div>
    </div>

    <div class="div-account-detail">
      <h2>선택 정보 입력</h2>
      <div class="div-detail">
        <input type="number" v-model="optionalInfo.apm" placeholder="평균 APM(숫자)">
        <div style="margin-bottom: 5px">
          <vue-multiselect v-model="optionalInfo.grade" placeholder="래더 등급(시즌 평균) 선택" :options="$defs.grades" label="name" track-by="name" selectLabel="선택" selectedLabel="선택 됨" deselectLabel="제거"></vue-multiselect>
        </div>
        <textarea v-model="optionalInfo.comment" placeholder="아이엠~ 그라운드~♬ 자기소개 하기!"></textarea>
        <br>
        <button @click="createAccount">계정 생성</button>
      </div>
    </div>
    <div class="error-text">{{error}}</div>
  </div>
</template>

<script>
export default {
  name: 'CreateAccount',
  data () {
    return {
      accountParams: {
        userId: '',
        pwd: '',
        pwd_confirm: '',
        userName: '',
        bNetId: '',
        tribe: '',
        optionalInfo: {}
      },
      optionalInfo: { apm: '', grade: '', comment: '' },
    }
  },
  methods: {
    async createAccount () {
      this.accountParams.optionalInfo = this.optionalInfo
      this.$lcordAPI.user.create(this.accountParams)
        .then(() => {
          this.$router.push({name: 'Login'})
        })
    },
    async checkDupUserId () {
      if (this.accountParams.userId != '') {
        this.$lcordAPI.user.checkId(this.accountParams)
          .then(resp => {
            if (resp.isAxiosError) {
              alert('이미 등록 된 아이디입니다.')
            } else {
              alert('사용 가능한 아이디입니다.')
            }
          })
      } else {
        alert('사용하실 아이디를 입력해 주세요.')
      }
    }
  },
  beforeMount() {

  }
}
</script>

<style scoped>
  .container-account {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  .error-text {
    color: red;
    min-height: 30px;
  }
  .div-account-detail {
    width: 330px;
    border-radius: 5px;
    border: solid #545459 1px;
    margin: 10px;
    background: white;
  }
  .div-detail {
    padding: 10px;
  }
  input, textarea {
    width: 93%;
    margin-bottom: 5px;
  }
  h2 {
    background: #303033;
    color: white;
    padding: 5px;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .btn-dup-check {
    width: 100px; height: 38px; padding: 5px; font-size: 14px; margin-bottom: 5px;
  }
</style>
