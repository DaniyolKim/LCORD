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
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginParams: {
        userId: '',
        pwd: '',
      }
    }
  },
  methods: {
    async onSubmit () {
      this.$lcordAPI.getUserToken(this.loginParams)
        .then(() => {
          this.$lcordAPI.getUserInfo(this.loginParams.userId)
        });
    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
