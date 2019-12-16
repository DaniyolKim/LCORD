<template>
  <div>
    <h3>배틀 생성</h3>
    <hr>

    <h4>기본 정보 입력</h4>
    <div>
      <input type="text" v-model="battleData.name" placeholder="이름 입력">
    </div>
    <div>
      <textarea type="text" v-model="battleData.desc" placeholder="목적 등 상세 설명"></textarea>
    </div>
    <div>
      <label>참가 티어(Min ~ Max)</label>
      <div>
        <select v-model="battleData.tierMin"><option v-for="tier in $defs.tierList" :value="tier.type">{{tier.name}}</option></select> ~
        <select v-model="battleData.tierMax"><option v-for="tier in $defs.tierList" :value="tier.type">{{tier.name}}</option></select>
      </div>
    </div>
    <div>
      <label>배틀 타입 :
        <select v-model="battleData.type">
          <option v-for="battle in $defs.battleTypeList" :value="battle.type">{{battle.name}}</option>
        </select>
      </label>
    </div>

    <div v-if="battleData.type === 1">
      <div>
        <label>참가 팀 수 : <input type="number" v-model="battleData.teamCount"></label>
      </div>

      <div>
        <label>진행 방식 :
          <select v-model="battleData.isRound">
            <option v-for="isRound in $defs.isRoundList" :value="isRound.type">{{isRound.name}}</option>
          </select>
        </label>
        <br>
        <label>(풀 라운드 방식은 라운드별로 모든 팀이 경기를 진행합니다.)</label>
      </div>
    </div>

    <div>
      <label>관리자 :
        {{userId}}
      </label>
    </div>
    <button @click="createBattle">배틀 생성</button>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
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
          isRound: true,
          managers: [],
        },

        respBattle: ''
      }
    },
    methods: {
      async createBattle () {
        this.battleData.managers.push(this.userDBIndex)
        this.$lcordAPI.battle.create(this.battleData)
          .then((resp) => {
            alert('배틀 생성 완료')
          })
      },
    },
    computed: {
      ...mapGetters({
        userId: 'getUserId',
        userDBIndex: 'getUserDBIndex',
      })
    }
  }
</script>

<style scoped>

</style>
