<template>
  <div class="container-my-info">
    <h3>My account</h3>
    <div class="div-account-detail about">
      <h2>필수 정보</h2>
      <div>ID : {{userInfo.userId}}</div>
      <div>이름 : {{userInfo.userName}}</div>
      <div>배틀넷 아이디 : {{userInfo.bNetId}}</div>
      <div>아프리카 TV 아이디 : {{userInfo.afreecaId}}</div>
      <div>별명 : {{userInfo.nickName}}</div>
      <div>종족 : {{userInfo.tribe}}</div>
      <div>가입일 : {{userInfo.created_date | moment(mDateFormat)}} </div>
    </div>
    <br>
    <div class="div-account-detail about">
      <h2>선택 정보</h2>
      <div>평균 APM : {{optionalInfo.apm | checkValue}}</div>
      <div>래더 등급 : {{optionalInfo.grade | checkValue}}</div>
      <div>소개 : {{optionalInfo.comment | checkValue}}</div>
    </div>
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
      mDateFormat: 'YYYY-MM-DD',
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

</style>
