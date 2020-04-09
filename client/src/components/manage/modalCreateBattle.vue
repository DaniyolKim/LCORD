<template>
  <div style="text-align: center">
    <h2>배틀 생성</h2>
    <div class="contents-container">
      <div class="battle-elem">
        <label>배틀 이름</label>
        <input type="text" v-model="battleData.name">
      </div>
      <div class="battle-elem">
        <label>배틀 설명</label>
        <input type="text" v-model="battleData.description">
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
        <select v-model="battleData.type">
          <option v-for="battle in $defs.battleTypeList" :value="battle.type">{{battle.name}}</option>
        </select>
      </div>
      <div class="battle-elem">
        <label>진행 방식</label>
        <select v-model="battleData.isRound">
          <option v-for="isRound in $defs.isRoundList" :value="isRound.type">{{isRound.name}}</option>
        </select>
      </div>

      <div class="battle-elem battle-manager">
        <label>관리자</label>
        <div style="width: 42.5%">
          <vue-multiselect v-model="battleData.managers" placeholder="이름 검색" label="userName" track-by="userId" selectLabel="추가" selectedLabel="선택 됨" deselectLabel="제거"
                           :options="userList" :multiple="true" :taggable="true" :custom-label="userSearchLabel" :show-labels="false"
          ></vue-multiselect>
        </div>
      </div>

      <div class="footer">
        <button @click="cancelEdit">취소</button>
        <button @click="createBattle">확인</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: "modal_CreateBattle",
    props: ['userList'],
    data () {
      return {
        tierList: [ { name: 'NONE', type: 0}, { name: 'AMOEBA', type: 1}, { name: 'ANIMAL', type: 2}, { name: 'HUMAN', type: 3}, { name: 'GOD', type: 4} ],
        battleData: {
          name: '',
          description: '',
          tierMin: 0,
          tierMax: 0,
          type: 0,
          isRound: true,
          managers: [],
        },

        respBattle: ''
      }
    },
    methods: {
      cancelEdit () {
        this.$emit('close')
      },
      async createBattle () {
        this.$modal.show('loading-modal')
        this.$lcordAPI.battle.create(this.battleData)
          .then((resp) => {
            this.$modal.hide('loading-modal')
            this.$toast.success('배틀 생성 완료.', {position: 'top'})
            this.$emit('close')
          })
      },
      userSearchLabel ({userName, bNetId, tribe}) {
        //return `${userName}(${bNetId.split(' ')[0]})`
        let cvtTribe = `${tribe}`.slice(0,1).toUpperCase()
        return `${userName} `+ cvtTribe + ` (${bNetId})`
      },
    },
    mounted() {
      let index = this.userList.findIndex(x => x._id == this.userDBIndex)
      this.battleData.managers.push(this.userList[index])
    },
    computed: {
      ...mapGetters({
        userId: 'getUserId',
        userDBIndex: 'getUserDBIndex',
      }),
      getTierMin: {
        get: function () {
          return this.tierList[this.battleData.tierMin]
        },
        set: function (newVal) {
          this.battleData.tierMin = newVal.type
        }
      },
      getTierMax: {
        get: function () {
          return this.tierList[this.battleData.tierMax]
        },
        set: function (newVal) {
          this.battleData.tierMax = newVal.type
        }
      },
    }
  }
</script>

<style scoped>
  .contents-container { height: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: center; }
  .input-area { display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 20px;}
  .footer { width: 100%; display: flex; flex-direction: row; justify-content: space-around; align-items: center;}
  .battle-elem { display: flex; flex-direction: row; align-items: center; justify-content: center; height: 45px; width: 100%; }
  .battle-manager { align-items: flex-start; height: auto; }
  button { width: 200px; }
  label { width: 150px; text-align: right; margin-right: 15px; }
  input { width: 40%; font-size: 14px; }
  select { font-size: 14px; padding: 10px; border: solid 1px #e8e8e8; border-radius: 5px; width: 42.5%;}
</style>
