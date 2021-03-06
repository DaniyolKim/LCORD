import Vue from 'vue'
import Router from 'vue-router'
import lcordCommon from '../server_API/index'
const commAPI = lcordCommon.comFunction

import Main from '../components/Main'
import Login from '../components/Login'
import CreateAccount from '../components/CreateAccount'
import MyInfo from '../components/MyInfo'
import BattleInfo from '../components/battle/BattleInfo'
import CreateRecord from '../components/manage/CreateRecord'
import ManageBattle from '../components/manage/ManageBattle'
import Admin from "../components/manage/Admin"
import UserList from '../components/user/userList'
import UserCompare from '../components/user/userCompare'
import About from '../components/About'
import BattleDetail from '../components/battle/BattleDetail'
import test from '../components/module/vueTeamRecordList'

Vue.use(require('vue-moment'))
Vue.use(Router)

export default new Router({
  mode: 'history',

  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/regUser',
      name: 'CreateAccount',
      component: CreateAccount,
    },
    {
      path: '/test',
      name: 'test',
      component: test,
    },
    {
      path: '/',
      name: 'Main',
      component: Main,
      beforeEnter: function (to, from, next) {
        checkAuth(to, from, next)
      },
      children:[
        {
          path: '/',
          name: 'about',
          component: About,
        },
        {
          path: '/battleId/:battleId',
          name: 'Battle',
          component: BattleDetail,
          props: true,
        },
        {
          path: '/battle/:isProgressing',
          name: 'BattleInfo',
          component: BattleInfo,
          props: true,
        },
        {
          path: '/manage/createRecord',
          name: 'CreateRecord',
          component: CreateRecord,
        },
        {
          path: '/manage/manageBattle',
          name: 'ManageBattle',
          component: ManageBattle,
        },
        {
          path: '/manage/admin',
          name: 'Admin',
          component: Admin,
        },
        {
          path: '/user/userList',
          name: 'UserList',
          component: UserList,
        },
        {
          path: '/user/userCompare',
          name: 'UserCompare',
          component: UserCompare,
        },
        {
          path: '/myInfo',
          name: 'MyInfo',
          component: MyInfo,
        },
      ]
    },
  ]
})

function checkAuth (to, from, next) {
  next()
  if(commAPI.isAuth()) {
    next()
  } else {
    Vue.$toast.info('로그인이 필요한 서비스입니다. 로그인 화면으로 이동합니다.', {position: 'top'})
    next({name: 'Login', params: {toName: to.name}})
  }
}
