<template>
  <div>
    <form @submit.prevent="onSubmit">
      <div>계정</div>
      <input type="text" v-model="loginParams.userId" placeholder="user id">
      <div>비밀번호</div>
      <input type="password" v-model="loginParams.pwd" required>
      <br>
      <button type="submit"style="font-size: 16px; height: 45px">로그인</button>
      <div class="error-text">{{error}}</div>
    </form>
    <button v-on:click="createAccount">회원가입</button>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      loginParams: {
        userId: '',
        pwd: '',
      },
      error: '',
      nextPageName: ''
    }
  },
  methods: {
    async onSubmit () {
      this.$lcordAPI.getUserToken(this.loginParams)
        .then(resp => {
          if (resp.isAxiosError) {
            this.error = '로그인 오류 : 계정 또는 비밀 번호를 확인해주세요.'
          } else {
            if (this.nextPageName == undefined) this.nextPageName = 'Main'
            this.$router.replace({name: this.nextPageName})
          }
        })
        .catch(error => {
          this.error = error
        })
    },
    createAccount () {
      this.$router.push({ name: 'CreateAccount' })
    },
    ...mapActions({
      clearUserInfo: 'clearUserInfo'
    })
  },
  mounted() {
    this.nextPageName = this.$route.params.toName
    console.log(this.nextPageName)
    this.clearUserInfo()
  },
}
</script>

<style scoped>

</style>
