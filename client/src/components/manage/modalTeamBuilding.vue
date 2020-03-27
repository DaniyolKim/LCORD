<template>
  <div style="text-align: center">
    <h2>팀 관리</h2>
    <div class="contents-container">
      <!--왼쪽-->
      <div class="tb-elem">
        <h3>팀 구성(최대 8팀) <button style="width: 80px;padding: 0px" @click="addTeam">팀 추가</button></h3>
        <div class="team-container">
          <table style="width: 100%">
            <thead>
            <tr>
              <th v-for="team in teamList" @click="selectTeam(team)" :class="{ active: selectedTeam.name === team.name}">{{team.name}}</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td v-for="team in teamList">
                <div v-if="team.members.length == 0">
                  팀장 먼저 추가하세요
                </div>
                <div v-else>
                  <div v-for="user in team.members">
                    <UserCard :user="user"></UserCard>
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
        <h3>ZERG({{userListZerg.length}}명)</h3>
        <div class="user-container">
          <div v-for="user in userListZerg">
            <UserCard :user="user"></UserCard>
          </div>
        </div>

        <h3>PROTOSS({{userListProtoss.length}}명)</h3>
        <div class="user-container">
          <div v-for="user in userListProtoss">
            <UserCard :user="user"></UserCard>
          </div>
        </div>

        <h3>TERRAN({{userListTerran.length}}명)</h3>
        <div class="user-container">
          <div v-for="user in userListTerran">
            <UserCard :user="user"></UserCard>
          </div>
        </div>

        <h3>RANDOM({{userListRandom.length}}명)</h3>
        <div class="user-container">
          <div v-for="user in userListRandom">
            <UserCard :user="user"></UserCard>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
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
    props: ['userList', 'c'],
    components: {UserCard},
    data () {
      return {
        tierList: [ { name: 'NONE', type: 0}, { name: 'AMOEBA', type: 1}, { name: 'ANIMAL', type: 2}, { name: 'HUMAN', type: 3}, { name: 'GOD', type: 4} ],
        teamList: [],
        selectedTeam : '',
      }
    },
    methods: {
      cancelEdit () {
        this.$emit('close')
      },

      updateTeamBuild () {
        this.$emit('close')
      },

      addTeam () {
        let teamCount = this.teamList.length + 1
        if (teamCount < 9) {
          let team = {
            battleId: this.battleId,
            name: teamCount + '팀',
            captain: '',
            manager: '',
            members: [],
            openTalkLink: ''
          }
          this.teamList.push(team)
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

      sortUserListByTier (userList) {
        userList.sort((a, b) => {
          return a.tier > b.tier ? -1 : a.tier < b.tier ? 1 : 0
        })
      }
    },
    mounted() {
      this.$EventBus.$on('sendUserInfo', selUser => {
        if (this.selectedTeam == '') {
          this.$toast.warning('왼쪽 테이블에서 팀명을 클릭하고 팀원을 추가하세요.', {position: 'top'})
        } else {
          let existIndex = this.selectedTeam.members.findIndex(x => x._id == selUser._id)

          if (existIndex < 0) { //없는 경우, 추가
            this.selectedTeam.members.push(selUser)

            let index = this.userList.findIndex(x => x._id == selUser._id)
            this.userList.splice(index, 1)
          } else { //이미 있는 경우, 제거
            this.userList.push(selUser)
            this.selectedTeam.members.splice(existIndex, 1)
          }
        }
      })
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
    }
  }
</script>

<style scoped>
  .contents-container { height: inherit; display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding-bottom: 5px}
  .footer { width: 100%; display: flex; flex-direction: row; justify-content: space-around; align-items: center;}
  .tb-elem { display: flex; flex-direction: column; width: 50%; height: 85vh; overflow-y: auto; }
  .team-container { display: flex; flex-direction: row; justify-content: space-between; align-items: center; }
  .team-container > div { width: 12.5%; }
  .user-container { display: flex; flex-flow: row wrap; width: 100%; }
  button { width: 200px; }
  label { width: 150px; text-align: right; margin-right: 15px; }
  input { width: 40%; font-size: 14px; }
  select { font-size: 14px; padding: 10px; border: solid 1px #e8e8e8; border-radius: 5px; width: 42.5%;}
  .active { background-color: red;}
</style>
