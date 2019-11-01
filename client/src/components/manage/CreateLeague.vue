<template>
  <div>
    <form @submit.prevent="onSubmit">
      <div>리그 생성</div>
      <hr style="border-color: rgba(0, 0, 0, 0.1); margin: 10px;">

      <div>
        <label>리그 이름 : <input type="text" v-model="leagueData.name"></label>
      </div>
      <div>
        <label>리그 설명 : <input type="text" v-model="leagueData.desc"></label>
      </div>
      <div>
        <label>참가 티어(Min ~ Max)</label>
        <div>
          <select v-model="leagueData.tierMin"><option v-for="tier in $defs.tierList" :value="tier.type">{{tier.name}}</option></select> ~
          <select v-model="leagueData.tierMax"><option v-for="tier in $defs.tierList" :value="tier.type">{{tier.name}}</option></select>
        </div>
      </div>
      <div>
        <label>진행 방식 :
          <select v-model="leagueData.type">
            <option v-for="league in $defs.leagueTypeList" :value="league.type">{{league.name}}</option>
          </select>
        </label>
      </div>
      <div>
        <label>참가 팀 수 : <input type="number" v-model="leagueData.teamCount"></label>
      </div>
      <div>
        <label>관리자 :
          {{leagueData.managers}}
        </label>
      </div>
      <button type="submit">리그 생성</button>
    </form>
  </div>
</template>

<script>
  export default {
    name: "CreateLeagueTeam",
    data () {
      return {
        leagueData: {
          name: '',
          desc: '',
          tierMin: 0,
          tierMax: 0,
          teamCount: 8,
          type: 0,
          //managers: Array,
          managers: ['5db25b1d22fa6129e1b6dbfb'],
        },

        respLeague: ''
      }
    },
    methods: {
      async onSubmit () {
        this.$lcordAPI.league.create(this.leagueData)
          .then((resp) => {
            //alert(resp)
          })
      },
    }
  }
</script>

<style scoped>

</style>
