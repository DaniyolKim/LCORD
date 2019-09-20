import Vue from 'vue'
import Router from 'vue-router'
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
      component: CreateRecord
    },
    {
      path: '/createLeaguePerson',
      name: 'CreateLeaguePerson',
      component: CreateLeaguePerson
    },
    {
      path: '/createLeagueTeam',
      name: 'CreateLeagueTeam',
      component: CreateLeagueTeam
    },
    {
      path: '/createLeagueEvent',
      name: 'CreateLeagueEvent',
      component: CreateLeagueEvent
    },
  ]
})
