<template>
  <div>
    <form @submit.prevent="onSubmit">
      <div>배틀 편집</div>
      <hr>

      <div>
        <label>배틀 이름 : <input type="text" v-model="battleData.name"></label>
      </div>
      <div>
        <label>배틀 설명 : <input type="text" v-model="battleData.desc"></label>
      </div>
      <div>
        <label>참가 티어(Min ~ Max)</label>
        <div>
          <select v-model="battleData.tierMin"><option v-for="tier in $defs.tierList" :value="tier.val">{{tier.name}}</option></select> ~
          <select v-model="battleData.tierMax"><option v-for="tier in $defs.tierList" :value="tier.val">{{tier.name}}</option></select>
        </div>
      </div>
      <div>
        <label>진행 방식 :
          <select v-model="battleData.type">
            <option v-for="battle in $defs.battleTypeList" :value="battle.type">{{battle.name}}</option>
          </select>
        </label>
      </div>
      <div>
        <label>참가 팀 수 : <input type="number" v-model="battleData.teamCount"></label>
      </div>
      <div>
        <label>관리자 :
          {{battleData.managers}}
        </label>
      </div>
      <button type="submit">배틀 생성</button>
    </form>
  </div>
</template>

<script>
  export default {
    name: "CreateBattleTeam",
    data () {
      return {
        battleData: {
          name: '',
          desc: '',
          tierMin: 0,
          tierMax: 0,
          teamCount: 8,
          type: 0,
          //managers: Array,
          managers: ['5db25b1d22fa6129e1b6dbfb'],
        },


        respBattle: ''
      }
    },
    methods: {
      async onSubmit () {
        this.$lcordAPI.battle.create(this.battleData)
          .then((resp) => {
            //alert(resp)
          })
      },
    }
  }
</script>

<style scoped>

</style>
