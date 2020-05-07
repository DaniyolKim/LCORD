<template>
  <div id="app">
    <div class="contents-area">
      <router-view style="height: 100vh;"></router-view>
    </div>
    <modal-loading/>
  </div>
</template>
<script>
  export default {
    name: 'App',
    data() {
      return {

      }
    },
  }
</script>
<style src="./assets/stylesCommon.css"></style>
<style src="./assets/stylesMobile.css"></style>
<style src="./assets/stylesDesktop.css"></style>
<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }
</style>
