<template>
  <div class="container-create-battle">
    <div class="create-battle-article">
      <h4>배틀 관리</h4>
      <div style="height: 85vh; overflow-y: auto;">
        <b-list-group v-for="battle in battleList" :key="battle._id">
          <b-list-group-item button @click="selectBattle(battle)">
            <div class="battle-name">{{battle.name}}</div>
            <div class="battle-desc">{{battle.description}}</div>
          </b-list-group-item>
        </b-list-group>
      </div>
      <!--<ul>
        <li v-for="battle in battleList" @click="selectBattle(battle)">
          <div>
            <div class="battle-name">{{battle.name}}</div>
            <div class="battle-desc">{{battle.description}}</div>
          </div>
        </li>
      </ul>-->
      <b-button  variant="success" style="width: 100%;" @click="showModalCreate">배틀 추가</b-button>
    </div>

    <div class="create-battle-article">
      <h4>상세 정보</h4>
      <div v-if="selectedBattle == null">배틀 리스트에서 항목을 선택해 주세요.</div>
      <div v-else style="margin-top: 10px;">
        <div class="battle-elem">
          <label>배틀 이름</label>
          <input type="text" v-model="selectedBattle.name" :disabled="inputEnable == false">
        </div>
        <div class="battle-elem">
          <label>배틀 설명</label>
          <input type="text" v-model="selectedBattle.description" :disabled="inputEnable == false">
        </div>
        <div class="battle-elem">
          <label>참가 티어</label>
          <div style="width: 42.5%; display: flex; flex-direction: row; align-items: center; justify-content: space-between">
            <div style="width: 40%">
              <vue-multiselect v-model="getTierMin" placeholder="티어 선택" :options="$defs.tierList" label="name" track-by="name" selectLabel="선택" selectedLabel="선택 됨" deselectLabel="제거" :disabled="inputEnable == false"></vue-multiselect>
            </div>
            <div>~</div>
            <div style="width: 40%">
              <vue-multiselect v-model="getTierMax" placeholder="티어 선택" :options="$defs.tierList" label="name" track-by="name" selectLabel="선택" selectedLabel="선택 됨" deselectLabel="제거" :disabled="inputEnable == false"></vue-multiselect>
            </div>
          </div>
        </div>
        <div class="battle-elem">
          <label>배틀 타입</label>
          <select v-model="selectedBattle.type" :disabled="inputEnable == false">
            <option v-for="battle in $defs.battleTypeList" :value="battle.type">{{battle.name}}</option>
          </select>
        </div>
        <div v-if="parseInt(selectedBattle.type) === 1" class="battle-elem">
          <label>팀 관리</label>
          <button style="width: 42.3%; margin-left: 2px" @click="showModalTeamBuilding" :disabled="inputEnable == false">팀 빌딩</button>
        </div>
        <div class="battle-elem">
          <label>진행 방식</label>
          <select v-model="selectedBattle.isRound" :disabled="inputEnable == false">
            <option v-for="isRound in $defs.isRoundList" :value="isRound.type">{{isRound.name}}</option>
          </select>
        </div>

        <div class="battle-elem">
          <label>승/패 점수</label>
          <select class="select-score" v-model="selectedBattle.winScore">
            <option v-for="score in scoreList" :value="score">+{{score}}</option>
          </select>
          <select class="select-score" v-model="selectedBattle.loseScore">
            <option v-for="score in loseScoreList" :value="score">{{score | cvtScoreValue}}</option>
          </select>
        </div>

        <div class="battle-elem">
          <label>완료 여부</label>
          <select v-model="selectedBattle.onProgressing" :disabled="inputEnable == false">
            <option v-for="progress in progressList" :value="progress.value">{{progress.name}}</option>
          </select>
        </div>

        <div class="battle-elem battle-manager">
          <label>관리자</label>
          <div style="width: 42.5%">
            <vue-multiselect v-model="selectedBattle.managers" placeholder="이름 검색" label="userName" track-by="userId" selectLabel="추가" selectedLabel="선택 됨" deselectLabel="제거"
                             :options="userList" :multiple="true" :taggable="true" :custom-label="userSearchLabel" :show-labels="false" :disabled="inputEnable == false"
            ></vue-multiselect>
          </div>
        </div>
        <br>
        <b-button variant="success" style="width: 62%;" @click="updateBattleInfo" :disabled="inputEnable == false">업데이트</b-button>
      </div>
    </div>
    <modals-container @close="getBattleList"></modals-container>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import modalCreateBattle from "./modalCreateBattle";
  import modalTeamBuilding from "./modalTeamBuilding";
  export default {
    name: "ManageBattle",
    components: { modalCreateBattle },
    data () {
      return {
        selectedBattle: null,
        scoreList: [1, 2, 3, 4, 5],
        loseScoreList: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
        progressList: [{value: false, name: '종료'}, {value: true, name: '진행 중'},],
        battleList: [],
        userList: [],
        tierList: [ { name: 'NONE', type: 0}, { name: 'AMOEBA', type: 1}, { name: 'ANIMAL', type: 2}, { name: 'HUMAN', type: 3}, { name: 'GOD', type: 4} ],
      }
    },
    methods: {
      getBattleList () {
        this.$modal.show('loading-modal')
        this.$lcordAPI.battle.getAll()
          .then((resp) => {
            this.battleList = resp
            if (this.selectedBattle != null) {
              let battleId = this.selectedBattle._id
              let index = this.battleList.findIndex(x => x._id === battleId)
              if (index > -1) {
                this.selectedBattle = this.battleList[index]
              }
            }
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
      },

      userSearchLabel ({userName, bNetId, tribe}) {
        //return `${userName}(${bNetId.split(' ')[0]})`
        let cvtTribe = `${tribe}`.slice(0,1).toUpperCase()
        return `${userName} `+ cvtTribe + ` (${bNetId})`
      },

      updateBattleInfo () {
        this.$modal.show('loading-modal')
        this.$lcordAPI.battle.update(this.selectedBattle)
          .then(() => {
            this.$toast.success('업데이트 성공', {position: 'top'})
            this.getBattleList()
            this.$modal.hide('loading-modal')
          })
      },

      showModalCreate () {
        this.$modal.show(modalCreateBattle,
          { userList: this.userList },
          {
            width: '700px',
            height: '470px',
            clickToClose: false,
            root: this.$root
          }
        )
      },

      showModalTeamBuilding () {
        let cloneUserList = JSON.parse(JSON.stringify(this.userList))

        let tbTeamList = JSON.parse(JSON.stringify(this.selectedBattle.teamList))
        let tbUserList = []
        let tierMin = this.selectedBattle.tierMin
        let tierMax = this.selectedBattle.tierMax

        for (let i = 0; i < tbTeamList.length; i++) {
          let members = tbTeamList[i].members
          for (let j = 0; j < members.length; j++) {
            let index = cloneUserList.findIndex(x => x._id === members[j])
            if (index > -1) {
              members[j] = cloneUserList[index]
              cloneUserList[index].isExist = true
            }
          }
        }

        let battleId = this.selectedBattle._id
        cloneUserList.forEach(function (user) {
          if (user.tier >= tierMin && user.tier <= tierMax) {
            if (user.isExist == false || user.isExist == undefined) {
              let nonAttIndex = user.nonAttendanceBattles.findIndex(x => x === battleId)
              if (nonAttIndex < 0) {
                tbUserList.push(user)
              }
            }
          }
        })

        this.$modal.show(modalTeamBuilding,
          { userList: tbUserList, battleId: this.selectedBattle._id, teamList: tbTeamList },
          {
            width: '94%',
            height: '95%',
            clickToClose: false,
            root: this.$root
          }
        )
      },
    },
    mounted() {
      this.getBattleList()
      this.getAllPlayers()
    },
    computed: {
      ...mapGetters({
        userDBIndex: 'getUserDBIndex',
        userRole: 'getUserRole'
      }),
      inputEnable : function() {
        if (this.selectedBattle != null) {
          if (this.userRole == 0) {
            let uId = this.userDBIndex
            let index = this.selectedBattle.managers.findIndex(x => x._id === uId)

            if (index > -1) return true
            else return false

          } else {
            return true
          }
        } else {
          return false
        }
      },
      getTierMin: {
        get: function () {
          return this.tierList[this.selectedBattle.tierMin]
        },
        set: function (newVal) {
          this.selectedBattle.tierMin = newVal.type
        }
      },
      getTierMax: {
        get: function () {
          return this.tierList[this.selectedBattle.tierMax]
        },
        set: function (newVal) {
          this.selectedBattle.tierMax = newVal.type
        }
      },
    },
    filters: {
      cvtScoreValue: function (val) {
        if (val == 0) {
          return val
        } else if (val > 0){
          return '-' + val
        } else {
          return '+' + Math.abs(val)
        }
      }
    }
  }
</script>

<style scoped>
  ul { list-style-type: none; padding: 0px; width: 100%; height: 87%; border: solid #dcdcdc 1px; border-radius: 15px; overflow-y: auto; }
  li { text-align: left; margin: 20px; padding-bottom: 15px; border-bottom: solid #dcdcdc 1px; }
  .battle-name { font-size: 18px; font-weight: bold; text-align: left; }
  .battle-desc { font-size: 12px; text-align: left; }
  .battle-elem { display: flex; flex-direction: row; align-items: center; justify-content: center; height: 45px; }
  .battle-manager { align-items: flex-start; height: auto; }
  label { width: 150px; text-align: right; margin-right: 15px; }
  input { width: 40%; font-size: 14px; }
  select { font-size: 14px; padding: 10px; border: solid 1px #e8e8e8; border-radius: 5px; width: 42.5%;}
  .select-score { font-size: 14px; padding: 10px; border: solid 1px #e8e8e8; border-radius: 5px; width: 21.25%;}
</style>
