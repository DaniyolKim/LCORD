<template>
  <div class="container-create-battle">
    <div class="create-battle-article">
      <h2>배틀 관리</h2>
      <ul>
        <li v-for="battle in battleList" @click="selectBattle(battle)">
          <div>
            <div class="battle-name">{{battle.name}}</div>
            <div class="battle-desc">{{battle.description}}</div>
          </div>
        </li>
      </ul>
    </div>

    <div class="create-battle-article">
      <h2>상세 정보</h2>
      <div v-if="selectedBattle == null">배틀 리스트에서 항목을 선택해 주세요.</div>
      <div v-else>
        <div class="battle-elem">
          <label>배틀 이름</label>
          <input type="text" v-model="selectedBattle.name">
        </div>
        <div class="battle-elem">
          <label>배틀 설명</label>
          <input type="text" v-model="selectedBattle.description">
        </div>
        <div class="battle-elem">
          <label>참가 티어</label>
          <div style="width: 42.5%; display: flex; flex-direction: row; align-items: center; justify-content: space-between">
            <div style="width: 40%">
              <vue-multiselect v-model="getTierMin" placeholder="티어 선택" :options="$defs.tierList" label="name" track-by="name" selectLabel="선택" selectedLabel="선택 됨" deselectLabel="제거"></vue-multiselect>
            </div>
            <div>~</div>
            <div style="width: 40%">
              <vue-multiselect v-model="getTierMax" placeholder="티어 선택" :options="$defs.tierList" label="name" track-by="name" selectLabel="선택" selectedLabel="선택 됨" deselectLabel="제거"></vue-multiselect>
            </div>
          </div>
        </div>
        <div class="battle-elem">
          <label>배틀 타입</label>
          <select v-model="selectedBattle.type">
            <option v-for="battle in $defs.battleTypeList" :value="battle.type">{{battle.name}}</option>
          </select>
        </div>
        <div v-if="selectedBattle.type === 1" class="battle-elem">
          <label>참가 팀 수</label>

        </div>
        <div class="battle-elem">
          <label>진행 방식</label>
          <select v-model="selectedBattle.isRound">
            <option v-for="isRound in $defs.isRoundList" :value="isRound.type">{{isRound.name}}</option>
          </select>
        </div>
        <div class="battle-elem">
          <label>관리자</label>
          <div style="width: 42.5%;">
            <label>{{getManagerName}}</label>
          </div>
        </div>
        <br>
        <button style="width: 62%;">업데이트</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: "ManageBattle",
    data () {
      return {
        selectedBattle: null,
        battleList: [],
        userList: [],
        tierList: [ { name: 'NONE', type: 0}, { name: 'AMOEBA', type: 1}, { name: 'ANIMAL', type: 2}, { name: 'HUMAN', type: 3}, { name: 'GOD', type: 4} ],
      }
    },
    methods: {
      getBattleList () {
        this.selectedBattle = null
        this.$modal.show('loading-modal')
        this.$lcordAPI.battle.getListByProgress(true)
          .then((resp) => {
            this.battleList = resp
            this.$modal.hide('loading-modal')
          })
      },
      getAllPlayers () {
        this.$modal.show('loading-modal')
        this.$lcordAPI.user.getAllUsers()
          .then(resp => {
            this.userList = resp
            this.$modal.hide('loading-modal')
          })
      },

      selectBattle (battle) {
        this.selectedBattle = battle
      }
    },
    mounted() {
      this.getBattleList()
      this.getAllPlayers()
    },
    computed: {
      ...mapGetters({
        userDBIndex: 'getUserDBIndex',
      }),
      getTierMin() {
        return this.tierList[this.selectedBattle.tierMin]
      },
      getTierMax() {
        return this.tierList[this.selectedBattle.tierMax]
      },
      getManagerName() {
        let retList = []
        let managerList = this.selectedBattle.managers
        for (let i = 0; i < managerList.length; i++) {
          let index = this.userList.findIndex(x => x._id == managerList[i])
          retList.push(this.userList[index].userName)
        }
        return retList
      }
    }
  }
</script>

<style scoped>
  ul { list-style-type: none; padding: 0px; width: 100%; height: 90%; border: solid #dcdcdc 1px; border-radius: 15px; overflow-y: auto; }
  li { text-align: left; margin: 20px; padding-bottom: 15px; border-bottom: solid #dcdcdc 1px; }
  .battle-name { font-size: 18px; font-weight: bold; }
  .battle-desc { font-size: 12px; }
  .battle-elem { display: flex; flex-direction: row; align-items: center; justify-content: center; height: 45px; }
  label { width: 150px; text-align: right; margin-right: 15px; }
  input { width: 40%; font-size: 14px; }
  select { font-size: 14px; padding: 10px; border: solid 1px #e8e8e8; border-radius: 5px; width: 42.5%;}
</style>
