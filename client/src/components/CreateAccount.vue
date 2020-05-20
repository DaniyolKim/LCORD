<template>
  <div class="container-account">
    <div>
      <div class="div-account-detail info">
        <h4>LCORD란?</h4>
        <ul>
          <li>LCORD(LG Craft RecorD)는 엘크(범 LG그룹 스타크래프트 인포멀)에 가입한 스타크래프트 게이머들을 위한 전적 관리 시스템입니다.</li>
          <li>가입자들끼리 서로의 전적을 기록하다 보면 부등호 어그로(ex: 아무나 >>> 제리코)의 근거로 삼을 수 있습니다.</li>
          <br>
          <div style="font-weight: bold;">*참고 사항*</div>
          <li><b>배틀 :</b> 일반적으로 사용하는 리그 경기를 통칭합니다. 관리자만이 배틀의 정보를 편집할 수 있습니다. 배틀을 생성한 사람이 관리자가 되며, 생성자가 임의의 가입자를 관리자에 추가 할 수 있습니다.</li>
          <li><b>전적 :</b> 배틀을 기반으로 가입자들간의 승/패 결과를 기입합니다. 결과를 베이스로 팀/플레이어의 순위를 알 수 있습니다.</li>
          <li>전적입력 시 가입 안한 플레이어는 추가 할 수 없습니다. 상대 플레이어의 가입 독려 부탁 드립니다.^^</li>
          <li><b>방송 URL :</b> 방송 경기의 경우 기입하며, 경기를 다시보기 할 수 있는 Web 경로입니다.</li>
          <li><b>악의적으로 전적을 조작하는 행위는 금지하며, 적발시 계정 삭제 합니다.</b></li>
        </ul>
      </div>
      <br>
      <div class="div-account-detail info">
        <h4>필수 정보 입력</h4>
        <div class="div-detail">
          <h5>계정 등록</h5>
          <b-input-group class="mt-3">
            <b-form-input type="text" v-model="accountParams.userId" placeholder="아이디(영/숫자 조합)"/>
            <b-input-group-append>
              <b-button variant="danger" @click="checkDupUserId">중복확인</b-button>
            </b-input-group-append>
          </b-input-group>
          <br>
          <b-form-input type="password" v-model="accountParams.pwd" required placeholder="비밀번호"/>
          <br>
          <b-form-input type="password" v-model="accountParams.pwd_confirm" required placeholder="비밀번호 확인"/>

          <h5>개인 정보<i class="far fa-question-circle" v-b-popover.hover.top="'LCORD에서 수집한 개인 정보는 플레이어 구별을 위한 부수적인 수단이며, 상업적으로 사용 및 악용하지 않습니다.'"></i></h5>
          <b-form-input type="text" v-model="accountParams.userName" required placeholder="이름"/>
          <br>
          <b-form-input type="text" v-model="accountParams.bNetId" required placeholder="배틀넷 아이디"/>
          <br>
          <b-form-input type="text" v-model="accountParams.afreecaId" required placeholder="아프리카 TV 아이디"/>
          <br>
          <b-form-input type="text" v-model="accountParams.nickName" required placeholder="별명"/>
          <br>
          <br>
          <b-form-select v-model="accountParams.tribe" :options="tribes" class="mb-3"/>
          <br>
          <b-form-select v-model="accountParams.tier" :options="tierList" class="mb-3"/>
        </div>
      </div>

      <br>

      <div class="div-account-detail info">
        <h4>선택 정보 입력</h4>
        <div class="div-detail">
          <b-form-input type="number" v-model="optionalInfo.apm" placeholder="평균 APM(숫자)"/>
          <br>
          <b-form-select v-model="optionalInfo.grade" :options="grades" class="mb-3"/>

          <br>
          <b-form-textarea v-model="optionalInfo.comment" placeholder="아이엠~ 그라운드~♬ 자기소개 하기!"></b-form-textarea>
        </div>
      </div>
      <br>
      <b-button variant="success" @click="createAccount" style="width: 100%">계정 생성</b-button>
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
        nickName: '',
        afreecaId: '',
        tier: null,
        tribe: null,
        optionalInfo: {}
      },
      optionalInfo: { apm: '', grade: null, comment: '' },
      grades: [
        { value: null, text: '래더 등급(시즌 최고) 선택' },
        {text: 'S', value: 's'}, {text: 'A', value: 'a'}, {text: 'B', value: 'b'}, {text: 'C', value: 'c'}, {text: 'D', value: 'd'}, {text: 'E', value: 'e'}, {text: 'F', value: 'f'} ],
      tierList: [
        { value: null, text: '엘크 티어 선택' },
        { text: 'NONE', value: 0}, { text: 'AMOEBA', value: 1}, { text: 'ANIMAL', value: 2}, { text: 'HUMAN', value: 3}, { text: 'GOD', value: 4} ],
      tribes: [
        { value: null, text: '주 종족 선택' },
        {text: '저그', value: 'zerg'}, {text: '테란', value: 'terran'}, {text: '프로토스', value: 'protoss'}, {text: '랜덤', value: 'random'} ],
    }
  },
  methods: {
    async createAccount () {
      this.$modal.show('loading-modal')
      this.accountParams.optionalInfo = this.optionalInfo
      this.$lcordAPI.user.create(this.accountParams)
        .then((resp) => {
          this.$modal.hide('loading-modal')
          if (resp.isAxiosError) {
            this.$toast.error('필수 정보 입력 내용을 빠짐없이 입력 바랍니다.', {position: 'top'})
          } else {
            this.$toast.success('계정 생성 성공!!로그인 바랍니다.', {position: 'top'})
            this.$router.push({name: 'Login'})
          }
        })
    },
    async checkDupUserId () {
      if (this.accountParams.userId != '') {
        this.$lcordAPI.user.checkId(this.accountParams)
          .then(resp => {
            if (resp.isAxiosError) {
              this.$toast.warning('이미 등록 된 아이디입니다.', {position: 'top'})
            } else {
              this.$toast.info('사용 가능한 아이디입니다.', {position: 'top'})
            }
          })
      } else {
        this.$toast.warning('사용하실 아이디를 입력해 주세요.', {position: 'top'})
      }
    }
  },
  beforeMount() {

  }
}
</script>

<style scoped>
  li { text-align: left; padding-right: 15px; }
  .error-text {
    color: red;
    min-height: 30px;
  }

  textarea {
    width: 98%;
    margin-bottom: 5px;
  }
</style>
