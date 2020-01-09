<template>
  <div class="container-login">
    <div class="login-form">
      <a href="https://cafe.naver.com/lgcraft" target="_blank" title="LG Craft 공식 카페로 이동">
        <img class="login-logo" src="../../static/logo_1.png"/>
      </a>
      <div class="login-error-text"></div>
      <div class="login-container-input">
        <input class="login-id-pw" type="text" v-model="loginParams.userId" placeholder="아이디">
      </div>
      <div class="login-container-input">
        <input class="login-id-pw" type="password" v-model="loginParams.pwd" placeholder="비밀번호" @keyup.enter="reqLogin">
      </div>
      <div class="login-error-text">{{error}}</div>
      <button class="login-btn" @click="createAccount">회원가입</button>
      <button class="login-btn" @click="reqLogin">로그인</button>
      <div class="login-error-text"></div>
    </div>
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
      error: ' ',
      nextPageName: ''
    }
  },
  methods: {
    async reqLogin () {
      this.$lcordAPI.user.getToken(this.loginParams)
        .then(resp => {
          if (resp.isAxiosError) {
            this.error = '계정 또는 비밀 번호를 확인해주세요.'
          } else {
            if (this.nextPageName == '' || this.nextPageName == undefined) this.nextPageName = 'Main'
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
    this.clearUserInfo()
  },
}
</script>

<style scoped>
</style>
