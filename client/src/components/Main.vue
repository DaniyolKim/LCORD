<template>
  <div>
    <label>안녕하세요.<router-link :to="{ name: 'MyInfo'}">{{userId}}</router-link>님</label>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      userId: this.$cookie.get('userId')
    }
  },
  methods: {
    hasCookie () {
      if (this.$cookie.get('userToken') == null) {
        //go to login page
        this.$router.push({name: 'Login'})
      }
    }
  },
  mounted() {
    this.hasCookie()
  }
}
</script>

<style scoped>

</style>
