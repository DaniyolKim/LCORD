<template>
  <div>
    <vue-navigation-bar :options="navbarOptions"></vue-navigation-bar>
    <router-view style="height: 95vh; overflow-y: auto"></router-view>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'Main',
    data() {
      return {
        defaultNavbarOptions: {
          elementId: "main-navbar",
          isUsingVueRouter: true,
          mobileBreakpoint: 992,
          brandImagePath: "/",
          brandImage: require("../../src/assets/images/logo.png"),
          brandImageAltText: "LG Craft Record",
          collapseButtonImageOpen: require("../../src/assets/images/menu-light.png"),
          collapseButtonImageClose: require("../../src/assets/images/menu-close.png"),
          showBrandImageInMobilePopup: false,
          ariaLabelMainNav: "Main Navigation",
          tooltipAnimationType: "shift-away",
          menuOptionsLeft: [],
        },
        battleList: [],
      }
    },
    methods: {
      getBattleList () {
        this.selectedBattle = null
        this.$lcordAPI.battle.getAll()
          .then((resp) => {
            this.battleList = resp
            this.setNavOptionBattles()
          })
      },

      setNavOptionLogin() {
        this.defaultNavbarOptions.menuOptionsRight = []

        if (this.userId == undefined) {
          let login = {
            type: "button",
            text: "Login",
            path: "/login",
            iconRight: '<i class="fas fa-sign-in-alt"></i>'
          }
          this.defaultNavbarOptions.menuOptionsRight.push(login)
        } else {
          let myInfo = {
            type: "button",
            text: "안녕하세요. " + this.userId + '님',
            path: "/myInfo"
          }
          this.defaultNavbarOptions.menuOptionsRight.push(myInfo)

          let logout = {
            type: "button",
            text: "",
            path: "/login",
            iconRight: '<i class="fas fa-sign-out-alt"></i>'
          }
          this.defaultNavbarOptions.menuOptionsRight.push(logout)
        }
      },

      setNavOptionBattles() {
        if (this.battleList.length > 0) {
          let ingBattleList = []
          let doneBattleList = []

          this.battleList.forEach(battle => {
            let subMenu = {
              type: "link",
              text: battle.name,
              path: "/battleId/" + battle._id,
            }
            if (battle.onProgressing) {
              ingBattleList.push(subMenu)
            } else {
              doneBattleList.push(subMenu)
            }
          })

          let menuList = [
            {
              type: "link",
              text: "진행 중인 배틀",
              iconLeft: '<i class="fas fa-hourglass-half"></i>',
              subMenuOptions: ingBattleList
            },
            {
              type: "link",
              text: "종료 된 배틀",
              iconLeft: '<i class="fas fa-hourglass-end"></i>',
              path: "/battle/false",
              subMenuOptions: doneBattleList
            },
            {
              type: "link",
              text: "전적 입력",
              iconLeft: '<i class="vsm--icon fa fa-download"></i>',
              path: "/manage/createRecord",
            },
            {
              type: "link",
              text: "배틀 관리",
              iconLeft: '<i class="fas fa-tools"></i>',
              path: "/manage/manageBattle",
            },
            {
              type: "link",
              text: "랭킹",
              iconLeft: '<i class="fas fa-flag-checkered"></i>',
              subMenuOptions: [
                {
                  type: "link",
                  text: "ELO 순위",
                  iconLeft: '<i class="fas fa-sort-amount-down-alt"></i>',
                  path: "/user/userList",
                },
                {
                  type: "link",
                  text: "상대 비교",
                  iconLeft: '<i class="fas fa-user-friends"></i>',
                  path: "/user/userCompare",
                },
              ]
            },
            {
              type: "link",
              text: "나의 정보",
              iconLeft: '<i class="fas fa-user-cog"></i>',
              path: "/myInfo",
            },
          ]

          this.defaultNavbarOptions.menuOptionsLeft = menuList
        }
      },
    },
    beforeMount () {
      this.getBattleList()
    },
    mounted() {
      //this.$router.push({ name : 'BattleInfo', params: { isProgressing: true } })
    },
    computed: {
      ...mapGetters({
        userId: 'getUserId',
      }),
      navbarOptions: function () {
        //this.setNavOptionBattles()
        this.setNavOptionLogin()

        return this.defaultNavbarOptions
      }
    },
  }
</script>

<style>

</style>
