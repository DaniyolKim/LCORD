<template>
  <div style="text-align: center">
    <h2>팀 관리</h2>
    <div class="contents-container">
      <!--왼쪽-->
      <div class="tb-elem">
        <h3>팀 구성(최대 8팀) <button style="width: 80px;padding: 0px" @click="addTeam">팀 추가</button>
          <label><input type="checkbox" v-model="isSnakePick" style="width: 25px; margin: 0px;" @change="changeSnakePick">스네이크 픽 활성화</label>
        </h3>
        <div class="team-container">
          <table style="width: 100%">
            <thead>
            <tr>
              <th v-for="team in teamList" @click="selectTeam(team)" :class="{ active: selectedTeam.name === team.name}">
                {{team.name}}({{team.members.length}}명)
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td v-for="team in teamList" @click="selectTeam(team)" style="vertical-align: top;">
                <div v-if="team.members.length == 0">
                  팀장 먼저 추가하세요
                </div>
                <div v-else class="member-container">
                  <div v-for="user in team.members" style="margin: 1px 0px;">
                    <UserCard :user="user" :is-click-enable="true"></UserCard>
                  </div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!--오른쪽-->
      <div class="tb-elem">
        <h3>TOTAL({{userList.length}}명)
          <div>
            <label><input type="radio" v-model="viewType" value="tribe" style="width: 15px;">종족 순 정렬</label>
            <label><input type="radio" v-model="viewType" value="tier" style="width: 15px;">티어 순 정렬</label>
          </div>
        </h3>

        <div v-if="viewType == 'tribe'">
          <h3>ZERG({{userListZerg.length}}명)</h3>
          <div class="user-container">
            <div v-for="user in userListZerg" style="margin: 1px">
              <UserCard :user="user" :is-click-enable="true"></UserCard>
            </div>
          </div>

          <h3>PROTOSS({{userListProtoss.length}}명)</h3>
          <div class="user-container">
            <div v-for="user in userListProtoss" style="margin: 1px">
              <UserCard :user="user" :is-click-enable="true"></UserCard>
            </div>
          </div>

          <h3>TERRAN({{userListTerran.length}}명)</h3>
          <div class="user-container">
            <div v-for="user in userListTerran" style="margin: 1px">
              <UserCard :user="user" :is-click-enable="true"></UserCard>
            </div>
          </div>

          <h3>RANDOM({{userListRandom.length}}명)</h3>
          <div class="user-container">
            <div v-for="user in userListRandom" style="margin: 1px">
              <UserCard :user="user" :is-click-enable="true"></UserCard>
            </div>
          </div>
        </div>
        <div v-if="viewType == 'tier'">
          <h3>GOD({{userListGod.length}}명)</h3>
          <div class="user-container">
            <div v-for="user in userListGod" style="margin: 1px">
              <UserCard :user="user" :is-click-enable="true"></UserCard>
            </div>
          </div>

          <h3>HUMAN({{userListHuman.length}}명)</h3>
          <div class="user-container">
            <div v-for="user in userListHuman" style="margin: 1px">
              <UserCard :user="user" :is-click-enable="true"></UserCard>
            </div>
          </div>

          <h3>ANIMAL({{userListAnimal.length}}명)</h3>
          <div class="user-container">
            <div v-for="user in userListAnimal" style="margin: 1px">
              <UserCard :user="user" :is-click-enable="true"></UserCard>
            </div>
          </div>

          <h3>AMOEBA({{userListAmoeba.length}}명)</h3>
          <div class="user-container">
            <div v-for="user in userListAmoeba" style="margin: 1px">
              <UserCard :user="user" :is-click-enable="true"></UserCard>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <button @click="initTeam">초기화</button>
      <button @click="cancelEdit">취소</button>
      <button @click="updateTeamBuild">확인</button>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import UserCard from "../module/userCard"
  export default {
    name: "modal_TeamBuilding",
    props: [ 'userList', 'battleId', 'teamList', ],
    components: { UserCard },
    data () {
      return {
        tierList: [ { name: 'NONE', type: 0}, { name: 'AMOEBA', type: 1}, { name: 'ANIMAL', type: 2}, { name: 'HUMAN', type: 3}, { name: 'GOD', type: 4} ],
        //teamList: [],
        viewType: 'tribe',
        selectedTeam : '',
        isSnakePick: true,
        shiftCounter: {row: 0, col:0},
      }
    },
    methods: {
      cancelEdit () {
        this.$emit('close')
      },

      initTeam () {
        this.teamList = []
        let reqInfo = { _id: this.battleId, teamList: this.teamList }
        this.$lcordAPI.battle.update(reqInfo)
          .then(() => {
            this.$emit('close')
          })
      },

      updateTeamBuild () {
        for (let i = 0; i < this.teamList.length; i++) {
          this.teamList[i].captain = this.teamList[i].members[0]
        }
        let reqInfo = { _id: this.battleId, teamList: this.teamList }
        this.$lcordAPI.battle.update(reqInfo)
          .then(() => {
            this.$emit('close')
          })
      },

      addTeam () {
        let teamCount = this.teamList.length + 1
        if (teamCount < 9) {
          let team = {
            name: teamCount + '팀',
            /*captain: '',
            manager: '',*/
            members: [],
            openTalkLink: ''
          }
          this.teamList.push(team)
          this.selectedTeam = this.teamList[0]
          this.shiftCounter = {row: 0, col:0}
        } else {
          this.$toast.error('최대 8개까지 팀 생성 가능합니다.', {position: 'top'})
        }
      },

      selectTeam (team) {
        this.selectedTeam = team
      },

      sepUserByTribe (user, tribe, targetList) {
        if (user.tribe == tribe) {
          targetList.push(user)
        }
      },

      sepUserByTier (user, tier, targetList) {
        if (user.tier == tier) {
          targetList.push(user)
        }
      },

      sortUserListByTier (userList) {
        userList.sort((a, b) => {
          return a.tier > b.tier ? -1 : a.tier < b.tier ? 1 : 0
        })
      },

      sortUserListByTribe (userList) {
        userList.sort((a, b) => {
          return a.tribe > b.tribe ? -1 : a.tribe < b.tribe ? 1 : 0
        })
      },

      snakePick () {
        if (this.isSnakePick) {
          if (this.shiftCounter.row < 1) { //팀장 라인
            this.shiftCounter.col += 1
            this.selectTeam(this.teamList[this.shiftCounter.col])

            if (this.shiftCounter.col == this.teamList.length - 1) {
              this.shiftCounter.row += 1
              this.shiftCounter.col = -1
              this.selectTeam(this.teamList[this.teamList.length - 1])
            }
          } else {
            if (this.shiftCounter.row % 2 == 1) { //순방향
              this.shiftCounter.col += 1
              if (this.shiftCounter.col == this.teamList.length) {
                this.shiftCounter.row += 1
                this.shiftCounter.col = this.teamList.length - 1
              }
            } else { //역방향
              this.shiftCounter.col -= 1
              if (this.shiftCounter.col == -1) {
                this.shiftCounter.row += 1
                this.shiftCounter.col = 0
              }
            }
            this.selectTeam(this.teamList[this.shiftCounter.col])
          }
        }
      },

      changeSnakePick () {
        this.shiftCounter = {row: 1, col:-1}
        if (this.isSnakePick) {
          this.$toast.info('스네이크 픽이 처음부터 시작 됩니다.', {position: 'top'})
        }
        this.snakePick()
      }
    },
    mounted() {
      this.$EventBus.$on('sendUserInfo', selUser => {
        if (this.selectedTeam == '') {
          this.$toast.warning('왼쪽 테이블에서 팀명을 클릭하고 팀원을 추가하세요.', {position: 'top'})
        } else {
          let existIndex = this.selectedTeam.members.findIndex(x => x._id == selUser._id)

          if (existIndex < 0) { //없는 경우, 추가
            let index = this.userList.findIndex(x => x._id == selUser._id)

            if (index > -1) {
              this.selectedTeam.members.push(selUser)
              this.userList.splice(index, 1)

              //선택한 팀 이동
              this.snakePick()
            }
          } else { //이미 있는 경우, 제거
            this.userList.push(selUser)
            this.selectedTeam.members.splice(existIndex, 1)

            if (this.isSnakePick == true) {
              this.shiftCounter.row = existIndex
              this.shiftCounter.col = this.teamList.findIndex(x => x.name === this.selectedTeam.name)
            }
          }
        }
      })
    },
    beforeDestroy() {
      this.$EventBus.$off('sendUserInfo')
    },
    computed: {
      ...mapGetters({
        userId: 'getUserId',
        userDBIndex: 'getUserDBIndex',
      }),
      userListZerg: function () {
        let userList = []
        for (let i = 0; i < this.userList.length; i++) {
          this.sepUserByTribe(this.userList[i], 'zerg', userList)
        }
        this.sortUserListByTier(userList)
        return userList
      },
      userListProtoss: function () {
        let userList = []
        for (let i = 0; i < this.userList.length; i++) {
          this.sepUserByTribe(this.userList[i], 'protoss', userList)
        }
        this.sortUserListByTier(userList)
        return userList
      },
      userListTerran: function () {
        let userList = []
        for (let i = 0; i < this.userList.length; i++) {
          this.sepUserByTribe(this.userList[i], 'terran', userList)
        }
        this.sortUserListByTier(userList)
        return userList
      },
      userListRandom: function () {
        let userList = []
        for (let i = 0; i < this.userList.length; i++) {
          this.sepUserByTribe(this.userList[i], 'random', userList)
        }
        this.sortUserListByTier(userList)
        return userList
      },

      userListGod: function () {
        let userList = []
        for (let i = 0; i < this.userList.length; i++) {
          this.sepUserByTier(this.userList[i], 4, userList)
        }
        this.sortUserListByTribe(userList)
        return userList
      },
      userListHuman: function () {
        let userList = []
        for (let i = 0; i < this.userList.length; i++) {
          this.sepUserByTier(this.userList[i], 3, userList)
        }
        this.sortUserListByTribe(userList)
        return userList
      },
      userListAnimal: function () {
        let userList = []
        for (let i = 0; i < this.userList.length; i++) {
          this.sepUserByTier(this.userList[i], 2, userList)
        }
        this.sortUserListByTribe(userList)
        return userList
      },
      userListAmoeba: function () {
        let userList = []
        for (let i = 0; i < this.userList.length; i++) {
          this.sepUserByTier(this.userList[i], 1, userList)
        }
        this.sortUserListByTribe(userList)
        return userList
      },
      userListNone: function () {
        let userList = []
        for (let i = 0; i < this.userList.length; i++) {
          this.sepUserByTier(this.userList[i], 0, userList)
        }
        this.sortUserListByTribe(userList)
        return userList
      },
    },
  }
</script>

<style scoped>
  .contents-container { height: inherit; display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding-bottom: 5px}
  .footer { width: 100%; display: flex; flex-direction: row; justify-content: space-around; align-items: center;}
  .tb-elem { display: flex; flex-direction: column; width: 50%; height: 85vh; overflow-y: auto; padding: 0 10px;}
  .team-container { display: flex; flex-direction: row; justify-content: space-between; align-items: center; }
  .member-container { display: flex; flex-direction: column; align-items: center; margin: 10px 0px; height: 100%;}
  .user-container { display: flex; flex-flow: row wrap; width: 100%; }
  button { width: 200px; }
  label { width: 150px; text-align: right; margin-right: 15px; }
  input { width: 40%; font-size: 14px; }
  select { font-size: 14px; padding: 10px; border: solid 1px #e8e8e8; border-radius: 5px; width: 42.5%;}
  .active { background-color: red;}
  h3 { margin: 5px 0px; }
</style>
