<template>
  <div>
    <div>ID : {{userInfo.userId}}</div>
    <div>이름 : {{userInfo.userName}}</div>
    <div>배넷 ID : {{userInfo.bNetId}}</div>
    <div>주종 : {{userInfo.tribe}}</div>
    <div>가입일 : {{userInfo.created_date}}</div>
    <div>추가 정보 : {{optionalInfo}}</div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
export default {
  name: 'MyInfo',

  data () {
    return {
      userInfo: null,
      optionalInfo: null,
    }
  },
  methods: {
    getUserInfo () {
      this.$lcordAPI.user.getInfo(this.userId)
        .then(resp => {
          this.userInfo = resp
          this.optionalInfo = resp.optionalInfo
        })
    }
  },
  mounted() {
    if (this.$commAPI.isAuth() == false) {
      this.$router.push({name: 'Login'})
    }
    this.getUserInfo()
  },
  computed: {
    ...mapGetters({
      userId: 'getUserId',
    })
  }
}
</script>

<style scoped>

</style>
