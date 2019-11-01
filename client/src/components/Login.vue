<template>
  <div class="container-login">
    <div class="login-form">
      <a href="https://cafe.naver.com/lgcraft" target="_blank" title="LG Craft 공식 카페로 이동">
        <img src="../../static/logo_1.png" width="400px" style="border-radius: 5px"/>
      </a>
      <div class="error-text"></div>
      <div class="container-input">
        <input type="text" v-model="loginParams.userId" placeholder="아이디">
      </div>
      <div class="container-input">
        <input type="password" v-model="loginParams.pwd" placeholder="비밀번호" @keyup.enter="reqLogin">
      </div>
      <div class="error-text">{{error}}</div>
      <button @click="reqLogin" style="margin-bottom: 5px">로그인</button>
      <button @click="createAccount">회원가입</button>
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
            if (this.nextPageName == '') this.nextPageName = 'Main'
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
    this.clearUserInfo()
  },
}
</script>

<style scoped>
  .container-input {
    margin: 15px;
  }
  .login-form {
    background-color: #424246;
    border-radius: 5px;
  }
  .container-login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .error-text {
    color: red;
    min-height: 30px;
  }

</style>
