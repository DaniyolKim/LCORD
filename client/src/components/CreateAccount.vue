<template>
  <div>
    <form @submit.prevent="onSubmit">
      <div>계정</div>
      <input type="text" v-model="accountParams.userId" placeholder="user id">
      <div>비밀번호</div>
      <input type="password" v-model="accountParams.pwd" required placeholder="비밀번호 입력">
      <div>비밀번호 확인</div>
      <input type="password" v-model="accountParams.pwd_confirm" required placeholder="비밀번호 확인">

      <div>이름</div>
      <input type="text" v-model="accountParams.userName" required placeholder="본인 이름">

      <div>BattleNet ID</div>
      <input type="text" v-model="accountParams.bNetId" required placeholder="대표 배틀넷 아이디">

      <div>주종족 선택</div>
      <select v-model="accountParams.tribe" required>
        <option v-for="tribe in tribes" v-bind:value="tribe.val">{{tribe.name}}</option>
      </select>

      <br>
      <br>
      <div>선택 정보</div>
      <div>APM</div>
      <input type="number" v-model="optionalInfo.apm" placeholder="숫자만 입력">
      <div>래더(시즌 평균) 등급</div>
      <select v-model="optionalInfo.grade" required>
        <option v-for="grade in grades" v-bind:value="grade.val">{{grade.name}}</option>
      </select>
      <div>자기 소개</div>
      <input type="text" v-model="optionalInfo.comment" placeholder="아무말이나...">
      <br>
      <button type="submit"style="font-size: 16px; height: 45px">계정 생성</button>
      <div class="error-text">{{error}}</div>
    </form>
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
      tribes: [{name: '저그', val: 'zerg'}, {name: '테란', val: 'terran'}, {name: '프로토스', val: 'protoss'}, {name: '랜덤', val: 'random'} ],
      grades: [{name: 'S', val: 's'}, {name: 'A', val: 'a'}, {name: 'B', val: 'b'}, {name: 'C', val: 'c'}, {name: 'D', val: 'd'}, {name: 'E', val: 'e'}, {name: 'F', val: 'f'},]
    }
  },
  methods: {
    async onSubmit () {
      this.accountParams.optionalInfo = this.optionalInfo
      this.$lcordAPI.createAccount(this.accountParams)
        .then(() => {
          this.$router.push({name: 'Login'})
        })
    }
  },
  beforeMount() {

  }
}
</script>

<style scoped>

</style>
