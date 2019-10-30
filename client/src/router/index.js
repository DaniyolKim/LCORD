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
import LeagueInfo from '../components/league/LeagueInfo'
import CreateRecord from "../components/manage/CreateRecord"
import CreateLeague from "../components/manage/CreateLeague"
import UpdateLeague from "../components/manage/UpdateLeague"

Vue.use(require('vue-moment'))
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
      path: '/league/:isProgressing',
      name: 'LeagueInfo',
      component: LeagueInfo,
      props: true,
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
      path: '/manage/createLeague',
      name: 'CreateLeague',
      component: CreateLeague,
      beforeEnter: function (to, from, next) {
        checkAuth(to, from, next)
      }
    },
    {
      path: '/manage/updateLeague',
      name: 'UpdateLeague',
      component: UpdateLeague,
      beforeEnter: function (to, from, next) {
        checkAuth(to, from, next)
      }
    },
    /*{
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
    },*/
  ]
})

function checkAuth (to, from, next) {
  next()
  /*if(commAPI.isAuth()) {
    next()
  } else {
    alert('로그인이 필요한 서비스입니다.')
    next({name: 'Login', params: {toName: to.name}})
  }*/
}
