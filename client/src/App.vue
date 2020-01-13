<template>
  <div id="app">
    <div class="contents-area">
      <header-area style="height: 5vh"/>
      <router-view style="height: 93vh; overflow-y: auto"></router-view>
    </div>
    <sidebar-menu :menu="menu" :showChild="false" :width="menuWidth" :widthCollapsed="menuWidthCollabse" :collapsed="true"/>
    <modal-loading/>
  </div>
</template>
<script>
const logo = {
  template: '<a href="/"><img src="/static/logo_1.png" width="200px"/></a>'
}
const separator = {
  template: '<hr>'
}
import HeaderArea from './components/HeaderArea'
export default {
  name: 'App',
  components: {HeaderArea},
  data() {
    return {
      menu: [
        {
          component: logo,
          hiddenOnCollapse: true
        },
        /*{
          header: true,
          title: '순위',
          hiddenOnCollapse: true
        },
        {
          href: '/rank/0',
          title: '개인 배틀',
          icon: 'fas fa-user'
        },
        {
          href: '/rank/1',
          title: '팀 배틀',
          icon: 'fas fa-sitemap'
        },
        {
          href: '/rank/2',
          title: '이벤트 배틀',
          icon: 'fas fa-bowling-ball'
        },
        {
          component: separator
        },*/
        {
          header: true,
          title: '배틀',
          hiddenOnCollapse: true
        },
        {
          href: '/battle/true',
          title: '진행 중',
          icon: 'fas fa-hourglass-half'
        },
        {
          href: '/battle/false',
          title: '종료',
          icon: 'fas fa-hourglass-end'
        },
        {
          component: separator
        },
        {
          header: true,
          title: '관리',
          hiddenOnCollapse: true
        },
        {
          href: '/manage/createRecord',
          title: '전적 입력',
          icon: 'fa fa-download'
        },
        {
          title: '배틀 관리',
          icon: 'fas fa-tools',
          child: [
            {
              href: '/manage/createBattle',
              title: '배틀 생성',
              icon: 'fab fa-battle-net'
            },
            {
              href: '/manage/updateBattle',
              title: '배틀 편집',
              icon: 'fas fa-edit'
            },
          ]
        },
        {
          component: separator
        },
        {
          header: true,
          title: '랭크',
          hiddenOnCollapse: true
        },
        {
          href: '/user/userList',
          title: '플레이어 리스트',
          icon: 'fas fa-sitemap'
        },
      ],
      menuWidth: '200px',
      menuWidthCollabse: '50px',
    }
  },
}
</script>
<style src="./assets/stylesCommon.css"></style>
<style src="./assets/stylesMobile.css"></style>
<style src="./assets/stylesDesktop.css"></style>
<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }
</style>
