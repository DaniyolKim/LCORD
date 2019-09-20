<template>
  <div class="header-root">
    <div v-if="userId != undefined">
      <label>안녕하세요.<router-link :to="{ name: 'MyInfo'}">{{userId}}</router-link>님</label>
      <a>sign out <i class="fas fa-sign-out-alt"></i></a>
    </div>
    <router-link v-if="userId == undefined" :to="{ name: 'Login'}">Sign in<i class="fas fa-sign-in-alt"></i></router-link>
  </div>
</template>

<script>
  export default {
    name: "HeaderArea",
    data () {
      return {
        userId: localStorage.userId
      }
    },
  }
</script>

<style scoped>
  .header-root {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: right;
    margin: 15px;
  }
</style>
