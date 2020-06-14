import Vue from 'vue'
import VueRouter from 'vue-router'

import lcordCommon from '../server_API/index'
const commAPI = lcordCommon.comFunction

import Login from '../views/Login'
import DashBoard from '../views/DashBoard'
import Ranking from '../views/Ranking'

Vue.use(require('vue-moment'))
Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'DashBoard',
    component: DashBoard,
  },
  {
    path: '/ranking/:selTribe/:selTier',
    name: 'Ranking',
    component: Ranking,
    props: true,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

function checkAuth (to, from, next) {
  next()
  if(commAPI.isAuth()) {
    next()
  } else {
    //Vue.$toast.info('로그인이 필요한 서비스입니다. 로그인 화면으로 이동합니다.', {position: 'top'})
    next({name: 'Login', params: {toName: to.name}})
  }
}

export default router
