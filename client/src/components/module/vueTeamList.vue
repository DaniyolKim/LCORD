<template>
  <div>
    <table style="width: 100%">
      <thead>
      <tr>
        <th>구분</th>
        <th v-for="team in teamList">
          {{team.name}}({{team.members.length}}명)
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="tier in selTierList">
        <td>{{tier.name}}</td>
        <td class="td-members" v-for="team in teamList">
          <div class="div-members" v-for="user in orderTierMember(team.members)" style="margin: 1px">
            <UserCard v-if="user.tier == tier.value" :user="user" :is-click-enable="false"></UserCard>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import UserCard from "../module/userCard"
  export default {
    name: "vueTeamList",
    props: [ 'playerList', 'teamList', 'tierMin', 'tierMax'],
    components: {UserCard},
    data () {
      return {
        tierList: [
          { name: '미정', value: 0 },
          { name: '아메바', value: 1 },
          { name: '애니멀', value: 2 },
          { name: '휴먼', value: 3 },
          { name: '갓', value: 4 },
        ]
      }
    },
    methods: {
      orderTeamMemberByTier() {
        for (let i = 0; i < this.teamList.length; i++) {
          let members = this.teamList[i].members
          for (let j = 0; j < members.length; j++) {
            let index = this.playerList.findIndex(x => x._id === members[j])
            if (index > -1) {
              members[j] = this.playerList[index]
            }
          }
        }
      },

      orderTierMember(members) {
        let retMembers = members.slice()
        retMembers.sort((a, b) => {
          return a.userName < b.userName ? -1 : a.userName > b.userName ? 1 : 0
        })
        retMembers.sort((a, b) => {
          return a.tribe > b.tribe ? -1 : a.tribe < b.tribe ? 1 : 0
        })
        return retMembers
      }
    },
    beforeMount() {
      this.orderTeamMemberByTier()
    },
    mounted() {
      this.$EventBus.$emit('cmpOrderTeamMember')
    },
    computed: {
      selTierList: function () {
        let retList = this.tierList.slice(this.tierMin, this.tierMax + 1)
        return retList.reverse()
      }
    }
  }
</script>

<style scoped>
  .td-members { vertical-align: top; }
  .div-members { margin: 1px 0px; display: flex; flex-direction: column; align-items: center; margin: 10px 0px; height: 100%; }
</style>
