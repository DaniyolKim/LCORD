import Vue from 'vue'
import Router from 'vue-router'
import lcordCommon from '../server_API/index'
const commAPI = lcordCommon.comFunction

import Main from '../components/Main'
import Login from '../components/Login'
import CreateAccount from '../components/CreateAccount'
import MyInfo from '../components/MyInfo'
import RankInfo from '../components/rank/RankInfo'
import BattleInfo from '../components/battle/BattleInfo'
import CreateRecord from '../components/manage/CreateRecord'
import CreateBattle from '../components/manage/CreateBattle'
import UpdateBattle from '../components/manage/UpdateBattle'
import UserList from '../components/user/userList'

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
      path: '/rank/:type',
      name: 'RankTeam',
      component: RankInfo,
      props: true,
    },
    {
      path: '/Battle/:isProgressing',
      name: 'BattleInfo',
      component: BattleInfo,
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
      path: '/manage/createBattle',
      name: 'CreateBattle',
      component: CreateBattle,
      beforeEnter: function (to, from, next) {
        checkAuth(to, from, next)
      }
    },
    {
      path: '/manage/updateBattle',
      name: 'UpdateBattle',
      component: UpdateBattle,
      beforeEnter: function (to, from, next) {
        checkAuth(to, from, next)
      }
    },
    {
      path: '/user/userList',
      name: 'UserList',
      component: UserList,
      beforeEnter: function (to, from, next) {
        checkAuth(to, from, next)
      }
    },
    /*{
      path: '/manage/createBattlePerson',
      name: 'CreateBattlePerson',
      component: CreateBattlePerson,
      beforeEnter: function (to, from, next) {
        checkAuth(to, from, next)
      }
    },
    {
      path: '/manage/createBattleTeam',
      name: 'CreateBattleTeam',
      component: CreateBattleTeam,
      beforeEnter: function (to, from, next) {
        checkAuth(to, from, next)
      }
    },
    {
      path: '/manage/createBattleEvent',
      name: 'CreateBattleEvent',
      component: CreateBattleEvent,
      beforeEnter: function (to, from, next) {
        checkAuth(to, from, next)
      }
    },*/
  ]
})

function checkAuth (to, from, next) {
  next()
  if(commAPI.isAuth()) {
    next()
  } else {
    alert('로그인이 필요한 서비스입니다.')
    next({name: 'Login', params: {toName: to.name}})
  }
}
