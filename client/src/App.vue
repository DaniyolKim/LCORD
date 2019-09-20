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
  template: '<a href="/"><img src="/static/logo.png" width="200px"/></a>'
}
const separator = {
  template: '<hr style="border-color: rgba(0, 0, 0, 0.1); margin: 10px;">'
}
import HeaderArea from './components/HeaderArea'
export default {
  name: 'App',
  components: {HeaderArea},
  component: { HeaderArea },
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
          href: '/rankPerson',
          title: '개인 순위',
          icon: 'fas fa-user'
        },
        {
          href: '/rankLeague',
          title: '리그 순위',
          icon: 'fas fa-sitemap'
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
          href: '/createRecord',
          title: '전적 입력',
          icon: 'fa fa-download'
        },
        {
          title: '리그 생성',
          icon: 'fab fa-battle-net',
          child: [
            {
              href: '/createLeaguePerson',
              title: '개인 리그',
              icon: 'fas fa-user'
            },
            {
              href: '/createLeagueTeam',
              title: '팀 리그',
              icon: 'fas fa-sitemap'
            },
            {
              href: '/CreateLeagueEvent',
              title: '이벤트 전',
              icon: 'fas fa-bowling-ball'
            }
          ]
        },
      ],
      menuWidth: '200px',
      menuWidthCollabse: '50px',
    }
  }
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
</style>
