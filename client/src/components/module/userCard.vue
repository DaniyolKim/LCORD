<template>
  <div class="layout" :class="user.tribe" :title="'ELO: ' + user.eloScore + '\n' + '소개: ' + user.optionalInfo.comment"
       @click="sendUserInfo">
    <div :class="'tier-div-' + user.tier">{{user.tier | cvtTier}}</div>
    <div style="font-size: 17px">{{user.userName}}</div>
    <div>{{user.bNetId}}</div>
  </div>
</template>

<script>
  export default {
    name: "userCard",
    props: ['user', 'isClickEnable'],
    methods: {
      sendUserInfo () {
        if (this.isClickEnable)
          this.$EventBus.$emit('sendUserInfo', this.user)
      },
    },
    filters: {
      cvtTier: function (val) {
        let tierList = [{name: 'NONE', type: 0}, {name: 'AMOEBA', type: 1}, {name: 'ANIMAL', type: 2}, {name: 'HUMAN', type: 3}, {name: 'GOD', type: 4}]
        return tierList[val].name
      },
    }
  }
</script>

<style scoped>
  div { color: white; font-size: 13px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
  .layout { width: 95px; padding-bottom: 5px; border: gray solid 1px; border-radius: 7px; }
  .tier-div-1 { width: 100%; background-color: white; color: black; border-bottom: black solid 1px; }
  .tier-div-2 { width: 100%; background-color: green; border-bottom: white solid 1px; }
  .tier-div-3 { width: 100%; background-color: blue; border-bottom: white solid 1px; }
  .tier-div-4 { width: 100%; background-color: black; border-bottom: white solid 1px; }
  .terran { background-color: cornflowerblue; }
  .zerg { background-color: #ff4a84; }
  .protoss { background-color: goldenrod; }
  .random { background-color: #404043; }
</style>
