<template>
  <!--<div class="container-login">
    <div class="login-form">
      <a href="https://cafe.naver.com/lgcraft" target="_blank" title="LG Craft 공식 카페로 이동">
        <img class="login-logo" src="../../static/logo_1.png"/>
      </a>
      <div class="login-error-text"></div>
      <div class="login-container-input">
        <b-form-input type="text" v-model="loginParams.userId" placeholder="아이디"></b-form-input>
      </div>
      <div class="login-container-input">
        <b-form-input type="password" v-model="loginParams.pwd" placeholder="비밀번호" @keyup.enter="reqLogin"></b-form-input>
      </div>
      <div class="login-error-text">{{error}}</div>
      &lt;!&ndash;<button class="login-btn" @click="createAccount">회원가입</button>&ndash;&gt;
      <div style="color: white;">계정 관련 문의는 네이버 카페 챗(전자 김대언)에게..</div>
      <div style="color: white;">로고 클릭하면 카페로 이동 합니다.</div>
      <br>
      <b-button class="login-btn" @click="reqLogin">로그인</b-button>
      <div class="login-error-text"></div>
    </div>
  </div>-->
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
    }
  },
  methods: {
    async reqLogin () {
      this.$lcordAPI.user.getToken(this.loginParams)
        .then(resp => {
          if (resp.isAxiosError) {
            this.error = '계정 또는 비밀 번호를 확인해주세요.'
          } else {
            this.$router.replace({name: 'about'})
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
  beforeMount () {
    this.clearUserInfo()
  },
}
</script>

<style scoped>
</style>
