<template>
  <div class="header-root">
    <div v-if="userId != ''">
      <label>안녕하세요. <router-link :to="{ name: 'MyInfo'}" style="color: white">{{userId}}</router-link>님</label>
      <router-link :to="{ name: 'Login'}"><i class="fas fa-sign-out-alt"></i></router-link>
    </div>
    <router-link v-if="userId == ''" :to="{ name: 'Login'}" >Sign in<i class="fas fa-sign-in-alt"></i></router-link>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: "HeaderArea",
    data () {
      return {
        //userId: localStorage.userId
      }
    },
    computed: {
      ...mapGetters({
        userId: 'getUserId',
      })
    }
  }
</script>

<style scoped>
  .header-root {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 10px;
    color: white;
    background: #303033;
  }
  a {
    color: white;
  }
  a:hover {
    color: grey;
  }
</style>
