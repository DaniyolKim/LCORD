<template>
  <div id="app">
    <div class="contents-area">
      <header-area style="height: 5vh"/>
      <router-view class="body" style="height: 95vh"/>
    </div>
    <sidebar-menu :menu="menu" :showChild="false" :width="menuWidth" :widthCollapsed="menuWidthCollabse" :collapsed="true"/>
  </div>
</template>
<script>
const logo = {
  template: '<a href="/"><img src="/static/logo_1.png" width="200px"/></a>'
}
const separator = {
  template: '<hr style="border-color: rgba(0, 0, 0, 0.1); margin: 10px;">'
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
        {
          header: true,
          title: '순위',
          hiddenOnCollapse: true
        },
        {
          href: '/rank/rankPerson',
          title: '개인 순위',
          icon: 'fas fa-user'
        },
        {
          href: '/rank/rankLeague',
          title: '리그 순위',
          icon: 'fas fa-sitemap'
        },
        {
          component: separator
        },
        {
          header: true,
          title: '리그',
          hiddenOnCollapse: true
        },
        {
          href: '/league/true',
          title: '진행 중',
          icon: 'fas fa-hourglass-half'
        },
        {
          href: '/league/false',
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
          title: '리그 관리',
          icon: 'fas fa-tools',
          child: [
            {
              href: '/manage/createLeague',
              title: '리그 생성',
              icon: 'fab fa-battle-net'
            },
            {
              href: '/manage/updateLeague',
              title: '리그 편집',
              icon: 'fas fa-edit'
            },
          ]
        },
      ],
      menuWidth: '200px',
      menuWidthCollabse: '50px',
    }
  },
}
</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
  .contents-area {
    padding-left: 50px;
  }
  .body {
    padding: 10px;
  }
</style>
