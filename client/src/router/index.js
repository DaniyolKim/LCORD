import Vue from 'vue'
import Router from 'vue-router'
import lcordCommon from '../server_API/index'
const commAPI = lcordCommon.comFunction

import Main from '../components/Main'
import Login from '../components/Login'
import CreateAccount from "../components/CreateAccount"
import MyInfo from "../components/MyInfo"
import RankPerson from "../components/rank/RankPerson"
import RankLeague from "../components/rank/RankLeague"
import LeagueIng from '../components/league/LeagueIng'
import LeagueFinish from '../components/league/LeagueFinish'
import CreateRecord from "../components/CreateRecord"
import CreateLeaguePerson from "../components/manage/CreateLeaguePerson"
import CreateLeagueTeam from "../components/manage/CreateLeagueTeam"
import CreateLeagueEvent from "../components/manage/CreateLeagueEvent"
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
      path: '/rank/rankPerson',
      name: 'RankPerson',
      component: RankPerson
    },
    {
      path: '/rank/rankLeague',
      name: 'RankLeague',
      component: RankLeague
    },
    {
      path: '/league/ing',
      name: 'LeagueIng',
      component: LeagueIng
    },
    {
      path: '/league/fin',
      name: 'LeagueFinish',
      component: LeagueFinish
    },
    {
      path: '/manage/createRecord',
      name: 'CreateRecord',
      component: CreateRecord,
      beforeEnter: function (to, from, next) {
        checkAuth(to, from, next)
      }
    },
    {
      path: '/manage/createLeaguePerson',
      name: 'CreateLeaguePerson',
      component: CreateLeaguePerson,
      beforeEnter: function (to, from, next) {
        checkAuth(to, from, next)
      }
    },
    {
      path: '/manage/createLeagueTeam',
      name: 'CreateLeagueTeam',
      component: CreateLeagueTeam,
      beforeEnter: function (to, from, next) {
        checkAuth(to, from, next)
      }
    },
    {
      path: '/manage/createLeagueEvent',
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
