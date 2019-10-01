import Vue from 'vue'
import Router from 'vue-router'
import lcordCommon from '../server_API/index'
const commAPI = lcordCommon.comFunction

import Main from '../components/Main'
import Login from '../components/Login'
import CreateAccount from "../components/CreateAccount"
import MyInfo from "../components/MyInfo"
import RankPerson from "../components/RankPerson"
import RankLeague from "../components/RankLeague"
import CreateRecord from "../components/CreateRecord"
import CreateLeaguePerson from "../components/CreateLeaguePerson"
import CreateLeagueTeam from "../components/CreateLeagueTeam"
import CreateLeagueEvent from "../components/CreateLeagueEvent"
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/regUser',
      name: 'CreateAccount',
      component: CreateAccount
    },
    {
      path: '/myInfo',
      name: 'MyInfo',
      component: MyInfo
    },
    {
      path: '/rankPerson',
      name: 'RankPerson',
      component: RankPerson
    },
    {
      path: '/rankLeague',
      name: 'RankLeague',
      component: RankLeague
    },
    {
      path: '/createRecord',
      name: 'CreateRecord',
      component: CreateRecord,
      beforeEnter: function (to, from, next) {
        checkAuth(to, from, next)
      }
    },
    {
      path: '/createLeaguePerson',
      name: 'CreateLeaguePerson',
      component: CreateLeaguePerson,
      beforeEnter: function (to, from, next) {
        checkAuth(to, from, next)
      }
    },
    {
      path: '/createLeagueTeam',
      name: 'CreateLeagueTeam',
      component: CreateLeagueTeam,
      beforeEnter: function (to, from, next) {
        checkAuth(to, from, next)
      }
    },
    {
      path: '/createLeagueEvent',
      name: 'CreateLeagueEvent',
      component: CreateLeagueEvent,
      beforeEnter: function (to, from, next) {
        checkAuth(to, from, next)
      }
    },
  ]
})

function checkAuth (to, from, next) {
  if(commAPI.isAuth()) {
    next()
  } else {
    alert('로그인이 필요한 서비스입니다.')
    next({name: 'Login', params: {toName: to.name}})
  }
}
