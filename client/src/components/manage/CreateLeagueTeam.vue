<template>
  <div>
    <div>팀 리그 생성</div>
    <hr style="border-color: rgba(0, 0, 0, 0.1); margin: 10px;">

    <div>
      <label>리그 이름 : <input type="text"></label>
    </div>
    <div>
      <label>리그 설명 : <input type="text"></label>
    </div>
    <div>
      <label>참가 티어(Min ~ Max)</label>
      <div>
        <select v-model="leagueData.tier.min"><option v-for="tier in tierList">{{tier}}</option></select> ~
        <select v-model="leagueData.tier.max"><option v-for="tier in tierList">{{tier}}</option></select>
      </div>
    </div>
    <div>
      <label>진행 방식 : <select><option>풀 리그</option><option>위너스 리그</option></select></label>
    </div>
    <div>
      <label>참가 팀 수 : <input type="number" v-model="teamCount"></label>
    </div>
    <div>
      <label>관리자 : </label>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CreateLeagueTeam",
    data () {
      return {
        leagueData: {
          name:'',
          desc: '',
          tier: {min:'NONE', max:'NONE'},
          teamCount: 0,
        },
        tierList: ['GOD', 'HUMAN', 'ANIMAL', 'AMOEBA', 'NONE']
      }
    }
  }
</script>

<style scoped>

</style>
