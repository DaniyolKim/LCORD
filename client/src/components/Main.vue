<template>
  <div>
    <vue-navigation-bar :options="navbarOptions"></vue-navigation-bar>
    <router-view style="height: 95vh; overflow-y: auto"></router-view>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'Login',
    data() {
      return {
        defaultNavbarOptions: {
          elementId: "main-navbar",
          isUsingVueRouter: true,
          mobileBreakpoint: 992,
          brandImagePath: "/battle/true",
          brandImage: require("../../src/assets/images/logo.png"),
          brandImageAltText: "LG Craft Record",
          collapseButtonImageOpen: require("../../src/assets/images/menu-light.png"),
          collapseButtonImageClose: require("../../src/assets/images/menu-close.png"),
          showBrandImageInMobilePopup: false,
          ariaLabelMainNav: "Main Navigation",
          tooltipAnimationType: "shift-away",
          menuOptionsLeft: [
            {
              type: "link",
              text: "진행 중인 배틀",
              iconLeft: '<i class="fas fa-hourglass-half"></i>',
              path: "/battle/true",
            },
            {
              type: "link",
              text: "종료 된 배틀",
              iconLeft: '<i class="fas fa-hourglass-end"></i>',
              path: "/battle/false",
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
          ],
        },
      }
    },
    methods: {
    },
    mounted() {
      this.$router.push({ name : 'BattleInfo', params: { isProgressing: true } })
    },
    computed: {
      ...mapGetters({
        userId: 'getUserId',
      }),
      navbarOptions: function () {
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

        return this.defaultNavbarOptions
      }
    },
  }
</script>

<style>

</style>
